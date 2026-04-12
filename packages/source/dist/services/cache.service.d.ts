import { Cache } from 'cache-manager';
export declare class CacheService {
    private cacheManager;
    constructor(cacheManager: Cache);
    set(key: string, item: string): Promise<void>;
    get(key: string): Promise<string | null>;
}
//# sourceMappingURL=cache.service.d.ts.map