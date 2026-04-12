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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PushNotifyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotifyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bull_1 = require("@nestjs/bull");
const config_1 = require("@nestjs/config");
const node_pushnotifications_1 = __importDefault(require("node-pushnotifications"));
const _ = __importStar(require("lodash"));
const logger_handler_1 = require("../utilities/logger-handler");
const cache_service_1 = require("./cache.service");
const date_service_1 = require("./date.service");
const push_notify_template_entity_1 = require("../entities/push-notify-template.entity");
const push_notifications_entity_1 = require("../entities/push-notifications.entity");
const common_enum_1 = require("../common/enum/common.enum");
let PushNotifyService = PushNotifyService_1 = class PushNotifyService {
    configService;
    cacheService;
    dateService;
    pushNotifyTmplRepository;
    pushNotifyLogsRepository;
    pushQueue;
    log = new logger_handler_1.LoggerHandler(PushNotifyService_1.name).getInstance();
    constructor(configService, cacheService, dateService, pushNotifyTmplRepository, pushNotifyLogsRepository, pushQueue) {
        this.configService = configService;
        this.cacheService = cacheService;
        this.dateService = dateService;
        this.pushNotifyTmplRepository = pushNotifyTmplRepository;
        this.pushNotifyLogsRepository = pushNotifyLogsRepository;
        this.pushQueue = pushQueue;
    }
    async getPushNotifyByCode(code) {
        let template;
        try {
            template = await this.pushNotifyTmplRepository.findOne({
                where: { templateCode: code },
            });
            if (!_.isObject(template) || _.isEmpty(template)) {
                throw new Error('Push notify template not found.');
            }
        }
        catch (err) {
            this.log.error('[getPushNotifyByCode] >> Error ', err);
        }
        return template;
    }
    async processPushNotifyTemplate(tmplData, varsData, execData) {
        let pushTitle = tmplData?.title || '';
        let pushMessage = tmplData?.message || '';
        const keyValuePair = {};
        let keyValueData = {};
        if (_.isArray(varsData) && varsData.length > 0) {
            if (_.isObject(execData?.params)) {
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
                        pushTitle = pushTitle.replace(regex, keyValue);
                        pushMessage = pushMessage.replace(regex, keyValue);
                    }
                }
            }
        }
        const processedData = {
            push_title: pushTitle,
            push_message: pushMessage,
            key_values: keyValuePair,
        };
        return processedData;
    }
    async processPushNotification(code, data, params) {
        let success;
        try {
            if (!code) {
                throw new Error('Push notify template is missing');
            }
            if (!_.isObject(data) || _.isEmpty(data)) {
                throw new Error('Parameters object is empty');
            }
            if (!('device_token' in data)) {
                throw new Error('Device token is empty');
            }
            const pushTemplate = await this.getPushNotifyByCode(code);
            const pushVariables = pushTemplate?.varsJson;
            const processedData = await this.processPushNotifyTemplate(pushTemplate, pushVariables, data);
            const pushTitle = processedData.push_title;
            const pushMessage = processedData.push_message;
            const pushSound = data?.sound || pushTemplate?.sound;
            const pushBadge = data?.badge || pushTemplate?.badge;
            const pushImage = data?.image || pushTemplate?.image;
            const pushColor = data?.color || pushTemplate?.color;
            const pushSilent = data?.silent || pushTemplate?.silent;
            const pushPriority = data?.priority || pushTemplate?.priority;
            const pushCollapseKey = data?.collapse_key || pushTemplate?.collapseKey;
            const pushSendInterval = data?.send_after || pushTemplate?.sendInterval;
            const pushExpireInterval = data?.expire_after || pushTemplate?.expireInterval;
            const pushOptions = {
                device_token: data.device_token,
                code: data.code,
                title: pushTitle,
                message: pushMessage,
                sound: pushSound,
                badge: pushBadge,
                image: pushImage,
                color: pushColor,
                silent: pushSilent,
                priority: pushPriority,
                collapse_key: pushCollapseKey,
                send_after: pushSendInterval,
                expire_after: pushExpireInterval,
                send_mode: data.send_mode,
                async: data?.async,
            };
            const dataParams = _.isObject(params)
                ? { ...params }
                : {};
            dataParams.template_title = pushTemplate?.templateTitle;
            dataParams.template_code = pushTemplate?.templateCode;
            success = await this.insertPushNotification(pushOptions, dataParams);
        }
        catch (err) {
            this.log.error('[processPushNotification] >> Error', err);
            success = 0;
        }
        return success;
    }
    async insertPushNotification(options, params) {
        let success;
        try {
            let sendType = await this.cacheService.get('PUSH_NOTIFY_SENDING_TYPE');
            if ('send_mode' in options && options?.send_mode) {
                sendType = options.send_mode;
            }
            options.send_mode = sendType;
            await this.logPushNotification(options, params);
        }
        catch (err) {
            success = 0;
            this.log.error('[insertPushNotification] >> Error ', err);
        }
        return success;
    }
    async sendPushNotification(options, tokensList) {
        let success;
        let message;
        try {
            const settingsFilePath = this.configService.get('app.settings_files_path');
            const iosKeyFileName = await this.cacheService.get('PUSH_NOTIFY_PEM_FILE');
            const iosKeyFilePath = `${settingsFilePath}${iosKeyFileName}`;
            const iosKeyId = await this.cacheService.get('PUSH_NOTIFY_IOS_KEY_ID');
            const iosTeamId = await this.cacheService.get('PUSH_NOTIFY_IOS_TEAM_ID');
            const iosPassPhrase = await this.cacheService.get('PUSH_NOTIFY_IOS_KEY');
            const iosSendingMode = await this.cacheService.get('PUSH_NOTIFY_SENDING_MODE');
            const iosProduction = iosSendingMode !== 'sandbox';
            const adFCMKey = await this.cacheService.get('PUSH_NOTIFY_ANDROID_KEY');
            const pushInstance = new node_pushnotifications_1.default({
                gcm: {
                    id: adFCMKey,
                },
                apn: {
                    token: {
                        key: iosKeyFilePath,
                        keyId: iosKeyId,
                        teamId: iosTeamId,
                    },
                    production: iosProduction,
                    passphrase: iosPassPhrase || null,
                },
                isAlwaysUseFCM: false,
            });
            if ('async' in options && options.async === false) {
                const result = await new Promise((resolve, reject) => {
                    pushInstance.send(tokensList, options, (error, info) => {
                        const sendStatus = {};
                        if (error) {
                            sendStatus.success = 0;
                            sendStatus.message = 'Push notification sending failed';
                            sendStatus.error = error;
                        }
                        else if (_.isArray(info) && info[0].success === 0) {
                            sendStatus.success = 0;
                            sendStatus.message = 'Push notification sending failed';
                            sendStatus.error = info;
                        }
                        else {
                            sendStatus.success = 1;
                            sendStatus.message = 'Push notification sent successfully';
                            sendStatus.data = info;
                        }
                        resolve(sendStatus);
                    });
                });
                if (!result?.success) {
                    throw new Error(JSON.stringify(result.error[0].message));
                }
            }
            else {
                pushInstance.send(tokensList, options, (error, info) => {
                    const sendStatus = {};
                    if (error) {
                        sendStatus.success = 0;
                        sendStatus.message = 'Push notification sending failed';
                        sendStatus.error = error;
                    }
                    else if (_.isArray(info) && info[0].success === 0) {
                        sendStatus.success = 0;
                        sendStatus.message = 'Push notification sending failed';
                        sendStatus.error = info;
                    }
                    else {
                        sendStatus.success = 1;
                        sendStatus.message = 'Push notification sent successfully';
                        sendStatus.data = info;
                    }
                    if (sendStatus?.success) {
                        this.handlePushCallBack(null, sendStatus.data, options.id);
                    }
                    else {
                        this.handlePushCallBack(JSON.stringify(sendStatus.error[0].message), null, options.id);
                    }
                });
            }
            success = 1;
        }
        catch (err) {
            success = 0;
            message = err;
            this.log.error('[sendPushNotification] >> Error ', err);
        }
        return {
            success: success,
            message: message,
        };
    }
    async logPushNotification(options, params) {
        let success = 1;
        let message = '';
        try {
            const sendingMode = await this.cacheService.get('PUSH_NOTIFY_SENDING_MODE');
            if (!('device_token' in options)) {
                throw new Error('Device token is empty');
            }
            if (!('message' in options)) {
                throw new Error('Message is empty');
            }
            let tokensList;
            if (_.isString(options?.device_token) && options?.device_token) {
                if (options?.device_token.indexOf(',') >= 0) {
                    tokensList = options.device_token.split(',');
                }
                else {
                    tokensList = [options.device_token];
                }
            }
            const notifyData = {
                title: options?.title,
                body: options?.message,
                alert: {
                    title: options?.title,
                    body: options?.message,
                },
            };
            notifyData.topic = await this.cacheService.get('PUSH_NOTIFY_IOS_BUNDLE_ID');
            if ('sound' in options && options.sound) {
                notifyData.sound = options.sound;
            }
            if ('badge' in options && Number(options.badge) >= 0) {
                notifyData.badge = Number(options.badge);
            }
            if ('image' in options && options.image) {
                notifyData.image = options.image;
            }
            if ('icon' in options && options.icon) {
                notifyData.icon = options.icon;
            }
            if ('color' in options && options.color) {
                notifyData.color = options.color;
            }
            if ('priority' in options && options.priority) {
                notifyData.priority = options.priority;
            }
            if ('collapse_key' in options && options.collapse_key) {
                notifyData.collapseKey = options.collapse_key;
            }
            if ('silent' in options && options.silent === 'Yes') {
                notifyData.contentAvailable = true;
            }
            if ('expire_after' in options && Number(options.expire_after) > 0) {
                notifyData.expire =
                    Math.floor(Date.now() / 1000) + Number(options.expire_after);
            }
            notifyData.custom = {};
            if ('data' in options && _.isObject(options.data)) {
                notifyData.custom = options.data;
            }
            if ('code' in options && options.code) {
                notifyData.custom.code = options.code;
            }
            notifyData.async = options.async;
            const queryColumns = {
                deviceId: options.device_token,
                mode: sendingMode === 'sandbox' ? common_enum_1.MODE.SANDBOX : common_enum_1.MODE.LIVE,
                type: common_enum_1.TYPE.API,
                notifyCode: options?.code,
                title: options.title,
                message: options.message,
                sound: options?.sound,
                badge: options?.badge,
                silent: options?.silent,
                image: options?.image,
                color: options?.color,
                priority: options?.priority,
                collapseKey: options?.collapse_key,
            };
            if (params?.template_code) {
                queryColumns.code = params.template_code;
            }
            if ('data' in options && _.isObject(options.data)) {
                queryColumns.varsJSON = JSON.stringify(options.data);
            }
            if ('payload' in options && _.isObject(options.payload)) {
                queryColumns.sendJSON = JSON.stringify(options.payload);
            }
            if (Number(options.send_after) > 0) {
                queryColumns.pushTime = this.dateService.getDateTimeAfter(Number(options.send_after));
            }
            if ('expire_after' in options && Number(options.expire_after) > 0) {
                queryColumns.expireTime = this.dateService.getDateTimeAfter(Number(options.expire_after));
                queryColumns.expireInterval = Number(options.expire_after);
            }
            if (options.device_token.length > 64) {
                queryColumns.deviceType = common_enum_1.DEVICE.ANDROID;
            }
            else {
                queryColumns.deviceType = common_enum_1.DEVICE.IOS;
            }
            queryColumns.status = common_enum_1.STATUS.PENDING;
            const queryObject = this.pushNotifyLogsRepository.create(queryColumns);
            let res = await this.pushNotifyLogsRepository.save(queryObject);
            notifyData.id = res.id;
            const sendPriority = 'priority' in options && options.priority !== ''
                ? options.priority
                : 'default';
            const is_queue_enabled = this.configService.get('app.enable_notification_queue');
            if (sendPriority == 'immediate' || !is_queue_enabled) {
                let res = await this.sendPushNotification(notifyData, tokensList);
                if ('async' in options && options.async === false) {
                    if (res.success == 1) {
                        this.handlePushCallBack(null, res.message, notifyData.id);
                    }
                    else {
                        this.handlePushCallBack(res.message, null, notifyData.id);
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
                let option_data = {
                    notify_data: notifyData,
                    token_list: tokensList,
                };
                const resultdata = await this.pushQueue.add('push-task', option_data, {
                    priority: priority,
                });
                message = 'Email notification registered.';
            }
            this.log.debug(`[logPushNotification] >> Push notify logging completed`);
        }
        catch (err) {
            this.log.error('[logPushNotification] >> Error ', err);
        }
        return { success: success, message: message };
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
exports.PushNotifyService = PushNotifyService;
exports.PushNotifyService = PushNotifyService = PushNotifyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(push_notify_template_entity_1.PushNotifyTemplateEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(push_notifications_entity_1.PushNotificationsEntity)),
    __param(5, (0, bull_1.InjectQueue)('push-queue')),
    __metadata("design:paramtypes", [config_1.ConfigService,
        cache_service_1.CacheService,
        date_service_1.DateService,
        typeorm_2.Repository,
        typeorm_2.Repository, Object])
], PushNotifyService);
//# sourceMappingURL=pushnotify.service.js.map