declare enum SILENT {
    YES = "Yes",
    NO = "No"
}
declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class PushNotifyTemplateEntity {
    id: number;
    templateTitle: string;
    templateCode: string;
    title: string;
    message: string;
    sound: string;
    badge: number;
    image: string;
    color: string;
    silent: SILENT;
    priority: string;
    collapseKey: string;
    sendInterval: number;
    expireInterval: number;
    varsJson: JSON;
    status: STATUS;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=push-notify-template.entity.d.ts.map