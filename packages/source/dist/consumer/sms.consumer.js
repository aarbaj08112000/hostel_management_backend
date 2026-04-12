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
var SmsConsumer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsConsumer = void 0;
const bull_1 = require("@nestjs/bull");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const logger_handler_1 = require("../utilities/logger-handler");
const sms_service_1 = require("../services/sms.service");
const date_service_1 = require("../services/date.service");
const common_enum_1 = require("../common/enum/common.enum");
const sms_notifications_entity_1 = require("../entities/sms-notifications.entity");
let SmsConsumer = SmsConsumer_1 = class SmsConsumer {
    smsService;
    dateService;
    smsNotifyLogsRepository;
    log = new logger_handler_1.LoggerHandler(SmsConsumer_1.name).getInstance();
    constructor(smsService, dateService, smsNotifyLogsRepository) {
        this.smsService = smsService;
        this.dateService = dateService;
        this.smsNotifyLogsRepository = smsNotifyLogsRepository;
    }
    async handleSmsTask(job) {
        try {
            const data = job.data;
            this.log.log(`Processing sms job for queueOne with data:`, data.id);
            const result_data = await this.smsService.sendSMS(data);
            if ('async' in data && data.async === false) {
                if (result_data.success == 1) {
                    this.handleSmsCallBack(null, data.id);
                }
                else {
                    this.handleSmsCallBack(result_data.message, data.id);
                }
            }
            this.log.debug(`Ended sms job for queueOne with data:`, data.id);
        }
        catch (error) {
            this.log.error(`Error processing job for queueOne:`, error);
        }
    }
    async handleSmsCallBack(error, notification_id) {
        const queryColumns = {};
        queryColumns.status = error === null ? common_enum_1.STATUS.EXECUTED : common_enum_1.STATUS.FAILED;
        queryColumns.executedAt = this.dateService.getCurrentDateTime();
        if (error != null) {
            queryColumns.error = error.toString();
        }
        const queryObject = this.smsNotifyLogsRepository
            .createQueryBuilder()
            .update(sms_notifications_entity_1.SmsNotificationsEntity)
            .set(queryColumns);
        queryObject.andWhere('id = :id', { id: notification_id });
        await queryObject.execute();
        return true;
    }
};
exports.SmsConsumer = SmsConsumer;
__decorate([
    (0, bull_1.Process)({ name: 'sms-task', concurrency: 10 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SmsConsumer.prototype, "handleSmsTask", null);
exports.SmsConsumer = SmsConsumer = SmsConsumer_1 = __decorate([
    (0, bull_1.Processor)('sms-queue'),
    __param(2, (0, typeorm_1.InjectRepository)(sms_notifications_entity_1.SmsNotificationsEntity)),
    __metadata("design:paramtypes", [sms_service_1.SmsService,
        date_service_1.DateService,
        typeorm_2.Repository])
], SmsConsumer);
//# sourceMappingURL=sms.consumer.js.map