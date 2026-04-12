import { Redis } from 'ioredis';
export declare class RedisService {
    private readonly redisClient;
    constructor(redisClient: Redis);
    set(key: string, value: any, ttlInSeconds?: number): Promise<void>;
    get(key: string): Promise<any | null>;
    delete(key: string): Promise<number>;
}
//# sourceMappingURL=redis.service.d.ts.map