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
exports.SyncElasticEntityUser = exports.SyncElasticEntity = void 0;
const typeorm_1 = require("typeorm");
var STATUS;
(function (STATUS) {
    STATUS["ACTIVE"] = "Active";
    STATUS["INACTIVE"] = "Inactive";
})(STATUS || (STATUS = {}));
var SEARCHABLE;
(function (SEARCHABLE) {
    SEARCHABLE["ACTIVE"] = "Active";
    SEARCHABLE["INACTIVE"] = "Inactive";
})(SEARCHABLE || (SEARCHABLE = {}));
let SyncElasticEntity = class SyncElasticEntity {
    iSyncElasticId;
    vEntity;
    vMySqlEntity;
    vMySqlEntityType;
    vUniqueKey;
    vUniqueIndex;
    vEntityType;
    vEntityRegex;
    dLastSyncTime;
    iBulkUploadLimit;
    eStatus;
    eIsSearchable;
    eIsEnabledForSearch;
};
exports.SyncElasticEntity = SyncElasticEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], SyncElasticEntity.prototype, "iSyncElasticId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", Number)
], SyncElasticEntity.prototype, "vEntity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], SyncElasticEntity.prototype, "vMySqlEntity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], SyncElasticEntity.prototype, "vMySqlEntityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], SyncElasticEntity.prototype, "vUniqueKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], SyncElasticEntity.prototype, "vUniqueIndex", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], SyncElasticEntity.prototype, "vEntityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], SyncElasticEntity.prototype, "vEntityRegex", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], SyncElasticEntity.prototype, "dLastSyncTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: false, default: '0' }),
    __metadata("design:type", Number)
], SyncElasticEntity.prototype, "iBulkUploadLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        nullable: true,
        enum: STATUS,
        default: STATUS.ACTIVE,
    }),
    __metadata("design:type", String)
], SyncElasticEntity.prototype, "eStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        nullable: true,
        enum: SEARCHABLE,
        default: SEARCHABLE.ACTIVE,
    }),
    __metadata("design:type", String)
], SyncElasticEntity.prototype, "eIsSearchable", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        nullable: true,
        enum: SEARCHABLE,
        default: SEARCHABLE.ACTIVE,
    }),
    __metadata("design:type", String)
], SyncElasticEntity.prototype, "eIsEnabledForSearch", void 0);
exports.SyncElasticEntity = SyncElasticEntity = __decorate([
    (0, typeorm_1.Entity)('sync_elastic_entity')
], SyncElasticEntity);
var IS_SEARCHABLE;
(function (IS_SEARCHABLE) {
    IS_SEARCHABLE["YES"] = "Yes";
    IS_SEARCHABLE["NO"] = "No";
})(IS_SEARCHABLE || (IS_SEARCHABLE = {}));
var IS_ENABLED_FOR_SEARCH;
(function (IS_ENABLED_FOR_SEARCH) {
    IS_ENABLED_FOR_SEARCH["YES"] = "Yes";
    IS_ENABLED_FOR_SEARCH["NO"] = "No";
})(IS_ENABLED_FOR_SEARCH || (IS_ENABLED_FOR_SEARCH = {}));
let SyncElasticEntityUser = class SyncElasticEntityUser {
    id;
    entityName;
    entityType;
    entityRegex;
    sqlEntityName;
    sqlEntityType;
    uniqueKey;
    uniqueIndex;
    lastSyncTime;
    bulkUploadLimit;
    eIsSearchable;
    eIsEnabledForSearch;
    status;
    addedBy;
    updatedBy;
    updatedAt;
    createdAt;
};
exports.SyncElasticEntityUser = SyncElasticEntityUser;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], SyncElasticEntityUser.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 100 }),
    __metadata("design:type", String)
], SyncElasticEntityUser.prototype, "entityName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 100 }),
    __metadata("design:type", String)
], SyncElasticEntityUser.prototype, "entityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], SyncElasticEntityUser.prototype, "entityRegex", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 100 }),
    __metadata("design:type", String)
], SyncElasticEntityUser.prototype, "sqlEntityName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 50 }),
    __metadata("design:type", String)
], SyncElasticEntityUser.prototype, "sqlEntityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 50 }),
    __metadata("design:type", String)
], SyncElasticEntityUser.prototype, "uniqueKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 50 }),
    __metadata("design:type", String)
], SyncElasticEntityUser.prototype, "uniqueIndex", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], SyncElasticEntityUser.prototype, "lastSyncTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', nullable: true }),
    __metadata("design:type", Number)
], SyncElasticEntityUser.prototype, "bulkUploadLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        nullable: true,
        enum: IS_SEARCHABLE,
        default: IS_SEARCHABLE.YES,
    }),
    __metadata("design:type", String)
], SyncElasticEntityUser.prototype, "eIsSearchable", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        nullable: true,
        enum: IS_ENABLED_FOR_SEARCH,
        default: IS_ENABLED_FOR_SEARCH.YES,
    }),
    __metadata("design:type", String)
], SyncElasticEntityUser.prototype, "eIsEnabledForSearch", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        nullable: true,
        enum: STATUS,
        default: STATUS.ACTIVE,
    }),
    __metadata("design:type", String)
], SyncElasticEntityUser.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], SyncElasticEntityUser.prototype, "addedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], SyncElasticEntityUser.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], SyncElasticEntityUser.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], SyncElasticEntityUser.prototype, "createdAt", void 0);
exports.SyncElasticEntityUser = SyncElasticEntityUser = __decorate([
    (0, typeorm_1.Entity)('sync_elastic_entity_user')
], SyncElasticEntityUser);
//# sourceMappingURL=elastic_sync.entity.js.map