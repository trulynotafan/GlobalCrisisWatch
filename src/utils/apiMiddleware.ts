import { NextApiRequest } from 'next';
import { prisma } from '@/lib/prisma';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!
});

export async function validateApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey) return false;

  const key = await prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: { organization: true }
  });

  if (!key) return false;

  // Check if key is active and not expired
  const isValid = key.status === 'active' && 
    (!key.expiresAt || new Date(key.expiresAt) > new Date());

  if (isValid) {
    // Update usage metrics
    await prisma.apiKey.update({
      where: { id: key.id },
      data: {
        lastUsed: new Date(),
        usageCount: { increment: 1 }
      }
    });
  }

  return isValid;
}

export async function rateLimit(req: NextApiRequest) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const apiKey = req.headers['x-api-key'];
  
  const identifier = apiKey || ip;
  const key = `ratelimit:${identifier}`;

  const limit = apiKey ? 1000 : 100; // Higher limit for API keys
  const window = 60 * 60; // 1 hour window

  try {
    const [current] = await redis
      .pipeline()
      .incr(key)
      .expire(key, window)
      .exec();

    const remaining = limit - (current as number);
    const reset = Date.now() + window * 1000;

    // Set rate limit headers
    if (req.res) {
      req.res.setHeader('X-RateLimit-Limit', limit);
      req.res.setHeader('X-RateLimit-Remaining', Math.max(0, remaining));
      req.res.setHeader('X-RateLimit-Reset', reset);
    }

    return {
      success: remaining > 0,
      limit,
      remaining: Math.max(0, remaining),
      reset
    };
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Fail open if Redis is down
    return { success: true, limit, remaining: 1, reset: Date.now() + window * 1000 };
  }
} 