
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class ApiCacheManager {
  private cache: Map<string, CacheItem<any>> = new Map();
  private maxCacheSize: number = 100;
  private requestCounter: Map<string, { count: number, timestamp: number }> = new Map();
  private requestLimits: { [key: string]: number } = {
    default: 10, // Default per minute
    fixtures: 20,
    leagues: 5,
    live: 15
  };

  constructor() {
    // Clean up expired cache items every 5 minutes
    setInterval(() => this.cleanupExpiredItems(), 5 * 60 * 1000);
    
    // Reset request counters every minute
    setInterval(() => this.resetRequestCounters(), 60 * 1000);
  }

  /**
   * Get item from cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    return item.data;
  }

  /**
   * Get the timestamp of when an item was cached
   */
  getTimestamp(key: string): number {
    const item = this.cache.get(key);
    if (!item) return 0;
    return item.timestamp;
  }

  /**
   * Set item in cache with an expiration time in milliseconds
   */
  set<T>(key: string, data: T, expiration: number): void {
    // If cache is at max size, remove oldest item
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.getOldestCacheKey();
      if (oldestKey) this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Set expiration
    if (expiration > 0) {
      setTimeout(() => {
        this.cache.delete(key);
      }, expiration);
    }
  }

  /**
   * Check if making a request is within the rate limit
   */
  canMakeRequest(endpointType: string): boolean {
    const now = Date.now();
    const limit = this.requestLimits[endpointType] || this.requestLimits.default;
    
    const counterKey = `${endpointType}_${Math.floor(now / 60000)}`; // Current minute
    const counter = this.requestCounter.get(counterKey) || { count: 0, timestamp: now };
    
    return counter.count < limit;
  }

  /**
   * Increment the request counter for an endpoint type
   */
  trackRequest(endpointType: string): void {
    const now = Date.now();
    const counterKey = `${endpointType}_${Math.floor(now / 60000)}`; // Current minute
    const counter = this.requestCounter.get(counterKey) || { count: 0, timestamp: now };
    
    counter.count += 1;
    this.requestCounter.set(counterKey, counter);
  }

  /**
   * Get oldest cache key (for removal when at capacity)
   */
  private getOldestCacheKey(): string | null {
    if (this.cache.size === 0) return null;
    
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;
    
    this.cache.forEach((item, key) => {
      if (item.timestamp < oldestTimestamp) {
        oldestTimestamp = item.timestamp;
        oldestKey = key;
      }
    });
    
    return oldestKey;
  }

  /**
   * Clean up expired cache items
   */
  private cleanupExpiredItems(): void {
    const now = Date.now();
    
    this.cache.forEach((item, key) => {
      if (now - item.timestamp > 24 * 60 * 60 * 1000) { // Default to 24h expiration for cleanup
        this.cache.delete(key);
      }
    });
  }

  /**
   * Reset request counters for previous minutes (keep only current minute)
   */
  private resetRequestCounters(): void {
    const currentMinute = Math.floor(Date.now() / 60000);
    
    this.requestCounter.forEach((counter, key) => {
      const counterMinute = parseInt(key.split('_')[1]);
      if (counterMinute < currentMinute) {
        this.requestCounter.delete(key);
      }
    });
  }
}

export const ApiCache = new ApiCacheManager();
