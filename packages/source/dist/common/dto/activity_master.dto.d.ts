export declare class ActivityMasterAddDto {
    code: string;
    name: string;
    template?: string;
    params?: any;
    type: string;
    added_by: string;
    status: string;
}
declare const ActivityMasterUpdateDto_base: import("@nestjs/mapped-types").MappedType<Partial<ActivityMasterAddDto>>;
export declare class ActivityMasterUpdateDto extends ActivityMasterUpdateDto_base {
    id: string;
    updated_by: string;
}
export {};
//# sourceMappingURL=activity_master.dto.d.ts.map