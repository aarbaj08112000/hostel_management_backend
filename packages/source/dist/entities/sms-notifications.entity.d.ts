declare enum STATUS {
    PENDING = "Pending",
    INPROCESS = "Inprocess",
    EXECUTED = "Executed",
    FAILED = "Failed"
}
declare enum TYPE {
    API = "API",
    ADMIN = "Admin",
    FRONT = "Front",
    NOTIFICATIONS = "Notifications"
}
export declare class SmsNotificationsEntity {
    id: number;
    receiver: string;
    message: string;
    error: string;
    type: TYPE;
    code: string;
    status: STATUS;
    executedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
export {};
//# sourceMappingURL=sms-notifications.entity.d.ts.map