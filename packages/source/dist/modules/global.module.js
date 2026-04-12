"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalModule = void 0;
const common_1 = require("@nestjs/common");
const elastic_service_1 = require("@repo/source/services/elastic.service");
const module_service_1 = require("@repo/source/services/module.service");
const cache_service_1 = require("@repo/source/services/cache.service");
const cit_general_library_1 = require("@repo/source/utilities/cit-general-library");
const setting_entity_1 = require("@repo/source/entities/setting.entity");
const email_notify_template_entity_1 = require("@repo/source/entities/email-notify-template.entity");
const email_notifications_entity_1 = require("@repo/source/entities/email-notifications.entity");
const push_notifications_entity_1 = require("@repo/source/entities/push-notifications.entity");
const push_notify_template_entity_1 = require("@repo/source/entities/push-notify-template.entity");
const sms_notifications_entity_1 = require("@repo/source/entities/sms-notifications.entity");
const sms_notify_template_entity_1 = require("@repo/source/entities/sms-notify-template.entity");
const elastic_sync_entity_1 = require("@repo/source/entities/elastic_sync.entity");
const typeorm_1 = require("@nestjs/typeorm");
const date_service_1 = require("@repo/source/services/date.service");
const email_service_1 = require("@repo/source/services/email.service");
const encrypt_service_1 = require("@repo/source/services/encrypt.service");
const file_service_1 = require("@repo/source/services/file.service");
const amazon_service_1 = require("@repo/source/services/amazon.service");
const jwt_token_service_1 = require("@repo/source/services/jwt-token.service");
const pushnotify_service_1 = require("@repo/source/services/pushnotify.service");
const sms_service_1 = require("@repo/source/services/sms.service");
const gearman_service_1 = require("@repo/source/services/gearman.service");
const gearman_worker_service_1 = require("@repo/source/services/gearman.worker.service");
const bull_1 = require("@nestjs/bull");
const axios_1 = require("@nestjs/axios");
const http_service_1 = require("@repo/source/services/http.service");
const mailer_module_1 = require("@repo/source/modules/mailer.module");
const response_library_1 = require("@repo/source/utilities/response-library");
const ioredis_1 = require("ioredis");
const config_1 = require("@nestjs/config");
const activity_log_service_1 = require("@repo/source/services/activity_log.service");
const activity_log_entity_1 = require("../entities/activity-log.entity");
const activity_master_entity_1 = require("../entities/activity-master.entity");
const admin_entity_1 = require("@repo/source/entities/admin.entity");
const lookup_entity_1 = require("../entities/lookup.entity");
const activity_master_service_1 = require("@repo/source/services/activity_master.service");
const stripe_service_1 = require("@repo/source/services/stripe.service");
const pdf_generate_service_1 = require("@repo/source/services/pdf_generate.service");
const cron_service_1 = require("@repo/source/services/cron.service");
const schedule_1 = require("@nestjs/schedule");
const email_execution_service_1 = require("@repo/source/services/email-execution.service");
const redis_service_1 = require("@repo/source/services/redis.service");
const fetch_lkp_data_service_1 = require("@repo/source/services/fetch_lkp_data.service");
const redisProvider = {
    provide: 'REDIS_CLIENT',
    useFactory: async (configService) => {
        return new ioredis_1.Redis({
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
        });
    },
    inject: [config_1.ConfigService],
};
let GlobalModule = class GlobalModule {
};
exports.GlobalModule = GlobalModule;
exports.GlobalModule = GlobalModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            bull_1.BullModule.registerQueue({
                name: 'email-queue',
            }),
            bull_1.BullModule.registerQueue({
                name: 'push-queue',
            }),
            bull_1.BullModule.registerQueue({
                name: 'sms-queue',
            }),
            typeorm_1.TypeOrmModule.forFeature([
                setting_entity_1.SettingEntity,
                email_notify_template_entity_1.EmailNotifyTemplateEntity,
                email_notifications_entity_1.EmailNotificationsEntity,
                push_notifications_entity_1.PushNotificationsEntity,
                push_notify_template_entity_1.PushNotifyTemplateEntity,
                sms_notify_template_entity_1.SmsNotifyTemplateEntity,
                sms_notifications_entity_1.SmsNotificationsEntity,
                elastic_sync_entity_1.SyncElasticEntity,
                activity_log_entity_1.ActivityLogEntity,
                activity_master_entity_1.ActivityMasterEntity,
                admin_entity_1.AdminEntity,
                lookup_entity_1.LookupEntity,
            ]),
            mailer_module_1.MailerModuleWrapper,
            schedule_1.ScheduleModule.forRoot(),
        ],
        providers: [
            cache_service_1.CacheService,
            elastic_service_1.ElasticService,
            module_service_1.ModuleService,
            cit_general_library_1.CitGeneralLibrary,
            date_service_1.DateService,
            email_service_1.EmailService,
            encrypt_service_1.EncryptService,
            file_service_1.FileService,
            amazon_service_1.AmazonService,
            jwt_token_service_1.JwtTokenService,
            pushnotify_service_1.PushNotifyService,
            sms_service_1.SmsService,
            gearman_service_1.GearmanService,
            gearman_worker_service_1.GearmanWorkerService,
            http_service_1.HttpService,
            response_library_1.ResponseLibrary,
            redisProvider,
            activity_log_service_1.ActivityLogService,
            activity_master_service_1.ActivityMasterService,
            stripe_service_1.StripeService,
            pdf_generate_service_1.PdfService,
            cron_service_1.CronService,
            email_execution_service_1.CallingEmailExecution,
            redis_service_1.RedisService,
            fetch_lkp_data_service_1.GetLookupData,
        ],
        exports: [
            cache_service_1.CacheService,
            elastic_service_1.ElasticService,
            module_service_1.ModuleService,
            cit_general_library_1.CitGeneralLibrary,
            date_service_1.DateService,
            email_service_1.EmailService,
            encrypt_service_1.EncryptService,
            file_service_1.FileService,
            amazon_service_1.AmazonService,
            jwt_token_service_1.JwtTokenService,
            pushnotify_service_1.PushNotifyService,
            sms_service_1.SmsService,
            gearman_service_1.GearmanService,
            gearman_worker_service_1.GearmanWorkerService,
            http_service_1.HttpService,
            response_library_1.ResponseLibrary,
            redisProvider,
            activity_log_service_1.ActivityLogService,
            activity_master_service_1.ActivityMasterService,
            stripe_service_1.StripeService,
            pdf_generate_service_1.PdfService,
            cron_service_1.CronService,
            email_execution_service_1.CallingEmailExecution,
            redis_service_1.RedisService,
            fetch_lkp_data_service_1.GetLookupData,
        ],
    })
], GlobalModule);
//# sourceMappingURL=global.module.js.map