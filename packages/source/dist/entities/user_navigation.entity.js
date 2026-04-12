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
exports.UserNavigationEntity = void 0;
const typeorm_1 = require("typeorm");
var navigationType;
(function (navigationType) {
    navigationType["front"] = "front";
    navigationType["admin"] = "admin";
})(navigationType || (navigationType = {}));
let UserNavigationEntity = class UserNavigationEntity {
    navigationId;
    visitorId;
    params;
    navigationType;
};
exports.UserNavigationEntity = UserNavigationEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], UserNavigationEntity.prototype, "navigationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], UserNavigationEntity.prototype, "visitorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext' }),
    __metadata("design:type", String)
], UserNavigationEntity.prototype, "params", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', nullable: true, enum: navigationType }),
    __metadata("design:type", String)
], UserNavigationEntity.prototype, "navigationType", void 0);
exports.UserNavigationEntity = UserNavigationEntity = __decorate([
    (0, typeorm_1.Entity)('user_navigation')
], UserNavigationEntity);
//# sourceMappingURL=user_navigation.entity.js.map