import { Job } from 'bull';
import { Repository } from 'typeorm';
import { SmsService } from '../services/sms.service';
import { DateService } from '../services/date.service';
import { SmsNotificationsEntity } from '../entities/sms-notifications.entity';
export declare class SmsConsumer {
    private readonly smsService;
    private readonly dateService;
    private smsNotifyLogsRepository;
    protected readonly log: any;
    constructor(smsService: SmsService, dateService: DateService, smsNotifyLogsRepository: Repository<SmsNotificationsEntity>);
    handleSmsTask(job: Job): Promise<void>;
    handleSmsCallBack(error: any, notification_id: number): Promise<boolean>;
}
//# sourceMappingURL=sms.consumer.d.ts.map