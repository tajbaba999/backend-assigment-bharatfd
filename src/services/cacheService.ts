import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.connect()
  .then(() => console.log('✅ Redis connection established'))
  .catch(err => console.error("❌ Redis connection error:", err));

redisClient.on("error", (err) => console.error("Redis error:", err));

export const cacheService = {
  async getCache(key: string) {
    return await redisClient.get(key);
  },

  async setCache(key: string, value: string) {
    await redisClient.set(key, value, { EX:3600  });
  },
};
