import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [liveCheckIns, setLiveCheckIns] = useState([]);
  const [liveAnnouncements, setLiveAnnouncements] = useState([]);
  const [liveAttendanceUpdates, setLiveAttendanceUpdates] = useState([]);

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const socketServerUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketServerUrl, {
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 2000
    });

    newSocket.on('connect', () => {
      console.log('Connected to EventForge Socket server');
      if (user?._id) {
        newSocket.emit('join_user', user._id);
      }
      if (user?.organizationId) {
        newSocket.emit('join_org', user.organizationId._id || user.organizationId);
      }
    });

    newSocket.on('checkin_update', (data) => {
      setLiveCheckIns((prev) => [data, ...prev.slice(0, 19)]);
    });

    newSocket.on('announcement', (data) => {
      setLiveAnnouncements((prev) => [data, ...prev.slice(0, 9)]);
    });

    newSocket.on('attendance_update', (data) => {
      setLiveAttendanceUpdates((prev) => [data, ...prev.slice(0, 19)]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token, user?._id]);

  const joinEvent = (eventId) => {
    if (socket && eventId) {
      socket.emit('join_event', eventId);
    }
  };

  const leaveEvent = (eventId) => {
    if (socket && eventId) {
      socket.emit('leave_event', eventId);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, joinEvent, leaveEvent, liveCheckIns, liveAnnouncements, liveAttendanceUpdates }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
