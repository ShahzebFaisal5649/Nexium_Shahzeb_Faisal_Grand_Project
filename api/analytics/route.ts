import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit';

const rateLimiter = rateLimit();

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
    
    // Fix: Use the correct property names from the limiter response
    const { success, remaining } = rateLimiter.check(10, ip) // 10 requests per minute
    
    // Fix: Check for rate limiting using the correct property
    if (!success) {
      return new NextResponse("Too many requests", { 
        status: 429,
        headers: {
          'X-RateLimit-Remaining': remaining.toString()
        }
      })
   }
    
    // Your analytics logic here
    
    // Process analytics data
    // ... your existing analytics code
    
    return NextResponse.json({ 
      success: true, 
      remaining: remaining 
    })
    
  } catch (error) {
    console.error('Analytics error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// Alternative rate limiter setup if you need to create one:
/*
import LRU from 'lru-cache'

interface RateLimitResult {
  success: boolean
  remaining: number
}

class RateLimiter {
  private cache: LRU<string, number[]>
  
  constructor(maxSize = 1000) {
    this.cache = new LRU({
      max: maxSize,
      ttl: 60 * 1000 // 1 minute TTL
    })
  }
  
  check(context: any, limit: number, identifier: string): RateLimitResult {
    const now = Date.now()
    const windowStart = now - 60 * 1000 // 1 minute window
    
    const requests = this.cache.get(identifier) || []
    const recentRequests = requests.filter(time => time > windowStart)
    
    if (recentRequests.length >= limit) {
      return { success: false, remaining: 0 }
    }
    
    recentRequests.push(now)
    this.cache.set(identifier, recentRequests)
    
    return { 
      success: true, 
      remaining: limit - recentRequests.length 
    }
  }
}

export const limiter = new RateLimiter()
*/