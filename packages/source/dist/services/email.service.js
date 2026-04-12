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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
const bull_1 = require("@nestjs/bull");
const _ = __importStar(require("lodash"));
const logger_handler_1 = require("../utilities/logger-handler");
const cache_service_1 = require("./cache.service");
const date_service_1 = require("./date.service");
const email_notify_template_entity_1 = require("../entities/email-notify-template.entity");
const email_notifications_entity_1 = require("../entities/email-notifications.entity");
const common_enum_1 = require("../common/enum/common.enum");
let EmailService = EmailService_1 = class EmailService {
    mailerService;
    cacheService;
    dateService;
    emailNotifyTmplRepository;
    emailNotifyLogsRepository;
    configService;
    emailQueue;
    log = new logger_handler_1.LoggerHandler(EmailService_1.name).getInstance();
    constructor(mailerService, cacheService, dateService, emailNotifyTmplRepository, emailNotifyLogsRepository, configService, emailQueue) {
        this.mailerService = mailerService;
        this.cacheService = cacheService;
        this.dateService = dateService;
        this.emailNotifyTmplRepository = emailNotifyTmplRepository;
        this.emailNotifyLogsRepository = emailNotifyLogsRepository;
        this.configService = configService;
        this.emailQueue = emailQueue;
    }
    unescape(str) {
        return str
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#x2F;/g, '/')
            .replace(/&#x5C;/g, '\\')
            .replace(/&#96;/g, '`');
    }
    async getTemplateByCode(code) {
        let template;
        try {
            template = await this.emailNotifyTmplRepository.findOne({
                where: { emailCode: code },
            });
            if (!_.isObject(template) || _.isEmpty(template)) {
                throw new Error('Email template not found.');
            }
        }
        catch (err) {
            this.log.error('[getTemplateByCode] >> ', err);
        }
        return template;
    }
    async getTemplateVars() {
        const apiURL = await this.cacheService.get('API_URL');
        const siteUrl = await this.cacheService.get('SITE_URL');
        const siteLogo = await this.cacheService.get('COMPANY_LOGO');
        const logoUrl = `${this.configService.get('app.settings_files_url')}${siteLogo}`;
        const currentYear = new Date().getFullYear();
        const companyName = await this.cacheService.get('COMPANY_NAME');
        let copyRightText = await this.cacheService.get('COPYRIGHTED_TEXT');
        copyRightText = copyRightText.replace('#COMPANY_NAME#', companyName);
        copyRightText = copyRightText.replace('#CURRENT_YEAR#', String(currentYear));
        const params = {
            company_name: companyName,
            copyright_text: copyRightText,
            site_url: siteUrl,
            logo: `${apiURL}/${logoUrl}`,
        };
        return params;
    }
    async processTemplate(tmplData, varsData, execData) {
        let emailSubject;
        if ('email_subject' in execData && execData.email_subject) {
            emailSubject = execData.email_subject;
        }
        else {
            emailSubject = tmplData.emailSubject || '';
        }
        let emailMessage = tmplData.emailMessage || '';
        emailMessage = emailMessage.replace(/\\(.)/gm, '$1').trim();
        let fromName;
        if ('from_name' in execData && execData.from_name) {
            fromName = execData.from_name;
        }
        else {
            fromName = tmplData.fromName;
        }
        if (!fromName) {
            fromName = await this.cacheService.get('COMPANY_NAME');
        }
        let fromEmail;
        if ('from_email' in execData && execData.from_email) {
            fromEmail = execData.from_email;
        }
        else {
            fromEmail = tmplData.fromEmail;
        }
        if (!fromEmail) {
            fromEmail = await this.cacheService.get('NOTIFICATION_EMAIL');
        }
        const keyValuePair = {};
        let keyValueData = {};
        if (_.isArray(varsData) && varsData.length > 0) {
            if (_.isObject(execData?.params)) {
                keyValueData = execData?.params;
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
                        emailSubject = emailSubject.replace(regex, keyValue);
                        emailMessage = emailMessage.replace(regex, keyValue);
                        fromName = fromName.replace(regex, keyValue);
                        fromEmail = fromEmail.replace(regex, keyValue);
                    }
                }
            }
        }
        const processedData = {
            email_subject: emailSubject,
            email_message: emailMessage,
            from_name: fromName,
            from_email: fromEmail,
            key_values: keyValuePair,
        };
        return processedData;
    }
    async processMail(code, data, params) {
        let success;
        try {
            if (!code) {
                throw new Error('Email template is missing');
            }
            if (!_.isObject(data) || _.isEmpty(data)) {
                throw new Error('Parameters object is empty');
            }
            if (!('to_email' in data)) {
                throw new Error('Receiver email is empty');
            }
            const mailTemplate = await this.getTemplateByCode(code);
            const mailVariables = mailTemplate?.varsJson;
            const processedData = await this.processTemplate(mailTemplate, mailVariables, data);
            const toEmail = data?.to_email;
            const fromName = processedData?.from_name;
            const fromEmail = processedData?.from_email;
            const emailSubject = processedData?.email_subject;
            const emailMessage = this.unescape(processedData.email_message);
            let ccEmail;
            if ('cc_email' in data && data.cc_email) {
                ccEmail = data.cc_email;
            }
            else if ('vCcEmail' in mailTemplate && mailTemplate.ccEmail) {
                ccEmail = mailTemplate.ccEmail;
            }
            let bccEmail;
            if ('bcc_email' in data && data.bcc_email) {
                bccEmail = data.bcc_email;
            }
            else if ('vBccEmail' in mailTemplate && mailTemplate.bccEmail) {
                bccEmail = mailTemplate.bccEmail;
            }
            let replyToName;
            if ('replyto_name' in data && data.replyto_name) {
                replyToName = data.replyto_name;
            }
            else if ('vReplyToName' in mailTemplate && mailTemplate.replyToName) {
                bccEmail = mailTemplate.replyToName;
            }
            let replyToEmail;
            if ('replyto_email' in data && data.replyto_email) {
                replyToEmail = data.replyto_email;
            }
            else if ('vReplyToEmail' in mailTemplate && mailTemplate.replyToEmail) {
                bccEmail = mailTemplate.replyToEmail;
            }
            let emailAttachments = null;
            if ('attachments' in data && _.isArray(data.attachments)) {
                emailAttachments = data.attachments;
            }
            const keyValues = processedData?.key_values;
            const emailOptions = {
                to_email: toEmail,
                cc_email: ccEmail,
                bcc_email: bccEmail,
                from_name: fromName,
                from_email: fromEmail,
                replyto_name: replyToName,
                replyto_email: replyToEmail,
                email_subject: emailSubject,
                email_message: emailMessage,
                attachments: emailAttachments,
                variables: keyValues,
                callback: data?.callback,
                async: data?.async,
                new_priority: data?.new_priority,
            };
            const dataParams = _.isObject(params)
                ? { ...params }
                : {};
            dataParams.email_title = mailTemplate?.emailTitle;
            dataParams.email_code = mailTemplate?.emailCode;
            success = await this.registerEmail(emailOptions, dataParams);
        }
        catch (err) {
            success = 0;
            this.log.error('[processMail] >> Error ', err);
        }
        return success;
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
    async sendMail(options) {
        let success;
        let message;
        try {
            if (!('to' in options) || options.to === '') {
                throw new Error('Receiver email address is missing..!');
            }
            if ('async' in options && options.async === false) {
                const result = await new Promise((resolve, reject) => {
                    this.mailerService
                        .sendMail(options)
                        .then((data) => {
                        resolve({
                            success: 1,
                            message: 'Email sent successfully',
                            data,
                        });
                    })
                        .catch((error) => {
                        resolve({
                            success: 0,
                            message: 'Email sending failed',
                            error,
                        });
                    });
                });
                if (result?.error) {
                    throw new Error(result.error);
                }
            }
            else {
                this.mailerService
                    .sendMail(options)
                    .then((info) => {
                    this.handleMailCallBack(null, info, options.id);
                    if (options?.callback) {
                        options.callback(null, info, options.id);
                    }
                })
                    .catch((error) => {
                    this.log.error('[sendMail] >> Catch ', error);
                    this.handleMailCallBack(error, null, options.id);
                    if (options?.callback) {
                        options.callback(error, null, options.id);
                    }
                });
            }
            success = 1;
        }
        catch (err) {
            success = 0;
            message = err;
            this.log.error('[sendMail] >> Error ', err);
        }
        return {
            success: success,
            message: message,
        };
    }
    async logEmail(options, params) {
        const sendPriority = 'new_priority' in options && options.new_priority !== ''
            ? options.new_priority
            : 'default';
        let success = 1;
        let message = '';
        try {
            const miscJSON = {
                from_email: options?.from,
                from_name: options.to,
                replyto_email: options?.replyTo,
                replyto_name: options?.inReplyTo,
                cc_email: options?.cc,
                bcc_email: options?.bcc,
                attachments: options?.attachments,
                variables: options?.variables,
            };
            const queryColumns = {
                receiver: options.to,
                subject: options?.subject,
                content: options?.context?.content,
                type: common_enum_1.TYPE.API,
            };
            queryColumns.params = JSON.stringify(miscJSON);
            if (params.email_code) {
                queryColumns.code = params.email_code;
            }
            const queryObject = this.emailNotifyLogsRepository.create(queryColumns);
            let resdata = await this.emailNotifyLogsRepository.save(queryObject);
            const is_queue_enabled = this.configService.get('app.enable_notification_queue');
            options.id = resdata.id;
            if (sendPriority == 'immediate' || !is_queue_enabled) {
                let res = await this.sendMail(options);
                if ('async' in options && options.async === false) {
                    if (res.success == 1) {
                        this.handleMailCallBack(null, res.message, options.id);
                    }
                    else {
                        this.handleMailCallBack(res.message, null, options.id);
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
                await this.emailQueue.add('email-task', options, {
                    priority: priority,
                });
                message = 'Email notification registered.';
            }
            this.log.debug(`[logEmail] >> Email logging completed`);
            success = 1;
            message = 'Email logging completed';
        }
        catch (err) {
            success = 0;
            message = err;
            this.log.error('[logEmail] >> Error ', err);
        }
        return { success: success, message: message };
    }
    async registerEmail(options, params) {
        let success = 0;
        try {
            if (!('to_email' in options) || options.to_email === '') {
                throw new Error('Receiver email address is missing..!');
            }
            if (!('email_message' in options) || options.email_message === '') {
                throw new Error('Email body content is missing..!');
            }
            const tmplVariables = await this.getTemplateVars();
            const notifyEmail = await this.cacheService.get('NOTIFICATION_EMAIL');
            const companyName = await this.cacheService.get('COMPANY_NAME');
            const fromEmail = options?.from_email || notifyEmail;
            const fromName = options?.from_name || companyName;
            const mailOptions = {
                to: options?.to_email,
            };
            if (fromName) {
                mailOptions.from = `${fromName} <${fromEmail}>`;
            }
            else {
                mailOptions.from = fromEmail;
            }
            mailOptions.subject = options.email_subject || '';
            mailOptions.template = 'mail-template';
            mailOptions.context = {
                ...tmplVariables,
                ...options?.variables,
                content: options.email_message,
            };
            if ('replyto_email' in options && options.replyto_email) {
                mailOptions.replyTo = options.replyto_email;
            }
            else {
                mailOptions.replyTo = fromEmail;
            }
            if ('replyto_name' in options && options.replyto_name) {
                mailOptions.inReplyTo = options.replyto_name;
            }
            else {
                mailOptions.inReplyTo = fromName;
            }
            if ('cc_email' in options && options.cc_email) {
                mailOptions.cc = options.cc_email;
            }
            if ('bcc_email' in options && options.bcc_email) {
                mailOptions.bcc = options.bcc_email;
            }
            if ('attachments' in options && _.isArray(options.attachments)) {
                mailOptions.attachments = options.attachments;
            }
            if ('async' in options) {
                mailOptions.async = options.async;
            }
            mailOptions.new_priority = options.new_priority;
            let result = await this.logEmail(mailOptions, params);
            if (!result?.success) {
                throw new Error(result?.message);
            }
            success = 1;
        }
        catch (error) {
            success = 0;
            this.log.error('[registerEmail] >> Error ', error);
        }
        return success;
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(email_notify_template_entity_1.EmailNotifyTemplateEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(email_notifications_entity_1.EmailNotificationsEntity)),
    __param(6, (0, bull_1.InjectQueue)('email-queue')),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        cache_service_1.CacheService,
        date_service_1.DateService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService, Object])
], EmailService);
//# sourceMappingURL=email.service.js.map