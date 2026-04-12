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
exports.PushNotifyTemplateEntity = void 0;
const typeorm_1 = require("typeorm");
var SILENT;
(function (SILENT) {
    SILENT["YES"] = "Yes";
    SILENT["NO"] = "No";
})(SILENT || (SILENT = {}));
var STATUS;
(function (STATUS) {
    STATUS["ACTIVE"] = "Active";
    STATUS["INACTIVE"] = "Inactive";
})(STATUS || (STATUS = {}));
let PushNotifyTemplateEntity = class PushNotifyTemplateEntity {
    id;
    templateTitle;
    templateCode;
    title;
    message;
    sound;
    badge;
    image;
    color;
    silent;
    priority;
    collapseKey;
    sendInterval;
    expireInterval;
    varsJson;
    status;
    createdAt;
    updatedAt;
};
exports.PushNotifyTemplateEntity = PushNotifyTemplateEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], PushNotifyTemplateEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], PushNotifyTemplateEntity.prototype, "templateTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], PushNotifyTemplateEntity.prototype, "templateCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 50 }),
    __metadata("design:type", String)
], PushNotifyTemplateEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PushNotifyTemplateEntity.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], PushNotifyTemplateEntity.prototype, "sound", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PushNotifyTemplateEntity.prototype, "badge", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], PushNotifyTemplateEntity.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 10 }),
    __metadata("design:type", String)
], PushNotifyTemplateEntity.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SILENT, default: SILENT.NO }),
    __metadata("design:type", String)
], PushNotifyTemplateEntity.prototype, "silent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 50 }),
    __metadata("design:type", String)
], PushNotifyTemplateEntity.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], PushNotifyTemplateEntity.prototype, "collapseKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PushNotifyTemplateEntity.prototype, "sendInterval", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PushNotifyTemplateEntity.prototype, "expireInterval", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], PushNotifyTemplateEntity.prototype, "varsJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: STATUS, default: STATUS.ACTIVE }),
    __metadata("design:type", String)
], PushNotifyTemplateEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], PushNotifyTemplateEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], PushNotifyTemplateEntity.prototype, "updatedAt", void 0);
exports.PushNotifyTemplateEntity = PushNotifyTemplateEntity = __decorate([
    (0, typeorm_1.Entity)('mod_push_notify_template')
], PushNotifyTemplateEntity);
//# sourceMappingURL=push-notify-template.entity.js.map