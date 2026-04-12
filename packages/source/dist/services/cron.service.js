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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronService = void 0;
require('dotenv').config();
const TRANSACTION_URL = process.env.TRANSACTION_URL || '127.0.0.1';
const TRANSACTION_PORT = parseInt(process.env.TRANSACTION_PORT || '6004', 10);
const USER_URL = process.env.USER_URL || '127.0.0.1';
const USER_PORT = parseInt(process.env.USER_PORT || '6005', 10);
const CAR_URL = process.env.CAR_URL || '127.0.0.1';
const CAR_PORT = parseInt(process.env.CAR_PORT || '6001', 10);
const CUSTOMER_URL = process.env.CUSTOMER_URL || '127.0.0.1';
const CUSTOMER_PORT = parseInt(process.env.CUSTOMER_PORT || '6002', 10);
const MASTER_URL = process.env.MASTER_URL || '127.0.0.1';
const MASTER_PORT = parseInt(process.env.MASTER_PORT || '6003', 10);
const CRM_URL = '127.0.0.1';
const CRM_PORT = parseInt(process.env.CRM_PORT || '6008', 10);
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const cit_jobs_config_1 = require("@repo/source/config/cit-jobs-config");
let CronService = class CronService {
    client;
    transClient;
    userClient;
    carClient;
    customerClient;
    masterClient;
    crmClient;
    async handleCron() {
        console.log('Cron triggered: calling expire...');
        try {
            if (!this.transClient['isConnected']) {
                await this.transClient.connect();
                console.log(this.transClient['isConnected']);
            }
            const payload = {};
            const task = 'expire-booking';
            if (!cit_jobs_config_1.CronJobs[process.env.PORT].includes(task)) {
                return true;
            }
            const response = await (0, rxjs_1.firstValueFrom)(this.transClient.send('expire-booking', payload));
            console.log('Microservice responded:', response);
        }
        catch (err) {
            console.error('Microservice call failed:', err.message);
        }
    }
    async handleBookingReminderCron() {
        console.log('Cron triggered: calling booking reminder...');
        try {
            if (!this.transClient['isConnected']) {
                await this.transClient.connect();
                console.log(this.transClient['isConnected']);
            }
            const payload = {};
            const task = 'reminder-booking';
            if (!cit_jobs_config_1.CronJobs[process.env.PORT].includes(task)) {
                return true;
            }
            const response = await (0, rxjs_1.firstValueFrom)(this.transClient.send('reminder-booking', payload));
            console.log('Microservice responded:', response);
        }
        catch (err) {
            console.error('Microservice call failed:', err.message);
        }
    }
    async handleReview() {
        console.log('Cron triggered: calling microservice...');
        try {
            if (!this.userClient['isConnected']) {
                await this.userClient.connect();
            }
            const payload = {};
            const task = 'fetch-review';
            if (!cit_jobs_config_1.CronJobs[process.env.PORT].includes(task)) {
                return true;
            }
            const response = await (0, rxjs_1.firstValueFrom)(this.userClient.send('fetch-review', payload));
            console.log('Microservice responded:', response);
        }
        catch (err) {
            console.error('Microservice call failed:', err.message);
        }
    }
    async syncElastic() {
        console.log('Cron triggered: calling microservice...');
        try {
            const clients = [
                {
                    code: 'customer',
                    instance: () => this.customerClient,
                    pattern: 'sync-data',
                },
                {
                    code: 'master',
                    instance: () => this.masterClient,
                    pattern: 'sync-data',
                },
                { code: 'car', instance: () => this.carClient, pattern: 'sync-data' },
                { code: 'user', instance: () => this.userClient, pattern: 'sync-data' },
                {
                    code: 'transaction',
                    instance: () => this.transClient,
                    pattern: 'sync-data',
                },
            ];
            const payload = {};
            for (const clientConfig of clients) {
                const clientInstance = clientConfig.instance();
                if (clientInstance && typeof clientInstance.emit === 'function') {
                    clientInstance.emit('sync-data', payload);
                }
                else {
                    console.warn(`Client for ${clientConfig.code} is not initialized correctly.`);
                }
            }
        }
        catch (err) {
            console.error('Microservice call failed:', err.message);
        }
    }
    async syncIndexData() {
        try {
            if (!this.masterClient['isConnected']) {
                await this.masterClient.connect();
                console.log(this.transClient['isConnected']);
            }
            const payload = {};
            const task = 'index-sync';
            if (!cit_jobs_config_1.CronJobs[process.env.PORT].includes(task)) {
                return true;
            }
            const response = await (0, rxjs_1.firstValueFrom)(this.masterClient.send('index-sync', payload));
            console.log('Microservice responded:', response);
        }
        catch (err) {
            console.log(err);
        }
    }
    async handleWhatsappConversation() {
        return true;
        console.log('Cron triggered: calling expire...');
        try {
            if (!this.crmClient['isConnected']) {
                await this.crmClient.connect();
                console.log(this.crmClient['isConnected']);
            }
            const payload = {};
            const task = 'close-conversation';
            if (!cit_jobs_config_1.CronJobs[process.env.PORT].includes(task)) {
                return true;
            }
            const response = await (0, rxjs_1.firstValueFrom)(this.crmClient.send('close-conversation', payload));
            console.log('Microservice responded:', response);
        }
        catch (err) {
            console.error('Microservice call failed:', err.message);
        }
    }
};
exports.CronService = CronService;
__decorate([
    (0, microservices_1.Client)({
        transport: microservices_1.Transport.TCP,
        options: { port: TRANSACTION_PORT, host: TRANSACTION_URL },
    }),
    __metadata("design:type", microservices_1.ClientTCP)
], CronService.prototype, "transClient", void 0);
__decorate([
    (0, microservices_1.Client)({
        transport: microservices_1.Transport.TCP,
        options: { port: USER_PORT, host: USER_URL },
    }),
    __metadata("design:type", microservices_1.ClientTCP)
], CronService.prototype, "userClient", void 0);
__decorate([
    (0, microservices_1.Client)({
        transport: microservices_1.Transport.TCP,
        options: { port: CAR_PORT, host: CAR_URL },
    }),
    __metadata("design:type", microservices_1.ClientTCP)
], CronService.prototype, "carClient", void 0);
__decorate([
    (0, microservices_1.Client)({
        transport: microservices_1.Transport.TCP,
        options: { port: CUSTOMER_PORT, host: CUSTOMER_URL },
    }),
    __metadata("design:type", microservices_1.ClientTCP)
], CronService.prototype, "customerClient", void 0);
__decorate([
    (0, microservices_1.Client)({
        transport: microservices_1.Transport.TCP,
        options: { port: MASTER_PORT, host: MASTER_URL },
    }),
    __metadata("design:type", microservices_1.ClientTCP)
], CronService.prototype, "masterClient", void 0);
__decorate([
    (0, microservices_1.Client)({
        transport: microservices_1.Transport.TCP,
        options: { port: CRM_PORT, host: CRM_URL },
    }),
    __metadata("design:type", microservices_1.ClientTCP)
], CronService.prototype, "crmClient", void 0);
__decorate([
    (0, schedule_1.Cron)('0 0 */2 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "handleCron", null);
__decorate([
    (0, schedule_1.Cron)('0 0 1 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "handleBookingReminderCron", null);
__decorate([
    (0, schedule_1.Cron)('0 0 */9 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "handleReview", null);
__decorate([
    (0, schedule_1.Cron)('0 0 */5 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "syncElastic", null);
__decorate([
    (0, schedule_1.Cron)('0 0 */1 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "syncIndexData", null);
__decorate([
    (0, schedule_1.Cron)('0 */30 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "handleWhatsappConversation", null);
exports.CronService = CronService = __decorate([
    (0, common_1.Injectable)()
], CronService);
//# sourceMappingURL=cron.service.js.map