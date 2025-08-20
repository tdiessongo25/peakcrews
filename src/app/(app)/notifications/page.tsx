"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, Trash2, RefreshCw } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import type { Notification } from '@/lib/types';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/notifications?userId=${currentUser?.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      } else {
        toast({
          title: 'Failed to load notifications',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast({
        title: 'Failed to load notifications',
        description: 'An error occurred while loading notifications.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
      } else {
        toast({
          title: 'Failed to mark notification as read',
          description: 'Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast({
        title: 'Failed to mark notification as read',
        description: 'An error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleNotificationAction = (notification: Notification) => {
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser?.id }),
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast({
          title: 'All notifications marked as read',
          description: 'All notifications have been marked as read.',
        });
      } else {
        toast({
          title: 'Failed to mark all as read',
          description: 'Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast({
        title: 'Failed to mark all as read',
        description: 'An error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAll = async () => {
    try {
      const response = await fetch('/api/notifications/delete-all', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser?.id }),
      });

      if (response.ok) {
        setNotifications([]);
        toast({
          title: 'All notifications cleared',
          description: 'All notifications have been deleted.',
        });
      } else {
        toast({
          title: 'Failed to clear notifications',
          description: 'Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to clear notifications:', error);
      toast({
        title: 'Failed to clear notifications',
        description: 'An error occurred.',
        variant: 'destructive',
      });
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md text-center p-8">
          <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-2xl font-bold mb-2">Access Denied</CardTitle>
          <CardDescription className="mb-6">
            You need to be logged in to view your notifications.
          </CardDescription>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <a href="/login">Login</a>
          </Button>
        </Card>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline mb-2">Notifications</h1>
        <p className="text-lg text-muted-foreground">Stay updated with your latest activities and updates.</p>
      </div>
      
      {isLoading ? (
        <Card className="shadow-lg">
          <CardContent className="flex items-center justify-center py-12">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Loading notifications...</span>
          </CardContent>
        </Card>
      ) : notifications.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                {unreadCount} unread
              </Badge>
              <span className="text-sm text-muted-foreground">
                {notifications.length} total notifications
              </span>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                  <CheckCircle size={16} className="mr-2" />
                  Mark All Read
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleDeleteAll}>
                <Trash2 size={16} className="mr-2" />
                Clear All
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {notifications.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onAction={handleNotificationAction}
              />
            ))}
          </div>
        </div>
      ) : (
        <Card className="text-center py-12 shadow-lg">
          <CardHeader>
            <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
            <CardTitle className="text-2xl">No Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-6">
              You're all caught up! Check back later for new updates.
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
