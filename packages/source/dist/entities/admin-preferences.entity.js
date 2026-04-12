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
exports.AdminPreferencesEntity = void 0;
const typeorm_1 = require("typeorm");
var REC_TYPE;
(function (REC_TYPE) {
    REC_TYPE["GLOBAL"] = "Global";
    REC_TYPE["GROUP"] = "Group";
    REC_TYPE["USER"] = "User";
})(REC_TYPE || (REC_TYPE = {}));
var IS_DEFAULT;
(function (IS_DEFAULT) {
    IS_DEFAULT["YES"] = "Yes";
    IS_DEFAULT["NO"] = "No";
})(IS_DEFAULT || (IS_DEFAULT = {}));
let AdminPreferencesEntity = class AdminPreferencesEntity {
    id;
    adminId;
    groupId;
    module;
    name;
    slug;
    configuration;
    recType;
    isDefault;
    adminMenuId;
    comments;
    createdAt;
    updatedAt;
    deletedAt;
};
exports.AdminPreferencesEntity = AdminPreferencesEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], AdminPreferencesEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, default: '0' }),
    __metadata("design:type", Number)
], AdminPreferencesEntity.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, default: '0' }),
    __metadata("design:type", Number)
], AdminPreferencesEntity.prototype, "groupId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], AdminPreferencesEntity.prototype, "module", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], AdminPreferencesEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], AdminPreferencesEntity.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AdminPreferencesEntity.prototype, "configuration", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        nullable: true,
        enum: REC_TYPE,
        default: REC_TYPE.USER,
    }),
    __metadata("design:type", String)
], AdminPreferencesEntity.prototype, "recType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        nullable: true,
        enum: IS_DEFAULT,
        default: IS_DEFAULT.NO,
    }),
    __metadata("design:type", String)
], AdminPreferencesEntity.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, default: '0' }),
    __metadata("design:type", Number)
], AdminPreferencesEntity.prototype, "adminMenuId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AdminPreferencesEntity.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], AdminPreferencesEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], AdminPreferencesEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], AdminPreferencesEntity.prototype, "deletedAt", void 0);
exports.AdminPreferencesEntity = AdminPreferencesEntity = __decorate([
    (0, typeorm_1.Entity)('mod_admin_preferences')
], AdminPreferencesEntity);
//# sourceMappingURL=admin-preferences.entity.js.map