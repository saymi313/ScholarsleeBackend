import { useEffect, useState, useCallback, useRef } from 'react';
import socketService from '../services/socketService';

export const useSocket = (token) => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const unsubscribersRef = useRef([]);

  useEffect(() => {
    if (!token) return;

    // Connect socket
    socketService.connect(token);

    // Listen to connection events
    const onConnected = () => {
      setConnected(true);
      setError(null);
    };

    const onDisconnected = () => {
      setConnected(false);
    };

    const onError = (data) => {
      setError(data.error);
    };

    const onReconnected = () => {
      setConnected(true);
      setError(null);
    };

    const unsubConnected = socketService.on('socket:connected', onConnected);
    const unsubDisconnected = socketService.on('socket:disconnected', onDisconnected);
    const unsubError = socketService.on('socket:error', onError);
    const unsubReconnected = socketService.on('socket:reconnected', onReconnected);

    unsubscribersRef.current = [unsubConnected, unsubDisconnected, unsubError, unsubReconnected];

    // Check initial connection state
    if (socketService.isConnected()) {
      setConnected(true);
    }

    // Cleanup
    return () => {
      unsubscribersRef.current.forEach(unsub => unsub());
    };
  }, [token]);

  const disconnect = useCallback(() => {
    socketService.disconnect();
    setConnected(false);
  }, []);

  return {
    socket: socketService,
    connected,
    error,
    disconnect
  };
};

export const useSocketEvent = (event, callback) => {
  useEffect(() => {
    if (!event || !callback) return;

    const unsubscribe = socketService.on(event, callback);

    return () => {
      unsubscribe();
    };
  }, [event, callback]);
};

export default useSocket;

