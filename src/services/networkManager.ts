/**
 * networkManager.ts
 * Centralized network status detection and controlled recovery.
 * Listens for browser online/offline events and provides reactive state.
 */

export type NetworkStatus = 'ONLINE' | 'OFFLINE';

type NetworkListener = (status: NetworkStatus) => void;

class NetworkManager {
  private status: NetworkStatus = 'ONLINE';
  private listeners: Set<NetworkListener> = new Set();
  private initialized = false;
  private offlineSince: number | null = null;
  private recoveryInProgress = false;
  private recoveryCallbacks: Array<() => void | Promise<void>> = [];

  public init(): void {
    if (this.initialized) return;
    this.initialized = true;

    this.status = navigator.onLine ? 'ONLINE' : 'OFFLINE';
    if (!navigator.onLine) {
      this.offlineSince = Date.now();
    }

    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  public destroy(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    this.listeners.clear();
    this.recoveryCallbacks = [];
    this.initialized = false;
  }

  private handleOnline = (): void => {
    const wasOffline = this.status === 'OFFLINE';
    this.status = 'ONLINE';
    this.notifyListeners();

    if (wasOffline) {
      console.log('[NetworkManager] Connection restored. Starting controlled recovery...');
      this.runRecovery();
    }
    this.offlineSince = null;
  };

  private handleOffline = (): void => {
    this.status = 'OFFLINE';
    this.offlineSince = Date.now();
    console.warn('[NetworkManager] Internet connection lost.');
    this.notifyListeners();
  };

  /**
   * Register a callback to run on network recovery.
   * Callbacks are executed sequentially with a 500ms delay between each
   * to avoid flooding the backend with requests.
   */
  public onRecovery(callback: () => void | Promise<void>): () => void {
    this.recoveryCallbacks.push(callback);
    return () => {
      this.recoveryCallbacks = this.recoveryCallbacks.filter((cb) => cb !== callback);
    };
  }

  private async runRecovery(): Promise<void> {
    if (this.recoveryInProgress) return;
    this.recoveryInProgress = true;

    for (const cb of this.recoveryCallbacks) {
      try {
        await cb();
      } catch (err) {
        console.warn('[NetworkManager] Recovery callback failed:', err);
      }
      // Stagger requests to avoid flooding
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    this.recoveryInProgress = false;
  }

  public getStatus(): NetworkStatus {
    return this.status;
  }

  public isOnline(): boolean {
    return this.status === 'ONLINE';
  }

  public getOfflineSince(): number | null {
    return this.offlineSince;
  }

  public subscribe(listener: NetworkListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((fn) => {
      try {
        fn(this.status);
      } catch (err) {
        console.error('[NetworkManager] Listener error:', err);
      }
    });
  }
}

export const networkManager = new NetworkManager();
