/**
 * App Provider - Unified Context Provider
 * Combines all app-wide providers (Auth, Theme, Notifications, etc.)
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { APP_CONFIG, getSocketUrl } from '../config/app.config.js';

// ============ CONTEXT CREATION ============

const AuthContext = createContext();
const ThemeContext = createContext();
const NotificationContext = createContext();

// ============ UNIFIED PROVIDER ============

export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

// ============ AUTH PROVIDER ============

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(APP_CONFIG.storage.user);
      if (!stored || stored === 'undefined') return null;
      return JSON.parse(stored);
    } catch (err) {
      console.error('Failed to parse user from localStorage:', err);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem(APP_CONFIG.storage.token);
    return storedToken && storedToken !== 'undefined' ? storedToken : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setAuth = useCallback(({ user: newUser, token: newToken }) => {
    if (newUser && typeof newUser === 'object') {
      setUser(newUser);
      localStorage.setItem(APP_CONFIG.storage.user, JSON.stringify(newUser));
    }

    if (typeof newToken === 'string' && newToken.trim() !== '') {
      setToken(newToken);
      localStorage.setItem(APP_CONFIG.storage.token, newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    }

    setError(null);
    window.dispatchEvent(new Event('authUpdate'));
  }, []);

  const updateUser = useCallback((newData) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...newData };
      localStorage.setItem(APP_CONFIG.storage.user, JSON.stringify(updated));
      window.dispatchEvent(new Event('authUpdate'));
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(APP_CONFIG.storage.user);
    localStorage.removeItem(APP_CONFIG.storage.token);
    delete axios.defaults.headers.common['Authorization'];
    setError(null);
    window.dispatchEvent(new Event('authUpdate'));
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    setAuth,
    updateUser,
    logout,
    isAuthenticated: !!user && !!token,
    hasRole: (roles) => {
      if (!user) return false;
      if (typeof roles === 'string') return user.role === roles;
      return Array.isArray(roles) && roles.includes(user.role);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============ THEME PROVIDER ============

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(APP_CONFIG.storage.theme);
    return saved || 'light';
  });

  useEffect(() => {
    localStorage.setItem(APP_CONFIG.storage.theme, theme);
    // Update document class for Tailwind dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const value = { theme, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// ============ NOTIFICATION PROVIDER ============

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  const fetchNotifications = useCallback(async (token) => {
    if (!token) return;
    try {
      const response = await axios.get(
        APP_CONFIG.api.baseURL + APP_CONFIG.api.endpoints.notifications.list,
        { withCredentials: true }
      );
      const notifs = response.data.data?.notifications || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem(APP_CONFIG.storage.user);
    const tokenData = localStorage.getItem(APP_CONFIG.storage.token);
    const user = userData ? JSON.parse(userData) : null;

    if (!user || !tokenData) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    const connectSocket = () => {
      try {
        const newSocket = io(getSocketUrl(), {
          withCredentials: true,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        });

        newSocket.on('connect', () => {
          console.log('Connected to notifications socket');
          newSocket.emit('join', user._id);
          setConnected(true);
          fetchNotifications(tokenData);
        });

        newSocket.on('new_notification', (notification) => {
          setNotifications((prev) => [notification, ...prev]);
          setUnreadCount((prev) => prev + 1);

          // Browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title || 'New Notification', {
              body: notification.message,
              icon: '/logo.png',
            });
          }
        });

        newSocket.on('disconnect', () => {
          console.log('Disconnected from notifications socket');
          setConnected(false);
        });

        setSocket(newSocket);
        return newSocket;
      } catch (err) {
        console.error('Error connecting to notifications socket:', err);
        return null;
      }
    };

    const socketInstance = connectSocket();

    const handleAuthUpdate = () => {
      if (socketInstance) socketInstance.disconnect();
      connectSocket();
    };

    window.addEventListener('authUpdate', handleAuthUpdate);

    return () => {
      window.removeEventListener('authUpdate', handleAuthUpdate);
      if (socketInstance) socketInstance.disconnect();
    };
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await axios.put(
        APP_CONFIG.api.baseURL + APP_CONFIG.api.endpoints.notifications.markRead.replace(':id', notificationId),
        {},
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await axios.put(
        APP_CONFIG.api.baseURL + APP_CONFIG.api.endpoints.notifications.markAllRead,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await axios.delete(
        APP_CONFIG.api.baseURL + APP_CONFIG.api.endpoints.notifications.delete.replace(':id', notificationId),
        { withCredentials: true }
      );
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  }, []);

  const value = {
    notifications,
    unreadCount,
    connected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
};

// ============ CUSTOM HOOKS ============

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AppProvider');
  }
  return context;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within AppProvider');
  }
  return context;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within AppProvider');
  }
  return context;
};

// Combined hook for all auth features
export const useAppContext = () => {
  return {
    auth: useAuth(),
    theme: useTheme(),
    notifications: useNotifications(),
  };
};
