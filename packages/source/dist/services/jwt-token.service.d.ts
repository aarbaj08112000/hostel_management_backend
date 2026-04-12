import { CacheService } from './cache.service';
import { ConfigService } from '@nestjs/config';
export declare class JwtTokenService {
    protected readonly cacheService: CacheService;
    protected readonly configService: ConfigService;
    protected readonly log: any;
    constructor(cacheService: CacheService, configService: ConfigService);
    createAPIToken(apiName: any, apiConfig: any, apiResult: any): Promise<{
        success: number;
        message: string;
        token: string;
    }>;
    verifyAPIToken(apiName: any, apiConfig: any, apiToken: any): Promise<{
        success: number;
        message: string;
        payload: {};
        verify_api: string;
    }>;
    verifyAdminToken(apiName: any, apiConfig: any, apiToken: any): Promise<{
        success: number;
        message: string;
        payload: {};
    }>;
}
//# sourceMappingURL=jwt-token.service.d.ts.map