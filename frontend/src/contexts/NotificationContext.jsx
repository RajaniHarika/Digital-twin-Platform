import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import authService from '../services/auth';
import { dashboardApi, mapAlerts } from '../services/api';
import { getRelativeTime } from '../utils/formatters';

const NotificationContext = createContext(null);

const DISMISSED_KEY = 'twindigital_dismissed_notifications';

const getDismissedIds = () => {
  try {
    return JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]');
  } catch {
    return [];
  }
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const reloadNotifications = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setNotifications([]);
      return;
    }
    try {
      const dismissed = getDismissedIds();
      const res = await dashboardApi.getAlerts();
      setNotifications(
        mapAlerts(res.data)
          .filter((a) => !dismissed.includes(String(a.id)))
          .map((a) => ({
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

  const unreadCount = useMemo(() => notifications.length, [notifications]);

  const dismissNotification = useCallback((id) => {
    const sid = String(id);
    const dismissed = getDismissedIds();
    if (!dismissed.includes(sid)) {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify([...dismissed, sid]));
    }
    setNotifications((prev) => prev.filter((n) => String(n.id) !== sid));
  }, []);

  const dismissAllNotifications = useCallback(() => {
    const allIds = notifications.map((n) => String(n.id));
    const dismissed = getDismissedIds();
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...new Set([...dismissed, ...allIds])]));
    setNotifications([]);
  }, [notifications]);

  const value = {
    notifications,
    unreadCount,
    dismissNotification,
    dismissAllNotifications,
    reloadNotifications,
    // Legacy aliases for settings page
    markAsRead: dismissNotification,
    markAllAsRead: dismissAllNotifications,
    isRead: () => false,
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
