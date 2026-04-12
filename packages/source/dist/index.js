"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.links = void 0;
const link_entity_1 = require("links/entities/link.entity");
const create_link_dto_1 = require("links/dto/create-link.dto");
const update_link_dto_1 = require("links/dto/update-link.dto");
const test_1 = require("utilities/test");
const general_library_1 = require("utilities/general-library");
const cit_general_library_1 = require("utilities/cit-general-library");
const custom_logger_1 = require("utilities/custom-logger");
const logger_handler_1 = require("utilities/logger-handler");
const pdf_exporter_1 = require("utilities/pdf-exporter");
const response_handler_1 = require("utilities/response-handler");
const response_library_1 = require("utilities/response-library");
const response_export_config_1 = __importDefault(require("utilities/response.export.config"));
const custom = __importStar(require("utilities/custom-helper"));
const amazon_service_1 = require("services/amazon.service");
const base_service_1 = require("services/base.service");
const cache_service_1 = require("services/cache.service");
const date_service_1 = require("services/date.service");
const elastic_service_1 = require("services/elastic.service");
const email_execution_service_1 = require("services/email-execution.service");
const email_service_1 = require("services/email.service");
const encrypt_service_1 = require("services/encrypt.service");
const file_service_1 = require("services/file.service");
const gearman_service_1 = require("services/gearman.service");
const googlemap_service_1 = require("services/googlemap.service");
const http_service_1 = require("services/http.service");
const module_service_1 = require("services/module.service");
const node_pushnotifications_1 = __importDefault(require("node-pushnotifications"));
const redis_service_1 = require("services/redis.service");
const sms_service_1 = require("services/sms.service");
const interceptor_service_1 = require("services/interceptor.service");
const admin_menu_entity_1 = require("entities/admin-menu.entity");
const base_user_entity_1 = require("entities/base-user.entity");
const elastic_sync_entity_1 = require("entities/elastic_sync.entity");
const email_notifications_entity_1 = require("entities/email-notifications.entity");
const email_notify_template_entity_1 = require("entities/email-notify-template.entity");
const notify_operation_values_entity_1 = require("entities/notify-operation-values.entity");
const notify_schedule_entity_1 = require("entities/notify-schedule.entity");
const push_notifications_entity_1 = require("entities/push-notifications.entity");
const push_notify_template_entity_1 = require("entities/push-notify-template.entity");
const setting_entity_1 = require("@repo/source/entities/setting.entity");
const sms_notifications_entity_1 = require("entities/sms-notifications.entity");
const sms_notify_template_entity_1 = require("entities/sms-notify-template.entity");
const lookup_entity_1 = require("entities/lookup.entity");
const amazonDTO = __importStar(require("common/dto/amazon.dto"));
const commonDTO = __importStar(require("common/dto/common.dto"));
const appConfig_1 = __importDefault(require("config/appConfig"));
const mailer_module_1 = require("modules/mailer.module");
const global_module_1 = require("modules/global.module");
const setting_middleware_1 = require("middleware/setting.middleware");
const http_exception_filter_1 = require("filters/http-exception.filter");
exports.links = {
    common: {
        amazonDTO,
        commonDTO,
    },
    config: {
        appConfig: appConfig_1.default,
    },
    dto: {
        CreateLinkDto: create_link_dto_1.CreateLinkDto,
        UpdateLinkDto: update_link_dto_1.UpdateLinkDto,
    },
    entities: {
        Link: link_entity_1.Link,
        AdminMenuEntity: admin_menu_entity_1.AdminMenuEntity,
        UserBase: base_user_entity_1.UserBase,
        SyncElasticEntity: elastic_sync_entity_1.SyncElasticEntity,
        EmailNotificationsEntity: email_notifications_entity_1.EmailNotificationsEntity,
        EmailNotifyTemplateEntity: email_notify_template_entity_1.EmailNotifyTemplateEntity,
        NotifyOperationValuesEntity: notify_operation_values_entity_1.NotifyOperationValuesEntity,
        NotifyScheduleEntity: notify_schedule_entity_1.NotifyScheduleEntity,
        PushNotificationsEntity: push_notifications_entity_1.PushNotificationsEntity,
        PushNotifyTemplateEntity: push_notify_template_entity_1.PushNotifyTemplateEntity,
        SettingEntity: setting_entity_1.SettingEntity,
        SmsNotificationsEntity: sms_notifications_entity_1.SmsNotificationsEntity,
        SmsNotifyTemplateEntity: sms_notify_template_entity_1.SmsNotifyTemplateEntity,
        LookupEntity: lookup_entity_1.LookupEntity,
    },
    utilities: {
        GeneralLibrary: general_library_1.GeneralLibrary,
        CitGeneralLibrary: cit_general_library_1.CitGeneralLibrary,
        CustomLogger: custom_logger_1.CustomLogger,
        LoggerHandler: logger_handler_1.LoggerHandler,
        PdfExportService: pdf_exporter_1.PdfExportService,
        ResponseHandler: response_handler_1.ResponseHandler,
        ResponseLibrary: response_library_1.ResponseLibrary,
        responseExportConfig: response_export_config_1.default,
        custom,
        Tester: test_1.Tester,
    },
    service: {
        AmazonService: amazon_service_1.AmazonService,
        BaseService: base_service_1.BaseService,
        CacheService: cache_service_1.CacheService,
        DateService: date_service_1.DateService,
        ElasticService: elastic_service_1.ElasticService,
        CallingEmailExecution: email_execution_service_1.CallingEmailExecution,
        EmailService: email_service_1.EmailService,
        EncryptService: encrypt_service_1.EncryptService,
        FileService: file_service_1.FileService,
        GearmanService: gearman_service_1.GearmanService,
        GoogleMapService: googlemap_service_1.GoogleMapService,
        HttpService: http_service_1.HttpService,
        ModuleService: module_service_1.ModuleService,
        PushNotifications: node_pushnotifications_1.default,
        RedisService: redis_service_1.RedisService,
        SmsService: sms_service_1.SmsService,
        LoggingInterceptor: interceptor_service_1.LoggingInterceptor,
    },
    module: {
        MailerModuleWrapper: mailer_module_1.MailerModuleWrapper,
        GlobalModule: global_module_1.GlobalModule,
    },
    middleware: {
        SettingMiddleware: setting_middleware_1.SettingMiddleware,
    },
    filters: {
        HttpExceptionFilter: http_exception_filter_1.HttpExceptionFilter,
    },
};
//# sourceMappingURL=index.js.map