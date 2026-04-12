"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsLoggerDto = exports.SendSmsObjectDto = exports.SmsSendJsonDto = exports.SendSmsParamsDto = exports.SendSmsOptionsDto = exports.ProcessSmsDto = exports.SmsVariableDto = exports.SmsTemplateDto = void 0;
class SmsTemplateDto {
    templateTitle;
    templateCode;
    message;
    varsJson;
}
exports.SmsTemplateDto = SmsTemplateDto;
class SmsVariableDto {
    var_name;
}
exports.SmsVariableDto = SmsVariableDto;
class ProcessSmsDto {
    sms_message;
    key_values;
}
exports.ProcessSmsDto = ProcessSmsDto;
class SendSmsOptionsDto {
    number;
    message;
    params;
    callback;
    skiplog;
    async;
    priority;
    id;
}
exports.SendSmsOptionsDto = SendSmsOptionsDto;
class SendSmsParamsDto {
    template_code;
    template_title;
}
exports.SendSmsParamsDto = SendSmsParamsDto;
class SmsSendJsonDto {
    payload;
}
exports.SmsSendJsonDto = SmsSendJsonDto;
class SendSmsObjectDto {
    to;
    from;
    body;
}
exports.SendSmsObjectDto = SendSmsObjectDto;
class SmsLoggerDto {
    receiver;
    message;
    error;
    type;
    code;
    status;
    executedAt;
}
exports.SmsLoggerDto = SmsLoggerDto;
//# sourceMappingURL=sms-notify.dto.js.map