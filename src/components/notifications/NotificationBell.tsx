'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { NotificationDropdown } from './NotificationDropdown';
import { NotificationType } from '@/types';
import { cn } from '@/lib/utils';

interface NotificationActor {
  id: string;
  display_name: string;
  slug: string;
  profile_photo: string | null;
}

interface NotificationData {
  id: string;
  notification_type: NotificationType;
  is_read: boolean;
  created_at: string;
  actor: NotificationActor;
  payload: {
    portfolio_item_title?: string;
    portfolio_item_id?: string;
    comment_preview?: string;
  } | null;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [myArtistId, setMyArtistId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch current artist ID
  useEffect(() => {
    const fetchArtistId = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from('artists')
          .select('id')
          .eq('user_id', user.id)
          .single() as { data: { id: string } | null };

        if (data) {
          setMyArtistId(data.id);
        }
      }
    };

    fetchArtistId();
  }, []);

  // Check for unread notifications
  useEffect(() => {
    if (!myArtistId) return;

    const checkUnread = async () => {
      try {
        const response = await fetch('/api/notifications?unreadOnly=true&limit=1');
        if (response.ok) {
          const data = await response.json();
          setHasUnread(data.unreadCount > 0);
        }
      } catch (error) {
        console.error('Failed to check notifications:', error);
      }
    };

    checkUnread();

    // Poll every 30 seconds
    const interval = setInterval(checkUnread, 30000);
    return () => clearInterval(interval);
  }, [myArtistId]);

  // Subscribe to realtime notifications
  useEffect(() => {
    if (!myArtistId) return;

    const supabase = createClient();

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${myArtistId}`,
        },
        () => {
          setHasUnread(true);
          // Refresh notifications if dropdown is open
          if (isOpen) {
            fetchNotifications();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [myArtistId, isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications?limit=20');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
        setHasUnread(data.unreadCount > 0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    fetchNotifications();
  };

  const handleMarkAsRead = async (notificationId: string) => {
    // Optimistic update
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );

    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      });

      // Update unread status
      const stillHasUnread = notifications.some(n => n.id !== notificationId && !n.is_read);
      setHasUnread(stillHasUnread);
    } catch {
      // Rollback on error
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: false } : n)
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setHasUnread(false);

    try {
      await fetch('/api/notifications/read-all', {
        method: 'POST',
      });
    } catch {
      // Rollback on error
      fetchNotifications();
    }
  };

  if (!myArtistId) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className={cn(
          'relative p-2 rounded-full transition-colors',
          isOpen
            ? 'bg-[var(--color-teal)]/10 text-[var(--color-teal)]'
            : 'text-[var(--color-charcoal)]/70 hover:text-[var(--color-charcoal)] hover:bg-[var(--color-cream)]'
        )}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          isLoading={isLoading}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
