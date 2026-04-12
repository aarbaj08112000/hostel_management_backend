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
exports.CountryEntity = void 0;
const typeorm_1 = require("typeorm");
var STATUS;
(function (STATUS) {
    STATUS["ACTIVE"] = "Active";
    STATUS["INACTIVE"] = "Inactive";
})(STATUS || (STATUS = {}));
let CountryEntity = class CountryEntity {
    id;
    country;
    countryCode;
    countryCodeISO3;
    countryFlag;
    dialCode;
    description;
    status;
    createdAt;
    updatedAt;
};
exports.CountryEntity = CountryEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], CountryEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CountryEntity.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char' }),
    __metadata("design:type", String)
], CountryEntity.prototype, "countryCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', nullable: true }),
    __metadata("design:type", String)
], CountryEntity.prototype, "countryCodeISO3", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], CountryEntity.prototype, "countryFlag", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 10 }),
    __metadata("design:type", String)
], CountryEntity.prototype, "dialCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CountryEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', nullable: true, enum: STATUS }),
    __metadata("design:type", String)
], CountryEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], CountryEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], CountryEntity.prototype, "updatedAt", void 0);
exports.CountryEntity = CountryEntity = __decorate([
    (0, typeorm_1.Entity)('mod_country')
], CountryEntity);
//# sourceMappingURL=country.entity.js.map