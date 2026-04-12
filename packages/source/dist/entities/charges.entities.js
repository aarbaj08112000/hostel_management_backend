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
exports.Charges = void 0;
const typeorm_1 = require("typeorm");
let Charges = class Charges extends typeorm_1.BaseEntity {
    chargesId;
    chargeName;
    chargeAmount;
    chargeType;
    addedDate;
    updatedDate;
};
exports.Charges = Charges;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], Charges.prototype, "chargesId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Charges.prototype, "chargeName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Charges.prototype, "chargeAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['fixed', 'variable'] }),
    __metadata("design:type", String)
], Charges.prototype, "chargeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Charges.prototype, "addedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Charges.prototype, "updatedDate", void 0);
exports.Charges = Charges = __decorate([
    (0, typeorm_1.Entity)('charges')
], Charges);
//# sourceMappingURL=charges.entities.js.map