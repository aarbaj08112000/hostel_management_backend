declare enum MODE {
    LIVE = "live",
    SANDBOX = "sandbox"
}
declare enum DEVICE {
    IOS = "iOS",
    ANDROID = "Android"
}
declare enum TYPE {
    API = "API",
    ADMIN = "Admin",
    FRONT = "Front",
    NOTIFICATIONS = "Notifications"
}
declare enum STATUS {
    PENDING = "Pending",
    INPROCESS = "Inprocess",
    EXECUTED = "Executed",
    FAILED = "Failed"
}
export declare class PushNotificationsEntity {
    id: number;
    code: string;
    mode: MODE;
    token: string;
    title: string;
    message: string;
    params: string;
    varsJson: string;
    notifyCode: string;
    deviceType: DEVICE;
    sendJson: string;
    error: string;
    priority: string;
    type: TYPE;
    status: STATUS;
    executedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
export {};
//# sourceMappingURL=push-notifications.entity.d.ts.map