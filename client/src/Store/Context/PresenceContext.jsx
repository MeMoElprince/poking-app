import { createContext, useState, useEffect, useCallback } from 'react';
import socket from '../socket';

export const PresenceCtx = createContext();

// eslint-disable-next-line react/prop-types
export default function PresenceContext({ children }) {
  const [online, setOnline] = useState(() => new Set());
  const [lastSeen, setLastSeen] = useState({});

  useEffect(() => {
    const onInit = (ids) => setOnline(new Set(ids));
    const onPresence = ({ userId, online: isOnline, lastSeen: seen }) => {
      setOnline((prev) => {
        const next = new Set(prev);
        if (isOnline) next.add(userId);
        else next.delete(userId);
        return next;
      });
      if (!isOnline && seen) setLastSeen((prev) => ({ ...prev, [userId]: seen }));
    };

    socket.on('presence:init', onInit);
    socket.on('presence', onPresence);
    return () => {
      socket.off('presence:init', onInit);
      socket.off('presence', onPresence);
    };
  }, []);

  const isOnline = useCallback((id) => online.has(id), [online]);
  const getLastSeen = useCallback((id) => lastSeen[id], [lastSeen]);

  return (
    <PresenceCtx.Provider value={{ online, isOnline, getLastSeen }}>
      {children}
    </PresenceCtx.Provider>
  );
}
