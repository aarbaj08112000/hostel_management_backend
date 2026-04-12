import { STATUS, TYPE } from '../enum/common.enum';
import { DynamicKeyMixDto } from './common.dto';
export declare class EmailTemplateDto {
    emailCode: string;
    emailTitle: string;
    fromName?: string;
    fromEmail?: string;
    replyToName?: string;
    replyToEmail?: string;
    ccEmail?: string;
    bccEmail?: string;
    emailSubject?: string;
    emailMessage?: string;
    varsJson?: any;
}
export declare class EmailVariableDto {
    var_name?: string;
}
export declare class EmailConfigVarsDto {
    company_name?: string;
    copyright_text?: string;
    site_url?: string;
    logo?: string;
}
export declare class ProcessEmailDto {
    email_subject?: string;
    email_message?: string;
    from_name?: string;
    from_email?: string;
    key_values?: DynamicKeyMixDto;
}
export declare class SendEmailOptionsDto {
    to_email: string;
    email_subject?: string;
    email_message?: string;
    from_name?: string;
    from_email?: string;
    replyto_name?: string;
    replyto_email?: string;
    cc_email?: string;
    bcc_email?: string;
    attachments?: EmailAttachmentsDto[];
    variables?: DynamicKeyMixDto;
    params?: DynamicKeyMixDto;
    callback?: Function;
    skiplog?: boolean;
    async?: boolean;
    new_priority?: string;
}
export declare class EmailAttachmentsDto {
    filename: string;
    path?: string;
}
export declare class SendEmailParamsDto {
    email_code?: string;
    email_title?: string;
}
export declare class SendEmailObjectDto {
    to: string;
    from?: string;
    subject?: string;
    template?: string;
    replyTo?: string;
    inReplyTo?: string;
    cc?: string;
    bcc?: string;
    attachments?: EmailAttachmentsDto[];
    transporterName?: string;
    variables?: any;
    context?: any;
    new_priority?: string;
    async?: boolean;
    callback?: Function;
    skiplog?: boolean;
    id?: number;
    uniq_id?: number;
}
export declare class EmailLoggerDto {
    receiver: string;
    subject?: string;
    content?: string;
    type?: TYPE;
    params?: string;
    error?: string;
    code?: string;
    status?: STATUS;
    executedAt?: string;
}
//# sourceMappingURL=email-notify.dto.d.ts.map