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
var GeneralLibrary_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralLibrary = void 0;
const common_1 = require("@nestjs/common");
const buffer_1 = require("buffer");
const crypto = __importStar(require("crypto"));
const _ = __importStar(require("lodash"));
const logger_handler_1 = require("./logger-handler");
const fs_1 = require("fs");
const cache_service_1 = require("@repo/source/services/cache.service");
const date_service_1 = require("@repo/source/services/date.service");
const email_service_1 = require("@repo/source/services/email.service");
const encrypt_service_1 = require("@repo/source/services/encrypt.service");
const file_service_1 = require("@repo/source/services/file.service");
const amazon_service_1 = require("@repo/source/services/amazon.service");
const jwt_token_service_1 = require("@repo/source/services/jwt-token.service");
const pushnotify_service_1 = require("@repo/source/services/pushnotify.service");
const sms_service_1 = require("@repo/source/services/sms.service");
const custom = __importStar(require("./custom-helper"));
const cit_api_config_1 = __importDefault(require("@repo/source/config/cit-api-config"));
const config_1 = require("@nestjs/config");
const gearman_service_1 = require("@repo/source/services/gearman.service");
const elastic_service_1 = require("@repo/source/services/elastic.service");
const redis_service_1 = require("@repo/source/services/redis.service");
const activity_log_service_1 = require("@repo/source/services/activity_log.service");
let GeneralLibrary = GeneralLibrary_1 = class GeneralLibrary {
    cacheService;
    dateService;
    emailService;
    encryptService;
    fileService;
    amazonService;
    jwtTokenService;
    pushService;
    smsService;
    configService;
    gearmanService;
    elasticService;
    activityLogService;
    redisService;
    log = new logger_handler_1.LoggerHandler(GeneralLibrary_1.name).getInstance();
    constructor(cacheService, dateService, emailService, encryptService, fileService, amazonService, jwtTokenService, pushService, smsService, configService, gearmanService, elasticService, activityLogService, redisService) {
        this.cacheService = cacheService;
        this.dateService = dateService;
        this.emailService = emailService;
        this.encryptService = encryptService;
        this.fileService = fileService;
        this.amazonService = amazonService;
        this.jwtTokenService = jwtTokenService;
        this.pushService = pushService;
        this.smsService = smsService;
        this.configService = configService;
        this.gearmanService = gearmanService;
        this.elasticService = elasticService;
        this.activityLogService = activityLogService;
        this.redisService = redisService;
    }
    escape(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\//g, '&#x2F;')
            .replace(/\\/g, '&#x5C;')
            .replace(/`/g, '&#96;');
    }
    getRandomNumber = (length) => {
        length = length > 0 ? length : 16;
        return custom.getRandomNumber(length);
    };
    unescape(str) {
        return str
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#x2F;/g, '/')
            .replace(/&#x5C;/g, '\\')
            .replace(/&#96;/g, '`');
    }
    parse(str) {
        let arr = [];
        try {
            arr = JSON.parse(str);
        }
        catch (err) {
            this.log.error(`[parse] -> ${err.message}`);
        }
        return arr;
    }
    stringify(arr) {
        let str = '';
        try {
            str = JSON.stringify(arr);
        }
        catch (err) {
            this.log.error(`[stringify] -> ${err.message}`);
        }
        return str;
    }
    async getDateTime(type, params) {
        let value;
        switch (type) {
            case 'date':
                value = this.dateService.getCurrentDate();
                break;
            case 'time':
                value = this.dateService.getCurrentTime();
                break;
            case 'datetime':
                value = this.dateService.getCurrentDateTime();
                break;
            case 'timestamp':
                value = this.dateService.getCurrentTimeStamp();
                break;
            case 'timems':
                value = this.dateService.getCurrentTimeMS();
                break;
            case 'datetime_before':
                value = this.dateService.getDateTimeBefore(params.value, params.type);
                break;
            case 'datetime_after':
                value = this.dateService.getDateTimeAfter(params.value, params.type);
                break;
            case 'sys_date':
                value = await this.dateService.getDateSystemFormat(params.value);
                break;
            case 'sys_time':
                value = await this.dateService.getTimeSystemFormat(params.value);
                break;
            case 'sys_datetime':
                value = await this.dateService.getDateTimeSystemFormat(params.value);
                break;
            case 'cus_date':
                value = this.dateService.getDateCustomFormat(params.value, params.format);
                break;
            case 'cus_time':
                value = this.dateService.getTimeCustomFormat(params.value, params.format);
                break;
            case 'cus_datetime':
                value = this.dateService.getDateTimeCustomFormat(params.value, params.format);
                break;
            default:
                break;
        }
        return value;
    }
    isValidDate(val) {
        if (!val || ['0000-00-00', '0000-00-00 00:00:00'].includes(val)) {
            return false;
        }
        if (!this.dateService.isValidDate(val)) {
            return false;
        }
        return true;
    }
    isValidTime(val) {
        if (!val || val === '00:00:00') {
            return false;
        }
        if (!this.dateService.isValidTime(val)) {
            return false;
        }
        return true;
    }
    getDateDiff(dateLeft, dateRight, type) {
        return this.dateService.diff(dateLeft, dateRight, type);
    }
    compareDate(dateLeft, dateRight) {
        return this.dateService.compare(dateLeft, dateRight);
    }
    async getSystemFormat(type) {
        let value;
        switch (type) {
            case 'date':
                const dateFormat = await this.cacheService.get('ADMIN_DATE_FORMAT');
                value = this.dateService.getSystemDateFormat(dateFormat);
                break;
            case 'time':
                const timeFormat = await this.cacheService.get('ADMIN_TIME_FORMAT');
                value = this.dateService.getSystemTimeFormat(timeFormat);
                break;
            case 'datetime':
                const dateTimeFormat = await this.cacheService.get('ADMIN_DATE_TIME_FORMAT');
                value = this.dateService.getSystemTimeFormat(dateTimeFormat);
                break;
            default:
                break;
        }
        return value;
    }
    isFile(filePath) {
        return this.fileService.isFile(filePath);
    }
    isDirectory(dirPath) {
        return this.fileService.isDirectory(dirPath);
    }
    createFolder(dirPath, mode) {
        return this.fileService.createFolder(dirPath, mode);
    }
    getFileSize(filePath) {
        return this.fileService.getFileSize(filePath);
    }
    getFileMime(filePath) {
        return this.fileService.getFileMime(filePath);
    }
    readURLName(filePath) {
        return this.fileService.readURLName(filePath);
    }
    readFile(filePath, options) {
        return this.fileService.readFile(filePath, options);
    }
    writeFile(filePath, data, options) {
        return this.fileService.writeFile(filePath, data, options);
    }
    deleteFile(filePath, options) {
        return this.fileService.deleteFile(filePath, options);
    }
    getFile(options, params) {
        return this.fileService.getFile(options);
    }
    uploadFile(options, params) {
        return this.fileService.uploadFile(options);
    }
    imageUpload(options, params) {
        return this.fileService.imageUpload(options);
    }
    getFileAttributes(fileName) {
        return this.fileService.getFileAttributes(fileName);
    }
    getBase64ImageName(imageData) {
        return this.fileService.getBase64ImageName(imageData);
    }
    validateFileSize(fSize, mSize) {
        return this.fileService.validateFileSize(fSize, mSize);
    }
    validateFileFormat(allowedExt, file) {
        return this.fileService.validateFileFormat(allowedExt, file);
    }
    async getResizeImageUrl(url, wh, ht, opts) {
        return await this.fileService.getResizeImageUrl(url, wh, ht, opts);
    }
    async getResizedImage(opts) {
        await this.fileService.getResizedImage(opts);
    }
    async writeURLData(fileUrl, filePath, headers, options) {
        return await this.fileService.writeURLData(fileUrl, filePath, headers || {}, options || {});
    }
    async encryptData(data, method) {
        method = method || 'cit';
        let encData = '';
        if (custom.isEmpty(data)) {
            return encData;
        }
        switch (method) {
            case 'base64':
                encData = buffer_1.Buffer.from(data).toString('base64');
                break;
            case 'password_hash':
            case 'bcrypt':
                if (data === '******') {
                    encData = false;
                }
                else {
                    encData = custom.getPasswordHash(data);
                }
                break;
            case 'md5':
            case 'sha1':
            case 'sha256':
            case 'sha512':
                encData = this.getHashChecksum(data, method);
                break;
            default:
                encData = await this.encryptService.encryptContent(data);
                break;
        }
        return encData;
    }
    async decryptData(data, method) {
        method = method || 'cit';
        let decData = '';
        if (custom.isEmpty(data)) {
            return decData;
        }
        switch (method) {
            case 'base64':
                if (_.isString(data)) {
                    decData = buffer_1.Buffer.from(data, 'base64').toString('utf8');
                }
                break;
            case 'password_hash':
            case 'bcrypt':
            case 'md5':
            case 'sha1':
            case 'sha256':
            case 'sha512':
                if (_.isString(data)) {
                    decData = '******';
                }
                break;
            default:
                decData = await this.encryptService.decryptContent(data);
                break;
        }
        return decData;
    }
    verifyEncrypted(data, encData, method) {
        method = method || 'cit';
        let isMatched = false;
        if (custom.isEmpty(data) || custom.isEmpty(encData)) {
            return isMatched;
        }
        let decData;
        switch (method) {
            case 'base64':
                decData = buffer_1.Buffer.from(encData, 'base64').toString('utf8');
                if (data === decData) {
                    isMatched = true;
                }
                break;
            case 'password_hash':
            case 'bcrypt':
                isMatched = custom.comparePasswordHash(data, encData);
                break;
            case 'md5':
            case 'sha1':
            case 'sha256':
            case 'sha512':
                decData = this.getHashChecksum(data, method);
                if (decData === encData) {
                    isMatched = true;
                }
                break;
            default:
                decData = this.encryptService.decryptContent(data);
                if (decData === encData) {
                    isMatched = true;
                }
                break;
        }
        return isMatched;
    }
    getHashChecksum(str, algorithm, encoding) {
        return crypto
            .createHash(algorithm || 'md5')
            .update(str, 'utf8')
            .digest(encoding || 'hex');
    }
    async sendMailNotification(data, code, params) {
        let success;
        if (!code) {
            success = await this.emailService.registerEmail(data, params);
        }
        else {
            success = await this.emailService.processMail(code, data, params);
        }
        return success;
    }
    async sendPushNotification(data, code, params) {
        let success;
        if (!code) {
            success = await this.pushService.insertPushNotification(data, params);
        }
        else {
            success = await this.pushService.processPushNotification(code, data, params);
        }
        return success;
    }
    async sendSMSNotification(data, code, params) {
        let success;
        if (!code) {
            success = await this.smsService.registerSMSNotification(data, params);
        }
        else {
            success = await this.smsService.processSMS(code, data, params);
        }
        return success;
    }
    async createAPIToken(apiName, result) {
        if (_.isObject(cit_api_config_1.default[apiName]) &&
            'action' in cit_api_config_1.default[apiName] &&
            ['create', 'verify-create', 'optional-create'].includes(cit_api_config_1.default[apiName].action)) {
            if ('settings' in result &&
                'success' in result.settings &&
                result.settings.success) {
                const response = await this.jwtTokenService.createAPIToken(apiName, cit_api_config_1.default, result.data);
                if (response.success) {
                    result.settings.access_token = response.token;
                    if ('data' in result && _.isObject(result.data)) {
                        result.data.access_token = response.token;
                    }
                }
            }
        }
        return result;
    }
    async getConfigItem(key) {
        let val = null;
        const isRedisEnabled = process.env.REDIS_ENABLED;
        if (isRedisEnabled == 'Yes') {
            const redisVal = await this.redisService.get(key);
            if (redisVal !== null && redisVal !== undefined) {
                val = redisVal;
                return val;
            }
        }
        const configVal = await this.cacheService.get(key);
        if (configVal !== null && configVal !== undefined) {
            val = configVal;
        }
        else if (key in this.configService.get('app')) {
            val = this.configService.get(`app.${key}`);
        }
        return val;
    }
    async temporaryUpload(file) {
        const file_path = await this.getConfigItem('upload_temp_path');
        if (!(0, fs_1.existsSync)(file_path)) {
            (0, fs_1.mkdirSync)(file_path);
        }
        const fileProp = await this.getFileAttributes(file.originalname);
        const fileName = fileProp.file_name;
        const tempFilePath = `${file_path}${fileName}`;
        const writableStream = (0, fs_1.createWriteStream)(tempFilePath);
        await new Promise((resolve, reject) => {
            writableStream.on('finish', resolve).on('error', reject);
            writableStream.write(file.buffer);
            writableStream.end();
        });
        return fileName;
    }
    evalExpression(expr) {
        return custom.evaluateExpression(expr);
    }
};
exports.GeneralLibrary = GeneralLibrary;
exports.GeneralLibrary = GeneralLibrary = GeneralLibrary_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        date_service_1.DateService,
        email_service_1.EmailService,
        encrypt_service_1.EncryptService,
        file_service_1.FileService,
        amazon_service_1.AmazonService,
        jwt_token_service_1.JwtTokenService,
        pushnotify_service_1.PushNotifyService,
        sms_service_1.SmsService,
        config_1.ConfigService,
        gearman_service_1.GearmanService,
        elastic_service_1.ElasticService,
        activity_log_service_1.ActivityLogService,
        redis_service_1.RedisService])
], GeneralLibrary);
//# sourceMappingURL=general-library.js.map