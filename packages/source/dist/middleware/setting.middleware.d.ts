import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiService } from '@repo/source/services/api.service';
import { CacheService } from '../services/cache.service';
import { RedisService } from '@repo/source/services/redis.service';
export declare class SettingMiddleware implements NestMiddleware {
    private request;
    private readonly apiService;
    private readonly cacheService;
    private readonly redisService;
    private readonly log;
    constructor(request: Request, apiService: ApiService, cacheService: CacheService, redisService: RedisService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=setting.middleware.d.ts.map