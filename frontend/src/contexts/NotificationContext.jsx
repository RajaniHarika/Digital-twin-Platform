import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import authService from '../services/auth';
import { dashboardApi, mapAlerts } from '../services/api';
import { getRelativeTime } from '../utils/formatters';

const NotificationContext = createContext(null);

const STORAGE_KEY = 'twindigital_read_notifications';

export const NotificationProvider = ({ children }) => {
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [notifications, setNotifications] = useState([]);

  const reloadNotifications = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setNotifications([]);
      return;
    }
    try {
      const res = await dashboardApi.getAlerts();
      setNotifications(
        mapAlerts(res.data).map((a) => ({
          id: a.id,
          title: a.title,
          message: a.message || a.title,
          time: a.timestamp || getRelativeTime(new Date().toISOString()),
          acknowledged: a.status === 'Resolved',
        }))
      );
    } catch {
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    reloadNotifications();
    window.addEventListener('auth:changed', reloadNotifications);
    return () => window.removeEventListener('auth:changed', reloadNotifications);
  }, [reloadNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !readIds.includes(String(n.id))).length,
    [notifications, readIds]
  );

  const isRead = useCallback((id) => readIds.includes(String(id)), [readIds]);

  const markAsRead = useCallback((id) => {
    const sid = String(id);
    setReadIds((prev) => {
      if (prev.includes(sid)) return prev;
      const next = [...prev, sid];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    const all = notifications.map((n) => String(n.id));
    setReadIds(all);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }, [notifications]);

  const value = {
    notifications,
    unreadCount,
    isRead,
    markAsRead,
    markAllAsRead,
    reloadNotifications,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export default NotificationProvider;
