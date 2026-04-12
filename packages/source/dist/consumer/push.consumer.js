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
var PushConsumer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushConsumer = void 0;
const bull_1 = require("@nestjs/bull");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const logger_handler_1 = require("../utilities/logger-handler");
const pushnotify_service_1 = require("../services/pushnotify.service");
const date_service_1 = require("../services/date.service");
const common_enum_1 = require("../common/enum/common.enum");
const push_notifications_entity_1 = require("../entities/push-notifications.entity");
let PushConsumer = PushConsumer_1 = class PushConsumer {
    pushService;
    dateService;
    pushNotifyLogsRepository;
    log = new logger_handler_1.LoggerHandler(PushConsumer_1.name).getInstance();
    constructor(pushService, dateService, pushNotifyLogsRepository) {
        this.pushService = pushService;
        this.dateService = dateService;
        this.pushNotifyLogsRepository = pushNotifyLogsRepository;
    }
    async handlePushTask(job) {
        try {
            const data = job.data;
            const notify_data = data.notify_data;
            const token_list = data.token_list;
            this.log.log(`Processing job for queueOne with data:`, notify_data.id);
            const result_data = await this.pushService.sendPushNotification(notify_data, token_list);
            if ('async' in notify_data && notify_data.async === false) {
                if (result_data.success == 1) {
                    this.handlePushCallBack(null, result_data.message, notify_data.id);
                }
                else {
                    this.handlePushCallBack(result_data.message, null, notify_data.id);
                }
            }
            this.log.debug(`Ended job for queueOne with data:`, notify_data.id);
        }
        catch (error) {
            this.log.error(`Error processing job for queueOne:`, error);
        }
    }
    async handlePushCallBack(error, info, notification_id) {
        const queryColumns = {};
        queryColumns.status = error === null ? common_enum_1.STATUS.EXECUTED : common_enum_1.STATUS.FAILED;
        queryColumns.executedAt = this.dateService.getCurrentDateTime();
        if (error != null) {
            queryColumns.error = error.toString();
        }
        const queryObject = this.pushNotifyLogsRepository
            .createQueryBuilder()
            .update(push_notifications_entity_1.PushNotificationsEntity)
            .set(queryColumns);
        queryObject.andWhere('id = :id', { id: notification_id });
        await queryObject.execute();
        return true;
    }
};
exports.PushConsumer = PushConsumer;
__decorate([
    (0, bull_1.Process)({ name: 'push-task', concurrency: 10 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PushConsumer.prototype, "handlePushTask", null);
exports.PushConsumer = PushConsumer = PushConsumer_1 = __decorate([
    (0, bull_1.Processor)('push-queue'),
    __param(2, (0, typeorm_1.InjectRepository)(push_notifications_entity_1.PushNotificationsEntity)),
    __metadata("design:paramtypes", [pushnotify_service_1.PushNotifyService,
        date_service_1.DateService,
        typeorm_2.Repository])
], PushConsumer);
//# sourceMappingURL=push.consumer.js.map