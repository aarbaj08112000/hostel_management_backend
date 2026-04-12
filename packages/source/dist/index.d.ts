import { Link } from 'links/entities/link.entity';
import { CreateLinkDto } from 'links/dto/create-link.dto';
import { UpdateLinkDto } from 'links/dto/update-link.dto';
import { Tester } from 'utilities/test';
import { GeneralLibrary } from 'utilities/general-library';
import { CitGeneralLibrary } from 'utilities/cit-general-library';
import { CustomLogger } from 'utilities/custom-logger';
import { LoggerHandler } from 'utilities/logger-handler';
import { PdfExportService } from 'utilities/pdf-exporter';
import { ResponseHandler } from 'utilities/response-handler';
import { ResponseLibrary } from 'utilities/response-library';
import * as custom from 'utilities/custom-helper';
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
import * as amazonDTO from 'common/dto/amazon.dto';
import * as commonDTO from 'common/dto/common.dto';
import { MailerModuleWrapper } from 'modules/mailer.module';
import { GlobalModule } from 'modules/global.module';
import { SettingMiddleware } from 'middleware/setting.middleware';
import { HttpExceptionFilter } from 'filters/http-exception.filter';
export declare const links: {
    common: {
        amazonDTO: typeof amazonDTO;
        commonDTO: typeof commonDTO;
    };
    config: {
        appConfig: (() => {
            apiPort: string;
            nodeEnv: string;
            dataSecret: string;
            redisHost: string;
            redisPort: string;
            public_folder: string;
            upload_folder: string;
            imagic_install_dir: string;
            worker_url: string;
            upload_path: string;
            upload_url: string;
            upload_temp_path: string;
            upload_temp_url: string;
            settings_files_path: string;
            settings_files_url: string;
            query_log_path: string;
            request_log_path: string;
            upload_cache_path: string;
            settings_files_config: {
                upload_folder: string;
                aws_vars_list: string[];
            };
            enable_access_log: boolean;
            enable_query_log: boolean;
            upload_max_size: number;
            allowed_extensions: string;
            default_admin_users: string[];
            default_admin_groups: string[];
            restrict_admin_users: string[];
            restrict_admin_groups: string[];
            admin_password_history: number;
            admin_lf_display_limit: number;
            admin_lf_dropdown_limit: number;
            admin_dd_pagination_limit: number;
            admin_download_files_limit: number;
            admin_switch_dropdown_limit: number;
            cache_expiry_time: number;
            max_cache_allowed: number;
            OTP_EXPIRY_SECONDS: number;
            NOTIFICATIONS_CHUNK_SIZE: number;
            enable_notification_queue: boolean;
        }) & import("@nestjs/config").ConfigFactoryKeyHost<{
            apiPort: string;
            nodeEnv: string;
            dataSecret: string;
            redisHost: string;
            redisPort: string;
            public_folder: string;
            upload_folder: string;
            imagic_install_dir: string;
            worker_url: string;
            upload_path: string;
            upload_url: string;
            upload_temp_path: string;
            upload_temp_url: string;
            settings_files_path: string;
            settings_files_url: string;
            query_log_path: string;
            request_log_path: string;
            upload_cache_path: string;
            settings_files_config: {
                upload_folder: string;
                aws_vars_list: string[];
            };
            enable_access_log: boolean;
            enable_query_log: boolean;
            upload_max_size: number;
            allowed_extensions: string;
            default_admin_users: string[];
            default_admin_groups: string[];
            restrict_admin_users: string[];
            restrict_admin_groups: string[];
            admin_password_history: number;
            admin_lf_display_limit: number;
            admin_lf_dropdown_limit: number;
            admin_dd_pagination_limit: number;
            admin_download_files_limit: number;
            admin_switch_dropdown_limit: number;
            cache_expiry_time: number;
            max_cache_allowed: number;
            OTP_EXPIRY_SECONDS: number;
            NOTIFICATIONS_CHUNK_SIZE: number;
            enable_notification_queue: boolean;
        }>;
    };
    dto: {
        CreateLinkDto: typeof CreateLinkDto;
        UpdateLinkDto: typeof UpdateLinkDto;
    };
    entities: {
        Link: typeof Link;
        AdminMenuEntity: typeof AdminMenuEntity;
        UserBase: typeof UserBase;
        SyncElasticEntity: typeof SyncElasticEntity;
        EmailNotificationsEntity: typeof EmailNotificationsEntity;
        EmailNotifyTemplateEntity: typeof EmailNotifyTemplateEntity;
        NotifyOperationValuesEntity: typeof NotifyOperationValuesEntity;
        NotifyScheduleEntity: typeof NotifyScheduleEntity;
        PushNotificationsEntity: typeof PushNotificationsEntity;
        PushNotifyTemplateEntity: typeof PushNotifyTemplateEntity;
        SettingEntity: typeof SettingEntity;
        SmsNotificationsEntity: typeof SmsNotificationsEntity;
        SmsNotifyTemplateEntity: typeof SmsNotifyTemplateEntity;
        LookupEntity: typeof LookupEntity;
    };
    utilities: {
        GeneralLibrary: typeof GeneralLibrary;
        CitGeneralLibrary: typeof CitGeneralLibrary;
        CustomLogger: typeof CustomLogger;
        LoggerHandler: typeof LoggerHandler;
        PdfExportService: typeof PdfExportService;
        ResponseHandler: typeof ResponseHandler;
        ResponseLibrary: typeof ResponseLibrary;
        responseExportConfig: {
            customer_list: {
                api_name: string;
                fields: {
                    country: {
                        columnTitle: string;
                    };
                    countryCode: {
                        columnTitle: string;
                    };
                    countryCodeISO3: {
                        columnTitle: string;
                    };
                    dialCode: {
                        columnTitle: string;
                    };
                    status: {
                        columnTitle: string;
                    };
                    created_at: {
                        columnTitle: string;
                        formatter: string;
                    };
                };
            };
        };
        custom: typeof custom;
        Tester: typeof Tester;
    };
    service: {
        AmazonService: typeof AmazonService;
        BaseService: typeof BaseService;
        CacheService: typeof CacheService;
        DateService: typeof DateService;
        ElasticService: typeof ElasticService;
        CallingEmailExecution: typeof CallingEmailExecution;
        EmailService: typeof EmailService;
        EncryptService: typeof EncryptService;
        FileService: typeof FileService;
        GearmanService: typeof GearmanService;
        GoogleMapService: typeof GoogleMapService;
        HttpService: typeof HttpService;
        ModuleService: typeof ModuleService;
        PushNotifications: typeof PushNotifications;
        RedisService: typeof RedisService;
        SmsService: typeof SmsService;
        LoggingInterceptor: typeof LoggingInterceptor;
    };
    module: {
        MailerModuleWrapper: typeof MailerModuleWrapper;
        GlobalModule: typeof GlobalModule;
    };
    middleware: {
        SettingMiddleware: typeof SettingMiddleware;
    };
    filters: {
        HttpExceptionFilter: typeof HttpExceptionFilter;
    };
};
//# sourceMappingURL=index.d.ts.map