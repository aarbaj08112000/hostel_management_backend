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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtTokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt = __importStar(require("jsonwebtoken"));
const _ = __importStar(require("lodash"));
const cache_service_1 = require("./cache.service");
const cit_api_access_1 = __importDefault(require("../config/cit-api-access"));
const logger_handler_1 = require("../utilities/logger-handler");
const config_1 = require("@nestjs/config");
let JwtTokenService = class JwtTokenService {
    cacheService;
    configService;
    log = new logger_handler_1.LoggerHandler().getInstance();
    constructor(cacheService, configService) {
        this.cacheService = cacheService;
        this.configService = configService;
    }
    async createAPIToken(apiName, apiConfig, apiResult) {
        const response = {
            success: 0,
            message: '',
            token: '',
        };
        try {
            const apiObj = apiConfig[apiName];
            let accessObj = {};
            if ('access' in apiObj && _.isObject(cit_api_access_1.default[apiObj.access])) {
                accessObj = cit_api_access_1.default[apiObj.access];
            }
            if (!_.isArray(apiResult) && !_.isObject(apiResult)) {
                const err = { code: 404, message: 'No data found.' };
                throw err;
            }
            const secretKey = await this.cacheService.get('WS_AUTH_TOKEN_PUBLIC_KEY');
            if (_.isEmpty(secretKey)) {
                const err = { code: 404, message: 'Authentication key not found.' };
                throw err;
            }
            let expiryTime = await this.cacheService.get('WS_AUTH_TOKEN_EXPIRE_TIME');
            if (_.isObject(accessObj.token_info) && accessObj.token_info.expiry) {
                expiryTime = accessObj.token_info.expiry;
            }
            const tokenExpiry = Number(expiryTime) * 60;
            const payloadData = {};
            let payloadObject = {};
            if (_.isObject(accessObj.api_info) && accessObj.api_info.payload) {
                payloadObject = accessObj.api_info.payload;
            }
            if (_.isObject(payloadObject) && !_.isEmpty(payloadObject)) {
                let dataKey;
                let dataVal;
                let pKey;
                let cKey;
                Object.keys(payloadObject).forEach((key) => {
                    dataKey = payloadObject[key];
                    dataVal = '';
                    if (dataKey in apiResult) {
                        dataVal = apiResult[dataKey];
                    }
                    else if (_.isArray(apiResult) && dataKey in apiResult[0]) {
                        dataVal = apiResult[0][dataKey];
                    }
                    else if (dataKey.indexOf('.') >= 0) {
                        [pKey, cKey] = dataKey.split('.');
                        if (pKey in apiResult &&
                            cKey in apiResult[pKey] &&
                            dataKey in apiResult[pKey][cKey]) {
                            dataVal = apiResult[pKey][cKey];
                        }
                        else if (pKey in apiResult &&
                            cKey in apiResult[pKey][0] &&
                            dataKey in apiResult[pKey][0][cKey]) {
                            dataVal = apiResult[pKey][0][cKey];
                        }
                    }
                    payloadData[key] = dataVal;
                });
            }
            let tokenIssuer = await this.cacheService.get('API_URL');
            if (_.isObject(accessObj.token_info) && accessObj.token_info.issuer) {
                if (accessObj.token_info.issuer.toLowerCase() !== 'self') {
                    tokenIssuer = accessObj.token_info.issuer;
                }
            }
            let tokenAudience = await this.cacheService.get('API_URL');
            if (_.isObject(accessObj.token_info) && accessObj.token_info.audience) {
                if (accessObj.token_info.audience.toLowerCase() !== 'self') {
                    tokenAudience = accessObj.token_info.audience.split(',');
                }
            }
            let tokenAlgo = 'HS256';
            if (_.isObject(accessObj.token_info) && accessObj.token_info.algorithm) {
                tokenAlgo = accessObj.token_info.algorithm;
            }
            const tokenOptions = {
                algorithm: tokenAlgo,
                issuer: tokenIssuer,
                audience: tokenAudience,
                expiresIn: tokenExpiry,
            };
            const jwtToken = jwt.sign(payloadData, secretKey, tokenOptions);
            response.success = 1;
            response.message = 'JWT token created';
            response.token = jwtToken ? jwtToken.toString() : '';
        }
        catch (err) {
            if (typeof err === 'object') {
                if (err.message) {
                    response.message = err.message;
                }
                else {
                    response.message = 'Unable to show error message.';
                }
            }
            else if (typeof err === 'string') {
                response.message = err;
            }
            this.log.error('JWT Create API Token Error: ', err);
        }
        return response;
    }
    async verifyAPIToken(apiName, apiConfig, apiToken) {
        const response = {
            success: 0,
            message: '',
            payload: {},
            verify_api: '',
        };
        try {
            const apiObj = apiConfig[apiName];
            let accessObj = {};
            if ('access' in apiObj && _.isObject(cit_api_access_1.default[apiObj.access])) {
                accessObj = cit_api_access_1.default[apiObj.access];
            }
            if (_.isEmpty(apiToken)) {
                const err = { code: 404, message: 'Token not found.' };
                throw err;
            }
            const secretKey = await this.cacheService.get('WS_AUTH_TOKEN_PUBLIC_KEY');
            if (_.isEmpty(secretKey)) {
                const err = { code: 404, message: 'Authentication key not found.' };
                throw err;
            }
            const payloadKeys = [];
            const payloadData = {};
            let requiredKeys = [];
            if (_.isObject(accessObj.api_info) && accessObj.api_info.create) {
                requiredKeys = accessObj.api_info.required;
                const targetKeys = accessObj.api_info.payload;
                if (_.isObject(targetKeys) && !_.isEmpty(targetKeys)) {
                    Object.keys(targetKeys).forEach((key) => {
                        payloadKeys.push(key);
                    });
                }
            }
            let tokenIssuer = await this.cacheService.get('API_URL');
            if (_.isObject(accessObj.token_info) && accessObj.token_info.issuer) {
                if (accessObj.token_info.issuer.toLowerCase() !== 'self') {
                    tokenIssuer = accessObj.token_info.issuer;
                }
            }
            let tokenAudience = await this.cacheService.get('API_URL');
            if (_.isObject(accessObj.token_info) && accessObj.token_info.audience) {
                if (accessObj.token_info.audience.toLowerCase() !== 'self') {
                    tokenAudience = accessObj.token_info.audience.split(',');
                }
            }
            let tokenAlgo = 'HS256';
            if (_.isObject(accessObj.token_info) && accessObj.token_info.algorithm) {
                tokenAlgo = accessObj.token_info.algorithm;
            }
            const tokenOptions = {
                algorithms: [tokenAlgo],
                issuer: tokenIssuer,
                audience: tokenAudience,
            };
            let tokenDecoded;
            try {
                tokenDecoded = jwt.verify(apiToken, secretKey, tokenOptions);
            }
            catch (error) {
                const err = {
                    code: 400,
                    message: 'Authentication key does not match.',
                };
                throw err;
            }
            if (_.isArray(payloadKeys) && payloadKeys.length > 0) {
                let dataMissing = false;
                payloadKeys.forEach((key) => {
                    if (key) {
                        if (key in tokenDecoded) {
                            payloadData[key] = tokenDecoded[key];
                        }
                        else if (requiredKeys.length > 0) {
                            if (requiredKeys.includes(key)) {
                                dataMissing = true;
                            }
                        }
                    }
                });
                if (dataMissing) {
                    const err = {
                        code: 400,
                        message: 'Invalid token. Payload data missing.',
                    };
                    throw err;
                }
                response.payload = payloadData;
            }
            else {
                response.payload = tokenDecoded;
            }
            if (_.isObject(accessObj.api_info) && accessObj.api_info.verify) {
                response.verify_api = accessObj.api_info.verify;
            }
            else {
                delete response.verify_api;
            }
            response.success = 1;
            response.message = 'JWT token verified';
        }
        catch (err) {
            if (typeof err === 'object') {
                if (err.message) {
                    response.message = err.message;
                }
                else {
                    response.message = 'Unable to show error message.';
                }
            }
            else if (typeof err === 'string') {
                response.message = err;
            }
            this.log.error('JWT Verify API Token Error: ', err);
        }
        return response;
    }
    async verifyAdminToken(apiName, apiConfig, apiToken) {
        const response = {
            success: 0,
            message: '',
            payload: {},
        };
        try {
            let accessObj = {};
            const loginObj = apiConfig.admin_login;
            if ('access' in loginObj && _.isObject(cit_api_access_1.default[loginObj.access])) {
                accessObj = cit_api_access_1.default[loginObj.access];
            }
            if (_.isEmpty(apiToken)) {
                const err = { code: 404, message: 'Token not found.' };
                throw err;
            }
            let secretKey = await this.cacheService.get('WS_AUTH_TOKEN_PUBLIC_KEY');
            if (_.isObject(accessObj.token_info) && accessObj.token_info.algorithm) {
                secretKey = accessObj.token_info.algorithm;
            }
            if (_.isEmpty(secretKey)) {
                const err = { code: 404, message: 'Authentication key not found.' };
                throw err;
            }
            let tokenIssuer = await this.cacheService.get('API_URL');
            if (_.isObject(accessObj.token_info) && accessObj.token_info.issuer) {
                if (accessObj.token_info.issuer.toLowerCase() !== 'self') {
                    tokenIssuer = accessObj.token_info.issuer;
                }
            }
            let tokenAudience = await this.cacheService.get('API_URL');
            if (_.isObject(accessObj.token_info) && accessObj.token_info.audience) {
                if (accessObj.token_info.audience.toLowerCase() !== 'self') {
                    tokenAudience = accessObj.token_info.audience.split(',');
                }
            }
            let tokenAlgo = 'HS256';
            if (_.isObject(accessObj.token_info) && accessObj.token_info.algorithm) {
                tokenAlgo = accessObj.token_info.algorithm;
            }
            const tokenOptions = {
                algorithms: [tokenAlgo],
                issuer: tokenIssuer,
                audience: tokenAudience,
            };
            let tokenDecoded = {};
            try {
                tokenDecoded = jwt.verify(apiToken, secretKey, tokenOptions);
            }
            catch (error) {
                const err = {
                    code: 400,
                    message: 'Authentication key does not match.',
                };
                throw err;
            }
            response.success = 1;
            response.message = 'JWT token verified';
            response.payload = tokenDecoded;
        }
        catch (err) {
            if (typeof err === 'object') {
                if (err.message) {
                    response.message = err.message;
                }
                else {
                    response.message = 'Unable to show error message.';
                }
            }
            else if (typeof err === 'string') {
                response.message = err;
            }
            this.log.error('JWT Verify Admin Token Error: ', err);
        }
        return response;
    }
};
exports.JwtTokenService = JwtTokenService;
exports.JwtTokenService = JwtTokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        config_1.ConfigService])
], JwtTokenService);
//# sourceMappingURL=jwt-token.service.js.map