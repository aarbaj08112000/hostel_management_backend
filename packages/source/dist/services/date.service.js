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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var DateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateService = void 0;
const common_1 = require("@nestjs/common");
const date_fns_1 = require("date-fns");
const cache_service_1 = require("./cache.service");
const custom_config_1 = __importDefault(require("../config/custom-config"));
const logger_handler_1 = require("../utilities/logger-handler");
let DateService = DateService_1 = class DateService {
    cacheService;
    log = new logger_handler_1.LoggerHandler(DateService_1.name).getInstance();
    constructor(cacheService) {
        this.cacheService = cacheService;
    }
    getCurrentDate() {
        return (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd');
    }
    getCurrentTime() {
        return (0, date_fns_1.format)(new Date(), 'HH:mm:ss');
    }
    getCurrentDateTime() {
        return (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm:ss');
    }
    getCurrentTimeStamp() {
        return (0, date_fns_1.getUnixTime)(new Date());
    }
    getCurrentTimeMS() {
        return (0, date_fns_1.getTime)(new Date());
    }
    getDateTimeBefore(value, type) {
        let dateTime;
        if ([
            'years',
            'months',
            'weeks',
            'days',
            'hours',
            'minutes',
            'seconds',
        ].includes(type)) {
            const addObj = {};
            addObj[type] = value;
            dateTime = (0, date_fns_1.sub)(new Date(), addObj);
        }
        else if (type === 'milliseconds') {
            dateTime = (0, date_fns_1.subMilliseconds)(new Date(), value);
        }
        return (0, date_fns_1.format)(dateTime, 'yyyy-MM-dd HH:mm:ss');
    }
    getDateTimeAfter(value, type) {
        let dateTime;
        if ([
            'years',
            'months',
            'weeks',
            'days',
            'hours',
            'minutes',
            'seconds',
        ].includes(type)) {
            const addObj = {};
            addObj[type] = value;
            dateTime = (0, date_fns_1.add)(new Date(), addObj);
        }
        else if (type === 'milliseconds') {
            dateTime = (0, date_fns_1.addMilliseconds)(new Date(), value);
        }
        return (0, date_fns_1.format)(dateTime, 'yyyy-MM-dd HH:mm:ss');
    }
    getDateDBFormat(value) {
        if (!value)
            return '';
        if (!(0, date_fns_1.isValid)(new Date(value)))
            return '';
        return (0, date_fns_1.format)(new Date(value), 'yyyy-MM-dd');
    }
    getDateTimeDBFormat(value) {
        if (!value)
            return '';
        if (!(0, date_fns_1.isValid)(new Date(value)))
            return '';
        return (0, date_fns_1.format)(new Date(value), 'yyyy-MM-dd HH:mm:ss');
    }
    getTimeDBFormat(value, srcfmt) {
        if (!value)
            return '';
        if (!(0, date_fns_1.isMatch)(value, srcfmt))
            return '';
        const parseDate = (0, date_fns_1.parse)(value, srcfmt, new Date());
        return (0, date_fns_1.format)(parseDate, 'HH:mm:ss');
    }
    async getDateSystemFormat(value) {
        if (!value || value === '0000-00-00')
            return '';
        if (!(0, date_fns_1.isValid)(new Date(value)))
            return '';
        const dateFormat = await this.cacheService.get('ADMIN_DATE_TIME_FORMAT');
        const dstfmt = this.getSystemDateFormat(dateFormat);
        return (0, date_fns_1.format)(new Date(value), dstfmt);
    }
    async getDateTimeSystemFormat(value) {
        if (!value || value === '0000-00-00 00:00:00')
            return '';
        if (!(0, date_fns_1.isValid)(new Date(value)))
            return '';
        const dateTimeFormat = await this.cacheService.get('ADMIN_DATE_TIME_FORMAT');
        const dstfmt = this.getSystemDateTimeFormat(dateTimeFormat);
        return (0, date_fns_1.format)(new Date(value), dstfmt);
    }
    async getTimeSystemFormat(value) {
        if (!value || value === '00:00:00')
            return '';
        if (!(0, date_fns_1.isMatch)(value, 'HH:mm:ss'))
            return '';
        const timeFormat = await this.cacheService.get('ADMIN_TIME_FORMAT');
        const dstfmt = this.getSystemTimeFormat(timeFormat);
        const parseDate = (0, date_fns_1.parse)(value, 'HH:mm:ss', new Date());
        return (0, date_fns_1.format)(parseDate, dstfmt);
    }
    getDateCustomFormat(value, dstfmt) {
        if (!value || value === '0000-00-00')
            return '';
        if (!(0, date_fns_1.isValid)(new Date(value)))
            return '';
        return (0, date_fns_1.format)(new Date(value), dstfmt);
    }
    getDateTimeCustomFormat(value, dstfmt) {
        if (!value || value === '0000-00-00 00:00:00')
            return '';
        if (!(0, date_fns_1.isValid)(new Date(value)))
            return '';
        return (0, date_fns_1.format)(new Date(value), dstfmt);
    }
    getTimeCustomFormat(value, dstfmt) {
        if (!value || value === '00:00:00')
            return '';
        if (!(0, date_fns_1.isMatch)(value, 'HH:mm:ss'))
            return '';
        const parseDate = (0, date_fns_1.parse)(value, 'HH:mm:ss', new Date());
        return (0, date_fns_1.format)(parseDate, dstfmt);
    }
    getSystemDateFormat(sysfmt) {
        const dateFormats = custom_config_1.default.dateFormats;
        if (sysfmt === '' || !(sysfmt in dateFormats)) {
            sysfmt = 'dfmt_1';
        }
        return dateFormats[sysfmt];
    }
    getSystemDateTimeFormat(sysfmt) {
        const dateTimeFormats = custom_config_1.default.dateTimeFormats;
        if (sysfmt === '' || !(sysfmt in dateTimeFormats)) {
            sysfmt = 'dtfmt_1';
        }
        return dateTimeFormats[sysfmt];
    }
    getSystemTimeFormat(sysfmt) {
        const timeFormats = custom_config_1.default.timeFormats;
        if (sysfmt === '' || !(sysfmt in timeFormats)) {
            sysfmt = 'tfmt_1';
        }
        return timeFormats[sysfmt];
    }
    isValidDate(value) {
        if (!(0, date_fns_1.isValid)(new Date(value))) {
            return false;
        }
        return true;
    }
    isValidTime(value) {
        if (!(0, date_fns_1.isMatch)(value, 'HH:mm:ss')) {
            return false;
        }
        return true;
    }
    getSystemFormatLabels(sysfmt, type) {
        let dateLabels;
        if (type === 'ADMIN_DATE_FORMAT') {
            dateLabels = custom_config_1.default.dateLabels;
        }
        else if (type === 'ADMIN_DATE_TIME_FORMAT') {
            dateLabels = custom_config_1.default.dateTimeLabels;
        }
        else if (type === 'ADMIN_TIME_FORMAT') {
            dateLabels = custom_config_1.default.timeLabels;
        }
        if (!sysfmt || !(sysfmt in dateLabels)) {
            sysfmt = 'dfmt_1';
        }
        return dateLabels[sysfmt];
    }
    compare(dateLeft, dateRight) {
        return (0, date_fns_1.compareAsc)(new Date(dateLeft), new Date(dateRight));
    }
    diff(dateLeft, dateRight, type) {
        let res = 0;
        dateLeft = new Date(dateLeft);
        dateRight = new Date(dateRight);
        switch (type) {
            case 'seconds':
            case 's':
                res = (0, date_fns_1.differenceInSeconds)(dateLeft, dateRight);
                break;
            case 'minutes':
            case 'i':
                res = (0, date_fns_1.differenceInMinutes)(dateLeft, dateRight);
                break;
            case 'hours':
            case 'h':
                res = (0, date_fns_1.differenceInHours)(dateLeft, dateRight);
                break;
            case 'days':
            case 'd':
                res = (0, date_fns_1.differenceInDays)(dateLeft, dateRight);
                break;
            case 'months':
            case 'm':
                res = (0, date_fns_1.differenceInMonths)(dateLeft, dateRight);
                break;
            case 'years':
            case 'y':
            default:
                res = (0, date_fns_1.differenceInYears)(dateLeft, dateRight);
                break;
        }
        return res;
    }
};
exports.DateService = DateService;
exports.DateService = DateService = DateService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService])
], DateService);
//# sourceMappingURL=date.service.js.map