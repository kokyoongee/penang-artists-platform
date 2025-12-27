import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Check if Upstash is configured
const isUpstashConfigured =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Create rate limiter only if Upstash is configured
const ratelimit = isUpstashConfigured
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '60 s'), // 10 requests per minute
      analytics: true,
      prefix: 'penang-artists',
    })
  : null;

// More restrictive limiter for sensitive operations
const strictRatelimit = isUpstashConfigured
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, '60 s'), // 5 requests per minute
      analytics: true,
      prefix: 'penang-artists-strict',
    })
  : null;

export interface RateLimitResult {
  success: boolean;
  limit?: number;
  remaining?: number;
  reset?: number;
}

/**
 * Check rate limit for an identifier (usually IP or user ID)
 * Returns success: true if Upstash is not configured (fails open for development)
 */
export async function checkRateLimit(
  identifier: string,
  strict = false
): Promise<RateLimitResult> {
  const limiter = strict ? strictRatelimit : ratelimit;

  // If Upstash not configured, allow request (development mode)
  if (!limiter) {
    return { success: true };
  }

  try {
    const { success, limit, remaining, reset } = await limiter.limit(identifier);
    return { success, limit, remaining, reset };
  } catch (error) {
    // If rate limiting fails, allow request but log error
    console.error('Rate limit check failed:', error);
    return { success: true };
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return 'unknown';
}

/**
 * Create rate limit exceeded response
 */
export function rateLimitResponse(result: RateLimitResult) {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': String(result.limit || 0),
        'X-RateLimit-Remaining': String(result.remaining || 0),
        'X-RateLimit-Reset': String(result.reset || 0),
      },
    }
  );
}
