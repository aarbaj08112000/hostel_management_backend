import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';
import { DateService } from './date.service';
import { SmsNotifyTemplateEntity } from '../entities/sms-notify-template.entity';
import { SmsNotificationsEntity } from '../entities/sms-notifications.entity';
import { ProcessSmsDto, SendSmsOptionsDto, SendSmsParamsDto, SmsSendJsonDto, SmsTemplateDto, SmsVariableDto } from '../common/dto/sms-notify.dto';
import { StandardReturnDto } from '../common/dto/common.dto';
export declare class SmsService {
    protected readonly configService: ConfigService;
    private readonly cacheService;
    private readonly dateService;
    private smsNotifyTmplRepository;
    private smsNotifyLogsRepository;
    private smsQueue;
    private readonly log;
    constructor(configService: ConfigService, cacheService: CacheService, dateService: DateService, smsNotifyTmplRepository: Repository<SmsNotifyTemplateEntity>, smsNotifyLogsRepository: Repository<SmsNotificationsEntity>, smsQueue: Queue);
    getTemplateByCode(code: string): Promise<SmsTemplateDto>;
    processTemplate(tmplData: SmsTemplateDto, varsData: SmsVariableDto[], execData: SendSmsOptionsDto): Promise<ProcessSmsDto>;
    processSMS(code: string, data: SendSmsOptionsDto, params: SendSmsParamsDto): Promise<number>;
    sendSMS(options: SendSmsOptionsDto): Promise<StandardReturnDto>;
    logSMS(options: SendSmsOptionsDto & SmsSendJsonDto, params: SendSmsParamsDto): Promise<StandardReturnDto>;
    handleSmsCallBack(error: any, notification_id: number): Promise<boolean>;
    registerSMSNotification(options: SendSmsOptionsDto & SmsSendJsonDto, params: SendSmsParamsDto): Promise<number>;
}
//# sourceMappingURL=sms.service.d.ts.map