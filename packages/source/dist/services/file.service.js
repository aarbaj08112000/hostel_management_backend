"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var FileService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const buffer_1 = require("buffer");
const url_1 = require("url");
const _ = __importStar(require("lodash"));
const mime = __importStar(require("mime"));
const fse = __importStar(require("fs-extra"));
const sharp_1 = __importDefault(require("sharp"));
const crypto = __importStar(require("crypto"));
const randomatic_1 = __importDefault(require("randomatic"));
const path_1 = require("path");
const logger_handler_1 = require("../utilities/logger-handler");
const custom_helper_1 = require("../utilities/custom-helper");
const amazon_service_1 = require("./amazon.service");
const cache_service_1 = require("./cache.service");
const date_service_1 = require("./date.service");
const http_service_1 = require("./http.service");
const fs_1 = require("fs");
const config_1 = require("@nestjs/config");
let FileService = FileService_1 = class FileService {
    amazonService;
    cacheService;
    dateService;
    httpService;
    configService;
    log = new logger_handler_1.LoggerHandler(FileService_1.name).getInstance();
    constructor(amazonService, cacheService, dateService, httpService, configService) {
        this.amazonService = amazonService;
        this.cacheService = cacheService;
        this.dateService = dateService;
        this.httpService = httpService;
        this.configService = configService;
    }
    isFile(filePath) {
        let fileFlag = false;
        try {
            if ((0, fs_1.existsSync)(filePath)) {
                const fileStats = (0, fs_1.statSync)(filePath);
                fileFlag = !!fileStats.isFile();
            }
        }
        catch (err) {
            fileFlag = false;
            this.log.error('[isFile] >> Error ', err);
        }
        return fileFlag;
    }
    isDirectory(dirPath) {
        let dirFlag;
        try {
            const dirStats = fse.statSync(dirPath);
            dirFlag = !!dirStats.isDirectory();
        }
        catch (err) {
            dirFlag = false;
            this.log.error('[isDirectory] >> Error ', err);
        }
        return dirFlag;
    }
    getFileSize(filePath) {
        let fileSize;
        try {
            const fileStats = fse.statSync(filePath);
            fileSize = fileStats.size;
        }
        catch (err) {
            fileSize = -1;
        }
        return fileSize;
    }
    getFileMime(filePath) {
        return mime.getType(filePath);
    }
    readURLName(fileUrl) {
        const parsed = new url_1.URL(fileUrl);
        return (0, path_1.basename)(parsed.pathname);
    }
    async writeURLData(fileUrl, filePath, headers, options) {
        const response = await this.httpService.stream(fileUrl, filePath, headers, options);
        if (response.success) {
            return true;
        }
        return false;
    }
    readFile(filePath, options) {
        let result;
        options = options || {};
        if ('async' in options && options.async === true) {
            fse.readFile(filePath, (error, data) => {
                if (options?.callback) {
                    options.callback(error, data);
                }
            });
        }
        else {
            result = fse.readFileSync(filePath);
        }
        return result;
    }
    writeFile(filePath, data, options) {
        let result;
        options = options || {};
        if ('async' in options && options.async === false) {
            result = fse.writeFileSync(filePath, data);
        }
        else {
            fse.writeFile(filePath, data, (error) => {
                if (error) {
                    this.log.error('[writeFile] >> Error ', error);
                }
                if (options?.callback) {
                    options.callback(error);
                }
            });
        }
        return result;
    }
    deleteFile(filePath, options) {
        let result;
        options = options || {};
        if ('async' in options && options.async === false) {
            result = fse.removeSync(filePath);
        }
        else {
            fse.remove(filePath, (error) => {
                if (error) {
                    this.log.error('[deleteFile] >> Error ', error);
                }
                if (options?.callback) {
                    options.callback(error);
                }
            });
        }
        return result;
    }
    async getNoImageUrl(noImageVal) {
        const uploadServer = await this.cacheService.get('FILE_UPLOAD_SERVER_LOCATION');
        const settingsConfig = this.configService.get('app.settings_files_config');
        const uploadFolder = settingsConfig?.upload_folder;
        const awsVarsList = settingsConfig?.aws_vars_list;
        if (!noImageVal) {
            noImageVal = await this.cacheService.get('UPLOAD_NOIMAGE');
        }
        const apiURL = await this.cacheService.get('API_URL');
        const settingsUrl = this.configService.get('app.settings_files_url');
        const settingsPath = this.configService.get('app.settings_files_path');
        let noImageUrl = `${apiURL}/${settingsUrl}no-image.png`;
        if (noImageVal) {
            if (uploadServer === 'amazon' && awsVarsList.includes('UPLOAD_NOIMAGE')) {
                const awsPathInfo = await this.getAmazonUploadPathURL(uploadFolder);
                if (awsPathInfo.folder_url) {
                    noImageUrl = `${awsPathInfo.folder_url}${noImageVal}`;
                }
                else {
                    const noImagePath = `${settingsPath}${noImageVal}`;
                    if (this.isFile(noImagePath)) {
                        noImageUrl = `${apiURL}/${settingsUrl}${noImageVal}`;
                    }
                }
            }
            else {
                const noImagePath = `${settingsPath}${noImageVal}`;
                if (this.isFile(noImagePath)) {
                    noImageUrl = `${apiURL}/${settingsUrl}${noImageVal}`;
                }
            }
        }
        return noImageUrl;
    }
    async staticImageUrl(options) {
        let defaultImage = '';
        if (options?.no_img_req && options.no_img_req === true) {
            const allowedExtList = this.configService.get('app.allowed_extensions');
            const defaultExtList = allowedExtList.split(',');
            if (options?.extensions) {
                const optionsExtList = _.isString(options.extensions)
                    ? options.extensions.split(',')
                    : options.extensions;
                const intersectList = _.intersection(defaultExtList, optionsExtList);
                if (_.isArray(intersectList) && intersectList.length > 0) {
                    defaultImage = await this.getNoImageUrl(options?.no_img_val);
                }
            }
            else {
                defaultImage = await this.getNoImageUrl(options?.no_img_val);
            }
        }
        return defaultImage;
    }
    async getResizeImageUrl(imgUrl, width, height, options) {
        options = options || {};
        const resize = {
            edits: {
                resize: {
                    width: Number(width),
                    height: Number(height),
                    fit: options?.resize_mode || 'cover',
                },
            },
        };
        if (options?.color) {
            resize.edits.resize.background = this.hexToRgb(options.color, 1);
        }
        if (options?.background) {
            resize.flatten.background = this.hexToRgb(options.background, 1);
        }
        let resizeUrl = '';
        if ('amazon' in options && options.source === 'amazon') {
            resize.bucket = await this.cacheService.get('AWS_BUCKET_NAME');
            resize.key = `${options.path}/${options.image_name}`;
            const encData = buffer_1.Buffer.from(JSON.stringify(resize)).toString('base64');
            const isSSLVerify = await this.cacheService.get('AWS_SSL_VERIFY');
            const protocol = isSSLVerify === 'Y' ? 'https://' : 'http://';
            const domain = await this.cacheService.get('AWS_IMG_HANDLER_DOMAIN');
            resizeUrl = `${protocol}${domain}/${encData}`;
        }
        else {
            resize.img_url = imgUrl;
            const encData = buffer_1.Buffer.from(JSON.stringify(resize)).toString('base64');
            const apiURL = await this.cacheService.get('API_URL');
            resizeUrl = `${apiURL}/api/rest/image-resize/${encData}`;
        }
        return resizeUrl;
    }
    hexToRgb(hex, alpha) {
        let r = 0;
        let g = 0;
        let b = 0;
        if (hex) {
            r = parseInt(hex.slice(0, 2), 16);
            g = parseInt(hex.slice(2, 4), 16);
            b = parseInt(hex.slice(4, 6), 16);
        }
        return { r, g, b, alpha };
    }
    async getResizedImage(options) {
        await new Promise((resolve, reject) => {
            (0, sharp_1.default)(options.src_path)
                .resize(options.edits.resize.width, options.edits.resize.height, {
                fit: options.edits.resize.fit,
                background: options.edits.resize.background,
            })
                .toFile(options.dst_path)
                .then((data) => {
                this.log.debug('[getResizedImage] >> Resize Completed');
                resolve({ data: {} });
            })
                .catch((error) => {
                this.log.error('[getResizedImage] >> Error');
                this.log.error(error);
                reject({ error });
            });
        });
    }
    async getFile(options) {
        let source = options.source;
        if (source === 'SYSTEM') {
            source = await this.cacheService.get('FILE_UPLOAD_SERVER_LOCATION');
        }
        let fileUrl = '';
        switch (source) {
            case 'amazon':
                fileUrl = await this.getAmazonFile(options);
                break;
            case 'wasabi':
                fileUrl = await this.getWasabiFile(options);
                break;
            default:
                fileUrl = await this.getLocalFile(options);
                break;
        }
        return fileUrl;
    }
    async getLocalFile(options) {
        let finalFileUrl = this.getExternalFile(options);
        const fileName = options.image_name;
        if (finalFileUrl == undefined || !finalFileUrl) {
            const locFinalPath = this.getUploadNestedFolders(options.path);
            const locPathInfo = await this.getLocalUploadPathURL(locFinalPath);
            if (fileName && locPathInfo.folder_url) {
                let tmpFilePath = '';
                let tmpFileUrl = '';
                if ('nested_key' in options && options.nested_key) {
                    tmpFilePath = `${locPathInfo.folder_path}${options.nested_key}/${fileName}`;
                    tmpFileUrl = `${locPathInfo.folder_url}${options.nested_key}/${fileName}`;
                }
                else {
                    tmpFilePath = `${locPathInfo.folder_path}${fileName}`;
                    tmpFileUrl = `${locPathInfo.folder_url}${fileName}`;
                }
                if (this.isFile(tmpFilePath)) {
                    if ('width' in options || 'height' in options) {
                        finalFileUrl = await this.getResizeImageUrl(tmpFileUrl, options.width, options.height, options);
                    }
                    else {
                        finalFileUrl = tmpFileUrl;
                    }
                }
            }
            if (!finalFileUrl) {
                finalFileUrl = this.getDefaultFile(options);
            }
        }
        return finalFileUrl;
    }
    async getAmazonFile(options) {
        let finalFileUrl = this.getExternalFile(options);
        const fileName = options.image_name;
        if (!finalFileUrl) {
            const awsPathInfo = await this.getAmazonUploadPathURL(options.path);
            if (fileName && awsPathInfo.folder_url) {
                let tmpFileUrl = '';
                if ('nested_key' in options && options.nested_key) {
                    tmpFileUrl = `${awsPathInfo.folder_url}${options.nested_key}/${fileName}`;
                }
                else {
                    tmpFileUrl = `${awsPathInfo.folder_url}${fileName}`;
                }
                if ('width' in options || 'height' in options) {
                    finalFileUrl = this.getResizeImageUrl(tmpFileUrl, options.width, options.height, options);
                }
                else {
                    finalFileUrl = tmpFileUrl;
                }
            }
            if (!finalFileUrl) {
                finalFileUrl = this.getDefaultFile(options);
            }
        }
        return finalFileUrl;
    }
    async getWasabiFile(options) {
        let finalFileUrl = this.getExternalFile(options);
        const fileName = options.image_name;
        if (!finalFileUrl) {
            const wasabiPathInfo = await this.getWasabiUploadPathURL(options.path);
            if (fileName && wasabiPathInfo.folder_url) {
                let tmpFileUrl = '';
                if ('nested_key' in options && options.nested_key) {
                    tmpFileUrl = `${wasabiPathInfo.folder_url}${options.nested_key}/${fileName}`;
                }
                else {
                    tmpFileUrl = `${wasabiPathInfo.folder_url}${fileName}`;
                }
                if ('width' in options || 'height' in options) {
                    finalFileUrl = await this.getResizeImageUrl(tmpFileUrl, options.width, options.height, options);
                }
                else {
                    finalFileUrl = tmpFileUrl;
                }
            }
            if (!finalFileUrl) {
                finalFileUrl = this.getDefaultFile(options);
            }
        }
        return finalFileUrl;
    }
    getExternalFile(options) {
        let finalFileUrl;
        const fileName = options.image_name;
        if (fileName && (0, custom_helper_1.isExternalURL)(fileName)) {
            if ('width' in options || 'height' in options) {
                finalFileUrl = this.getResizeImageUrl(fileName, options.width, options.height, options);
            }
            else {
                finalFileUrl = fileName;
            }
        }
        return finalFileUrl;
    }
    async getDefaultFile(options) {
        let finalFileUrl = '';
        const defaultImage = await this.staticImageUrl(options);
        if (defaultImage && ('width' in options || 'height' in options)) {
            finalFileUrl = await this.getResizeImageUrl(defaultImage, options.width, options.height, options);
        }
        else {
            finalFileUrl = defaultImage;
        }
        return finalFileUrl;
    }
    async uploadFile(options) {
        let result = {};
        let source = options.source;
        if (source === 'SYSTEM') {
            source = await this.cacheService.get('FILE_UPLOAD_SERVER_LOCATION');
        }
        if (source === 'local') {
            options.upload_path = `${this.configService.get('app.upload_path')}${options.upload_path}/`;
        }
        switch (source) {
            case 'amazon':
                result = await this.uploadAmazonFile(options);
                break;
            case 'wasabi':
                result = await this.uploadWasabiFile(options);
                break;
            default:
                result = await this.uploadLocalFile(options);
                break;
        }
        return result;
    }
    async uploadLocalFile(options) {
        let success;
        let message;
        try {
            const uploadPath = options.upload_path;
            const tmpFile = options.src_file;
            const dstFile = options.dst_file;
            if (!dstFile || !this.isFile(tmpFile)) {
                throw new Error('Upload file not found.');
            }
            if (options?.extensions) {
                if (!this.validateFileFormat(options.extensions, dstFile)) {
                    throw new Error(`File extension is not valid. Vaild extensions are ${options.extensions}.`);
                }
            }
            if (options?.max_size && options.max_size > 0) {
                if (!this.validateFileSize(options.file_size, options.max_size)) {
                    throw new Error(`File size is not valid. Maximum upload file size is ${options.max_size} KB.`);
                }
            }
            if (!this.isDirectory(uploadPath)) {
                this.createFolder(uploadPath);
            }
            const dstPath = `${uploadPath}${dstFile}`;
            const tmpPath = this.configService.get('app.upload_temp_path');
            if ('async' in options && options.async === true) {
                fse.copy(tmpFile, dstPath, (err1) => {
                    if (err1) {
                        this.log.error('[uploadLocalFile] >> Copy Error ', err1);
                    }
                    if (tmpFile.startsWith(tmpPath)) {
                        fse.remove(tmpFile, (err2) => {
                            if (err2) {
                                this.log.error('[uploadLocalFile] >> Delete Error ', err2);
                            }
                        });
                    }
                });
            }
            else {
                fse.copySync(tmpFile, dstPath);
                if (tmpFile.startsWith(tmpPath)) {
                    fse.removeSync(tmpFile);
                }
            }
            success = 1;
            message = 'File uploaded successfully.';
        }
        catch (err) {
            success = 0;
            message = err;
            this.log.error('[uploadLocalFile] >> Error ', err);
        }
        return {
            success,
            message,
        };
    }
    async uploadAmazonFile(options) {
        let success;
        let message;
        let response;
        try {
            const uploadPath = options.upload_path;
            const tmpFile = options.src_file;
            const dstFile = options.dst_file;
            if (!dstFile || !this.isFile(tmpFile)) {
                throw new Error('Upload file not found.');
            }
            if ('extensions' in options && options.extensions) {
                if (!this.validateFileFormat(options.extensions, dstFile)) {
                    throw new Error(`File extension is not valid. Vaild extensions are ${options.extensions}.`);
                }
            }
            if ('max_size' in options && options.max_size > 0) {
                if (!this.validateFileSize(options.file_size, options.max_size)) {
                    throw new Error(`File size is not valid. Maximum upload file size is ${options.max_size} KB.`);
                }
            }
            const bucketName = await this.cacheService.get('AWS_BUCKET_NAME');
            const dstPath = `${uploadPath}${dstFile}`;
            let mimeType = mime.getType(tmpFile);
            mimeType = mimeType || options.file_type;
            const awsOptions = {
                async: options.async,
                bucket_name: bucketName,
                file_path: tmpFile,
                file_name: dstPath,
                mime_type: mimeType,
                file_size: this.getFileSize(tmpFile),
            };
            if ('async' in options && options.async === false) {
                response = await this.amazonService.uploadFile(awsOptions);
            }
            else {
                response = this.amazonService.uploadFile(awsOptions);
            }
            success = 1;
            message = 'File uploaded successfully.';
        }
        catch (err) {
            success = 0;
            message = err;
        }
        return {
            success,
            message,
            response,
        };
    }
    async uploadWasabiFile(options) {
        let success;
        let message;
        let response;
        try {
            const uploadPath = options.upload_path;
            const tmpFile = options.src_file;
            const dstFile = options.dst_file;
            if (!dstFile || !this.isFile(tmpFile)) {
                throw new Error('Upload file not found.');
            }
            if ('extensions' in options && options.extensions) {
                if (!this.validateFileFormat(options.extensions, dstFile)) {
                    throw new Error(`File extension is not valid. Vaild extensions are ${options.extensions}.`);
                }
            }
            if ('max_size' in options && options.max_size > 0) {
                if (!this.validateFileSize(options.file_size, options.max_size)) {
                    throw new Error(`File size is not valid. Maximum upload file size is ${options.max_size} KB.`);
                }
            }
            const bucketName = await this.cacheService.get('AWS_BUCKET_NAME');
            const dstPath = `${uploadPath}${dstFile}`;
            const awsOpts = {
                async: options.async,
                bucket_name: bucketName,
                file_path: tmpFile,
                file_name: dstPath,
                mime_type: mime.getType(tmpFile),
                file_size: this.getFileSize(tmpFile),
            };
            this.amazonService.setWasabi();
            if ('async' in options && options.async === false) {
                response = await this.amazonService.uploadFile(awsOpts);
            }
            else {
                response = this.amazonService.uploadFile(awsOpts);
            }
            success = 1;
            message = 'File uploaded successfully.';
        }
        catch (err) {
            success = 0;
            message = err;
        }
        return {
            success,
            message,
            response,
        };
    }
    imageUpload(options) {
        let success;
        let message;
        try {
            const uploadPath = options.upload_path;
            const imageData = options.image_data;
            let dstFile = options.dst_file;
            const cleanSource = this.cleanBase64ImageData(imageData);
            const imageSource = buffer_1.Buffer.from(cleanSource, 'base64').toString('utf8');
            if (!dstFile) {
                const tmpName = `base-image-${this.dateService.getCurrentTimeMS()}-${(0, randomatic_1.default)('0', 7)}`;
                dstFile = `${this.sanitizeFileName(tmpName)}.jpg`;
            }
            if (!this.isDirectory(uploadPath)) {
                this.createFolder(uploadPath);
            }
            const dstPath = `${uploadPath}${dstFile}`;
            if ('async' in options && options.async === true) {
                fse.outputFile(dstPath, imageSource, (err1) => {
                    if (err1) {
                        return false;
                    }
                    return true;
                });
            }
            else {
                fse.outputFileSync(dstPath, imageSource);
            }
            success = 1;
            message = 'File created successfully.';
        }
        catch (err) {
            success = 0;
            message = err;
        }
        return {
            success,
            message,
        };
    }
    async getLocalUploadPathURL(folderName) {
        const uploadPathInfo = {};
        const uploadPath = this.configService.get('app.upload_path');
        const uploadUrl = this.configService.get('app.upload_url');
        const apiURL = await this.cacheService.get('API_URL');
        folderName = folderName ? folderName.trim() : '';
        if (folderName === '') {
            uploadPathInfo.folder_name = folderName;
            uploadPathInfo.folder_path = '';
            uploadPathInfo.folder_url = '';
        }
        else {
            const folderPath = this.getUploadNestedFolders(folderName);
            uploadPathInfo.folder_name = folderName;
            uploadPathInfo.folder_path = `${uploadPath}${folderPath}/`;
            uploadPathInfo.folder_url = `${apiURL}/${uploadUrl}${folderName}/`;
        }
        return uploadPathInfo;
    }
    async getAmazonUploadPathURL(folderName) {
        const uploadPathInfo = {};
        folderName = folderName.trim();
        const bucketName = await this.cacheService.get('AWS_BUCKET_NAME');
        if (folderName === '' || bucketName === '') {
            uploadPathInfo.bucket_name = bucketName;
            uploadPathInfo.folder_name = folderName;
            uploadPathInfo.folder_path = '';
            uploadPathInfo.folder_url = '';
        }
        else {
            const awsCDNEnable = await this.cacheService.get('AWS_CDN_ENABLE');
            const awsCDNDomain = await this.cacheService.get('AWS_CDN_DOMAIN');
            const awsSSLVerify = await this.cacheService.get('AWS_SSL_VERIFY');
            const awsProtocal = awsSSLVerify === 'Y' ? 'https' : 'http';
            uploadPathInfo.bucket_name = bucketName;
            uploadPathInfo.folder_name = folderName;
            uploadPathInfo.folder_path = folderName;
            if (awsCDNEnable === 'Y') {
                uploadPathInfo.folder_url = `${awsProtocal}://${awsCDNDomain}/${folderName}/`;
            }
            else {
                uploadPathInfo.folder_url = `${awsProtocal}://${bucketName}.s3.amazonaws.com/${folderName}/`;
            }
        }
        return uploadPathInfo;
    }
    async getWasabiUploadPathURL(folderName) {
        const uploadPathInfo = {};
        folderName = folderName.trim();
        const bucketName = await this.cacheService.get('AWS_BUCKET_NAME');
        if (folderName === '' || bucketName === '') {
            uploadPathInfo.bucket_name = bucketName;
            uploadPathInfo.folder_name = folderName;
            uploadPathInfo.folder_path = '';
            uploadPathInfo.folder_url = '';
        }
        else {
            const awsSSLVerify = await this.cacheService.get('AWS_SSL_VERIFY');
            const awsProtocal = awsSSLVerify === 'Y' ? 'https' : 'http';
            uploadPathInfo.bucket_name = bucketName;
            uploadPathInfo.folder_name = folderName;
            uploadPathInfo.folder_path = folderName;
            uploadPathInfo.folder_url = `${awsProtocal}://s3.wasabisys.com/${bucketName}/${folderName}/`;
        }
        return uploadPathInfo;
    }
    getFileAttributes(fileName) {
        const result = {};
        if (!fileName) {
            const tmpName = `base-image-${this.dateService.getCurrentTimeMS()}-${(0, randomatic_1.default)('0', 7)}`;
            result.file_ext = 'jpg';
            result.file_name = `${this.sanitizeFileName(tmpName)}.${result.file_ext}`;
        }
        else {
            const fileInfo = (0, path_1.parse)(fileName);
            const finalName = fileInfo.name
                .replace(/ /g, '_')
                .replace(/[^A-Za-z0-9@.-_]/g, '');
            const tmpName = `${finalName}-${this.dateService.getCurrentTimeMS()}-${(0, randomatic_1.default)('0', 7)}`;
            result.file_ext = fileInfo.ext.slice(1).toLowerCase();
            result.file_name = `${this.sanitizeFileName(tmpName)}.${result.file_ext}`;
        }
        const allowedExtList = this.configService.get('app.allowed_extensions');
        const defaultExtList = allowedExtList.split(',');
        if (defaultExtList.includes(result.file_ext)) {
            result.file_cat = 'image';
        }
        else {
            result.file_cat = 'file';
        }
        return result;
    }
    getBase64ImageName(imageData) {
        imageData = imageData || '';
        const extension = imageData.substring('data:image/'.length, imageData.indexOf(';base64'));
        const tmpName = `base-image-${this.dateService.getCurrentTimeMS()}-${(0, randomatic_1.default)('0', 7)}`;
        const fileName = `${this.sanitizeFileName(tmpName)}.${extension}`;
        return fileName;
    }
    cleanBase64ImageData(imageData) {
        let imageSource = imageData || '';
        imageSource = imageSource.replace(' ', '+');
        imageSource = imageSource.replace('data:image/jpeg;base64,', '');
        imageSource = imageSource.replace('data:image/png;base64,', '');
        return imageSource;
    }
    createFolder(dirPath, mode) {
        const desiredMode = mode || 0o2777;
        fse.ensureDirSync(dirPath, desiredMode);
    }
    setPermission(filePath, mode) {
        const desiredMode = mode || 0o2777;
        if (this.isFile(filePath)) {
            fse.chmod(filePath, desiredMode);
            return true;
        }
        return false;
    }
    async createUploadFolder(folderName) {
        if (folderName === '') {
            return false;
        }
        const uploadFolder = `${this.configService.get('app.upload_path')}${folderName}/`;
        this.createFolder(uploadFolder);
        return true;
    }
    getUploadNestedFolders(folderName) {
        if (folderName.indexOf('/') >= 0) {
            const folderNameList = folderName.split('/');
            folderName = folderNameList.join('/');
        }
        return folderName;
    }
    validateFileFormat(allowedExt, uploadFile) {
        const checkExt = allowedExt.split(',');
        const imageExt = (0, path_1.extname)(uploadFile).slice(1).toLowerCase();
        return checkExt.includes(imageExt);
    }
    validateFileSize(fileSize, maxSize) {
        const fileSizeKB = Math.ceil(fileSize / 1024);
        return fileSizeKB <= maxSize;
    }
    sanitizeFileName(fileName) {
        return crypto.createHash('sha1').update(fileName, 'utf8').digest('hex');
    }
};
exports.FileService = FileService;
exports.FileService = FileService = FileService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [amazon_service_1.AmazonService,
        cache_service_1.CacheService,
        date_service_1.DateService,
        http_service_1.HttpService,
        config_1.ConfigService])
], FileService);
//# sourceMappingURL=file.service.js.map