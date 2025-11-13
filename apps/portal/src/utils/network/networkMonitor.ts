/**
 * Network Monitor
 * 
 * Monitors network connectivity and provides offline detection
 */
import { logger } from '../logging/Logger';

export type NetworkStatus = 'online' | 'offline' | 'unknown';

export interface NetworkMonitorCallbacks {
  onOnline?: () => void;
  onOffline?: () => void;
  onStatusChange?: (status: NetworkStatus) => void;
}

class NetworkMonitorService {
  private status: NetworkStatus = 'unknown';
  private callbacks: NetworkMonitorCallbacks[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.status = navigator.onLine ? 'online' : 'offline';
      this.setupEventListeners();
    }
  }

  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      logger.info('Network connection restored', {
        component: 'networkMonitor',
        action: 'online',
      });
      this.setStatus('online');
    });

    window.addEventListener('offline', () => {
      logger.warn('Network connection lost', {
        component: 'networkMonitor',
        action: 'offline',
      });
      this.setStatus('offline');
    });
  }

  private setStatus(newStatus: NetworkStatus): void {
    if (this.status !== newStatus) {
      const oldStatus = this.status;
      this.status = newStatus;

      // Notify all callbacks
      this.callbacks.forEach((callbacks) => {
        if (newStatus === 'online' && callbacks.onOnline) {
          callbacks.onOnline();
        }
        if (newStatus === 'offline' && callbacks.onOffline) {
          callbacks.onOffline();
        }
        if (callbacks.onStatusChange) {
          callbacks.onStatusChange(newStatus);
        }
      });

      logger.debug('Network status changed', {
        component: 'networkMonitor',
        action: 'statusChange',
        metadata: {
          oldStatus,
          newStatus,
        },
      });
    }
  }

  /**
   * Get current network status
   */
  getStatus(): NetworkStatus {
    if (typeof window !== 'undefined') {
      return navigator.onLine ? 'online' : 'offline';
    }
    return 'unknown';
  }

  /**
   * Check if currently online
   */
  isOnline(): boolean {
    return this.getStatus() === 'online';
  }

  /**
   * Subscribe to network status changes
   */
  subscribe(callbacks: NetworkMonitorCallbacks): () => void {
    this.callbacks.push(callbacks);

    // Immediately call status change callback if status is known
    if (this.status !== 'unknown' && callbacks.onStatusChange) {
      callbacks.onStatusChange(this.status);
    }

    // Return unsubscribe function
    return () => {
      const index = this.callbacks.indexOf(callbacks);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }
}

// Export singleton instance
export const networkMonitor = new NetworkMonitorService();

