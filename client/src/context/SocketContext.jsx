import React, { createContext, useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    let newSocket;

    if (user) {
      // Connect to the server socket.io proxy
      newSocket = io(window.location.origin, {
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('Connected to SokoNet Socket Server');
        // Join personal room for this user
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
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
