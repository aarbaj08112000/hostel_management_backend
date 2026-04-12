declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class PageSettingsEntity {
    id: number;
    pageTitle: string;
    pageCode: string;
    content: string;
    metaTitle: string;
    metaKeyword: string;
    metaDesc: string;
    status: STATUS;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=page-settings.entity.d.ts.map