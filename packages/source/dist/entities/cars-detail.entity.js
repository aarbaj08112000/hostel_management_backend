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
exports.CarDetailsEntity = void 0;
const typeorm_1 = require("typeorm");
const base_user_entity_1 = require("./base-user.entity");
var BodyType;
(function (BodyType) {
    BodyType["Sedan"] = "Sedan";
    BodyType["Suv"] = "Suv";
    BodyType["Convertible"] = "Convertible";
    BodyType["Coupe"] = "Coupe";
    BodyType["Wagon"] = "Wagon";
})(BodyType || (BodyType = {}));
var FuelType;
(function (FuelType) {
    FuelType["Petrol"] = "Petrol";
    FuelType["Diesel"] = "Diesel";
    FuelType["Hybrid"] = "Hybrid";
    FuelType["Electric"] = "Electric";
})(FuelType || (FuelType = {}));
var TransmissionType;
(function (TransmissionType) {
    TransmissionType["Manual"] = "Manual";
    TransmissionType["Automatic"] = "Automatic";
})(TransmissionType || (TransmissionType = {}));
var CarCategory;
(function (CarCategory) {
    CarCategory["ICE"] = "ICE";
    CarCategory["EV"] = "EV";
    CarCategory["HEV"] = "HEV";
    CarCategory["PHEV"] = "PHEV";
})(CarCategory || (CarCategory = {}));
var SteeringSide;
(function (SteeringSide) {
    SteeringSide["LeftHand"] = "LeftHand";
    SteeringSide["RightHand"] = "RightHand";
})(SteeringSide || (SteeringSide = {}));
var YesNo;
(function (YesNo) {
    YesNo["Yes"] = "Yes";
    YesNo["No"] = "No";
})(YesNo || (YesNo = {}));
let CarDetailsEntity = class CarDetailsEntity extends base_user_entity_1.UserBase {
    carsDetailsId;
    carId;
    vinNumber;
    chassisNumber;
    brandId;
    modelId;
    bodyTypeid;
    fuelType;
    manufactureYear;
    manufactureMonth;
    serialNumber;
    countryId;
    transmissionType;
    carCategory;
    engineCapacity;
    engineType;
    engineSize;
    horsePower;
    exteriorColorId;
    interiorColorId;
    steeringSide;
    regionalSpecsId;
    drivenDistance;
    serviceHistory;
    warranty;
    ownerNumber;
    seatingCapacity;
    numberOfDoors;
    variantId;
};
exports.CarDetailsEntity = CarDetailsEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int' }),
    __metadata("design:type", Number)
], CarDetailsEntity.prototype, "carsDetailsId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CarDetailsEntity.prototype, "carId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CarDetailsEntity.prototype, "vinNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CarDetailsEntity.prototype, "chassisNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CarDetailsEntity.prototype, "brandId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CarDetailsEntity.prototype, "modelId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CarDetailsEntity.prototype, "bodyTypeid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: FuelType }),
    __metadata("design:type", String)
], CarDetailsEntity.prototype, "fuelType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'year' }),
    __metadata("design:type", Number)
], CarDetailsEntity.prototype, "manufactureYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CarDetailsEntity.prototype, "manufactureMonth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CarDetailsEntity.prototype, "serialNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CarDetailsEntity.prototype, "countryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TransmissionType }),
    __metadata("design:type", String)
], CarDetailsEntity.prototype, "transmissionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CarCategory }),
    __metadata("design:type", String)
], CarDetailsEntity.prototype, "carCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double' }),
    __metadata("design:type", Number)
], CarDetailsEntity.prototype, "engineCapacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CarDetailsEntity.prototype, "engineType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CarDetailsEntity.prototype, "engineSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CarDetailsEntity.prototype, "horsePower", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CarDetailsEntity.prototype, "exteriorColorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CarDetailsEntity.prototype, "interiorColorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SteeringSide }),
    __metadata("design:type", String)
], CarDetailsEntity.prototype, "steeringSide", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CarDetailsEntity.prototype, "regionalSpecsId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double' }),
    __metadata("design:type", Number)
], CarDetailsEntity.prototype, "drivenDistance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: YesNo }),
    __metadata("design:type", String)
], CarDetailsEntity.prototype, "serviceHistory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: YesNo }),
    __metadata("design:type", String)
], CarDetailsEntity.prototype, "warranty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CarDetailsEntity.prototype, "ownerNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CarDetailsEntity.prototype, "seatingCapacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CarDetailsEntity.prototype, "numberOfDoors", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CarDetailsEntity.prototype, "variantId", void 0);
exports.CarDetailsEntity = CarDetailsEntity = __decorate([
    (0, typeorm_1.Entity)('cars_details')
], CarDetailsEntity);
//# sourceMappingURL=cars-detail.entity.js.map