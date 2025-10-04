import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
// npm install @upstash/redis
/*
Upstash Redis Setup:
Sign up for an account at Upstash
Create a new Redis database
Copy the REST API credentials (URL and token) to your environment variables
Next.js Configuration:
Make sure your next.config.js includes the necessary configuration for environment variables:

*/

/**
 * Initialize Redis client for rate limiting storage
 * Upstash Redis is serverless and works well with Next.js
 * Environment variables should be set in .env.local or through your hosting platform
 */
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || '',
  token: process.env.UPSTASH_REDIS_TOKEN || '',
});

/**
 * Response data type definition
 * @property {boolean} allowed - Whether the request is allowed or rate limited
 * @property {number} [remaining] - Number of requests remaining for the period
 * @property {number} [resetAt] - Timestamp when the rate limit will reset
 * @property {string} [message] - Optional message explaining the rate limit
 */

/**
 * POST handler for checking rate limits
 * This endpoint checks if a user has exceeded their daily message limit
 * It uses the client's IP address to track usage
 * 
 * @param {NextRequest} request - The incoming request object
 * @returns {Promise<NextResponse>} JSON response with rate limit information
 */
export async function POST(request: NextRequest) {
  // Get the client's IP address from the x-forwarded-for header
  // This header is typically set by proxies and load balancers
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  // Log the incoming request
  console.log(`[Rate Limit] Request from IP: ${ip.includes(',') ? ip.split(',')[0] : ip}`);
  
  // Create Redis keys for tracking this IP
  // const ipKey = `ip_limit:${ip}`;
  // Include the date in the key to reset counts daily
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const dailyKey = `daily:${ip}:${today}`;
  
  // Configure the daily message limit
  // This can be moved to an environment variable for easier configuration
  const dailyLimit = process.env.MAX_CHAT_REQUESTS_DAY as unknown as number || 20;
  
  console.log(`[Rate Limit] Daily limit configured as: ${dailyLimit} messages`);
  
  try {
    // Check if this IP has used the API today and how many times
    let dailyCount = await redis.get(dailyKey) as number | null;
    
    // If this is the first request today, initialize the counter
    if (dailyCount === null) {
      dailyCount = 0;
      // Set the key with a 24-hour expiration (86400 seconds)
      // This automatically handles cleanup of old keys
      await redis.set(dailyKey, 0, { ex: 86400 });
      console.log(`[Rate Limit] First request today from IP: ${ip}, initializing counter`);
    } else {
      console.log(`[Rate Limit] Current usage for IP ${ip}: ${dailyCount}/${dailyLimit}`);
    }
    
    // If the user has reached their daily limit
    if (dailyCount >= dailyLimit) {
      // Calculate the time until the limit resets (midnight)
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const resetTimeFormatted = tomorrow.toLocaleString();
      console.log(`[Rate Limit] IP ${ip} has reached daily limit. Reset at ${resetTimeFormatted}`);
      
      // Return a 429 Too Many Requests response
      return NextResponse.json({
        allowed: false,
        remaining: 0,
        resetAt: tomorrow.getTime(), // Timestamp when the limit resets
        message: "Daily message limit reached. Please try again tomorrow."
      }, { status: 429 });
    }
    
    // If the user hasn't reached their limit, increment their usage count
    await redis.incr(dailyKey);
    const newCount = dailyCount + 1;
    const remaining = dailyLimit - newCount;
    
    console.log(`[Rate Limit] Request allowed for IP ${ip}. ${remaining} requests remaining today.`);
    
    // Return success with the number of remaining requests
    return NextResponse.json({
      allowed: true,
      remaining: remaining
    });
    
  } catch (error) {
    // Log any errors that occur during rate limiting
    console.error('[Rate Limit] Error:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error(`[Rate Limit] Error name: ${error.name}, message: ${error.message}`);
      console.error(`[Rate Limit] Stack trace: ${error.stack}`);
    }
    
    // Log Redis connection details (without sensitive info)
    console.error('[Rate Limit] Redis connection issue. Check environment variables and network connectivity.');
    
    // If Redis fails, allow the request but log the error
    // This is a graceful degradation approach - you might want to be more strict in production
    return NextResponse.json({
      allowed: true,
      message: "Rate limit check failed, proceeding anyway"
    });
  }
} 