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
var SettingMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingMiddleware = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const _ = __importStar(require("lodash"));
const api_service_1 = require("@repo/source/services/api.service");
const logger_handler_1 = require("../utilities/logger-handler");
const cache_service_1 = require("../services/cache.service");
const redis_service_1 = require("@repo/source/services/redis.service");
let SettingMiddleware = SettingMiddleware_1 = class SettingMiddleware {
    request;
    apiService;
    cacheService;
    redisService;
    log = new logger_handler_1.LoggerHandler(SettingMiddleware_1.name).getInstance();
    constructor(request, apiService, cacheService, redisService) {
        this.request = request;
        this.apiService = apiService;
        this.cacheService = cacheService;
        this.redisService = redisService;
    }
    async use(req, res, next) {
        const isRedisEnabled = process.env.REDIS_ENABLED;
        const lastSyncedAt = await this.cacheService.get('LAST_SYNCED_AT');
        if (!lastSyncedAt) {
            const data = await this.apiService.syncSettings();
            if (_.isArray(data) && data.length > 0) {
                await this.cacheService.set('LAST_SYNCED_AT', new Date().getTime().toString());
                data.forEach(async (row) => {
                    await this.cacheService.set(row.name, row.value);
                    if (isRedisEnabled == 'Yes') {
                        await this.redisService.set(row.name, row.value);
                    }
                });
                this.log.log('Settings synced to cache');
            }
        }
        next();
    }
};
exports.SettingMiddleware = SettingMiddleware;
exports.SettingMiddleware = SettingMiddleware = SettingMiddleware_1 = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, api_service_1.ApiService,
        cache_service_1.CacheService,
        redis_service_1.RedisService])
], SettingMiddleware);
//# sourceMappingURL=setting.middleware.js.map