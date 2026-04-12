import { Job } from 'bull';
import { Repository } from 'typeorm';
import { PushNotifyService } from '../services/pushnotify.service';
import { DateService } from '../services/date.service';
import { PushNotificationsEntity } from '../entities/push-notifications.entity';
export declare class PushConsumer {
    private readonly pushService;
    private readonly dateService;
    private pushNotifyLogsRepository;
    protected readonly log: any;
    constructor(pushService: PushNotifyService, dateService: DateService, pushNotifyLogsRepository: Repository<PushNotificationsEntity>);
    handlePushTask(job: Job): Promise<void>;
    handlePushCallBack(error: any, info: any, notification_id: number): Promise<boolean>;
}
//# sourceMappingURL=push.consumer.d.ts.map