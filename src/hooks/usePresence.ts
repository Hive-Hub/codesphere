import { useState, useEffect } from 'react';
import { socketService } from '../services/socket';

export function usePresence() {
  const [isConnected, setIsConnected] = useState<boolean>(socketService.isConnected());

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socketService.on('connect', handleConnect);
    socketService.on('disconnect', handleDisconnect);

    return () => {
      socketService.off('connect', handleConnect);
      socketService.off('disconnect', handleDisconnect);
    };
  }, []);

  return { isConnected };
}
