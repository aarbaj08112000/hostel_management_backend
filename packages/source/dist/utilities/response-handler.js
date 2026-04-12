"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = void 0;
class ResponseHandler {
    static error(status, message) {
        const response = {
            settings: {
                status: status,
                success: 0,
                message: message,
            },
            data: {},
        };
        return response;
    }
    static success(status, data) {
        const response = {
            settings: {
                status: status,
                success: 1,
                message: '',
            },
            data,
        };
        return response;
    }
    static standard(status, success, message, data) {
        const response = {
            settings: {
                status: status,
                success: success,
                message: message,
            },
            data: data,
        };
        return response;
    }
}
exports.ResponseHandler = ResponseHandler;
//# sourceMappingURL=response-handler.js.map