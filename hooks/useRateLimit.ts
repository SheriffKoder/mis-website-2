import { useState, useEffect } from 'react';

interface RateLimitOptions {
  windowDuration: number;  // Time window in milliseconds
  maxRequests: number;     // Maximum requests allowed in window
  cooldownPeriod: number;  // Cooldown period after hitting limit
  dailyLimit?: number;     // Optional daily message limit
}

interface RateLimitState {
  isLimited: boolean;      // Whether user is currently rate limited
  remainingRequests: number; // How many requests user has left
  resetTime: number | null; // When the rate limit will reset
  dailyRemaining?: number;  // Remaining daily messages
  dailyResetTime?: number;  // When the daily limit resets
}

export function useRateLimit(
  key: string = 'default_rate_limit',
  options: RateLimitOptions = {
    windowDuration: 60000,  // 1 minute
    maxRequests: process.env.MAX_CHAT_REQUESTS_MINUTE as unknown as number || 10,        // 10 requests per minute
    cooldownPeriod: 30000   // 30 seconds cooldown
  }
): [RateLimitState, () => boolean] {
  const storageKey = `rate_limit_${key}`;
  
  // Initialize state
  const [state, setState] = useState<RateLimitState>({
    isLimited: false,
    remainingRequests: options.maxRequests,
    resetTime: null,
    dailyRemaining: options.dailyLimit,
    dailyResetTime: getMidnightTime()
  });

  // Get timestamp for next midnight (for daily reset)
  function getMidnightTime(): number {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime();
  }

  // Load state from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const now = Date.now();
      
      // Check if daily limit should reset
      let dailyRemaining = parsedData.dailyRemaining;
      let dailyResetTime = parsedData.dailyResetTime;
      
      if (now >= parsedData.dailyResetTime) {
        // Reset daily limit at midnight
        dailyRemaining = options.dailyLimit;
        dailyResetTime = getMidnightTime();
      }
      
      // If we're in cooldown period
      if (parsedData.isLimited && parsedData.resetTime > now) {
        setState({
          ...parsedData,
          dailyRemaining,
          dailyResetTime
        });
        
        // Set timeout to clear rate limit when cooldown expires
        const timeRemaining = parsedData.resetTime - now;
        const timeoutId = setTimeout(() => {
          setState(prev => ({
            ...prev,
            isLimited: false,
            remainingRequests: options.maxRequests,
            resetTime: null
          }));
          updateLocalStorage({
            ...state,
            isLimited: false,
            remainingRequests: options.maxRequests,
            resetTime: null,
            dailyRemaining,
            dailyResetTime
          });
        }, timeRemaining);
        
        return () => clearTimeout(timeoutId);
      } 
      // If we're in the rate limit window but not limited
      else if (parsedData.windowStart && 
               now - parsedData.windowStart < options.windowDuration) {
        setState({
          isLimited: false,
          remainingRequests: parsedData.remainingRequests,
          resetTime: parsedData.windowStart + options.windowDuration,
          dailyRemaining,
          dailyResetTime
        });
      } 
      // If we're outside the window, reset
      else {
        setState({
          isLimited: false,
          remainingRequests: options.maxRequests,
          resetTime: null,
          dailyRemaining,
          dailyResetTime
        });
        updateLocalStorage({
          isLimited: false,
          remainingRequests: options.maxRequests,
          resetTime: null,
          dailyRemaining,
          dailyResetTime
        });
      }
    }
  }, [storageKey, options.maxRequests, options.windowDuration, options.cooldownPeriod, options.dailyLimit]);

  // Helper to update localStorage
  const updateLocalStorage = (newState: RateLimitState & { windowStart?: number }) => {
    localStorage.setItem(storageKey, JSON.stringify(newState));
  };

  // Function to check and update rate limit when an action is performed
  const checkRateLimit = (): boolean => {
    const now = Date.now();
    
    // If already rate limited, prevent action
    if (state.isLimited) {
      return false;
    }
    
    // Check daily limit
    if (state.dailyRemaining !== undefined && state.dailyRemaining <= 0) {
      const newState = {
        ...state,
        isLimited: true,
        resetTime: state.dailyResetTime || getMidnightTime()
      };
      
      setState(newState);
      updateLocalStorage(newState);
      
      return false;
    }
    
    // Get current window start time
    const storedData = localStorage.getItem(storageKey);
    const windowStart = storedData 
      ? JSON.parse(storedData).windowStart || now 
      : now;
    
    // Check if we're in a new window
    const isNewWindow = now - windowStart > options.windowDuration;
    
    // Calculate new remaining requests
    const newRemainingRequests = isNewWindow 
      ? options.maxRequests - 1 
      : state.remainingRequests - 1;
    
    // Update daily remaining
    const newDailyRemaining = state.dailyRemaining !== undefined 
      ? state.dailyRemaining - 1 
      : undefined;
    
    // Check if rate limit is hit
    const isNewlyLimited = newRemainingRequests < 0;
    
    // If rate limit hit, set cooldown period
    if (isNewlyLimited) {
      const newResetTime = now + options.cooldownPeriod;
      const newState = {
        isLimited: true,
        remainingRequests: 0,
        resetTime: newResetTime,
        dailyRemaining: newDailyRemaining,
        dailyResetTime: state.dailyResetTime
      };
      
      setState(newState);
      updateLocalStorage({
        ...newState,
        windowStart: isNewWindow ? now : windowStart
      });
      
      // Set timeout to clear rate limit
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          isLimited: false,
          remainingRequests: options.maxRequests,
          resetTime: null
        }));
        updateLocalStorage({
          ...state,
          isLimited: false,
          remainingRequests: options.maxRequests,
          resetTime: null,
          windowStart: now + options.cooldownPeriod,
          dailyRemaining: newDailyRemaining,
          dailyResetTime: state.dailyResetTime
        });
      }, options.cooldownPeriod);
      
      return false;
    }
    
    // Update state for normal case (not limited)
    const newState = {
      isLimited: false,
      remainingRequests: newRemainingRequests,
      resetTime: isNewWindow ? now + options.windowDuration : state.resetTime,
      dailyRemaining: newDailyRemaining,
      dailyResetTime: state.dailyResetTime
    };
    
    setState(newState);
    updateLocalStorage({
      ...newState,
      windowStart: isNewWindow ? now : windowStart
    });
    
    return true;
  };

  return [state, checkRateLimit];
} 