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
exports.LogHistoryEntity = void 0;
const typeorm_1 = require("typeorm");
var USER_TYPE;
(function (USER_TYPE) {
    USER_TYPE["ADMIN"] = "Admin";
    USER_TYPE["FRONT"] = "Front";
})(USER_TYPE || (USER_TYPE = {}));
let LogHistoryEntity = class LogHistoryEntity {
    id;
    userId;
    userType;
    ip;
    loginDate;
    logoutDate;
    lastAccess;
    createdAt;
    updatedAt;
};
exports.LogHistoryEntity = LogHistoryEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], LogHistoryEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], LogHistoryEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', nullable: true, enum: USER_TYPE }),
    __metadata("design:type", String)
], LogHistoryEntity.prototype, "userType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 50 }),
    __metadata("design:type", String)
], LogHistoryEntity.prototype, "ip", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], LogHistoryEntity.prototype, "loginDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], LogHistoryEntity.prototype, "logoutDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], LogHistoryEntity.prototype, "lastAccess", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], LogHistoryEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], LogHistoryEntity.prototype, "updatedAt", void 0);
exports.LogHistoryEntity = LogHistoryEntity = __decorate([
    (0, typeorm_1.Entity)('mod_log_history')
], LogHistoryEntity);
//# sourceMappingURL=log-history.entity.js.map