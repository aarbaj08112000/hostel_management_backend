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
var EncryptService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptService = void 0;
const common_1 = require("@nestjs/common");
const _ = __importStar(require("lodash"));
const crypto = __importStar(require("crypto"));
const CryptoJS = __importStar(require("crypto-js"));
const custom_helper_1 = require("../utilities/custom-helper");
const cache_service_1 = require("./cache.service");
const logger_handler_1 = require("../utilities/logger-handler");
const config_1 = require("@nestjs/config");
let EncryptService = EncryptService_1 = class EncryptService {
    cacheService;
    configService;
    agent;
    ip;
    log = new logger_handler_1.LoggerHandler(EncryptService_1.name).getInstance();
    excludeParams = [
        'access_token',
        'ws_checksum',
        'ws_preview',
        'ws_encrypt',
        'ws_debug',
        'ws_cache',
        'ws_ctrls',
        'ws_log',
        '_',
    ];
    KEY = null;
    IV = null;
    constructor(cacheService, configService) {
        this.cacheService = cacheService;
        this.configService = configService;
    }
    async initialize(type) {
        let encryptKey = await this.cacheService.get('WS_ENC_KEY');
        if (type === 'content') {
            encryptKey = this.configService.get('app.dataSecret');
        }
        const saltPhrase = 'CIT';
        const iterCount = 999;
        const keyPhrase = crypto.createHash('md5').update(encryptKey).digest('hex');
        const ivPhrase = crypto
            .createHash('sha1')
            .update(encryptKey)
            .digest('hex')
            .substr(0, 16);
        this.KEY = CryptoJS.PBKDF2(keyPhrase, saltPhrase, {
            hasher: CryptoJS.algo.SHA256,
            keySize: 64 / 8,
            iterations: iterCount,
        });
        this.IV = CryptoJS.enc.Utf8.parse(ivPhrase);
    }
    async encryptData(str) {
        let output;
        try {
            await this.initialize('data');
            const encrypted = CryptoJS.AES.encrypt(str, this.KEY, {
                iv: this.IV,
            });
            output = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
        }
        catch (err) {
            output = '';
            this.log.error('[encryptData] >> Error ', err);
        }
        return output;
    }
    async decryptData(str) {
        let output;
        try {
            await this.initialize('data');
            const decrypted = CryptoJS.AES.decrypt(str, this.KEY, {
                iv: this.IV,
            });
            output = decrypted.toString(CryptoJS.enc.Utf8);
        }
        catch (err) {
            output = '';
            this.log.error('[decryptData] >> Error ', err);
        }
        return output;
    }
    async encryptContent(str) {
        let output;
        try {
            await this.initialize('content');
            const encrypted = CryptoJS.AES.encrypt(str, this.KEY, {
                iv: this.IV,
            });
            output = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
        }
        catch (err) {
            output = '';
            this.log.error('[encryptContent] >> Error ', err);
        }
        return output;
    }
    async decryptContent(str) {
        let output;
        try {
            await this.initialize('content');
            const decrypted = CryptoJS.AES.decrypt(str, this.KEY, {
                iv: this.IV,
                format: CryptoJS.format.Hex,
            });
            output = decrypted.toString(CryptoJS.enc.Utf8);
        }
        catch (err) {
            output = '';
            this.log.error('[decryptContent] >> Error ', err);
        }
        return output;
    }
    async decryptInputs(params) {
        if (!_.isObject(params) || _.isEmpty(params)) {
            return params;
        }
        const excludeList = this.excludeParams;
        excludeList.push('ws_token');
        Object.keys(params).forEach(async (key) => {
            if (!excludeList.includes(key)) {
                let val = params[key];
                if (_.isString(val)) {
                    val = val.replace(/\s/g, '+');
                }
                params[key] = await this.decryptData(val);
            }
        });
        return params;
    }
    async validateRequest(params) {
        let response = {
            success: 1,
            message: '',
        };
        const checksumEncryption = await this.cacheService.get('WS_CHECKSUM_ENCRYPTION');
        if (checksumEncryption === 'Y') {
            response = this.validateChecksum(params);
        }
        return response;
    }
    validateChecksum(params) {
        const response = {
            success: 1,
            message: '',
        };
        if (!_.isObject(params) || _.isEmpty(params)) {
            return response;
        }
        const excludeList = this.excludeParams;
        const sorted = {};
        Object.keys(params)
            .sort()
            .forEach((key) => {
            sorted[key] = params[key];
        });
        const data = [];
        Object.keys(sorted).forEach((key) => {
            const val = sorted[key];
            if (!(0, custom_helper_1.isEmpty)(val) && !excludeList.includes(key)) {
                const pair = `${key}=${val}`;
                data.push(pair);
            }
        });
        const reqChecksum = params['ws_checksum'] || '';
        if (!data.length && (0, custom_helper_1.isEmpty)(reqChecksum)) {
            response.success = 1;
            response.message = 'Checksum optional..!';
        }
        else {
            const str = data.join('');
            const genChecksum = crypto.createHash('sha1').update(str).digest('hex');
            if ((0, custom_helper_1.isEmpty)(genChecksum)) {
                response.success = -3;
                response.message = 'Checksum not found..!';
            }
            else if (genChecksum !== reqChecksum) {
                response.success = -3;
                response.message = 'Checksum failed..!';
            }
            else {
                response.success = 1;
                response.message = 'Checksum successful..!';
            }
        }
        return response;
    }
    setUserAgent = (agent) => {
        this.agent = agent;
    };
    setIPAddres = (ip) => {
        this.ip = ip;
    };
    async validateWSToken(wsToken) {
        const response = {
            success: 1,
            message: '',
        };
        return response;
    }
    async checkTimeLimit(tokenTime) {
        const timeLimit = await this.cacheService.get('WS_TIME_LIMIT');
        if (!timeLimit) {
            return false;
        }
        if (!tokenTime) {
            return false;
        }
        let prevTime = new Date(tokenTime).getTime();
        let currTime = new Date().getTime();
        prevTime /= 1000;
        currTime /= 1000;
        const avaiLimit = Math.round(Math.abs(currTime - prevTime) / 60);
        if (avaiLimit > Number(timeLimit)) {
            return true;
        }
        return false;
    }
};
exports.EncryptService = EncryptService;
exports.EncryptService = EncryptService = EncryptService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        config_1.ConfigService])
], EncryptService);
//# sourceMappingURL=encrypt.service.js.map