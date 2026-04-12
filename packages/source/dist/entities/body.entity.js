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
exports.BodyEntity = void 0;
const typeorm_1 = require("typeorm");
const base_user_entity_1 = require("./base-user.entity");
var STATUS;
(function (STATUS) {
    STATUS["ACTIVE"] = "Active";
    STATUS["INACTIVE"] = "Inactive";
})(STATUS || (STATUS = {}));
let BodyEntity = class BodyEntity extends base_user_entity_1.UserBase {
    bodyTypeId;
    bodyType;
    bodyCode;
    status;
};
exports.BodyEntity = BodyEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], BodyEntity.prototype, "bodyTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], BodyEntity.prototype, "bodyType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', unique: true }),
    __metadata("design:type", String)
], BodyEntity.prototype, "bodyCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', nullable: true, enum: STATUS }),
    __metadata("design:type", String)
], BodyEntity.prototype, "status", void 0);
exports.BodyEntity = BodyEntity = __decorate([
    (0, typeorm_1.Entity)('body_type')
], BodyEntity);
//# sourceMappingURL=body.entity.js.map