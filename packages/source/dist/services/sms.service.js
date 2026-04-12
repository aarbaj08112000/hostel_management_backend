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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bull_1 = require("@nestjs/bull");
const config_1 = require("@nestjs/config");
const twilio_1 = require("twilio");
const _ = __importStar(require("lodash"));
const logger_handler_1 = require("../utilities/logger-handler");
const cache_service_1 = require("./cache.service");
const date_service_1 = require("./date.service");
const sms_notify_template_entity_1 = require("../entities/sms-notify-template.entity");
const sms_notifications_entity_1 = require("../entities/sms-notifications.entity");
const common_enum_1 = require("../common/enum/common.enum");
let SmsService = SmsService_1 = class SmsService {
    configService;
    cacheService;
    dateService;
    smsNotifyTmplRepository;
    smsNotifyLogsRepository;
    smsQueue;
    log = new logger_handler_1.LoggerHandler(SmsService_1.name).getInstance();
    constructor(configService, cacheService, dateService, smsNotifyTmplRepository, smsNotifyLogsRepository, smsQueue) {
        this.configService = configService;
        this.cacheService = cacheService;
        this.dateService = dateService;
        this.smsNotifyTmplRepository = smsNotifyTmplRepository;
        this.smsNotifyLogsRepository = smsNotifyLogsRepository;
        this.smsQueue = smsQueue;
    }
    async getTemplateByCode(code) {
        let template;
        try {
            template = await this.smsNotifyTmplRepository.findOne({
                where: { templateCode: code },
            });
            if (!_.isObject(template) || _.isEmpty(template)) {
                throw new Error('SMS template not found.');
            }
        }
        catch (err) {
            this.log.error('[getSmsNotifyByCode] >> Error ', err);
        }
        return template;
    }
    async processTemplate(tmplData, varsData, execData) {
        let smsMessage = tmplData?.message || '';
        const keyValuePair = {};
        let keyValueData = {};
        if (_.isArray(varsData) && varsData.length > 0) {
            if (_.isObject(execData.params)) {
                keyValueData = execData.params;
            }
            for (const val of varsData) {
                if (val.var_name) {
                    let keyName = '';
                    let keyValue = '';
                    const varName = val.var_name.toString().trim();
                    if (varName.substr(0, 9) === '{{SYSTEM.' &&
                        varName.substr(-2) === '}}') {
                        keyName = varName.slice(9, -2);
                        keyValue = await this.cacheService.get(keyName);
                    }
                    else if (varName.substr(0, 8) === '#SYSTEM.' &&
                        varName.substr(-1) === '#') {
                        keyName = varName.slice(8, -1);
                        keyValue = await this.cacheService.get(keyName);
                    }
                    else if (varName.substr(0, 2) === '{{' &&
                        varName.substr(-2) === '}}') {
                        keyName = varName.slice(2, -2);
                        keyValue = keyValueData[keyName];
                    }
                    else if (varName.substr(0, 1) === '#' &&
                        varName.substr(-1) === '#') {
                        keyName = varName.slice(1, -1);
                        keyValue = keyValueData[keyName];
                    }
                    if (keyName) {
                        keyValuePair[keyName] = keyValue;
                        const regex = new RegExp(varName, 'g');
                        smsMessage = smsMessage.replace(regex, keyValue);
                    }
                }
            }
        }
        const processedData = {
            sms_message: smsMessage,
            key_values: keyValuePair,
        };
        return processedData;
    }
    async processSMS(code, data, params) {
        let success;
        try {
            if (!code) {
                throw new Error('Sms notify template is missing');
            }
            if (!_.isObject(data) || _.isEmpty(data)) {
                throw new Error('Parameters object is empty');
            }
            if (!('number' in data)) {
                throw new Error('Mobile number is empty');
            }
            const smsTemplate = await this.getTemplateByCode(code);
            const smsVariables = smsTemplate?.varsJson;
            const processedData = await this.processTemplate(smsTemplate, smsVariables, data);
            data.message = processedData?.sms_message;
            const dataParams = _.isObject(params) ? { ...params } : {};
            dataParams.template_title = smsTemplate?.templateTitle;
            dataParams.template_code = smsTemplate?.templateCode;
            success = await this.registerSMSNotification(data, dataParams);
        }
        catch (err) {
            this.log.error('[processSMS] >> Error ', err);
            success = 0;
        }
        return success;
    }
    async sendSMS(options) {
        let success;
        let message;
        try {
            if (!('number' in options)) {
                throw new Error('Mobile number is empty');
            }
            const accountSid = await this.cacheService.get('SMS_TW_API_SID');
            const authToken = await this.cacheService.get('SMS_TW_API_TOKEN');
            const fromNumber = await this.cacheService.get('SMS_FROM_NUMBER');
            const twilioClient = new twilio_1.Twilio(accountSid, authToken);
            const twilioPayload = {
                body: options.message,
                to: options.number,
                from: fromNumber,
            };
            if ('async' in options && options.async === false) {
                const result = await new Promise((resolve, reject) => {
                    twilioClient.messages.create(twilioPayload, (error, response) => {
                        const sendStatus = {};
                        if (error) {
                            sendStatus.success = 0;
                            sendStatus.message = 'SMS sending failed';
                            sendStatus.error = error;
                        }
                        else if (response.sid) {
                            sendStatus.success = 1;
                            sendStatus.message = 'SMS sent successfully';
                            sendStatus.data = response;
                        }
                        else {
                            sendStatus.success = 0;
                            sendStatus.message = 'SMS sending failed';
                            sendStatus.error = response;
                        }
                        resolve(sendStatus);
                    });
                });
                if (!result?.success) {
                    throw new Error(result.message);
                }
            }
            else {
                twilioClient.messages.create(twilioPayload, (error, response) => {
                    const sendStatus = {};
                    if (error) {
                        sendStatus.success = 0;
                        sendStatus.message = 'SMS sending failed';
                        sendStatus.error = error;
                    }
                    else if (response.sid) {
                        sendStatus.success = 1;
                        sendStatus.message = 'SMS sent successfully';
                        sendStatus.data = response;
                    }
                    else {
                        sendStatus.success = 0;
                        sendStatus.message = 'SMS sending failed';
                        sendStatus.error = response;
                    }
                    if (sendStatus.success === 1) {
                        this.handleSmsCallBack(null, options.id);
                    }
                    else {
                        this.handleSmsCallBack(sendStatus.error, options.id);
                    }
                });
            }
            success = 1;
        }
        catch (err) {
            success = 0;
            message = err;
            this.log.error('[sendSMS] >> Error ', err);
        }
        return { success: success, message: message };
    }
    async logSMS(options, params) {
        let success = 1;
        let message = '';
        try {
            const sendPriority = 'priority' in options && options.priority !== ''
                ? options.priority
                : 'default';
            const queryColumns = {
                receiver: options.number,
                message: options.message,
                type: common_enum_1.TYPE.API,
            };
            if (params.template_code) {
                queryColumns.code = params.template_code;
            }
            queryColumns.status = common_enum_1.STATUS.PENDING;
            const queryObject = this.smsNotifyLogsRepository.create(queryColumns);
            let resdata = await this.smsNotifyLogsRepository.save(queryObject);
            options.id = resdata.id;
            const is_queue_enabled = this.configService.get('app.enable_notification_queue');
            if (sendPriority == 'immediate' || !is_queue_enabled) {
                let res = await this.sendSMS(options);
                if ('async' in options && options.async === false) {
                    if (res.success == 1) {
                        this.handleSmsCallBack(null, options.id);
                    }
                    else {
                        this.handleSmsCallBack(res.message, options.id);
                    }
                }
                message = 'Email notification executed.';
            }
            else {
                let priority;
                if (sendPriority == 'high') {
                    priority = 1;
                }
                else if (sendPriority == 'low') {
                    priority = 3;
                }
                else {
                    priority = 2;
                }
                await this.smsQueue.add('sms-task', options, {
                    priority: priority,
                });
                message = 'Email notification registered.';
            }
            this.log.debug(`[logSMS] >> SMS logging completed.`);
            success = 1;
            message = 'Sms logging completed';
        }
        catch (err) {
            success = 0;
            message = err;
            this.log.error('[logSMS] >> Error ', err);
        }
        return { success: success, message: message };
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
    async registerSMSNotification(options, params) {
        let success;
        try {
            if (!('number' in options)) {
                throw new Error('Mobile number is empty');
            }
            let result = await this.logSMS(options, params);
            if (!result?.success) {
                throw new Error(result?.message);
            }
            success = 1;
        }
        catch (err) {
            success = 0;
            this.log.error('[registerSMSNotification] >> Error ', err);
        }
        return success;
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(sms_notify_template_entity_1.SmsNotifyTemplateEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(sms_notifications_entity_1.SmsNotificationsEntity)),
    __param(5, (0, bull_1.InjectQueue)('sms-queue')),
    __metadata("design:paramtypes", [config_1.ConfigService,
        cache_service_1.CacheService,
        date_service_1.DateService,
        typeorm_2.Repository,
        typeorm_2.Repository, Object])
], SmsService);
//# sourceMappingURL=sms.service.js.map