import { createClient } from "redis";

const redisclient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisclient.connect().catch(console.error);

export async function cacheGet(key: string): Promise<string | null> {
  return await redisclient.get(key);
}

export async function cacheSet(
  key: string,
  value: string,
  ttl: number
): Promise<void> {
  await redisclient.set(key, value, { EX: ttl });
}
