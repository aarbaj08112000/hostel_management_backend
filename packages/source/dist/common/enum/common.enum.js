"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEVICE = exports.SILENT = exports.CODE = exports.MODE = exports.TYPE = exports.STATUS = void 0;
var STATUS;
(function (STATUS) {
    STATUS["PENDING"] = "Pending";
    STATUS["INPROCESS"] = "Inprocess";
    STATUS["EXECUTED"] = "Executed";
    STATUS["FAILED"] = "Failed";
})(STATUS || (exports.STATUS = STATUS = {}));
var TYPE;
(function (TYPE) {
    TYPE["API"] = "API";
    TYPE["ADMIN"] = "Admin";
    TYPE["FRONT"] = "Front";
    TYPE["NOTIFICATIONS"] = "Notifications";
})(TYPE || (exports.TYPE = TYPE = {}));
var MODE;
(function (MODE) {
    MODE["LIVE"] = "live";
    MODE["SANDBOX"] = "sandbox";
})(MODE || (exports.MODE = MODE = {}));
var CODE;
(function (CODE) {
    CODE["USER"] = "USER";
    CODE["ALERT"] = "ALERT";
})(CODE || (exports.CODE = CODE = {}));
var SILENT;
(function (SILENT) {
    SILENT["YES"] = "Yes";
    SILENT["NO"] = "No";
})(SILENT || (exports.SILENT = SILENT = {}));
var DEVICE;
(function (DEVICE) {
    DEVICE["IOS"] = "iOS";
    DEVICE["ANDROID"] = "Android";
})(DEVICE || (exports.DEVICE = DEVICE = {}));
//# sourceMappingURL=common.enum.js.map