import apiClient from "@/service/apiClient";

export interface Notification {
  _id: string;
  from: string;
  description: string;
  notification_type: string;
  recipient: string;
  recipient_role: "Creator" | "Recruiter";
  created_at: string;
  updated_at: string;
  __v?: number;
  is_read?: boolean; 
}

export interface NotificationsResponse {
  message: string;
  data: {
    total_filtered_data: number;
    page_count: number;
    page_data: Notification[];
  };
}

export const NotificationService = {
  async getNotifications(role: "Creator" | "Recruiter"): Promise<NotificationsResponse> {
    const response = await apiClient.get(`/notification?role=${role}`);
    return response.data;
  },

  async getNotificationCount(role: "Creator" | "Recruiter"): Promise<number> {
    try {
      const response = await apiClient.get(`/notification?role=${role}`);
      const notifications = response.data.data?.page_data || [];
      
      const unreadCount = notifications.filter(
        (notification: Notification) => !notification.is_read
      ).length;
      
      return unreadCount;
    } catch (error) {
      console.error("Error fetching notification count:", error);
      return 0;
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await apiClient.patch(`/notification/${notificationId}/read`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  },


};