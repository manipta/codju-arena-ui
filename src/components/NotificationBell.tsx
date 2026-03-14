import React, { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

interface Notification {
  id: string;
  type: "achievement" | "friend_request" | "battle_invite" | "streak_reminder";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data: any;
}

interface Props {
  onNotificationClick?: () => void;
}

const NotificationBell: React.FC<Props> = ({ onNotificationClick }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API}/notifications`);
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.post(`${API}/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(`${API}/notifications/mark-all-read`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return "🏆";
      case "friend_request":
        return "👥";
      case "battle_invite":
        return "⚔️";
      case "streak_reminder":
        return "🔥";
      default:
        return "📢";
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          background: "none",
          border: "none",
          color: "#F0EEE8",
          fontSize: 18,
          cursor: "pointer",
          position: "relative",
          padding: 8,
        }}
      >
        🔔
        {unreadCount > 0 && (
          <div
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              background: "#E24B4A",
              color: "#fff",
              borderRadius: "50%",
              width: 16,
              height: 16,
              fontSize: 10,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: '"Nunito", sans-serif',
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </div>
        )}
      </button>

      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            width: 300,
            maxHeight: 400,
            background: "#1E2333",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: "#F0EEE8" }}>
              Notifications
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: "none",
                  border: "none",
                  color: "#5DCAA5",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: '"Nunito", sans-serif',
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications list */}
          <div style={{ maxHeight: 320, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: 40,
                  textAlign: "center",
                  color: "#8A8FA8",
                  fontSize: 13,
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>📭</div>
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    cursor: "pointer",
                    background: notification.isRead
                      ? "transparent"
                      : "rgba(93,202,165,0.05)",
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ fontSize: 16, flexShrink: 0 }}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#F0EEE8",
                        marginBottom: 2,
                      }}
                    >
                      {notification.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#8A8FA8",
                        lineHeight: 1.4,
                      }}
                    >
                      {notification.message}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#8A8FA8",
                        marginTop: 4,
                      }}
                    >
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#5DCAA5",
                        flexShrink: 0,
                        marginTop: 4,
                      }}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
