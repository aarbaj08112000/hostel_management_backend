import { Link } from 'links/entities/link.entity';
import { CreateLinkDto } from 'links/dto/create-link.dto';
import { UpdateLinkDto } from 'links/dto/update-link.dto';
import { Tester } from 'utilities/test';
//Utilities
import { GeneralLibrary } from 'utilities/general-library';
import { CitGeneralLibrary } from 'utilities/cit-general-library';
import { CustomLogger } from 'utilities/custom-logger';
import { LoggerHandler } from 'utilities/logger-handler';
import { PdfExportService } from 'utilities/pdf-exporter';
import { ResponseHandler } from 'utilities/response-handler';
import { ResponseLibrary } from 'utilities/response-library';
import responseExportConfig from 'utilities/response.export.config';
import * as custom from 'utilities/custom-helper';
//services
import { AmazonService } from 'services/amazon.service';
import { BaseService } from 'services/base.service';
import { CacheService } from 'services/cache.service';
import { DateService } from 'services/date.service';
import { ElasticService } from 'services/elastic.service';
import { CallingEmailExecution } from 'services/email-execution.service';
import { EmailService } from 'services/email.service';
import { EncryptService } from 'services/encrypt.service';
import { FileService } from 'services/file.service';
import { GearmanService } from 'services/gearman.service';
import { GoogleMapService } from 'services/googlemap.service';
import { HttpService } from 'services/http.service';
import { ModuleService } from 'services/module.service';
import PushNotifications from 'node-pushnotifications';
import { RedisService } from 'services/redis.service';
import { SmsService } from 'services/sms.service';
import { LoggingInterceptor } from 'services/interceptor.service';
//entities
import { AdminMenuEntity } from 'entities/admin-menu.entity';
import { UserBase } from 'entities/base-user.entity';
import { SyncElasticEntity } from 'entities/elastic_sync.entity';
import { EmailNotificationsEntity } from 'entities/email-notifications.entity';
import { EmailNotifyTemplateEntity } from 'entities/email-notify-template.entity';
import { NotifyOperationValuesEntity } from 'entities/notify-operation-values.entity';
import { NotifyScheduleEntity } from 'entities/notify-schedule.entity';
import { PushNotificationsEntity } from 'entities/push-notifications.entity';
import { PushNotifyTemplateEntity } from 'entities/push-notify-template.entity';
import { SettingEntity } from '@repo/source/entities/setting.entity';
import { SmsNotificationsEntity } from 'entities/sms-notifications.entity';
import { SmsNotifyTemplateEntity } from 'entities/sms-notify-template.entity';
import { LookupEntity } from 'entities/lookup.entity';
//common
import * as amazonDTO from 'common/dto/amazon.dto';
import * as commonDTO from 'common/dto/common.dto';
//config
import appConfig from 'config/appConfig';
//module
import { MailerModuleWrapper } from 'modules/mailer.module';
import { GlobalModule } from 'modules/global.module';
//middleware
import { SettingMiddleware } from 'middleware/setting.middleware';
//filters
import { HttpExceptionFilter } from 'filters/http-exception.filter';
export const links = {
  common: {
    amazonDTO,
    commonDTO,
  },
  config: {
    appConfig,
  },
  dto: {
    CreateLinkDto,
    UpdateLinkDto,
  },
  entities: {
    Link,
    AdminMenuEntity,
    UserBase,
    SyncElasticEntity,
    EmailNotificationsEntity,
    EmailNotifyTemplateEntity,
    NotifyOperationValuesEntity,
    NotifyScheduleEntity,
    PushNotificationsEntity,
    PushNotifyTemplateEntity,
    SettingEntity,
    SmsNotificationsEntity,
    SmsNotifyTemplateEntity,
    LookupEntity,
  },
  utilities: {
    GeneralLibrary,
    CitGeneralLibrary,
    CustomLogger,
    LoggerHandler,
    PdfExportService,
    ResponseHandler,
    ResponseLibrary,
    responseExportConfig,
    custom,
    Tester,
  },
  service: {
    AmazonService,
    BaseService,
    CacheService,
    DateService,
    ElasticService,
    CallingEmailExecution,
    EmailService,
    EncryptService,
    FileService,
    GearmanService,
    GoogleMapService,
    HttpService,
    ModuleService,
    PushNotifications,
    RedisService,
    SmsService,
    LoggingInterceptor,
  },
  module: {
    MailerModuleWrapper,
    GlobalModule,
  },
  middleware: {
    SettingMiddleware,
  },
  filters: {
    HttpExceptionFilter,
  },
};
