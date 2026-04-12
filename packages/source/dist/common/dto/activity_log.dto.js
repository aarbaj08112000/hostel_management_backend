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
exports.ActivityLogListDto = exports.ActivityLogUploadDto = exports.ActivityLogAddDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ActivityLogAddDto {
    activity_code;
    value_json;
    module_code;
    request_id;
    added_by;
}
exports.ActivityLogAddDto = ActivityLogAddDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ActivityLogAddDto.prototype, "activity_code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ActivityLogAddDto.prototype, "value_json", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ActivityLogAddDto.prototype, "module_code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ActivityLogAddDto.prototype, "request_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ActivityLogAddDto.prototype, "added_by", void 0);
class ActivityLogUploadDto {
    date;
}
exports.ActivityLogUploadDto = ActivityLogUploadDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)({ message: 'Date must be a valid date' }),
    __metadata("design:type", Date)
], ActivityLogUploadDto.prototype, "date", void 0);
class ActivityLogListDto {
    module_code;
    request_id;
    car_id;
    page;
    limit;
    sort;
    filters;
    keyword;
}
exports.ActivityLogListDto = ActivityLogListDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'module_code must be an array' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least one Module must be provided.' }),
    (0, class_validator_1.IsString)({ each: true, message: 'module name must be a string' }),
    __metadata("design:type", String)
], ActivityLogListDto.prototype, "module_code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ActivityLogListDto.prototype, "request_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ActivityLogListDto.prototype, "car_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ActivityLogListDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ActivityLogListDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ActivityLogListDto.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ActivityLogListDto.prototype, "filters", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ActivityLogListDto.prototype, "keyword", void 0);
//# sourceMappingURL=activity_log.dto.js.map