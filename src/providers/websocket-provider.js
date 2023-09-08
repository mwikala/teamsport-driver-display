import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const newWs = new WebSocket('wss://webserver16.sms-timing.com:10015/');
    setWs(newWs);

    return () => {
      newWs.close();
    }
  }, [])

  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (initialMessage) => {
  const ws = useContext(WebSocketContext);
  if (ws) {
    ws.onopen = () => {
      ws.send(initialMessage);
    }
  }
  return ws;
};
