import { GeneralLibrary } from './general-library';
import { HttpService } from '@nestjs/axios';
import { DataSource } from 'typeorm';
import { ActivityLogAddDto } from '@repo/source/common/dto/activity_log.dto';
type SortParam = {
    prop: string;
    dir: 'asc' | 'desc';
};
export declare class CitGeneralLibrary extends GeneralLibrary {
    protected dataSource: DataSource;
    protected readonly httpService: HttpService;
    protected readonly log: any;
    private readonly lookupEntityRepo;
    verifyCustomerLoginPassword(inputParams: any): {
        is_matched: number;
    };
    getAdminName(id: number, entity_name?: string, module?: string): Promise<string | null>;
    getAdminNameDb(id: any, entity_name: any): Promise<any>;
    getCarName(id: number): Promise<string | null>;
    getAdminData(): Promise<any>;
    addActivityLogs(inputParams: ActivityLogAddDto): Promise<any>;
    getActivityCode(module_name: string, module_api: string): Promise<string>;
    addActivity(moduleName: any, moduleAPI: any, added_by: any, value_json: any, request_id: any): Promise<void>;
    callThirdPartyApi(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, data?: any, headers?: Record<string, string>): Promise<any>;
    deleteAwsFile(filePath: string): Promise<{
        success: number;
        message: string | object;
        result: import("../common/dto/common.dto").PromiseResponseDto;
    }>;
    verifyAdminLoginPassword(inputParams: any): {
        is_matched: number;
    };
    verifyAdminResetPassword(inputParams: any, reqObj: any): {
        is_matched: number;
        old_passwords_limit: number;
    };
    verifyAdminOldPasswords(inputParams: any, reqObj: any): {
        is_old_password: number;
    };
    generateOTPCode(): any;
    encryptVerifyToken(keysObject: any): any;
    getAutocompleteWhere(queryObject: any, inputParams: any, extraConfig: any): void;
    prepareListingCriteria(searchObj: any, inputParams: any, aliasList: any, queryObject: any): any;
    decryptVerifyToken(token: any): Promise<any>;
    getAdminWhereCriteria(actionType: string, inputParams: any, queryObject: any, reqObject: any): any;
    getGroupWhereCriteria(type: string, inputParams: any, queryObject: any, requestObj: any): any;
    encryptPassword(value: any): Promise<string | false>;
    verifyCustomerResetPassword(inputParams: any): {
        is_matched: number;
    };
    extractHashVarName(str: any): any;
    extractReplaceConfigVars(inputData: any): {};
    getSysDateFormat1(sourceName: any, name: any): string;
    prepareListingCriteriaOrderBy(inputParams: any, aliasList: any, queryObject: any): number;
    prepareListingCriteriaWhere(inputParams: any, aliasList: any, queryObject: any): void;
    stringifyJson(value?: any, name?: any, obj?: any): string;
    updateExportOpts(inputParams: any): any;
    removeEmptyKeys(obj: Record<string, any>): Record<string, any>;
    toRadians(degrees: any): number;
    calculateDistance(lat1: any, lon1: any, lat2: any, lon2: any): string;
    chunkArray(array: any, chunkSize: any): any[];
    getServerName(): Promise<any>;
    getCustomeKey(alisa: any, index: any, id: any, page: any, size: any): string;
    numberFormat(value?: any, type?: string, currencyCode?: string, is_currency?: string): any;
    createElasticSearchQuery(params: any): "" | {
        query: string;
        is_admin: string;
        original_params: any;
        original_order: {
            [key: string]: SortParam;
        };
    } | {
        query: {
            bool: {};
        };
    };
    calculateDistancesFromArray(searchLat: any, searchLon: any, locations: any): any;
    submitGearmanJob(inputParams: any): Promise<void>;
    sendEmail(inputParams: any): Promise<void>;
    timeAgo(date: string | Date): string;
    cleanDateString(str: any): string;
    getYearsBetween(startYear: any, endYear: any): any[];
    buildElasticsearchSQLQuery(cleanedQueryParams: any, cleanedSortParams: {
        [key: string]: SortParam;
    }): "" | {
        query: string;
        is_admin: string;
        original_params: any;
        original_order: {
            [key: string]: SortParam;
        };
    };
    buildCondition(key: any, operator: any, value: any): string;
    getCustomToken(entity: any, code?: any, mode?: string): Promise<string>;
    getUsernameFromKeycloak(token: any, keycloakUrl: any, keycloakRealm: any): Promise<any>;
    createTimeSlots(startDate: string, endDate: string, durationMinutes: number): any[];
    applyDynamicSelectsFromLookup(queryObject: any, selFields: Record<string, string>, tableAlias: string): Promise<void>;
    setRedisData(key: any, data: any, timeOut?: any): Promise<boolean>;
    getRedisData(key: any): Promise<any>;
    deleteRedisData(key: any): Promise<number | false>;
    isRedisEnabled(): Promise<boolean>;
    getRandomInt(min: any, max: any): Promise<any>;
    findOneByDynamicFields(alias: string, filters: Record<string, any>, jsonColumn?: string): Promise<any>;
}
export {};
//# sourceMappingURL=cit-general-library.d.ts.map