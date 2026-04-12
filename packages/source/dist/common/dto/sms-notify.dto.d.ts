import { STATUS, TYPE } from '../enum/common.enum';
import { DynamicKeyMixDto } from './common.dto';
export declare class SmsTemplateDto {
    templateTitle: string;
    templateCode: string;
    message: string;
    varsJson?: any;
}
export declare class SmsVariableDto {
    var_name?: string;
}
export declare class ProcessSmsDto {
    sms_message?: string;
    key_values: DynamicKeyMixDto;
}
export declare class SendSmsOptionsDto {
    number: string;
    message?: string;
    params?: DynamicKeyMixDto;
    callback?: Function;
    skiplog?: boolean;
    async?: boolean;
    priority?: string;
    id?: number;
}
export declare class SendSmsParamsDto {
    template_code?: string;
    template_title?: string;
}
export declare class SmsSendJsonDto {
    payload?: any;
}
export declare class SendSmsObjectDto {
    to: string;
    from?: string;
    body?: string;
}
export declare class SmsLoggerDto {
    receiver: string;
    message?: string;
    error?: string;
    type?: TYPE;
    code?: string;
    status?: STATUS;
    executedAt?: string;
}
//# sourceMappingURL=sms-notify.dto.d.ts.map