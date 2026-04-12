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
exports.BookingCharges = exports.BookingService = exports.Booking = void 0;
const typeorm_1 = require("typeorm");
var STATUS;
(function (STATUS) {
    STATUS["BOOKED"] = "booked";
    STATUS["PENDING"] = "pending";
    STATUS["DRAFT"] = "draft";
    STATUS["INPROGRESS"] = "inprogress";
})(STATUS || (STATUS = {}));
let Booking = class Booking {
    bookingId;
    bookingCode;
    customerId;
    paymentId;
    paymentType;
    carId;
    source;
    remarks;
    status;
    totalPrice;
    discountPrice;
    locationId;
    addedDate;
    updatedDate;
    addedBy;
    updatedBy;
};
exports.Booking = Booking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], Booking.prototype, "bookingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Booking.prototype, "bookingCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Booking.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Booking.prototype, "paymentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['full', 'partial'] }),
    __metadata("design:type", String)
], Booking.prototype, "paymentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Booking.prototype, "carId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['admin', 'front'] }),
    __metadata("design:type", String)
], Booking.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: STATUS }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Booking.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Booking.prototype, "discountPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Booking.prototype, "locationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Booking.prototype, "addedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Booking.prototype, "updatedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Booking.prototype, "addedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Booking.prototype, "updatedBy", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)('bookings')
], Booking);
(function (STATUS) {
    STATUS["ACTIVE"] = "Active";
    STATUS["INACTIVE"] = "Inactive";
})(STATUS || (STATUS = {}));
let BookingService = class BookingService {
    bookingServiceId;
    serviceId;
    bookingId;
    addedDate;
    updatedDate;
    addedBy;
    updatedBy;
    status;
};
exports.BookingService = BookingService;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], BookingService.prototype, "bookingServiceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], BookingService.prototype, "serviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], BookingService.prototype, "bookingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], BookingService.prototype, "addedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], BookingService.prototype, "updatedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], BookingService.prototype, "addedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], BookingService.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: STATUS, default: STATUS.ACTIVE }),
    __metadata("design:type", String)
], BookingService.prototype, "status", void 0);
exports.BookingService = BookingService = __decorate([
    (0, typeorm_1.Entity)('booking_service')
], BookingService);
var CHARGES_TYPE;
(function (CHARGES_TYPE) {
    CHARGES_TYPE["FIXED"] = "fixed";
    CHARGES_TYPE["VARIABLE"] = "variable";
})(CHARGES_TYPE || (CHARGES_TYPE = {}));
let BookingCharges = class BookingCharges {
    bookingChargesId;
    bookingId;
    chargesId;
    chargesType;
    addedDate;
    updatedDate;
};
exports.BookingCharges = BookingCharges;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], BookingCharges.prototype, "bookingChargesId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], BookingCharges.prototype, "bookingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], BookingCharges.prototype, "chargesId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CHARGES_TYPE }),
    __metadata("design:type", String)
], BookingCharges.prototype, "chargesType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], BookingCharges.prototype, "addedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], BookingCharges.prototype, "updatedDate", void 0);
exports.BookingCharges = BookingCharges = __decorate([
    (0, typeorm_1.Entity)('booking_charges')
], BookingCharges);
//# sourceMappingURL=booking.entity.js.map