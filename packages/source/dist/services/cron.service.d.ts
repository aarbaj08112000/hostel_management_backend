import { ClientTCP } from '@nestjs/microservices';
export declare class CronService {
    private client;
    transClient: ClientTCP;
    userClient: ClientTCP;
    carClient: ClientTCP;
    customerClient: ClientTCP;
    masterClient: ClientTCP;
    crmClient: ClientTCP;
    handleCron(): Promise<boolean>;
    handleBookingReminderCron(): Promise<boolean>;
    handleReview(): Promise<boolean>;
    syncElastic(): Promise<void>;
    syncIndexData(): Promise<boolean>;
    handleWhatsappConversation(): Promise<boolean>;
}
//# sourceMappingURL=cron.service.d.ts.map