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
exports.NotifyScheduleEntity = void 0;
const typeorm_1 = require("typeorm");
var STATUS;
(function (STATUS) {
    STATUS["PENDING"] = "Pending";
    STATUS["EXECUTED"] = "Executed";
    STATUS["FAILED"] = "Failed";
    STATUS["DBERROR"] = "DBError";
    STATUS["INPROCESS"] = "Inprocess";
})(STATUS || (STATUS = {}));
var NOTIFY_TYPE;
(function (NOTIFY_TYPE) {
    NOTIFY_TYPE["TIME"] = "Time";
    NOTIFY_TYPE["OPERATION"] = "Operation";
})(NOTIFY_TYPE || (NOTIFY_TYPE = {}));
var OPERATION;
(function (OPERATION) {
    OPERATION["INSERT"] = "Insert";
    OPERATION["UPDATE"] = "Update";
    OPERATION["DELETE"] = "Delete";
})(OPERATION || (OPERATION = {}));
let NotifyScheduleEntity = class NotifyScheduleEntity {
    id;
    notifyName;
    notifyType;
    operation;
    success;
    message;
    outputJson;
    exeDateTime;
    status;
    createdAt;
    updatedAt;
    deletedAt;
};
exports.NotifyScheduleEntity = NotifyScheduleEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ unsigned: true }),
    __metadata("design:type", Number)
], NotifyScheduleEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NotifyScheduleEntity.prototype, "notifyName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: NOTIFY_TYPE, default: NOTIFY_TYPE.TIME }),
    __metadata("design:type", String)
], NotifyScheduleEntity.prototype, "notifyType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: NOTIFY_TYPE, default: null }),
    __metadata("design:type", String)
], NotifyScheduleEntity.prototype, "operation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NotifyScheduleEntity.prototype, "success", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NotifyScheduleEntity.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], NotifyScheduleEntity.prototype, "outputJson", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', { nullable: true }),
    __metadata("design:type", String)
], NotifyScheduleEntity.prototype, "exeDateTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: STATUS, default: STATUS.PENDING }),
    __metadata("design:type", String)
], NotifyScheduleEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], NotifyScheduleEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], NotifyScheduleEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], NotifyScheduleEntity.prototype, "deletedAt", void 0);
exports.NotifyScheduleEntity = NotifyScheduleEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'mod_notify_schedule' })
], NotifyScheduleEntity);
//# sourceMappingURL=notify-schedule.entity.js.map