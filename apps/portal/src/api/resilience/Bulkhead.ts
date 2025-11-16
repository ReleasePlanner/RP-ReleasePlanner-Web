/**
 * Bulkhead Pattern Implementation
 * 
 * Isolates resources to prevent failures in one area from affecting others.
 * Limits concurrent requests per resource pool.
 */

export interface BulkheadConfig {
  /** Maximum number of concurrent requests */
  maxConcurrent: number;
  /** Maximum queue size for waiting requests */
  maxQueueSize: number;
  /** Timeout for queued requests */
  queueTimeout: number;
}

const DEFAULT_CONFIG: BulkheadConfig = {
  maxConcurrent: 10,
  maxQueueSize: 50,
  queueTimeout: 30000, // 30 seconds
};

interface QueuedRequest<T> {
  resolve: (value: T) => void;
  reject: (error: Error) => void;
  timestamp: number;
  fn?: () => Promise<T>;
}

export class Bulkhead {
  private name: string;
  private config: BulkheadConfig;
  private activeRequests: number = 0;
  private queue: QueuedRequest<any>[] = [];

  constructor(name: string, config?: Partial<BulkheadConfig>) {
    this.name = name;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Execute a function with bulkhead protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if we can execute immediately
    if (this.activeRequests < this.config.maxConcurrent) {
      return this.executeRequest(fn);
    }

    // Check if queue is full
    if (this.queue.length >= this.config.maxQueueSize) {
      throw new BulkheadRejectedError(
        `Bulkhead "${this.name}" queue is full. Too many requests.`
      );
    }

    // Queue the request and wait for execution
    return new Promise<T>((resolve, reject) => {
      const queuedRequest: QueuedRequest<T> = {
        resolve,
        reject,
        timestamp: Date.now(),
      };

      // Store the function to execute
      (queuedRequest as any).fn = fn;

      this.queue.push(queuedRequest);

      // Try to process queue immediately
      this.processQueue();
    });
  }

  /**
   * Execute a request
   */
  private async executeRequest<T>(fn: () => Promise<T>): Promise<T> {
    this.activeRequests++;

    try {
      const result = await fn();
      return result;
    } finally {
      this.activeRequests--;
      this.processQueue();
    }
  }

  /**
   * Process queued requests
   */
  private processQueue(): void {
    // Remove expired requests from queue
    const now = Date.now();
    this.queue = this.queue.filter((req) => {
      if (now - req.timestamp > this.config.queueTimeout) {
        req.reject(
          new BulkheadTimeoutError(
            `Bulkhead "${this.name}" queue timeout exceeded.`
          )
        );
        return false;
      }
      return true;
    });

    // Execute queued requests up to max concurrent
    while (
      this.activeRequests < this.config.maxConcurrent &&
      this.queue.length > 0
    ) {
      const queued = this.queue.shift();
      if (queued && queued.fn) {
        // Execute the queued request
        this.executeRequest(queued.fn)
          .then(queued.resolve)
          .catch(queued.reject);
      }
    }
  }

  /**
   * Get current stats
   */
  getStats() {
    return {
      name: this.name,
      activeRequests: this.activeRequests,
      queueSize: this.queue.length,
      maxConcurrent: this.config.maxConcurrent,
      maxQueueSize: this.config.maxQueueSize,
    };
  }
}

export class BulkheadRejectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BulkheadRejectedError';
  }
}

export class BulkheadTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BulkheadTimeoutError';
  }
}

/**
 * Bulkhead Manager
 */
class BulkheadManager {
  private bulkheads: Map<string, Bulkhead> = new Map();

  getBulkhead(
    name: string,
    config?: Partial<BulkheadConfig>
  ): Bulkhead {
    if (!this.bulkheads.has(name)) {
      this.bulkheads.set(name, new Bulkhead(name, config));
    }
    return this.bulkheads.get(name)!;
  }

  getAllStats() {
    return Array.from(this.bulkheads.values()).map((bulkhead) =>
      bulkhead.getStats()
    );
  }
}

export const bulkheadManager = new BulkheadManager();

