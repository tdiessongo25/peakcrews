"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Briefcase,
  MessageSquare,
  Bell,
  AlertCircle
} from 'lucide-react';
import type { Notification } from '@/lib/types';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (notificationId: string) => void;
  onAction?: (notification: Notification) => void;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'profile_approved':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'profile_rejected':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'application_received':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'application_status':
      return <Briefcase className="h-5 w-5 text-orange-500" />;
    case 'message':
      return <MessageSquare className="h-5 w-5 text-purple-500" />;
    case 'reminder':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'profile_approved':
      return 'bg-green-50 border-green-200';
    case 'profile_rejected':
      return 'bg-red-50 border-red-200';
    case 'application_received':
      return 'bg-blue-50 border-blue-200';
    case 'application_status':
      return 'bg-orange-50 border-orange-200';
    case 'message':
      return 'bg-purple-50 border-purple-200';
    case 'reminder':
      return 'bg-yellow-50 border-yellow-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

export function NotificationItem({ notification, onMarkAsRead, onAction }: NotificationItemProps) {
  const handleMarkAsRead = () => {
    onMarkAsRead(notification.id);
  };

  const handleAction = () => {
    if (onAction) {
      onAction(notification);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className={`${getNotificationColor(notification.type)} hover:shadow-md transition-shadow ${!notification.isRead ? 'ring-2 ring-primary/20' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {getNotificationIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatTime(notification.createdAt)}</span>
                  {!notification.isRead && (
                    <Badge variant="secondary" className="text-xs">New</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1 ml-2">
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAsRead}
                    className="h-6 w-6 p-0"
                  >
                    <CheckCircle className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            
            {notification.actionUrl && onAction && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAction}
                  className="text-xs"
                >
                  {notification.type === 'profile_approved' && 'View Profile'}
                  {notification.type === 'profile_rejected' && 'Update Profile'}
                  {notification.type === 'application_received' && 'View Application'}
                  {notification.type === 'application_status' && 'View Details'}
                  {notification.type === 'message' && 'Reply'}
                  {notification.type === 'reminder' && 'Take Action'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
