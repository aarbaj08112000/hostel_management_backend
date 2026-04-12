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
exports.PushNotificationsEntity = void 0;
const typeorm_1 = require("typeorm");
var MODE;
(function (MODE) {
    MODE["LIVE"] = "live";
    MODE["SANDBOX"] = "sandbox";
})(MODE || (MODE = {}));
var DEVICE;
(function (DEVICE) {
    DEVICE["IOS"] = "iOS";
    DEVICE["ANDROID"] = "Android";
})(DEVICE || (DEVICE = {}));
var TYPE;
(function (TYPE) {
    TYPE["API"] = "API";
    TYPE["ADMIN"] = "Admin";
    TYPE["FRONT"] = "Front";
    TYPE["NOTIFICATIONS"] = "Notifications";
})(TYPE || (TYPE = {}));
var STATUS;
(function (STATUS) {
    STATUS["PENDING"] = "Pending";
    STATUS["INPROCESS"] = "Inprocess";
    STATUS["EXECUTED"] = "Executed";
    STATUS["FAILED"] = "Failed";
})(STATUS || (STATUS = {}));
let PushNotificationsEntity = class PushNotificationsEntity {
    id;
    code;
    mode;
    token;
    title;
    message;
    params;
    varsJson;
    notifyCode;
    deviceType;
    sendJson;
    error;
    priority;
    type;
    status;
    executedAt;
    createdAt;
    updatedAt;
    deletedAt;
};
exports.PushNotificationsEntity = PushNotificationsEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ unsigned: true }),
    __metadata("design:type", Number)
], PushNotificationsEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PushNotificationsEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: MODE, default: MODE.LIVE }),
    __metadata("design:type", String)
], PushNotificationsEntity.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PushNotificationsEntity.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 50 }),
    __metadata("design:type", String)
], PushNotificationsEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PushNotificationsEntity.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", String)
], PushNotificationsEntity.prototype, "params", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", String)
], PushNotificationsEntity.prototype, "varsJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 50 }),
    __metadata("design:type", String)
], PushNotificationsEntity.prototype, "notifyCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: DEVICE, nullable: true }),
    __metadata("design:type", String)
], PushNotificationsEntity.prototype, "deviceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", String)
], PushNotificationsEntity.prototype, "sendJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PushNotificationsEntity.prototype, "error", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 50 }),
    __metadata("design:type", String)
], PushNotificationsEntity.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TYPE, default: TYPE.API }),
    __metadata("design:type", String)
], PushNotificationsEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: STATUS, default: STATUS.PENDING }),
    __metadata("design:type", String)
], PushNotificationsEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], PushNotificationsEntity.prototype, "executedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], PushNotificationsEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], PushNotificationsEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], PushNotificationsEntity.prototype, "deletedAt", void 0);
exports.PushNotificationsEntity = PushNotificationsEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'mod_push_notifications' })
], PushNotificationsEntity);
//# sourceMappingURL=push-notifications.entity.js.map