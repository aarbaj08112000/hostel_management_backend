declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class SmsNotifyTemplateEntity {
    id: number;
    templateTitle: string;
    templateCode: string;
    message: string;
    varsJson: JSON;
    status: STATUS;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=sms-notify-template.entity.d.ts.map