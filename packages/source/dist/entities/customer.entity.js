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
exports.CustomerEntity = exports.STATUS = void 0;
const typeorm_1 = require("typeorm");
var IS_MOBILE_VERIFIED;
(function (IS_MOBILE_VERIFIED) {
    IS_MOBILE_VERIFIED["YES"] = "Yes";
    IS_MOBILE_VERIFIED["NO"] = "No";
})(IS_MOBILE_VERIFIED || (IS_MOBILE_VERIFIED = {}));
var IS_EMAIL_VERIFIED;
(function (IS_EMAIL_VERIFIED) {
    IS_EMAIL_VERIFIED["YES"] = "Yes";
    IS_EMAIL_VERIFIED["NO"] = "No";
})(IS_EMAIL_VERIFIED || (IS_EMAIL_VERIFIED = {}));
var STATUS;
(function (STATUS) {
    STATUS["ACTIVE"] = "Active";
    STATUS["INACTIVE"] = "Inactive";
})(STATUS || (exports.STATUS = STATUS = {}));
let CustomerEntity = class CustomerEntity {
    id;
    firstName;
    middleName;
    lastName;
    dob;
    email;
    password;
    dialCode;
    phoneNumber;
    altDialCode;
    altPhoneNumber;
    profileImage;
    authType;
    authCode;
    isMobileVerified;
    uniqueToken;
    otpCode;
    isEmailVerified;
    verificationCode;
    latitude;
    langitude;
    appVersion;
    deviceName;
    deviceOs;
    deviceType;
    deviceToken;
    lastLoginAt;
    status;
    createdAt;
    updatedAt;
};
exports.CustomerEntity = CustomerEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], CustomerEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "middleName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], CustomerEntity.prototype, "dob", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 500 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 10 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "dialCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 20 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 10 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "altDialCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 20 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "altPhoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "profileImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'set', nullable: true }),
    __metadata("design:type", Array)
], CustomerEntity.prototype, "authType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "authCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        nullable: true,
        enum: IS_MOBILE_VERIFIED,
        default: IS_MOBILE_VERIFIED.NO,
    }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "isMobileVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "uniqueToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 10 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "otpCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        nullable: true,
        enum: IS_EMAIL_VERIFIED,
        default: IS_EMAIL_VERIFIED.NO,
    }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "isEmailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "verificationCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double', nullable: true }),
    __metadata("design:type", Number)
], CustomerEntity.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double', nullable: true }),
    __metadata("design:type", Number)
], CustomerEntity.prototype, "langitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 20 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "appVersion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 50 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "deviceName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 50 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "deviceOs", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 50 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "deviceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "deviceToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], CustomerEntity.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        nullable: true,
        enum: STATUS,
        default: STATUS.ACTIVE,
    }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], CustomerEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], CustomerEntity.prototype, "updatedAt", void 0);
exports.CustomerEntity = CustomerEntity = __decorate([
    (0, typeorm_1.Entity)('mod_customer')
], CustomerEntity);
//# sourceMappingURL=customer.entity.js.map