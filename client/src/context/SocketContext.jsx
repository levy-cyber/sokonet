import React, { createContext, useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

// Resolve socket server URL:
// - In production, VITE_API_URL might be "https://Netsoko-api.onrender.com/api"
//   so we strip the path to get the server root.
// - In dev, fall back to window.location.origin (proxied by Vite to localhost:5000).
const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    try {
      const url = new URL(apiUrl);
      return url.origin; // e.g. "https://Netsoko-api.onrender.com"
    } catch {
      return window.location.origin;
    }
  }
  return window.location.origin;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    let newSocket;

    if (user) {
      newSocket = io(getSocketUrl(), {
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('Connected to Netsoko Socket Server');
        newSocket.emit('join', user._id);
      });

      setSocket(newSocket);
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Named hook for convenient consumption in any component
export const useSocket = () => useContext(SocketContext);

