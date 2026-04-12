interface AuthObject {
    user: any;
}
import { BlockResultDto } from '@repo/source/common/dto/common.dto';
import { SettingsParamsDto } from '@repo/source/common/dto/common.dto';
import { DataSource, Repository } from 'typeorm';
import { ResponseLibrary } from '@repo/source/utilities/response-library';
import { ActivityLogEntity } from '@repo/source/entities/activity-log.entity';
import { ActivityMasterEntity } from '@repo/source/entities/activity-master.entity';
import { ElasticService } from './elastic.service';
import { FileService } from '@repo/source/services/file.service';
import { CacheService } from '@repo/source/services/cache.service';
type SortParam = {
    prop: string;
    dir: 'asc' | 'desc';
};
export declare class ActivityLogService {
    protected readonly fileService: FileService;
    private readonly basePath;
    protected readonly log: any;
    protected inputParams: object;
    protected blockResult: BlockResultDto;
    protected settingsParams: SettingsParamsDto;
    protected singleKeys: any[];
    protected requestObj: AuthObject;
    protected dataSource: DataSource;
    protected readonly elasticService: ElasticService;
    protected readonly response: ResponseLibrary;
    protected activityLogEntityRepo: Repository<ActivityLogEntity>;
    protected activityMasterEntityRepo: Repository<ActivityMasterEntity>;
    protected readonly cacheService: CacheService;
    protected moduleName: string;
    protected moduleAPI: string;
    protected serviceConfig: any;
    constructor(fileService: FileService);
    setModuleAPI(api: string): void;
    uploadActivityLog(reqParams: any): Promise<any>;
    startActivityLogList(reqParams: any): Promise<{}>;
    getActivityLogList(inputParams: any, skip_filter?: boolean): Promise<any>;
    startAllActivityLogList(reqParams: any): Promise<{}>;
    getAllActivityLogList(inputParams: any): Promise<any>;
    replaceTemplatePlaceholders(valueJson: string, template: string): string;
    activityLogListFinishFailure(inputParams: any): any;
    activityLogListFinishSuccess(inputParams: any): any;
    startActivityLogAdd(reqParams: any): Promise<{}>;
    writeUserActivity(file_content: any): Promise<{
        success: boolean;
        data: string;
    }>;
    getActivityMasterData(activity_code: string): Promise<any>;
    insertActivityLogElastic(inputParams: any): Promise<BlockResultDto>;
    insertActivityLogData(inputParams: any): Promise<any>;
    activityLogFinishSuccess(inputParams: any, message: string): Promise<any>;
    activityLogFinishFailure(inputParams: any): any;
    createElasticSearchQuery(params: any): "" | {
        query: string;
        is_admin: string;
        original_params: any;
        original_order: {
            [key: string]: SortParam;
        };
    };
    getYearsBetween(startYear: any, endYear: any): any[];
    removeEmptyKeys(obj: Record<string, any>): Record<string, any>;
    buildElasticsearchSQLQuery(cleanedQueryParams: any, cleanedSortParams: {
        [key: string]: SortParam;
    }, extraCondition?: any): "" | {
        query: string;
        is_admin: string;
        original_params: any;
        original_order: {
            [key: string]: SortParam;
        };
    };
    getCondition(params: any): string[];
}
export {};
//# sourceMappingURL=activity_log.service.d.ts.map