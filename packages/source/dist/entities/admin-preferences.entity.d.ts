declare enum REC_TYPE {
    GLOBAL = "Global",
    GROUP = "Group",
    USER = "User"
}
declare enum IS_DEFAULT {
    YES = "Yes",
    NO = "No"
}
export declare class AdminPreferencesEntity {
    id: number;
    adminId: number;
    groupId: number;
    module: string;
    name: string;
    slug: string;
    configuration: string;
    recType: REC_TYPE;
    isDefault: IS_DEFAULT;
    adminMenuId: number;
    comments: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
export {};
//# sourceMappingURL=admin-preferences.entity.d.ts.map