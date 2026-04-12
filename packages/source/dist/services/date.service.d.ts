import { CacheService } from './cache.service';
export declare class DateService {
    private readonly cacheService;
    private readonly log;
    constructor(cacheService: CacheService);
    getCurrentDate(): string;
    getCurrentTime(): string;
    getCurrentDateTime(): string;
    getCurrentTimeStamp(): number;
    getCurrentTimeMS(): number;
    getDateTimeBefore(value: number, type?: string): string;
    getDateTimeAfter(value: number, type?: string): string;
    getDateDBFormat(value?: number | string | Date): string;
    getDateTimeDBFormat(value?: number | string | Date): string;
    getTimeDBFormat(value?: string, srcfmt?: string): string;
    getDateSystemFormat(value?: number | string | Date): Promise<string>;
    getDateTimeSystemFormat(value?: number | string | Date): Promise<string>;
    getTimeSystemFormat(value?: string): Promise<string>;
    getDateCustomFormat(value?: number | string | Date, dstfmt?: string): string;
    getDateTimeCustomFormat(value?: number | string | Date, dstfmt?: string): string;
    getTimeCustomFormat(value?: string, dstfmt?: string): string;
    getSystemDateFormat(sysfmt?: string): string;
    getSystemDateTimeFormat(sysfmt?: string): string;
    getSystemTimeFormat(sysfmt?: string): string;
    isValidDate(value?: number | string | Date): boolean;
    isValidTime(value?: string): boolean;
    getSystemFormatLabels(sysfmt?: string, type?: string): string;
    compare(dateLeft: number | Date, dateRight: number | Date): number;
    diff(dateLeft: number | string | Date, dateRight: number | string | Date, type?: string): number;
}
//# sourceMappingURL=date.service.d.ts.map