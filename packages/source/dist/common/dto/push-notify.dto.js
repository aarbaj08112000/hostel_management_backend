"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotifyConsumerInputDto = exports.PushLoggerDto = exports.SendPushObjectDto = exports.PushSendJsonDto = exports.SendPushParamsDto = exports.SendPushOptionsDto = exports.ProcessPushDto = exports.PushVariableDto = exports.PushTemplateDto = void 0;
class PushTemplateDto {
    templateTitle;
    templateCode;
    title;
    message;
    sound;
    badge;
    image;
    color;
    silent;
    priority;
    collapseKey;
    sendInterval;
    expireInterval;
    varsJson;
}
exports.PushTemplateDto = PushTemplateDto;
class PushVariableDto {
    var_name;
}
exports.PushVariableDto = PushVariableDto;
class ProcessPushDto {
    push_title;
    push_message;
    key_values;
}
exports.ProcessPushDto = ProcessPushDto;
class SendPushOptionsDto {
    device_token;
    code;
    title;
    message;
    sound;
    badge;
    image;
    icon;
    color;
    silent;
    priority;
    collapse_key;
    send_after;
    expire_after;
    send_mode;
    params;
    data;
    callback;
    skiplog;
    async;
}
exports.SendPushOptionsDto = SendPushOptionsDto;
class SendPushParamsDto {
    template_code;
    template_title;
}
exports.SendPushParamsDto = SendPushParamsDto;
class PushSendJsonDto {
    payload;
}
exports.PushSendJsonDto = PushSendJsonDto;
class SendPushObjectDto {
    title;
    body;
    alert;
    topic;
    sound;
    badge;
    image;
    icon;
    color;
    priority;
    collapseKey;
    contentAvailable;
    expire;
    custom;
    id;
    async;
}
exports.SendPushObjectDto = SendPushObjectDto;
class PushLoggerDto {
    deviceId;
    mode;
    type;
    notifyCode;
    title;
    message;
    sound;
    badge;
    silent;
    image;
    color;
    priority;
    collapseKey;
    code;
    varsJSON;
    sendJSON;
    pushTime;
    expireTime;
    expireInterval;
    deviceType;
    error;
    status;
    executedAt;
}
exports.PushLoggerDto = PushLoggerDto;
class PushNotifyConsumerInputDto {
    notify_data;
    token_list;
}
exports.PushNotifyConsumerInputDto = PushNotifyConsumerInputDto;
//# sourceMappingURL=push-notify.dto.js.map