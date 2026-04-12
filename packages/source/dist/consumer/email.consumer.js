"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EmailConsumer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailConsumer = void 0;
const bull_1 = require("@nestjs/bull");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const logger_handler_1 = require("../utilities/logger-handler");
const email_service_1 = require("../services/email.service");
const date_service_1 = require("../services/date.service");
const common_enum_1 = require("../common/enum/common.enum");
const email_notifications_entity_1 = require("../entities/email-notifications.entity");
let EmailConsumer = EmailConsumer_1 = class EmailConsumer {
    emailService;
    dateService;
    emailNotifyLogsRepository;
    log = new logger_handler_1.LoggerHandler(EmailConsumer_1.name).getInstance();
    constructor(emailService, dateService, emailNotifyLogsRepository) {
        this.emailService = emailService;
        this.dateService = dateService;
        this.emailNotifyLogsRepository = emailNotifyLogsRepository;
    }
    async handleEmailTask(job) {
        try {
            const data = job.data;
            this.log.log(`Processing job for queueOne with data:`, data.id, data.uniq_id);
            const result_data = await this.emailService.sendMail(data);
            if ('async' in data && data.async === false) {
                if (result_data.success == 1) {
                    this.handleMailCallBack(null, result_data.message, data.id);
                }
                else {
                    this.handleMailCallBack(result_data.message, null, data.id);
                }
            }
            this.log.debug(`Ended job for queueOne with data:`, data.id, data.uniq_id);
        }
        catch (error) {
            this.log.error(`Error processing job for queueOne:`, error);
        }
    }
    async handleMailCallBack(error, info, notification_id) {
        const queryColumns = {};
        queryColumns.status = error === null ? common_enum_1.STATUS.EXECUTED : common_enum_1.STATUS.FAILED;
        queryColumns.executedAt = this.dateService.getCurrentDateTime();
        if (error != null) {
            queryColumns.error = error.toString();
        }
        const queryObject = this.emailNotifyLogsRepository
            .createQueryBuilder()
            .update(email_notifications_entity_1.EmailNotificationsEntity)
            .set(queryColumns);
        queryObject.andWhere('id = :id', { id: notification_id });
        await queryObject.execute();
        return true;
    }
};
exports.EmailConsumer = EmailConsumer;
__decorate([
    (0, bull_1.Process)({ name: 'email-task', concurrency: 10 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailConsumer.prototype, "handleEmailTask", null);
exports.EmailConsumer = EmailConsumer = EmailConsumer_1 = __decorate([
    (0, bull_1.Processor)('email-queue'),
    __param(2, (0, typeorm_1.InjectRepository)(email_notifications_entity_1.EmailNotificationsEntity)),
    __metadata("design:paramtypes", [email_service_1.EmailService,
        date_service_1.DateService,
        typeorm_2.Repository])
], EmailConsumer);
//# sourceMappingURL=email.consumer.js.map