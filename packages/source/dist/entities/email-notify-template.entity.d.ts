declare enum STATUS {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class EmailNotifyTemplateEntity {
    id: number;
    emailTitle: string;
    emailCode: string;
    fromName: string;
    fromEmail: string;
    replyToName: string;
    replyToEmail: string;
    ccEmail: string;
    bccEmail: string;
    emailSubject: string;
    emailMessage: string;
    varsJson: JSON;
    status: STATUS;
    createdAt: Date;
    updatedAt: Date;
}
export {};
//# sourceMappingURL=email-notify-template.entity.d.ts.map