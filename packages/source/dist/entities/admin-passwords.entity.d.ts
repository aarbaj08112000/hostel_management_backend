declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class AdminPasswordsEntity {
    id: number;
    adminId: number;
    password: string;
    status: STATUS;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=admin-passwords.entity.d.ts.map