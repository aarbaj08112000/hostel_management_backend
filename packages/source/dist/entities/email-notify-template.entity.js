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
exports.EmailNotifyTemplateEntity = void 0;
const typeorm_1 = require("typeorm");
var STATUS;
(function (STATUS) {
    STATUS["ACTIVE"] = "Active";
    STATUS["INACTIVE"] = "Inactive";
})(STATUS || (STATUS = {}));
let EmailNotifyTemplateEntity = class EmailNotifyTemplateEntity {
    id;
    emailTitle;
    emailCode;
    fromName;
    fromEmail;
    replyToName;
    replyToEmail;
    ccEmail;
    bccEmail;
    emailSubject;
    emailMessage;
    varsJson;
    status;
    createdAt;
    updatedAt;
};
exports.EmailNotifyTemplateEntity = EmailNotifyTemplateEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], EmailNotifyTemplateEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], EmailNotifyTemplateEntity.prototype, "emailTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], EmailNotifyTemplateEntity.prototype, "emailCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], EmailNotifyTemplateEntity.prototype, "fromName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], EmailNotifyTemplateEntity.prototype, "fromEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], EmailNotifyTemplateEntity.prototype, "replyToName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], EmailNotifyTemplateEntity.prototype, "replyToEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], EmailNotifyTemplateEntity.prototype, "ccEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], EmailNotifyTemplateEntity.prototype, "bccEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], EmailNotifyTemplateEntity.prototype, "emailSubject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], EmailNotifyTemplateEntity.prototype, "emailMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], EmailNotifyTemplateEntity.prototype, "varsJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: STATUS, default: STATUS.ACTIVE }),
    __metadata("design:type", String)
], EmailNotifyTemplateEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], EmailNotifyTemplateEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], EmailNotifyTemplateEntity.prototype, "updatedAt", void 0);
exports.EmailNotifyTemplateEntity = EmailNotifyTemplateEntity = __decorate([
    (0, typeorm_1.Entity)('mod_email_notify_template')
], EmailNotifyTemplateEntity);
//# sourceMappingURL=email-notify-template.entity.js.map