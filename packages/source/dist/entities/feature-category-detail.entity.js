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
exports.FeatureCategoryEntity = void 0;
const typeorm_1 = require("typeorm");
const base_user_entity_1 = require("./base-user.entity");
var STATUS;
(function (STATUS) {
    STATUS["ACTIVE"] = "Active";
    STATUS["INACTIVE"] = "Inactive";
})(STATUS || (STATUS = {}));
let FeatureCategoryEntity = class FeatureCategoryEntity extends base_user_entity_1.UserBase {
    featureCategoryId;
    featureCategoryName;
    featureCategoryCode;
    status;
};
exports.FeatureCategoryEntity = FeatureCategoryEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int' }),
    __metadata("design:type", Number)
], FeatureCategoryEntity.prototype, "featureCategoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], FeatureCategoryEntity.prototype, "featureCategoryName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], FeatureCategoryEntity.prototype, "featureCategoryCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: STATUS }),
    __metadata("design:type", String)
], FeatureCategoryEntity.prototype, "status", void 0);
exports.FeatureCategoryEntity = FeatureCategoryEntity = __decorate([
    (0, typeorm_1.Entity)('feature_category')
], FeatureCategoryEntity);
//# sourceMappingURL=feature-category-detail.entity.js.map