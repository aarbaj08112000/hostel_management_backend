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
exports.AdminMenuEntity = void 0;
const typeorm_1 = require("typeorm");
var OPEN;
(function (OPEN) {
    OPEN["SAME"] = "same";
    OPEN["NEW"] = "new";
    OPEN["POPUP_IFRAME"] = "popup_iframe";
    OPEN["POPUP_AJAX"] = "popup_ajax";
})(OPEN || (OPEN = {}));
var MENU_TYPE;
(function (MENU_TYPE) {
    MENU_TYPE["CUSTOM"] = "Custom";
    MENU_TYPE["MODULE"] = "Module";
    MENU_TYPE["DASHBOARD"] = "Dashboard";
})(MENU_TYPE || (MENU_TYPE = {}));
var STATUS;
(function (STATUS) {
    STATUS["ACTIVE"] = "Active";
    STATUS["INACTIVE"] = "Inactive";
    STATUS["HIDDEN"] = "Hidden";
})(STATUS || (STATUS = {}));
let AdminMenuEntity = class AdminMenuEntity {
    id;
    parentId;
    menuDisplay;
    icon;
    url;
    open;
    menuType;
    capabilityId;
    capabilityCode;
    moduleName;
    dashBoardPage;
    uniqueMenuCode;
    columnNumber;
    sequenceOrder;
    status;
    createdAt;
    updatedAt;
};
exports.AdminMenuEntity = AdminMenuEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], AdminMenuEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AdminMenuEntity.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AdminMenuEntity.prototype, "menuDisplay", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], AdminMenuEntity.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], AdminMenuEntity.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', nullable: true, enum: OPEN, default: OPEN.SAME }),
    __metadata("design:type", String)
], AdminMenuEntity.prototype, "open", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        nullable: true,
        enum: MENU_TYPE,
        default: MENU_TYPE.MODULE,
    }),
    __metadata("design:type", String)
], AdminMenuEntity.prototype, "menuType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AdminMenuEntity.prototype, "capabilityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], AdminMenuEntity.prototype, "capabilityCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], AdminMenuEntity.prototype, "moduleName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], AdminMenuEntity.prototype, "dashBoardPage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 500 }),
    __metadata("design:type", String)
], AdminMenuEntity.prototype, "uniqueMenuCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, default: '1' }),
    __metadata("design:type", Number)
], AdminMenuEntity.prototype, "columnNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, default: '1' }),
    __metadata("design:type", Number)
], AdminMenuEntity.prototype, "sequenceOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', nullable: true, enum: STATUS }),
    __metadata("design:type", String)
], AdminMenuEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AdminMenuEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], AdminMenuEntity.prototype, "updatedAt", void 0);
exports.AdminMenuEntity = AdminMenuEntity = __decorate([
    (0, typeorm_1.Entity)('mod_admin_menu')
], AdminMenuEntity);
//# sourceMappingURL=admin-menu.entity.js.map