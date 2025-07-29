// lib/rate-limit.d.ts
import { NextApiResponse } from 'next'

declare module '@/lib/rate-limit' {
  export interface RateLimitResult {
    isRateLimited: boolean
    limit: number
    remaining: number
  }

  export interface RateLimitOptions {
    uniqueTokenPerInterval?: number
    interval?: number
  }

  export function rateLimit(options?: RateLimitOptions): {
    check: (
      res: NextApiResponse,
      limit: number,
      token: string
    ) => RateLimitResult
  }
}