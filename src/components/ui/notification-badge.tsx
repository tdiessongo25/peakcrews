"use client";

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface NotificationBadgeProps {
  className?: string;
}

export function NotificationBadge({ className }: NotificationBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useUser();

  useEffect(() => {
    if (currentUser) {
      fetchUnreadCount();
    }
  }, [currentUser]);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`/api/notifications?userId=${currentUser?.id}&unreadOnly=true`);
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.notifications.length);
      }
    } catch (error) {
      console.error('Failed to fetch notification count:', error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className={`relative ${className}`}>
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </div>
  );
}
