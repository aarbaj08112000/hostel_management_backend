"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const response_handler_1 = require("../utilities/response-handler");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const status = exception.getStatus();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        let errMessage;
        if (typeof exception.getResponse === 'function') {
            const responseObject = exception.getResponse();
            if (status === 400) {
                errMessage =
                    responseObject && typeof responseObject === 'object'
                        ? responseObject['message']
                        : responseObject || 'Internal Server Error';
            }
            else {
                errMessage =
                    responseObject && typeof responseObject === 'object'
                        ? (Array.isArray(responseObject['message'])
                            ? responseObject['message'][0]
                            : responseObject['message']) || 'Internal Server Error'
                        : responseObject || 'Internal Server Error';
            }
        }
        else {
            errMessage = exception.message || 'Internal Server Error';
        }
        if (request.path.slice(0, 5) === '/api/') {
            const apiResponse = response_handler_1.ResponseHandler.error(status, errMessage);
            response.status(status).json(apiResponse);
        }
        else {
            response.status(status).json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                message: errMessage,
                path: request.url,
            });
        }
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map