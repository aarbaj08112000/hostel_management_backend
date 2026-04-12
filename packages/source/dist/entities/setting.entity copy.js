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
exports.SettingEntity = void 0;
const typeorm_1 = require("typeorm");
var CONFIG_TYPE;
(function (CONFIG_TYPE) {
    CONFIG_TYPE["COMPANY"] = "Company";
    CONFIG_TYPE["APPEARANCE"] = "Appearance";
    CONFIG_TYPE["PREFERENCES"] = "Preferences";
    CONFIG_TYPE["EMAIL"] = "Email";
    CONFIG_TYPE["SMS"] = "SMS";
    CONFIG_TYPE["PUSHNOTIFY"] = "PushNotify";
    CONFIG_TYPE["CONFIG"] = "Config";
    CONFIG_TYPE["FORMATS"] = "Formats";
    CONFIG_TYPE["AUTHENTICATE"] = "Authenticate";
    CONFIG_TYPE["META"] = "Meta";
})(CONFIG_TYPE || (CONFIG_TYPE = {}));
var DISPLAY_TYPE;
(function (DISPLAY_TYPE) {
    DISPLAY_TYPE["TEXT"] = "text";
    DISPLAY_TYPE["SELECTBOX"] = "selectbox";
    DISPLAY_TYPE["TEXTAREA"] = "textarea";
    DISPLAY_TYPE["CHECKBOX"] = "checkbox";
    DISPLAY_TYPE["RADIO"] = "radio";
    DISPLAY_TYPE["HIDDEN"] = "hidden";
    DISPLAY_TYPE["EDITOR"] = "editor";
    DISPLAY_TYPE["FILE"] = "file";
    DISPLAY_TYPE["READONLY"] = "readonly";
    DISPLAY_TYPE["PASSWORD"] = "password";
})(DISPLAY_TYPE || (DISPLAY_TYPE = {}));
var SOURCE;
(function (SOURCE) {
    SOURCE["LIST"] = "List";
    SOURCE["QUERY"] = "Query";
    SOURCE["VALUE"] = "Value";
    SOURCE["PERCENT"] = "Percent";
    SOURCE["FUNCTION"] = "Function";
    SOURCE["NOIMAGE"] = "NoImage";
})(SOURCE || (SOURCE = {}));
var SELECT_TYPE;
(function (SELECT_TYPE) {
    SELECT_TYPE["SINGLE"] = "Single";
    SELECT_TYPE["MULTIPLE"] = "Multiple";
    SELECT_TYPE["PLUS"] = "Plus";
    SELECT_TYPE["MINUS"] = "Minus";
})(SELECT_TYPE || (SELECT_TYPE = {}));
var LANG;
(function (LANG) {
    LANG["YES"] = "Yes";
    LANG["NO"] = "No";
})(LANG || (LANG = {}));
var STATUS;
(function (STATUS) {
    STATUS["ACTIVE"] = "Active";
    STATUS["INACTIVE"] = "Inactive";
})(STATUS || (STATUS = {}));
let SettingEntity = class SettingEntity {
    id;
    name;
    desc;
    value;
    groupType;
    configType;
    displayType;
    source;
    sourceValue;
    selectType;
    defValue;
    lang;
    validateCode;
    validateMessage;
    settingAttr;
    placeholder;
    helpText;
    orderBy;
    status;
    createdAt;
    updatedAt;
};
exports.SettingEntity = SettingEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', unsigned: true }),
    __metadata("design:type", Number)
], SettingEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], SettingEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], SettingEntity.prototype, "desc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SettingEntity.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SettingEntity.prototype, "groupType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', nullable: true, enum: CONFIG_TYPE }),
    __metadata("design:type", String)
], SettingEntity.prototype, "configType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', nullable: true, enum: DISPLAY_TYPE }),
    __metadata("design:type", String)
], SettingEntity.prototype, "displayType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', nullable: true, enum: SOURCE }),
    __metadata("design:type", String)
], SettingEntity.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SettingEntity.prototype, "sourceValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', nullable: true, enum: SELECT_TYPE }),
    __metadata("design:type", String)
], SettingEntity.prototype, "selectType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], SettingEntity.prototype, "defValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', nullable: true, enum: LANG, default: LANG.NO }),
    __metadata("design:type", String)
], SettingEntity.prototype, "lang", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SettingEntity.prototype, "validateCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SettingEntity.prototype, "validateMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SettingEntity.prototype, "settingAttr", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 255 }),
    __metadata("design:type", String)
], SettingEntity.prototype, "placeholder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SettingEntity.prototype, "helpText", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: '0' }),
    __metadata("design:type", Number)
], SettingEntity.prototype, "orderBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: STATUS, default: STATUS.ACTIVE }),
    __metadata("design:type", String)
], SettingEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], SettingEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], SettingEntity.prototype, "updatedAt", void 0);
exports.SettingEntity = SettingEntity = __decorate([
    (0, typeorm_1.Entity)('mod_setting')
], SettingEntity);
//# sourceMappingURL=setting.entity%20copy.js.map