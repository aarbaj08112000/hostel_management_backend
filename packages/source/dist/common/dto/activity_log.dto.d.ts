export declare class ActivityLogAddDto {
    activity_code: string;
    value_json: string;
    module_code: string;
    request_id: number;
    added_by: number;
}
export declare class ActivityLogUploadDto {
    date: Date;
}
export declare class ActivityLogListDto {
    module_code: string;
    request_id: number;
    car_id: number;
    page: number;
    limit: number;
    sort: any;
    filters: any;
    keyword: string;
}
//# sourceMappingURL=activity_log.dto.d.ts.map