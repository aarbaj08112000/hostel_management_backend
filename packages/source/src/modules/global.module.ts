import { Module } from '@nestjs/common';
import { ElasticService } from '@repo/source/services/elastic.service';
import { ModuleService } from '@repo/source/services/module.service';
import { CacheService } from '@repo/source/services/cache.service';
import { CitGeneralLibrary } from '@repo/source/utilities/cit-general-library';
import { SettingEntity } from '@repo/source/entities/setting.entity';
import { EmailNotifyTemplateEntity } from '@repo/source/entities/email-notify-template.entity';
import { EmailNotificationsEntity } from '@repo/source/entities/email-notifications.entity';
import { PushNotificationsEntity } from '@repo/source/entities/push-notifications.entity';
import { PushNotifyTemplateEntity } from '@repo/source/entities/push-notify-template.entity';
import { SmsNotificationsEntity } from '@repo/source/entities/sms-notifications.entity';
import { SmsNotifyTemplateEntity } from '@repo/source/entities/sms-notify-template.entity';
import { SyncElasticEntity } from '@repo/source/entities/elastic_sync.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateService } from '@repo/source/services/date.service';
import { EmailService } from '@repo/source/services/email.service';
import { EncryptService } from '@repo/source/services/encrypt.service';
import { FileService } from '@repo/source/services/file.service';
import { AmazonService } from '@repo/source/services/amazon.service';
import { JwtTokenService } from '@repo/source/services/jwt-token.service';
import { PushNotifyService } from '@repo/source/services/pushnotify.service';
import { SmsService } from '@repo/source/services/sms.service';
import { GearmanService } from '@repo/source/services/gearman.service';
import { GearmanWorkerService } from '@repo/source/services/gearman.worker.service';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { HttpService } from '@repo/source/services/http.service';
import { MailerModuleWrapper } from '@repo/source/modules/mailer.module';
import { ResponseLibrary } from '@repo/source/utilities/response-library';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { ActivityLogService } from '@repo/source/services/activity_log.service';
import { ActivityLogEntity } from '../entities/activity-log.entity';
import { ActivityMasterEntity } from '../entities/activity-master.entity';
import { AdminEntity } from '@repo/source/entities/admin.entity';
import { LookupEntity } from '../entities/lookup.entity';
import { ActivityMasterService } from '@repo/source/services/activity_master.service';
import { StripeService } from '@repo/source/services/stripe.service';
import { PdfService } from '@repo/source/services/pdf_generate.service';
import { CronService } from '@repo/source/services/cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CallingEmailExecution } from '@repo/source/services/email-execution.service';
import { RedisService } from '@repo/source/services/redis.service';
import { GetLookupData } from '@repo/source/services/fetch_lkp_data.service';
const redisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: async (configService: ConfigService) => {
    return new Redis({
      host: configService.get('REDIS_HOST'),
      port: configService.get('REDIS_PORT'),
    });
  },
  inject: [ConfigService],
};
@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: 'email-queue',
    }),
    BullModule.registerQueue({
      name: 'push-queue',
    }),
    BullModule.registerQueue({
      name: 'sms-queue',
    }),
    TypeOrmModule.forFeature([
      SettingEntity,
      EmailNotifyTemplateEntity,
      EmailNotificationsEntity,
      PushNotificationsEntity,
      PushNotifyTemplateEntity,
      SmsNotifyTemplateEntity,
      SmsNotificationsEntity,
      SyncElasticEntity,
      ActivityLogEntity,
      ActivityMasterEntity,
      AdminEntity,
      LookupEntity,
    ]),
    MailerModuleWrapper,
    ScheduleModule.forRoot(),
  ],
  providers: [
    CacheService,
    ElasticService,
    ModuleService,
    CitGeneralLibrary,
    DateService,
    EmailService,
    EncryptService,
    FileService,
    AmazonService,
    JwtTokenService,
    PushNotifyService,
    SmsService,
    GearmanService,
    GearmanWorkerService,
    HttpService,
    ResponseLibrary,
    redisProvider,
    ActivityLogService,
    ActivityMasterService,
    StripeService,
    PdfService,
    CronService,
    CallingEmailExecution,
    RedisService,
    GetLookupData,
  ],
  exports: [
    CacheService,
    ElasticService,
    ModuleService,
    CitGeneralLibrary,
    DateService,
    EmailService,
    EncryptService,
    FileService,
    AmazonService,
    JwtTokenService,
    PushNotifyService,
    SmsService,
    GearmanService,
    GearmanWorkerService,
    HttpService,
    ResponseLibrary,
    redisProvider,
    ActivityLogService,
    ActivityMasterService,
    StripeService,
    PdfService,
    CronService,
    CallingEmailExecution,
    RedisService,
    GetLookupData,
  ],
})
export class GlobalModule {}
