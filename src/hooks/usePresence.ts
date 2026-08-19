import { useEffect, useState, useMemo, useCallback } from 'react';
import { socketService } from '../services/socket';
import { networkManager } from '../services/networkManager';
import { useSessionStore } from '../store/sessionStore';
import { SocketConnectionState } from '../types/websocket';

/**
 * usePresence — reactive hook for socket connection state and network status.
 *
 * Subscribes to the SocketService state machine and the NetworkManager.
 * Components use this instead of polling socketService.isConnected().
 */
export function usePresence() {
  const [connectionState, setConnectionState] = useState<SocketConnectionState>(
    socketService.getConnectionState()
  );
  const [isOnline, setIsOnline] = useState<boolean>(networkManager.isOnline());

  const { setSocketStatus, setNetworkStatus } = useSessionStore();

  useEffect(() => {
    // Initialize network manager
    networkManager.init();

    // Subscribe to socket state
    const unsubSocket = socketService.subscribeState((state) => {
      setConnectionState(state);
      setSocketStatus(state);
    });

    // Subscribe to network state
    const unsubNetwork = networkManager.subscribe((status) => {
      const online = status === 'ONLINE';
      setIsOnline(online);
      setNetworkStatus(status);
    });

    return () => {
      unsubSocket();
      unsubNetwork();
    };
  }, []);

  const isConnected = connectionState === 'CONNECTED';

  const statusLabel = useMemo(() => {
    if (!isOnline) return 'OFFLINE';
    switch (connectionState) {
      case 'CONNECTED': return 'LIVE';
      case 'CONNECTING': return 'CONNECTING';
      case 'RECONNECTING': return 'RECONNECTING';
      case 'FAILED': return 'CONNECTION FAILED';
      case 'DISCONNECTED': return 'DISCONNECTED';
      default: return 'DISCONNECTED';
    }
  }, [connectionState, isOnline]);

  const statusColor = useMemo(() => {
    if (!isOnline) return 'red';
    switch (connectionState) {
      case 'CONNECTED': return 'green';
      case 'CONNECTING': return 'yellow';
      case 'RECONNECTING': return 'amber';
      case 'FAILED': return 'red';
      default: return 'gray';
    }
  }, [connectionState, isOnline]);

  return {
    isConnected,
    isOnline,
    connectionState,
    statusLabel,
    statusColor,
  };
}
