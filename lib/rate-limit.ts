// lib/rate-limit.ts
import { LRUCache } from 'lru-cache'
import { NextApiResponse } from 'next'

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
    check: (res: NextApiResponse, limit: number, token: string) => {
      const tokenCount = tokenCache.get(token) || 0
      tokenCache.set(token, tokenCount + 1)

      const currentUsage = tokenCount + 1
      const isRateLimited = currentUsage > limit

      if (isRateLimited) {
        res.setHeader('X-RateLimit-Limit', limit)
        res.setHeader(
          'X-RateLimit-Remaining',
          isRateLimited ? 0 : limit - currentUsage
        )
      }

      return {
        isRateLimited,
        limit,
        remaining: isRateLimited ? 0 : limit - currentUsage,
      }
    },
  }
}