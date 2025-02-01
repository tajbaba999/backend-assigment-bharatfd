import { createClient } from "redis";

const redisClient = createClient();
redisClient.connect();

redisClient.on("error", (err) => console.error("Redis error:", err));

export const cacheService = {
  async getCache(key: string) {
    return await redisClient.get(key);
  },

  async setCache(key: string, value: string) {
    await redisClient.set(key, value, { EX: 86400 });
  },
};
