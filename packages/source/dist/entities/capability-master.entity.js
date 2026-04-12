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
exports.CapabilityMasterEntity = void 0;
const typeorm_1 = require("typeorm");
var CAPABILITY_TYPE;
(function (CAPABILITY_TYPE) {
    CAPABILITY_TYPE["CUSTOM"] = "Custom";
    CAPABILITY_TYPE["MODULE"] = "Module";
    CAPABILITY_TYPE["DASHBOARD"] = "Dashboard";
    CAPABILITY_TYPE["WIDGET"] = "Widget";
    CAPABILITY_TYPE["LISTFIELD"] = "ListField";
    CAPABILITY_TYPE["FORMFIELD"] = "FormField";
})(CAPABILITY_TYPE || (CAPABILITY_TYPE = {}));
var ADDED_BY;
(function (ADDED_BY) {
    ADDED_BY["SYSTEM"] = "System";
    ADDED_BY["MANUAL"] = "Manual";
})(ADDED_BY || (ADDED_BY = {}));
var STATUS;
(function (STATUS) {
    STATUS["ACTIVE"] = "Active";
    STATUS["INACTIVE"] = "Inactive";
})(STATUS || (STATUS = {}));
let CapabilityMasterEntity = class CapabilityMasterEntity {
    id;
    capabilityName;
    capabilityCode;
    capabilityType;
    capabilityMode;
    entityName;
    parentEntity;
    categoryId;
    addedBy;
    status;
    createdAt;
    updatedAt;
};
exports.CapabilityMasterEntity = CapabilityMasterEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], CapabilityMasterEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], CapabilityMasterEntity.prototype, "capabilityName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], CapabilityMasterEntity.prototype, "capabilityCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', nullable: true, enum: CAPABILITY_TYPE }),
    __metadata("design:type", String)
], CapabilityMasterEntity.prototype, "capabilityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], CapabilityMasterEntity.prototype, "capabilityMode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], CapabilityMasterEntity.prototype, "entityName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], CapabilityMasterEntity.prototype, "parentEntity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CapabilityMasterEntity.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        nullable: true,
        enum: ADDED_BY,
        default: ADDED_BY.SYSTEM,
    }),
    __metadata("design:type", String)
], CapabilityMasterEntity.prototype, "addedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        nullable: true,
        enum: STATUS,
        default: STATUS.ACTIVE,
    }),
    __metadata("design:type", String)
], CapabilityMasterEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], CapabilityMasterEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], CapabilityMasterEntity.prototype, "updatedAt", void 0);
exports.CapabilityMasterEntity = CapabilityMasterEntity = __decorate([
    (0, typeorm_1.Entity)('mod_capability_master')
], CapabilityMasterEntity);
//# sourceMappingURL=capability-master.entity.js.map