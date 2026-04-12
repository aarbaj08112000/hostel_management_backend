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
exports.BrandEntity = void 0;
const typeorm_1 = require("typeorm");
const base_user_entity_1 = require("./base-user.entity");
var STATUS;
(function (STATUS) {
    STATUS["ACTIVE"] = "Active";
    STATUS["INACTIVE"] = "Inactive";
})(STATUS || (STATUS = {}));
let BrandEntity = class BrandEntity extends base_user_entity_1.UserBase {
    brandId;
    brandName;
    brandCode;
    status;
    brandImage;
};
exports.BrandEntity = BrandEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], BrandEntity.prototype, "brandId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], BrandEntity.prototype, "brandName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', unique: true }),
    __metadata("design:type", String)
], BrandEntity.prototype, "brandCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', nullable: true, enum: STATUS }),
    __metadata("design:type", String)
], BrandEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], BrandEntity.prototype, "brandImage", void 0);
exports.BrandEntity = BrandEntity = __decorate([
    (0, typeorm_1.Entity)('brand')
], BrandEntity);
//# sourceMappingURL=brand.entity.js.map