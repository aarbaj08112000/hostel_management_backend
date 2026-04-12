"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailLoggerDto = exports.SendEmailObjectDto = exports.SendEmailParamsDto = exports.EmailAttachmentsDto = exports.SendEmailOptionsDto = exports.ProcessEmailDto = exports.EmailConfigVarsDto = exports.EmailVariableDto = exports.EmailTemplateDto = void 0;
class EmailTemplateDto {
    emailCode;
    emailTitle;
    fromName;
    fromEmail;
    replyToName;
    replyToEmail;
    ccEmail;
    bccEmail;
    emailSubject;
    emailMessage;
    varsJson;
}
exports.EmailTemplateDto = EmailTemplateDto;
class EmailVariableDto {
    var_name;
}
exports.EmailVariableDto = EmailVariableDto;
class EmailConfigVarsDto {
    company_name;
    copyright_text;
    site_url;
    logo;
}
exports.EmailConfigVarsDto = EmailConfigVarsDto;
class ProcessEmailDto {
    email_subject;
    email_message;
    from_name;
    from_email;
    key_values;
}
exports.ProcessEmailDto = ProcessEmailDto;
class SendEmailOptionsDto {
    to_email;
    email_subject;
    email_message;
    from_name;
    from_email;
    replyto_name;
    replyto_email;
    cc_email;
    bcc_email;
    attachments;
    variables;
    params;
    callback;
    skiplog;
    async;
    new_priority;
}
exports.SendEmailOptionsDto = SendEmailOptionsDto;
class EmailAttachmentsDto {
    filename;
    path;
}
exports.EmailAttachmentsDto = EmailAttachmentsDto;
class SendEmailParamsDto {
    email_code;
    email_title;
}
exports.SendEmailParamsDto = SendEmailParamsDto;
class SendEmailObjectDto {
    to;
    from;
    subject;
    template;
    replyTo;
    inReplyTo;
    cc;
    bcc;
    attachments;
    transporterName;
    variables;
    context;
    new_priority;
    async;
    callback;
    skiplog;
    id;
    uniq_id;
}
exports.SendEmailObjectDto = SendEmailObjectDto;
class EmailLoggerDto {
    receiver;
    subject;
    content;
    type;
    params;
    error;
    code;
    status;
    executedAt;
}
exports.EmailLoggerDto = EmailLoggerDto;
//# sourceMappingURL=email-notify.dto.js.map