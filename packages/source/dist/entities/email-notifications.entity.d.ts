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
export declare class EmailNotificationsEntity {
    id: number;
    receiver: string;
    subject: string;
    content: string;
    params: string;
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
//# sourceMappingURL=email-notifications.entity.d.ts.map