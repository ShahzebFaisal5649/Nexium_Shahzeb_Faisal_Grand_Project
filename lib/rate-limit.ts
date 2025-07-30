// lib/rate-limit.ts
import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export const rateLimit = (options?: Options) => {
  const tokenCache = new LRUCache<string, number>({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  })

  return {
    check: (limit: number, token: string) => {
      const tokenCount = tokenCache.get(token) || 0
      tokenCache.set(token, tokenCount + 1)
      const currentUsage = tokenCount + 1
      const isRateLimited = currentUsage > limit

      return {
        success: !isRateLimited,
        remaining: isRateLimited ? 0 : limit - currentUsage,
      }
    },
  }
}

// Create a default rate limiter instance for API routes
export const apiRateLimit = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60000, // 1 minute
})

// Alternative method that matches your current usage pattern
export const createRateLimiter = () => {
  const limiter = rateLimit()
  return {
    limit: async (token: string, limit: number = 10) => {
      return limiter.check(limit, token || 'anonymous')
    }
  }
}

// Export a ready-to-use rate limiter
export const defaultRateLimit = createRateLimiter()