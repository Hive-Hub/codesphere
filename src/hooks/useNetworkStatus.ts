import { useState, useEffect } from 'react';
import { networkManager, NetworkStatus } from '../services/networkManager';

/**
 * useNetworkStatus — reactive hook for network online/offline state.
 *
 * Shows banners like "Internet connection lost" / "Internet connection restored".
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(networkManager.isOnline());
  const [wasOffline, setWasOffline] = useState<boolean>(false);
  const [showRestoredBanner, setShowRestoredBanner] = useState<boolean>(false);

  useEffect(() => {
    networkManager.init();

    const unsub = networkManager.subscribe((status: NetworkStatus) => {
      const online = status === 'ONLINE';

      if (online && !isOnline) {
        // Just came back online
        setWasOffline(true);
        setShowRestoredBanner(true);
        // Auto-hide restored banner after 5 seconds
        setTimeout(() => setShowRestoredBanner(false), 5000);
      }

      setIsOnline(online);
    });

    return () => {
      unsub();
    };
  }, [isOnline]);

  return {
    isOnline,
    wasOffline,
    showRestoredBanner,
    offlineSince: networkManager.getOfflineSince(),
  };
}
