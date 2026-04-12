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
exports.FormDraftsEntity = void 0;
const typeorm_1 = require("typeorm");
var REC_MODE;
(function (REC_MODE) {
    REC_MODE["ADD"] = "Add";
    REC_MODE["UPDATE"] = "Update";
})(REC_MODE || (REC_MODE = {}));
var REC_TYPE;
(function (REC_TYPE) {
    REC_TYPE["GLOBAL"] = "Global";
    REC_TYPE["GROUP"] = "Group";
    REC_TYPE["USER"] = "User";
})(REC_TYPE || (REC_TYPE = {}));
var STATUS;
(function (STATUS) {
    STATUS["ACTIVE"] = "Active";
    STATUS["INACTIVE"] = "Inactive";
    STATUS["CLOSED"] = "Closed";
})(STATUS || (STATUS = {}));
let FormDraftsEntity = class FormDraftsEntity {
    id;
    createdAt;
    updatedAt;
    adminId;
    groupId;
    module;
    recMode;
    recId;
    formData;
    recType;
    status;
    deletedAt;
};
exports.FormDraftsEntity = FormDraftsEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], FormDraftsEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], FormDraftsEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], FormDraftsEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], FormDraftsEntity.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], FormDraftsEntity.prototype, "groupId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], FormDraftsEntity.prototype, "module", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', nullable: true, enum: REC_MODE }),
    __metadata("design:type", String)
], FormDraftsEntity.prototype, "recMode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], FormDraftsEntity.prototype, "recId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext', nullable: true }),
    __metadata("design:type", String)
], FormDraftsEntity.prototype, "formData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', nullable: true, enum: REC_TYPE }),
    __metadata("design:type", String)
], FormDraftsEntity.prototype, "recType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', nullable: true, enum: STATUS }),
    __metadata("design:type", String)
], FormDraftsEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], FormDraftsEntity.prototype, "deletedAt", void 0);
exports.FormDraftsEntity = FormDraftsEntity = __decorate([
    (0, typeorm_1.Entity)('mod_form_drafts')
], FormDraftsEntity);
//# sourceMappingURL=form-drafts.entity.js.map