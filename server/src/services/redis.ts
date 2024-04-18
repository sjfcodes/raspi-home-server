import { RedisClientType, createClient } from 'redis';

import { env } from '../config/globals';
import { logger } from './logger';

export class RedisService {
    private static client: RedisClientType;

    /**
     * Connect to Redis
     */
    static connect() {
        logger.info('connecting to redis');
        this.client = createClient({ url: env.REDIS_URL });
    }

    /**
     * Disconnect from Redis
     */
    static disconnect() {
        this.client.quit();
    }

    /**
     * Get object as instance of given type
     *
     * @param key Cache key
     * @returns Object
     */
    static async getObject<T>(key: string): Promise<T | null> {
        try {
            const data = await RedisService.client.get(key);
            if (data === null) {
                return null;
            }
            return JSON.parse(data) as T;
        } catch (err) {
            logger.error(err);
            return null;
        }
    }

    /**
     * Store object
     *
     * @param key Cache Key
     * @param obj Object to store
     */
    static setObject<T>(key: string, obj: T) {
        try {
            RedisService.client.set(key, JSON.stringify(obj));
        } catch (err) {
            logger.error(err);
        }
    }

    /**
     * Get object as instance of given type and store if not existing in cache
     *
     * @param key Cache Key
     * @param fn Function to fetch data if not existing
     * @returns Object
     */
    static async getAndSetObject<T>(
        key: string,
        fn: () => Promise<T>
    ): Promise<T> {
        const data = await RedisService.client.get(key);
        if (data === null) {
            const fetched = await fn();
            this.setObject(key, fetched);
            return fetched as T;
        }
        return JSON.parse(data) as T;
    }

    /**
     * Delete entry by key
     *
     * @param key Cache key
     */
    static deleteByKey(key: string) {
        RedisService.client.del(key);
    }
}
