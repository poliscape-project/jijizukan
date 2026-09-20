import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

if (redisUrl && redisToken) {
  redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });
}

// 開発環境や環境変数未設定時のインメモリフォールバック
const memoryStore: Record<string, number> = {};

export async function getViews(id: string): Promise<number> {
  if (redis) {
    try {
      const count = await redis.get<number>(`jiji_views:${id}`);
      return count ?? 0;
    } catch (e) {
      console.error("Redis getViews error:", e);
    }
  }
  return memoryStore[id] ?? 0;
}

export async function incrementViews(id: string): Promise<number> {
  if (redis) {
    try {
      const count = await redis.incr(`jiji_views:${id}`);
      return count;
    } catch (e) {
      console.error("Redis incrementViews error:", e);
    }
  }
  memoryStore[id] = (memoryStore[id] ?? 0) + 1;
  return memoryStore[id];
}
