import { Job } from 'bull';
import { Repository } from 'typeorm';
import { EmailService } from '../services/email.service';
import { DateService } from '../services/date.service';
import { EmailNotificationsEntity } from '../entities/email-notifications.entity';
export declare class EmailConsumer {
    private readonly emailService;
    private readonly dateService;
    private emailNotifyLogsRepository;
    protected readonly log: any;
    constructor(emailService: EmailService, dateService: DateService, emailNotifyLogsRepository: Repository<EmailNotificationsEntity>);
    handleEmailTask(job: Job): Promise<void>;
    handleMailCallBack(error: any, info: any, notification_id: number): Promise<boolean>;
}
//# sourceMappingURL=email.consumer.d.ts.map