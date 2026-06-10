import 'server-only';

// Rate limit: max 5 submissions per minute per IP.
// Uses Upstash when configured; otherwise falls back to an in-memory limiter
// (per serverless instance — good enough for low-volume / dev).

const LIMIT = 5;
const WINDOW_MS = 60_000;

type LimitResult = { success: boolean };

let upstashLimiter: { limit: (key: string) => Promise<{ success: boolean }> } | null =
  null;
let upstashTried = false;

async function getUpstashLimiter() {
  if (upstashTried) return upstashLimiter;
  upstashTried = true;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const { Ratelimit } = await import('@upstash/ratelimit');
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({ url, token });
    upstashLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(LIMIT, '60 s'),
      prefix: 'cwl:subscribe',
    });
  } catch {
    upstashLimiter = null;
  }
  return upstashLimiter;
}

// In-memory fallback store.
const hits = new Map<string, number[]>();

function inMemoryLimit(key: string): LimitResult {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const recent = (hits.get(key) ?? []).filter((t) => t > windowStart);
  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup to keep the map small.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => t <= windowStart)) hits.delete(k);
    }
  }

  return { success: recent.length <= LIMIT };
}

export async function checkRateLimit(ip: string): Promise<LimitResult> {
  const key = ip || 'unknown';
  const limiter = await getUpstashLimiter();
  if (limiter) {
    try {
      const { success } = await limiter.limit(key);
      return { success };
    } catch {
      // Fall through to in-memory on Upstash error.
    }
  }
  return inMemoryLimit(key);
}
