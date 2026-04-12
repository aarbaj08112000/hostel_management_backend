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
exports.NotifyOperationValuesEntity = void 0;
const typeorm_1 = require("typeorm");
let NotifyOperationValuesEntity = class NotifyOperationValuesEntity {
    id;
    notifyScheduleId;
    fieldName;
    oldValue;
    newValue;
    createdAt;
    updatedAt;
    deletedAt;
};
exports.NotifyOperationValuesEntity = NotifyOperationValuesEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ unsigned: true }),
    __metadata("design:type", Number)
], NotifyOperationValuesEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], NotifyOperationValuesEntity.prototype, "notifyScheduleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: '500', nullable: true }),
    __metadata("design:type", String)
], NotifyOperationValuesEntity.prototype, "fieldName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], NotifyOperationValuesEntity.prototype, "oldValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], NotifyOperationValuesEntity.prototype, "newValue", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], NotifyOperationValuesEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], NotifyOperationValuesEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], NotifyOperationValuesEntity.prototype, "deletedAt", void 0);
exports.NotifyOperationValuesEntity = NotifyOperationValuesEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'mod_notify_operation_values' })
], NotifyOperationValuesEntity);
//# sourceMappingURL=notify-operation-values.entity.js.map