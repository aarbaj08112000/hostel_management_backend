declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class GroupMasterEntity {
    id: number;
    groupName: string;
    groupCode: string;
    groupingAttr: string;
    groupCapabilities: string;
    status: STATUS;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=group-master.entity.d.ts.map