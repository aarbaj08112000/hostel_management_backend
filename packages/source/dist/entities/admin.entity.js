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
exports.AdminEntity = exports.STATUS = void 0;
const typeorm_1 = require("typeorm");
var IS_EMAIL_VERIFIED;
(function (IS_EMAIL_VERIFIED) {
    IS_EMAIL_VERIFIED["YES"] = "Yes";
    IS_EMAIL_VERIFIED["NO"] = "No";
})(IS_EMAIL_VERIFIED || (IS_EMAIL_VERIFIED = {}));
var IS_TEMPORARY_PASSWORD;
(function (IS_TEMPORARY_PASSWORD) {
    IS_TEMPORARY_PASSWORD["YES"] = "Yes";
    IS_TEMPORARY_PASSWORD["NO"] = "No";
})(IS_TEMPORARY_PASSWORD || (IS_TEMPORARY_PASSWORD = {}));
var STATUS;
(function (STATUS) {
    STATUS["ACTIVE"] = "Active";
    STATUS["INACTIVE"] = "Inactive";
})(STATUS || (exports.STATUS = STATUS = {}));
let AdminEntity = class AdminEntity {
    id;
    name;
    email;
    username;
    password;
    dialCode;
    phoneNumber;
    groupId;
    authType;
    authCode;
    otpCode;
    isEmailVerified;
    verificationCode;
    isTemporaryPassword;
    passwordExpiredOn;
    loginFailedAttempts;
    loginLockedUntil;
    lastLoginAt;
    status;
    createdAt;
    updatedAt;
};
exports.AdminEntity = AdminEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], AdminEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AdminEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AdminEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AdminEntity.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], AdminEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 10 }),
    __metadata("design:type", String)
], AdminEntity.prototype, "dialCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 20 }),
    __metadata("design:type", String)
], AdminEntity.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AdminEntity.prototype, "groupId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'set', nullable: true }),
    __metadata("design:type", Array)
], AdminEntity.prototype, "authType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], AdminEntity.prototype, "authCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 10 }),
    __metadata("design:type", String)
], AdminEntity.prototype, "otpCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        nullable: true,
        enum: IS_EMAIL_VERIFIED,
        default: IS_EMAIL_VERIFIED.NO,
    }),
    __metadata("design:type", String)
], AdminEntity.prototype, "isEmailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 10 }),
    __metadata("design:type", String)
], AdminEntity.prototype, "verificationCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: IS_TEMPORARY_PASSWORD,
        default: IS_TEMPORARY_PASSWORD.NO,
    }),
    __metadata("design:type", String)
], AdminEntity.prototype, "isTemporaryPassword", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], AdminEntity.prototype, "passwordExpiredOn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AdminEntity.prototype, "loginFailedAttempts", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], AdminEntity.prototype, "loginLockedUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], AdminEntity.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: STATUS, default: STATUS.ACTIVE }),
    __metadata("design:type", String)
], AdminEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AdminEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], AdminEntity.prototype, "updatedAt", void 0);
exports.AdminEntity = AdminEntity = __decorate([
    (0, typeorm_1.Entity)('mod_admin')
], AdminEntity);
//# sourceMappingURL=admin.entity.js.map