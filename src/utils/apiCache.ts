
/**
 * Simple in-memory cache for API responses
 */
export class ApiCache {
  private static cache: Record<string, { data: any; timestamp: number }> = {};

  /**
   * Store data in cache with expiration time
   */
  public static set(key: string, data: any, ttl: number): void {
    this.cache[key] = {
      data,
      timestamp: Date.now() + ttl,
    };
  }

  /**
   * Retrieve data from cache if not expired
   */
  public static get(key: string): any | null {
    const cached = this.cache[key];
    
    if (cached && cached.timestamp > Date.now()) {
      return cached.data;
    }
    
    // Clean up expired item
    if (cached) {
      delete this.cache[key];
    }
    
    return null;
  }

  /**
   * Clear entire cache or specific key
   */
  public static clear(key?: string): void {
    if (key) {
      delete this.cache[key];
    } else {
      this.cache = {};
    }
  }
}
