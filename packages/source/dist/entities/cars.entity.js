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
exports.CarDocumentEntity = exports.CarFeatureEntity = exports.CarTagEntity = exports.CarHistoryEntity = exports.CarEntity = void 0;
const typeorm_1 = require("typeorm");
const base_user_entity_1 = require("./base-user.entity");
var Negotiable;
(function (Negotiable) {
    Negotiable["Yes"] = "Yes";
    Negotiable["No"] = "No";
})(Negotiable || (Negotiable = {}));
var NegotiableRange;
(function (NegotiableRange) {
    NegotiableRange["High"] = "High";
    NegotiableRange["Medium"] = "Medium";
    NegotiableRange["Low"] = "Low";
})(NegotiableRange || (NegotiableRange = {}));
var CarCondition;
(function (CarCondition) {
    CarCondition["Excellent"] = "Excellent";
    CarCondition["Good"] = "Good";
    CarCondition["Satisfactory"] = "Satisfactory";
})(CarCondition || (CarCondition = {}));
var Status;
(function (Status) {
    Status["Active"] = "Active";
    Status["Inactive"] = "Inactive";
    Status["Booked"] = "Booked";
    Status["Sold"] = "Sold";
    Status["Draft"] = "Draft";
})(Status || (Status = {}));
var YesNo;
(function (YesNo) {
    YesNo["Yes"] = "Yes";
    YesNo["No"] = "No";
})(YesNo || (YesNo = {}));
let CarEntity = class CarEntity extends base_user_entity_1.UserBase {
    carId;
    carName;
    carDescription;
    price;
    negotiable;
    negotiableRange;
    carCondition;
    monthlyEMIAmount;
    slug;
    carImage;
    remarks;
    status;
    shortDescription;
    contactDetails;
    overviewTitle;
    isListed;
    carCode;
};
exports.CarEntity = CarEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], CarEntity.prototype, "carId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CarEntity.prototype, "carName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CarEntity.prototype, "carDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], CarEntity.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Negotiable }),
    __metadata("design:type", String)
], CarEntity.prototype, "negotiable", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: NegotiableRange }),
    __metadata("design:type", String)
], CarEntity.prototype, "negotiableRange", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CarCondition }),
    __metadata("design:type", String)
], CarEntity.prototype, "carCondition", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], CarEntity.prototype, "monthlyEMIAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CarEntity.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CarEntity.prototype, "carImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CarEntity.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Status, default: Status.Active }),
    __metadata("design:type", String)
], CarEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext', nullable: true }),
    __metadata("design:type", String)
], CarEntity.prototype, "shortDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CarEntity.prototype, "contactDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CarEntity.prototype, "overviewTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: YesNo, default: YesNo.Yes }),
    __metadata("design:type", String)
], CarEntity.prototype, "isListed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CarEntity.prototype, "carCode", void 0);
exports.CarEntity = CarEntity = __decorate([
    (0, typeorm_1.Entity)('cars')
], CarEntity);
var InsuranceType;
(function (InsuranceType) {
    InsuranceType["ThirdParty"] = "ThirdParty";
    InsuranceType["Comprehensible"] = "Comprehensible";
    InsuranceType["NotAvailable"] = "NotAvailable";
})(InsuranceType || (InsuranceType = {}));
var accidentalHistory;
(function (accidentalHistory) {
    accidentalHistory["no_accidental_history"] = "no_accidental_history";
    accidentalHistory["minor_wear_tear"] = "minor_wear_tear";
})(accidentalHistory || (accidentalHistory = {}));
let CarHistoryEntity = class CarHistoryEntity extends base_user_entity_1.UserBase {
    carHistoryId;
    carId;
    registrationNumber;
    registrationDate;
    registrationExpiry;
    locationId;
    insuranceType;
    insuranceExpiry;
    accidentHistory;
    insuranceProvideId;
    insurancePolicyNumber;
    isColetral;
    coletralWith;
    accidentalHistory;
    afterMarketModification;
};
exports.CarHistoryEntity = CarHistoryEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], CarHistoryEntity.prototype, "carHistoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], CarHistoryEntity.prototype, "carId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CarHistoryEntity.prototype, "registrationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], CarHistoryEntity.prototype, "registrationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], CarHistoryEntity.prototype, "registrationExpiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], CarHistoryEntity.prototype, "locationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: InsuranceType }),
    __metadata("design:type", String)
], CarHistoryEntity.prototype, "insuranceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], CarHistoryEntity.prototype, "insuranceExpiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: YesNo }),
    __metadata("design:type", String)
], CarHistoryEntity.prototype, "accidentHistory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true, nullable: true }),
    __metadata("design:type", Number)
], CarHistoryEntity.prototype, "insuranceProvideId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CarHistoryEntity.prototype, "insurancePolicyNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: YesNo }),
    __metadata("design:type", String)
], CarHistoryEntity.prototype, "isColetral", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CarHistoryEntity.prototype, "coletralWith", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: accidentalHistory }),
    __metadata("design:type", String)
], CarHistoryEntity.prototype, "accidentalHistory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: YesNo }),
    __metadata("design:type", String)
], CarHistoryEntity.prototype, "afterMarketModification", void 0);
exports.CarHistoryEntity = CarHistoryEntity = __decorate([
    (0, typeorm_1.Entity)('car_history')
], CarHistoryEntity);
let CarTagEntity = class CarTagEntity extends base_user_entity_1.UserBase {
    carTagId;
    tagId;
    carId;
};
exports.CarTagEntity = CarTagEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], CarTagEntity.prototype, "carTagId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CarTagEntity.prototype, "tagId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CarTagEntity.prototype, "carId", void 0);
exports.CarTagEntity = CarTagEntity = __decorate([
    (0, typeorm_1.Entity)('car_tags')
], CarTagEntity);
let CarFeatureEntity = class CarFeatureEntity extends base_user_entity_1.UserBase {
    carFeatureId;
    featureId;
    carId;
    featureValue;
};
exports.CarFeatureEntity = CarFeatureEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], CarFeatureEntity.prototype, "carFeatureId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CarFeatureEntity.prototype, "featureId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CarFeatureEntity.prototype, "carId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], CarFeatureEntity.prototype, "featureValue", void 0);
exports.CarFeatureEntity = CarFeatureEntity = __decorate([
    (0, typeorm_1.Entity)('car_feature')
], CarFeatureEntity);
let CarDocumentEntity = class CarDocumentEntity extends base_user_entity_1.UserBase {
    carDocumentId;
    carId;
    documentTitle;
    documentTypeId;
};
exports.CarDocumentEntity = CarDocumentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CarDocumentEntity.prototype, "carDocumentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CarDocumentEntity.prototype, "carId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CarDocumentEntity.prototype, "documentTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", String)
], CarDocumentEntity.prototype, "documentTypeId", void 0);
exports.CarDocumentEntity = CarDocumentEntity = __decorate([
    (0, typeorm_1.Entity)('car_documents')
], CarDocumentEntity);
//# sourceMappingURL=cars.entity.js.map