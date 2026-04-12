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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AuthMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const _ = __importStar(require("lodash"));
const cit_api_config_1 = __importDefault(require("../config/cit-api-config"));
const custom = __importStar(require("../utilities/custom-helper"));
const logger_handler_1 = require("../utilities/logger-handler");
const jwt_token_service_1 = require("../services/jwt-token.service");
const encrypt_service_1 = require("../services/encrypt.service");
const response_handler_1 = require("../utilities/response-handler");
let AuthMiddleware = AuthMiddleware_1 = class AuthMiddleware {
    request;
    jwtTokenService;
    encryptService;
    constructor(request, jwtTokenService, encryptService) {
        this.request = request;
        this.jwtTokenService = jwtTokenService;
        this.encryptService = encryptService;
    }
    log = new logger_handler_1.LoggerHandler(AuthMiddleware_1.name).getInstance();
    async use(req, res, next) {
        const actions = [
            'verify',
            'verify-create',
            'optional-verify',
            'optional-create',
        ];
        const apiName = custom.getRouteAPIName(req.baseUrl, req.method.toLowerCase());
        if (_.isObject(cit_api_config_1.default[apiName]) &&
            'action' in cit_api_config_1.default[apiName] &&
            actions.includes(cit_api_config_1.default[apiName].action)) {
            let apiToken;
            if (req.headers && req.headers.authorization) {
                const parts = req.headers.authorization.split(' ');
                const scheme = parts[0];
                const credentials = parts[1];
                if (/^Bearer$/i.test(scheme)) {
                    apiToken = credentials;
                }
            }
            else if (req.query && req.query.access_token) {
                apiToken = req.query.access_token;
            }
            else if (req.body && req.body.access_token) {
                apiToken = req.body.access_token;
            }
            const response = await this.jwtTokenService.verifyAPIToken(apiName, cit_api_config_1.default, apiToken);
            if (!response.success &&
                cit_api_config_1.default[apiName].action !== 'optional-verify') {
                const success = -1;
                const message = response.message || 'Authentication token failed.';
                const result = response_handler_1.ResponseHandler.standard(common_1.HttpStatus.UNAUTHORIZED, success, message, {});
                return res.status(result.settings.status).json(result);
            }
            let payload = { ...response.payload, token: apiToken };
            if (response.success &&
                response.verify_api &&
                response.verify_api in cit_api_config_1.default) {
                const verifyAPI = response.verify_api;
                const folderPath = cit_api_config_1.default[verifyAPI].folder;
                const verifyPath = `../api/services/${folderPath}/${verifyAPI}.service`;
                const verifyController = await Promise.resolve(`${verifyPath}`).then(s => __importStar(require(s)));
                const verifyObject = verifyController.default;
                const verifyMethod = custom.snakeToCamel(`start_${verifyAPI}`);
                const verifyResult = await verifyObject[verifyMethod](req, payload);
                if (!('settings' in verifyResult) || !verifyResult.settings.success) {
                    const success = -1;
                    const message = verifyResult.settings.message || 'Token verification failed.';
                    const result = response_handler_1.ResponseHandler.standard(common_1.HttpStatus.UNAUTHORIZED, success, message, {});
                    return res.status(result.settings.status).json(result);
                }
                if (_.isObject(verifyResult.data)) {
                    payload = { ...payload, ...verifyResult.data };
                }
            }
            req.user = payload;
        }
        next();
    }
};
exports.AuthMiddleware = AuthMiddleware;
exports.AuthMiddleware = AuthMiddleware = AuthMiddleware_1 = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, jwt_token_service_1.JwtTokenService,
        encrypt_service_1.EncryptService])
], AuthMiddleware);
//# sourceMappingURL=auth.middleware.js.map