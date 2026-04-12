"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLogger = void 0;
const winston_1 = require("winston");
const nest_winston_1 = require("nest-winston");
require("winston-daily-rotate-file");
class CustomLogger {
    logger;
    constructor() {
        this.logger = nest_winston_1.WinstonModule.createLogger({
            level: 'info',
            transports: [
                new winston_1.transports.DailyRotateFile({
                    filename: `public/logs/debug/%DATE%/error.log`,
                    level: 'error',
                    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: false,
                    maxFiles: '15d',
                }),
                new winston_1.transports.DailyRotateFile({
                    filename: `public/logs/debug/%DATE%/all.log`,
                    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: false,
                    maxFiles: '15d',
                }),
                new winston_1.transports.Console({
                    format: winston_1.format.combine(winston_1.format.cli(), winston_1.format.splat(), winston_1.format.timestamp(), winston_1.format.printf((info) => {
                        return `${info.timestamp} ${info.level}: ${info.message}`;
                    })),
                }),
            ],
        });
    }
    log(message) {
        this.logger.log(message);
    }
    error(message, trace) {
        this.logger.error(message, trace);
    }
    warn(message) {
        this.logger.warn(message);
    }
    debug(message) {
        this.logger.debug(message);
    }
    verbose(message) {
        this.logger.debug(message);
    }
}
exports.CustomLogger = CustomLogger;
//# sourceMappingURL=custom-logger.js.map