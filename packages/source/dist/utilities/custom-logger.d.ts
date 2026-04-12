import { LoggerService } from '@nestjs/common';
import 'winston-daily-rotate-file';
export declare class CustomLogger implements LoggerService {
    private logger;
    constructor();
    log(message: any): void;
    error(message: string, trace: string): void;
    warn(message: any): void;
    debug?(message: any): void;
    verbose?(message: any): void;
}
//# sourceMappingURL=custom-logger.d.ts.map