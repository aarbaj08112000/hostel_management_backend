import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { CacheService } from './cache.service';
import { DateService } from './date.service';
import { EmailNotifyTemplateEntity } from '../entities/email-notify-template.entity';
import { EmailNotificationsEntity } from '../entities/email-notifications.entity';
import { EmailConfigVarsDto, EmailTemplateDto, EmailVariableDto, ProcessEmailDto, SendEmailObjectDto, SendEmailOptionsDto, SendEmailParamsDto } from '../common/dto/email-notify.dto';
import { StandardReturnDto } from '../common/dto/common.dto';
export declare class EmailService {
    private readonly mailerService;
    private readonly cacheService;
    private readonly dateService;
    private emailNotifyTmplRepository;
    private emailNotifyLogsRepository;
    protected readonly configService: ConfigService;
    private emailQueue;
    private readonly log;
    constructor(mailerService: MailerService, cacheService: CacheService, dateService: DateService, emailNotifyTmplRepository: Repository<EmailNotifyTemplateEntity>, emailNotifyLogsRepository: Repository<EmailNotificationsEntity>, configService: ConfigService, emailQueue: Queue);
    unescape(str: string): string;
    getTemplateByCode(code: string): Promise<EmailTemplateDto>;
    getTemplateVars(): Promise<EmailConfigVarsDto>;
    processTemplate(tmplData: EmailTemplateDto, varsData: EmailVariableDto[], execData: SendEmailOptionsDto): Promise<ProcessEmailDto>;
    processMail(code: string, data: SendEmailOptionsDto, params: SendEmailParamsDto): Promise<number>;
    handleMailCallBack(error: any, info: any, notification_id: number): Promise<boolean>;
    sendMail(options: SendEmailObjectDto): Promise<StandardReturnDto>;
    logEmail(options: SendEmailObjectDto, params: SendEmailParamsDto): Promise<StandardReturnDto>;
    registerEmail(options: SendEmailOptionsDto, params: SendEmailParamsDto): Promise<number>;
}
//# sourceMappingURL=email.service.d.ts.map