declare enum USER_TYPE {
    ADMIN = "Admin",
    FRONT = "Front"
}
export declare class LogHistoryEntity {
    id: number;
    userId: number;
    userType: USER_TYPE;
    ip: string;
    loginDate: Date;
    logoutDate: Date;
    lastAccess: Date;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=log-history.entity.d.ts.map