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
var AmazonService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmazonService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const fse = __importStar(require("fs-extra"));
const cache_service_1 = require("./cache.service");
const logger_handler_1 = require("../utilities/logger-handler");
let AmazonService = AmazonService_1 = class AmazonService {
    cacheService;
    log = new logger_handler_1.LoggerHandler(AmazonService_1.name).getInstance();
    type = 'aws';
    region = '';
    provider;
    constructor(cacheService) {
        this.cacheService = cacheService;
    }
    setWasabi() {
        this.type = 'wasabi';
    }
    async initialize() {
        const endPoint = await this.cacheService.get('AWS_END_POINT');
        const accessKey = await this.cacheService.get('AWS_ACCESSKEY');
        const secretKey = await this.cacheService.get('AWS_SECRECTKEY');
        if (this.type === 'wasabi') {
            this.provider = new client_s3_1.S3Client({
                credentials: {
                    accessKeyId: accessKey,
                    secretAccessKey: secretKey,
                },
                region: this.region,
            });
        }
        else {
            const awsRegion = endPoint;
            this.region = awsRegion ? awsRegion.trim() : 'us-east-1';
            this.provider = new client_s3_1.S3Client({
                credentials: {
                    accessKeyId: accessKey,
                    secretAccessKey: secretKey,
                },
                region: this.region,
            });
        }
    }
    async checkBucket(options) {
        let success;
        let message;
        let result;
        try {
            await this.initialize();
            const command = new client_s3_1.HeadBucketCommand({
                Bucket: options.bucket_name,
            });
            if ('async' in options && options.async === false) {
                result = await this.provider
                    .send(command)
                    .then()
                    .catch((error) => {
                    this.log.error('[checkBucket::headBucket] >> Error', error);
                    throw error;
                });
            }
            else {
                result = this.provider
                    .send(command)
                    .then((response) => {
                    if (options?.callback) {
                        options.callback(response, 1);
                    }
                })
                    .catch((error) => {
                    this.log.error('[checkBucket::headBucket] >> Error', error);
                    if (options?.callback) {
                        options.callback(error, 0);
                    }
                    throw error;
                });
            }
            success = 1;
            message = 'Bucket status retrieved.';
        }
        catch (err) {
            success = 0;
            message = err;
            this.log.error('[checkBucket] >> Error', err);
        }
        return {
            success,
            message,
            result,
        };
    }
    async checkFile(options) {
        let success;
        let message;
        let result;
        try {
            await this.initialize();
            const command = new client_s3_1.HeadObjectCommand({
                Bucket: options.bucket_name,
                Key: options.file_name,
            });
            if ('async' in options && options.async === false) {
                result = await this.provider
                    .send(command)
                    .then()
                    .catch((error) => {
                    this.log.error('[checkFile::headObject] >> Error', error);
                    throw error;
                });
            }
            else {
                result = this.provider
                    .send(command)
                    .then((response) => {
                    if (options?.callback) {
                        options.callback(response, 1);
                    }
                })
                    .catch((error) => {
                    this.log.error('[checkFile::headObject] >> Error', error);
                    if (options?.callback) {
                        options.callback(error, 0);
                    }
                    throw error;
                });
            }
            success = 1;
            message = 'File status retrieved.';
        }
        catch (err) {
            success = 0;
            message = err;
            this.log.error('[checkFile] >> Error', err);
        }
        return {
            success,
            message,
            result,
        };
    }
    async uploadFile(options) {
        let success;
        let message;
        let result;
        try {
            await this.initialize();
            const command = new client_s3_1.PutObjectCommand({
                ACL: 'public-read',
                Bucket: options.bucket_name,
                Key: options.file_name,
                Body: fse.createReadStream(options.file_path),
                ContentType: options.mime_type,
                ContentLength: options.file_size,
            });
            if ('async' in options && options.async === false) {
                result = await this.provider
                    .send(command)
                    .then()
                    .catch((error) => {
                    this.log.error('[checkFile::upload] >> Error', error);
                    throw error;
                });
            }
            else {
                result = this.provider
                    .send(command)
                    .then((response) => {
                    if (options?.callback) {
                        options.callback(response, 1);
                    }
                })
                    .catch((error) => {
                    this.log.error('[uploadFile::upload] >> Error', error);
                    if (options?.callback) {
                        options.callback(error, 0);
                    }
                    throw error;
                });
            }
            success = 1;
            message = 'File uploaded successfully.';
        }
        catch (err) {
            success = 0;
            message = err;
            this.log.error('[uploadFile] >> Error', err);
        }
        return {
            success,
            message,
            result,
        };
    }
    async deleteFile(options) {
        let success;
        let message;
        let result;
        try {
            await this.initialize();
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: options.bucket_name,
                Key: options.file_name,
            });
            if ('async' in options && options.async === false) {
                result = await this.provider
                    .send(command)
                    .then()
                    .catch((error) => {
                    this.log.error('[deleteFile::deleteObject] >> Error', error);
                    throw error;
                });
            }
            else {
                result = this.provider
                    .send(command)
                    .then((response) => {
                    if (options?.callback) {
                        options.callback(response, 1);
                    }
                })
                    .catch((error) => {
                    this.log.error('[deleteFile::deleteObject] >> Error', error);
                    if (options?.callback) {
                        options.callback(error, 0);
                    }
                    throw error;
                });
            }
            success = 1;
            message = 'File deleted successfully.';
        }
        catch (err) {
            success = 0;
            message = err;
            this.log.error('[deleteFile] >> Error', err);
        }
        return {
            success,
            message,
            result,
        };
    }
    async deleteFiles(options) {
        let success;
        let message;
        let result;
        try {
            await this.initialize();
            const command = new client_s3_1.DeleteObjectsCommand({
                Bucket: options.bucket_name,
                Delete: {
                    Objects: options.file_names,
                },
            });
            if ('async' in options && options.async === false) {
                result = await this.provider
                    .send(command)
                    .then()
                    .catch((error) => {
                    this.log.error('[deleteFiles::deleteObject] >> Error', error);
                    throw error;
                });
            }
            else {
                result = this.provider
                    .send(command)
                    .then((response) => {
                    if (options?.callback) {
                        options.callback(response, 1);
                    }
                })
                    .catch((error) => {
                    this.log.error('[deleteFiles::deleteObject] >> Error', error);
                    if (options?.callback) {
                        options.callback(error, 0);
                    }
                    throw error;
                });
            }
            success = 1;
            message = 'Files deleted successfully.';
        }
        catch (err) {
            success = 0;
            message = err;
            this.log.error('[deleteFiles] >> Error', err);
        }
        return {
            success,
            message,
            result,
        };
    }
    async downloadFile(options) {
        let success;
        let message;
        let result;
        try {
            await this.initialize();
            const command = new client_s3_1.GetObjectCommand({
                Bucket: options.bucket_name,
                Key: options.file_name,
            });
            if ('async' in options && options.async === false) {
                result = await this.provider
                    .send(command)
                    .then()
                    .catch((error) => {
                    this.log.error('[downloadFile::getObject] >> Error', error);
                    throw error;
                });
            }
            else {
                result = this.provider
                    .send(command)
                    .then((response) => {
                    if (options?.callback) {
                        options.callback(response, 1);
                    }
                })
                    .catch((error) => {
                    this.log.error('[downloadFile::getObject] >> Error', error);
                    if (options?.callback) {
                        options.callback(error, 0);
                    }
                    throw error;
                });
            }
            success = 1;
            message = 'File downloaded successfully.';
        }
        catch (err) {
            success = 0;
            message = err;
            this.log.error('[downloadFile] >> Error', err);
        }
        return {
            success,
            message,
            result,
        };
    }
    async createBucket(options) {
        let success;
        let message;
        let result;
        try {
            await this.initialize();
            const command = new client_s3_1.CreateBucketCommand({
                ACL: 'public-read',
                Bucket: options.bucket_name,
                CreateBucketConfiguration: {
                    LocationConstraint: this.region,
                },
            });
            if ('async' in options && options.async === false) {
                result = await this.provider
                    .send(command)
                    .then()
                    .catch((error) => {
                    this.log.error('[createBucket::createBucket] >> Error', error);
                    throw error;
                });
            }
            else {
                result = this.provider
                    .send(command)
                    .then((response) => {
                    if (options?.callback) {
                        options.callback(response, 1);
                    }
                })
                    .catch((error) => {
                    this.log.error('[createBucket::createBucket] >> Error', error);
                    if (options?.callback) {
                        options.callback(error, 0);
                    }
                    throw error;
                });
            }
            success = 1;
            message = 'Bucket created successfully.';
        }
        catch (err) {
            success = 0;
            message = err;
            this.log.error('[createBucket] >> Error', err);
        }
        return {
            success,
            message,
            result,
        };
    }
    async deleteBucket(options) {
        let success;
        let message;
        let result;
        try {
            await this.initialize();
            const s3Client = this.provider;
            const command = new client_s3_1.DeleteBucketCommand({
                Bucket: options.bucket_name,
            });
            if ('async' in options && options.async === false) {
                result = await this.provider
                    .send(command)
                    .then()
                    .catch((error) => {
                    this.log.error('[deleteBucket::deleteBucket] >> Error', error);
                    throw error;
                });
            }
            else {
                result = this.provider
                    .send(command)
                    .then((response) => {
                    if (options?.callback) {
                        options.callback(response, 1);
                    }
                })
                    .catch((error) => {
                    this.log.error('[deleteBucket::deleteBucket] >> Error', error);
                    if (options?.callback) {
                        options.callback(error, 0);
                    }
                    throw error;
                });
            }
            success = 1;
            message = 'Bucket deleted successfully.';
        }
        catch (err) {
            success = 0;
            message = err;
            this.log.error('[deleteBucket] >> Error', err);
        }
        return {
            success,
            message,
            result,
        };
    }
    async getBucketFiles(options) {
        let success;
        let message;
        let result;
        try {
            await this.initialize();
            const listOpts = {
                Bucket: options.bucket_name,
            };
            if (options?.prefix) {
                listOpts.Prefix = options.prefix;
            }
            if (options?.max_keys > 0) {
                listOpts.MaxKeys = options.max_keys;
            }
            if (options?.start_after) {
                listOpts.StartAfter = options.start_after;
            }
            if (options?.continuation_token) {
                listOpts.ContinuationToken = options.continuation_token;
            }
            const command = new client_s3_1.ListObjectsV2Command(listOpts);
            if ('async' in options && options.async === false) {
                result = await this.provider
                    .send(command)
                    .then()
                    .catch((error) => {
                    this.log.error('[getBucketFiles::listObjectsV2] >> Error', error);
                    throw error;
                });
            }
            else {
                result = this.provider
                    .send(command)
                    .then((response) => {
                    if (options?.callback) {
                        options.callback(response, 1);
                    }
                })
                    .catch((error) => {
                    this.log.error('[getBucketFiles::listObjectsV2] >> Error', error);
                    if (options?.callback) {
                        options.callback(error, 0);
                    }
                    throw error;
                });
            }
            success = 1;
            message = 'Files retrieved successfully.';
        }
        catch (err) {
            success = 0;
            message = err;
        }
        return {
            success,
            message,
            result,
        };
    }
};
exports.AmazonService = AmazonService;
exports.AmazonService = AmazonService = AmazonService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService])
], AmazonService);
//# sourceMappingURL=amazon.service.js.map