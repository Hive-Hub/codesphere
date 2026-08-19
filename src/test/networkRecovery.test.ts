import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { networkManager } from '../services/networkManager';

describe('NetworkManager & Recovery Unit Tests', () => {
  beforeEach(() => {
    networkManager.destroy();
  });

  afterEach(() => {
    networkManager.destroy();
  });

  it('starts in ONLINE status when navigator.onLine is true', () => {
    networkManager.init();
    expect(networkManager.getStatus()).toBe('ONLINE');
    expect(networkManager.isOnline()).toBe(true);
  });

  it('notifies subscribers on network status change', () => {
    networkManager.init();

    const statusList: string[] = [];
    const unsub = networkManager.subscribe((status) => {
      statusList.push(status);
    });

    // Simulate window offline event
    window.dispatchEvent(new Event('offline'));
    expect(statusList).toContain('OFFLINE');
    expect(networkManager.isOnline()).toBe(false);

    // Simulate window online event
    window.dispatchEvent(new Event('online'));
    expect(statusList).toContain('ONLINE');
    expect(networkManager.isOnline()).toBe(true);

    unsub();
  });

  it('registers and unregisters recovery callbacks', () => {
    networkManager.init();

    let called = false;
    const unsub = networkManager.onRecovery(() => {
      called = true;
    });

    unsub();

    // Trigger online recovery
    window.dispatchEvent(new Event('offline'));
    window.dispatchEvent(new Event('online'));

    expect(called).toBe(false); // Unregistered, so not called
  });
});
