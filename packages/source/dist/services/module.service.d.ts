import { ConfigService } from '@nestjs/config';
import { EntityManager, Repository } from 'typeorm';
import { CitGeneralLibrary } from '../utilities/cit-general-library';
import { CacheService } from './cache.service';
import { SettingEntity } from '../entities/setting.entity';
export declare class ModuleService {
    protected readonly entityManager: EntityManager;
    protected readonly configService: ConfigService;
    protected readonly cacheService: CacheService;
    protected readonly general: CitGeneralLibrary;
    protected settingEntityRepo: Repository<SettingEntity>;
    protected readonly log: any;
    constructor(entityManager: EntityManager, configService: ConfigService, cacheService: CacheService, general: CitGeneralLibrary, settingEntityRepo: Repository<SettingEntity>);
    getListFilterClause(queryObject: any, filterParams: any, filterConfig: any): void;
    getListSortingClause(queryObject: any, sortParams: any, sortConfig: any): void;
    isEnclosedWithQuote: (keyword: any) => boolean;
    processSQLFunction(sqlStmt: string, queryStmt: string): string;
    convertServerData: (fieldValue: any, fieldConfig: any) => any;
    convertClientData: (fieldValue: any, fieldConfig: any) => any;
    getServiceObject(serviceName: any, folderName: any): Promise<any>;
    uploadFormFile(reqParams: any, reqFiles: any): Promise<import("../utilities/response-handler").ResponseDataInterface>;
    deleteFormFile: (reqParams: any) => Promise<import("../utilities/response-handler").ResponseDataInterface>;
    downloadFormFile: (reqParams: any) => Promise<{
        settings: {
            success: any;
            message: any;
        };
        file: any;
    }>;
}
//# sourceMappingURL=module.service.d.ts.map