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
exports.EmailNotificationsEntity = void 0;
const typeorm_1 = require("typeorm");
var STATUS;
(function (STATUS) {
    STATUS["PENDING"] = "Pending";
    STATUS["INPROCESS"] = "Inprocess";
    STATUS["EXECUTED"] = "Executed";
    STATUS["FAILED"] = "Failed";
})(STATUS || (STATUS = {}));
var TYPE;
(function (TYPE) {
    TYPE["API"] = "API";
    TYPE["ADMIN"] = "Admin";
    TYPE["FRONT"] = "Front";
    TYPE["NOTIFICATIONS"] = "Notifications";
})(TYPE || (TYPE = {}));
let EmailNotificationsEntity = class EmailNotificationsEntity {
    id;
    receiver;
    subject;
    content;
    params;
    error;
    type;
    code;
    status;
    executedAt;
    createdAt;
    updatedAt;
    deletedAt;
};
exports.EmailNotificationsEntity = EmailNotificationsEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ unsigned: true }),
    __metadata("design:type", Number)
], EmailNotificationsEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmailNotificationsEntity.prototype, "receiver", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmailNotificationsEntity.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmailNotificationsEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", String)
], EmailNotificationsEntity.prototype, "params", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmailNotificationsEntity.prototype, "error", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TYPE, default: TYPE.API }),
    __metadata("design:type", String)
], EmailNotificationsEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmailNotificationsEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: STATUS, default: STATUS.PENDING }),
    __metadata("design:type", String)
], EmailNotificationsEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], EmailNotificationsEntity.prototype, "executedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], EmailNotificationsEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], EmailNotificationsEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], EmailNotificationsEntity.prototype, "deletedAt", void 0);
exports.EmailNotificationsEntity = EmailNotificationsEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'mod_email_notifications' })
], EmailNotificationsEntity);
//# sourceMappingURL=email-notifications.entity.js.map