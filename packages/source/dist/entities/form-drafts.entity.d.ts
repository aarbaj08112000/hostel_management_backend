declare enum REC_MODE {
    ADD = "Add",
    UPDATE = "Update"
}
declare enum REC_TYPE {
    GLOBAL = "Global",
    GROUP = "Group",
    USER = "User"
}
declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive",
    CLOSED = "Closed"
}
export declare class FormDraftsEntity {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    adminId: number;
    groupId: number;
    module: string;
    recMode: REC_MODE;
    recId: number;
    formData: string;
    recType: REC_TYPE;
    status: STATUS;
    deletedAt: Date;
}
export {};
//# sourceMappingURL=form-drafts.entity.d.ts.map