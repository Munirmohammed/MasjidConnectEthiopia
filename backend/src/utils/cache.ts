import redis from '../config/redis';

export const cacheGet = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

export const cacheSet = async (key: string, value: any, ttl: number = 3600): Promise<void> => {
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

export const cacheDel = async (key: string): Promise<void> => {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
};

export const cacheIncrBy = async (key: string, increment: number = 1): Promise<number> => {
  try {
    return await redis.incrby(key, increment);
  } catch (error) {
    console.error('Cache increment error:', error);
    return 0;
  }
};

export const cacheDecrBy = async (key: string, decrement: number = 1): Promise<number> => {
  try {
    return await redis.decrby(key, decrement);
  } catch (error) {
    console.error('Cache decrement error:', error);
    return 0;
  }
};
