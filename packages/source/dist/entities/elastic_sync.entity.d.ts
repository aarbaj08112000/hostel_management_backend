declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
declare enum SEARCHABLE {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class SyncElasticEntity {
    iSyncElasticId: number;
    vEntity: number;
    vMySqlEntity: string;
    vMySqlEntityType: string;
    vUniqueKey: string;
    vUniqueIndex: string;
    vEntityType: string;
    vEntityRegex: string;
    dLastSyncTime: Date;
    iBulkUploadLimit: number;
    eStatus: STATUS;
    eIsSearchable: SEARCHABLE;
    eIsEnabledForSearch: SEARCHABLE;
}
declare enum IS_SEARCHABLE {
    YES = "Yes",
    NO = "No"
}
declare enum IS_ENABLED_FOR_SEARCH {
    YES = "Yes",
    NO = "No"
}
export declare class SyncElasticEntityUser {
    id: number;
    entityName: string;
    entityType: string;
    entityRegex: string;
    sqlEntityName: string;
    sqlEntityType: string;
    uniqueKey: string;
    uniqueIndex: string;
    lastSyncTime: Date;
    bulkUploadLimit: number;
    eIsSearchable: IS_SEARCHABLE;
    eIsEnabledForSearch: IS_ENABLED_FOR_SEARCH;
    status: STATUS;
    addedBy: string;
    updatedBy: string;
    updatedAt: Date;
    createdAt: Date;
}
export {};
//# sourceMappingURL=elastic_sync.entity.d.ts.map