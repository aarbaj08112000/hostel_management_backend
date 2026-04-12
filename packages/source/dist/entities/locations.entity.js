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
exports.LocationsEntity = void 0;
const typeorm_1 = require("typeorm");
const base_user_entity_1 = require("./base-user.entity");
var STATUS;
(function (STATUS) {
    STATUS["ACTIVE"] = "Active";
    STATUS["INACTIVE"] = "Inactive";
})(STATUS || (STATUS = {}));
var LOCATIONTYPE;
(function (LOCATIONTYPE) {
    LOCATIONTYPE["Showroom"] = "Showroom";
    LOCATIONTYPE["StockYard"] = "StockYard";
})(LOCATIONTYPE || (LOCATIONTYPE = {}));
let LocationsEntity = class LocationsEntity extends base_user_entity_1.UserBase {
    locationId;
    locationName;
    locationCode;
    zipCode;
    address;
    cityId;
    stateId;
    countryId;
    latitude;
    longitude;
    status;
    locationType;
    googleAddress;
};
exports.LocationsEntity = LocationsEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], LocationsEntity.prototype, "locationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], LocationsEntity.prototype, "locationName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', unique: true }),
    __metadata("design:type", String)
], LocationsEntity.prototype, "locationCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], LocationsEntity.prototype, "zipCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], LocationsEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", String)
], LocationsEntity.prototype, "cityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", String)
], LocationsEntity.prototype, "stateId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", String)
], LocationsEntity.prototype, "countryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], LocationsEntity.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], LocationsEntity.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', nullable: true, enum: STATUS }),
    __metadata("design:type", String)
], LocationsEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', nullable: true, enum: LOCATIONTYPE }),
    __metadata("design:type", String)
], LocationsEntity.prototype, "locationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], LocationsEntity.prototype, "googleAddress", void 0);
exports.LocationsEntity = LocationsEntity = __decorate([
    (0, typeorm_1.Entity)('locations')
], LocationsEntity);
//# sourceMappingURL=locations.entity.js.map