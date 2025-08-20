import { cursorClient } from './cursor-client';
import type { Notification } from './types';

export class NotificationService {
  static async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    return await cursorClient.createNotification(notification);
  }

  static async getNotifications(userId: string): Promise<Notification[]> {
    return await cursorClient.getNotifications(userId);
  }

  static async markAsRead(notificationId: string): Promise<void> {
    return await cursorClient.updateNotification(notificationId, { isRead: true });
  }

  static async markAllAsRead(userId: string): Promise<void> {
    return await cursorClient.markAllNotificationsAsRead(userId);
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    return await cursorClient.deleteNotification(notificationId);
  }

  static async deleteAllNotifications(userId: string): Promise<void> {
    return await cursorClient.deleteAllNotifications(userId);
  }

  // Application-specific notification helpers
  static async notifyApplicationReceived(jobId: string, workerId: string, hirerId: string, jobTitle: string, workerName: string): Promise<void> {
    // Notify hirer about new application
    await this.createNotification({
      userId: hirerId,
      title: 'New Job Application',
      message: `${workerName} has applied to your job: "${jobTitle}"`,
      type: 'application_received',
      isRead: false,
      actionUrl: `/jobs/${jobId}?tab=applications`,
    });
  }

  static async notifyApplicationStatusChanged(
    applicationId: string, 
    workerId: string, 
    hirerId: string, 
    jobTitle: string, 
    status: string,
    message?: string
  ): Promise<void> {
    const statusMessages = {
      selected: 'You have been selected for the job',
      confirmed: 'Your application has been confirmed',
      rejected: 'Your application was not selected for this job',
      cancelled_by_hirer: 'The contractor cancelled your application',
    };

    const statusMessage = statusMessages[status as keyof typeof statusMessages] || 'Your application status has changed';

    // Notify worker about status change
    await this.createNotification({
      userId: workerId,
      title: 'Application Status Update',
      message: `${statusMessage}: "${jobTitle}"${message ? ` - ${message}` : ''}`,
      type: 'application_status',
      isRead: false,
      actionUrl: `/applications`,
    });
  }

  static async notifyJobAssigned(jobId: string, workerId: string, hirerId: string, jobTitle: string): Promise<void> {
    // Notify worker that they've been assigned
    await this.createNotification({
      userId: workerId,
      title: 'Job Assignment Confirmed',
      message: `You have been assigned to: "${jobTitle}"`,
      type: 'success',
      isRead: false,
      actionUrl: `/applications`,
    });

    // Notify hirer that job has been assigned
    await this.createNotification({
      userId: hirerId,
      title: 'Worker Assigned',
      message: `A worker has been assigned to your job: "${jobTitle}"`,
      type: 'success',
      isRead: false,
      actionUrl: `/jobs/${jobId}`,
    });
  }
}
