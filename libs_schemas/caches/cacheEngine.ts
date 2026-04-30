import { TTLCache } from '@isaacs/ttlcache';

export const CacheTTL = {
  VERY_SHORT: 10_000,
  SHORT: 30_000,
  MEDIUM: 60_000,
  LONG: 5 * 60_000,
} as const;

type CacheEntry<T> = {
  value: T;
  tags: string[];
};

type CacheSetOptions = {
  ttl?: number;
  tags?: string[];
};

const DEFAULT_TTL = CacheTTL.SHORT;

const cache = new TTLCache<string, CacheEntry<unknown>>({
  max: 10_000,
  ttl: DEFAULT_TTL,
});

const tagIndex = new Map<string, Set<string>>();
const keyTags = new Map<string, Set<string>>();

function registerTagsForKey(key: string, tags: string[]): void {
  if (!tags.length) {
    return;
  }

  unregisterKeyTags(key);

  const uniqueTags = new Set(tags);
  keyTags.set(key, uniqueTags);

  uniqueTags.forEach((tag) => {
    const keys = tagIndex.get(tag) ?? new Set<string>();
    keys.add(key);
    tagIndex.set(tag, keys);
  });
}

function unregisterKeyTags(key: string): void {
  const existingTags = keyTags.get(key);
  if (!existingTags) {
    return;
  }

  existingTags.forEach((tag) => {
    const keys = tagIndex.get(tag);
    if (!keys) {
      return;
    }
    keys.delete(key);
    if (keys.size === 0) {
      tagIndex.delete(tag);
    }
  });

  keyTags.delete(key);
}

export function buildCacheKey(namespace: string, ...parts: Array<string | number | boolean | undefined | null>): string {
  const normalized = parts
    .filter((part) => part !== undefined && part !== null)
    .map((part) => String(part));
  return [namespace, ...normalized].join(':');
}

export function setTTLCache<T>(key: string, value: T, options?: CacheSetOptions): T {
  const ttl = options?.ttl ?? DEFAULT_TTL;
  const tags = options?.tags ?? [];

  cache.set(key, { value, tags }, { ttl });
  registerTagsForKey(key, tags);

  return value;
}

export function getFromTTLCache<T>(key: string): T | undefined {
  const hit = cache.get(key);
  if (!hit) {
    unregisterKeyTags(key);
    return undefined;
  }
  return hit.value as T;
}

export function ttlHas(key: string): boolean {
  return getFromTTLCache(key) !== undefined;
}

export function deleteTTLCache(key: string): boolean {
  unregisterKeyTags(key);
  return cache.delete(key);
}

export function invalidateCacheByPrefix(prefix: string): number {
  let removed = 0;
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      if (deleteTTLCache(key)) {
        removed += 1;
      }
    }
  }
  return removed;
}

export function invalidateCacheByTags(tags: string[]): number {
  const keysToDelete = new Set<string>();

  tags.forEach((tag) => {
    const keys = tagIndex.get(tag);
    if (!keys) {
      return;
    }
    keys.forEach((key) => keysToDelete.add(key));
  });

  let removed = 0;
  keysToDelete.forEach((key) => {
    if (deleteTTLCache(key)) {
      removed += 1;
    }
  });

  return removed;
}

export async function getOrSetTTLCache<T>(
  key: string,
  producer: () => Promise<T>,
  options?: CacheSetOptions
): Promise<T> {
  const cached = getFromTTLCache<T>(key);
  if (cached !== undefined) {
    return cached;
  }

  const value = await producer();
  return setTTLCache(key, value, options);
}

export async function retryAsync<T>(
  producer: () => Promise<T>,
  options: { attempts?: number; baseDelayMs?: number } = {}
): Promise<T> {
  const attempts = options.attempts ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 200;
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await producer();
    } catch (error) {
      lastError = error;
      if (attempt === attempts - 1) {
        break;
      }

      const delay = baseDelayMs * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

export function clearTTLCache(): void {
  cache.clear();
  tagIndex.clear();
  keyTags.clear();
}
