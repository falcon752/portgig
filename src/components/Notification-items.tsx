import { Notification } from "@/src/lib/requests/notifications";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (notificationId: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "JOB_CLOSED":
        return "border-l-4 border-l-red-500";
      case "NEW_MESSAGE":
        return "border-l-4 border-l-blue-500";
      case "APPLICATION_UPDATE":
        return "border-l-4 border-l-green-500";
      default:
        return "border-l-4 border-l-primary";
    }
  };

  const handleClick = () => {
    if (!notification.is_read && onMarkAsRead) {
      onMarkAsRead(notification._id);
    }
  };

  return (
    <div 
      className={`p-4 border rounded-lg bg-white shadow-sm ${getNotificationStyle(notification.notification_type)} ${
        !notification.is_read ? "border-l-4" : ""
      } cursor-pointer transition-all hover:shadow-md`}
      onClick={handleClick}
    >
      <p className="text-gray-800">{notification.description}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-500">
          From: {notification.from}
        </span>
        <span className="text-xs text-gray-400">
          {formatDate(notification.created_at)}
        </span>
      </div>
      <div className="mt-2">
        <span className="inline-block bg-gray-100 text-xs px-2 py-1 rounded text-gray-600">
          {notification.notification_type.replace(/_/g, ' ')}
        </span>
      </div>
      {!notification.is_read && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
      )}
    </div>
  );
}