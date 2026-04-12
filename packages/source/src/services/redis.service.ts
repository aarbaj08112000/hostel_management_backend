import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async set(key: string, value: any, ttlInSeconds?: number): Promise<void> {
    if (ttlInSeconds) {
      await this.redisClient.set(
        key,
        JSON.stringify(value),
        'EX',
        ttlInSeconds,
      );
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async get(key: string): Promise<any | null> {
    return await this.redisClient.get(key);
  }

  async delete(key: string): Promise<number> {
    return await this.redisClient.del(key);
  }
}
