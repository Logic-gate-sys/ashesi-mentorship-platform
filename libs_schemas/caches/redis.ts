// import {createClient} from'redis';
// import { env } from '#env';

// const redisClient = createClient({url: env.REDIS_URL })
//        .on("error", err => (console.log('Redis client errors out', err)) )
//        .connect()


// export const CacheTTL = {
//   VERY_SHORT: 10_000,
//   SHORT: 30_000,
//   MEDIUM: 60_000,
//   LONG: 5 * 60_000,
// } as const;


// type CacheSetOptions = {
//   ttl?: number;
//   tags?: string[];
// };

// const DEFAULT_TTL = CacheTTL.SHORT;

// export async function setOrGet<T>(
//   key: string,
//   producer: () => Promise<T>,
//   options?: CacheSetOptions
// ): Promise<T> {
//   const client = await redisClient; // Ensure connection is ready
  
//   const cachedValue = await client.get(key);
  
//   if (cachedValue) {
//     try {
//       return JSON.parse(cachedValue) as T;
//     } catch (e) {
//       console.error(`Redis parse error for key ${key}:`, e);
//     }
//   }

//   // 2. Cache Miss: Run the producer
//   const value = await producer();

//   // 3. Store in Redis
//   const ttl = (options?.ttl ?? DEFAULT_TTL) / 1000; // Redis uses seconds for EX
//   await client.set(key, JSON.stringify(value), {
//     EX: Math.floor(ttl)
//   });

//   return value;
// }

// export async function cacheHas(key: string): Promise<boolean> {
//   const client = await redisClient;
//   const count = await client.exists(key);
//   return count > 0;
// }

// export async function deleteFromCache(key: string): Promise<boolean> {
//   const client = await redisClient;
//   const deletedCount = await client.del(key);
//   return deletedCount > 0;
// }