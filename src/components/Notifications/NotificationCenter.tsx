import React, { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { XMarkIcon, BellIcon } from '@heroicons/react/24/outline';
import { Alert } from '@/types';
import { socketService } from '@/services/socketService';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Connect to WebSocket
    socketService.connect();

    // Listen for new alerts
    socketService.addEventListener('alert:new', (alert: Alert) => {
      addNotification({
        id: alert.id,
        title: alert.title,
        message: alert.message,
        type: mapAlertTypeToNotificationType(alert.type),
        timestamp: new Date(alert.timestamp),
        read: false,
      });
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const mapAlertTypeToNotificationType = (
    alertType: Alert['type']
  ): Notification['type'] => {
    const map: Record<Alert['type'], Notification['type']> = {
      warning: 'warning',
      danger: 'error',
      info: 'info',
      success: 'success',
    };
    return map[alertType];
  };

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationStyle = (type: Notification['type']) => {
    const baseStyle = 'rounded-lg p-4 mb-2 relative';
    switch (type) {
      case 'success':
        return `${baseStyle} bg-green-500/20 border border-green-500/50`;
      case 'error':
        return `${baseStyle} bg-red-500/20 border border-red-500/50`;
      case 'warning':
        return `${baseStyle} bg-yellow-500/20 border border-yellow-500/50`;
      case 'info':
        return `${baseStyle} bg-blue-500/20 border border-blue-500/50`;
      default:
        return baseStyle;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-dark-accent transition"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <Transition
        show={isOpen}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
        className="absolute right-0 mt-2 w-96 max-h-[80vh] overflow-y-auto bg-dark-secondary rounded-lg shadow-lg"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-dark-muted hover:text-dark-text"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {notifications.length === 0 ? (
            <p className="text-dark-muted text-center py-4">
              No notifications
            </p>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={getNotificationStyle(notification.type)}
                onClick={() => markAsRead(notification.id)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notification.id);
                  }}
                  className="absolute top-2 right-2 text-dark-muted hover:text-dark-text"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
                <h4 className="font-medium">{notification.title}</h4>
                <p className="text-sm text-dark-muted mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-dark-muted mt-2">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))
          )}
        </div>
      </Transition>
    </div>
  );
};

export default NotificationCenter; 