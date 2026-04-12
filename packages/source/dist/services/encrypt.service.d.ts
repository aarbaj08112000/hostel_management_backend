import { CacheService } from './cache.service';
import { DynamicKeyAnyDto, StandardResultDto } from '../common/dto/common.dto';
import { ConfigService } from '@nestjs/config';
export declare class EncryptService {
    private cacheService;
    protected readonly configService: ConfigService;
    private agent;
    private ip;
    private readonly log;
    private excludeParams;
    private KEY;
    private IV;
    constructor(cacheService: CacheService, configService: ConfigService);
    initialize(type: string): Promise<void>;
    encryptData(str: string): Promise<string>;
    decryptData(str: string): Promise<string>;
    encryptContent(str: string): Promise<string>;
    decryptContent(str: string): Promise<string>;
    decryptInputs(params: DynamicKeyAnyDto): Promise<DynamicKeyAnyDto>;
    validateRequest(params: DynamicKeyAnyDto): Promise<StandardResultDto>;
    validateChecksum(params: DynamicKeyAnyDto): StandardResultDto;
    setUserAgent: (agent: any) => void;
    setIPAddres: (ip: any) => void;
    validateWSToken(wsToken: string): Promise<{
        success: number;
        message: string;
    }>;
    checkTimeLimit(tokenTime: string): Promise<boolean>;
}
//# sourceMappingURL=encrypt.service.d.ts.map