import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';
import { DateService } from './date.service';
import { PushNotifyTemplateEntity } from '../entities/push-notify-template.entity';
import { PushNotificationsEntity } from '../entities/push-notifications.entity';
import { ProcessPushDto, PushSendJsonDto, PushTemplateDto, PushVariableDto, SendPushObjectDto, SendPushOptionsDto, SendPushParamsDto } from '../common/dto/push-notify.dto';
import { StandardReturnDto } from '../common/dto/common.dto';
export declare class PushNotifyService {
    protected readonly configService: ConfigService;
    private readonly cacheService;
    private readonly dateService;
    private pushNotifyTmplRepository;
    private pushNotifyLogsRepository;
    private pushQueue;
    private readonly log;
    constructor(configService: ConfigService, cacheService: CacheService, dateService: DateService, pushNotifyTmplRepository: Repository<PushNotifyTemplateEntity>, pushNotifyLogsRepository: Repository<PushNotificationsEntity>, pushQueue: Queue);
    getPushNotifyByCode(code: string): Promise<PushTemplateDto>;
    processPushNotifyTemplate(tmplData: PushTemplateDto, varsData: PushVariableDto[], execData: SendPushOptionsDto): Promise<ProcessPushDto>;
    processPushNotification(code: string, data: SendPushOptionsDto, params: SendPushParamsDto): Promise<boolean>;
    insertPushNotification(options: SendPushOptionsDto, params: SendPushParamsDto): Promise<boolean>;
    sendPushNotification(options: SendPushObjectDto, tokensList: any): Promise<StandardReturnDto>;
    logPushNotification(options: SendPushOptionsDto & PushSendJsonDto, params: SendPushParamsDto): Promise<StandardReturnDto>;
    handlePushCallBack(error: any, info: any, notification_id: number): Promise<boolean>;
}
//# sourceMappingURL=pushnotify.service.d.ts.map