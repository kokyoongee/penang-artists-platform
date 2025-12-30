'use client';

import { Loader2, Bell, Check } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { NotificationType } from '@/types';

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

interface NotificationDropdownProps {
  notifications: NotificationData[];
  isLoading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

export function NotificationDropdown({
  notifications,
  isLoading,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}: NotificationDropdownProps) {
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-[var(--color-charcoal)]/10 overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-charcoal)]/10">
        <h3 className="font-medium text-[var(--color-charcoal)]">Notifications</h3>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1 text-xs text-[var(--color-teal)] hover:text-[var(--color-teal)]/80 transition-colors"
          >
            <Check className="w-3 h-3" />
            Mark all read
          </button>
        )}
      </div>

      {/* Content */}
      <div className="max-h-[60vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--color-teal)]" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Bell className="w-10 h-10 mx-auto mb-2 text-[var(--color-charcoal)]/30" />
            <p className="text-sm text-[var(--color-charcoal)]/60">
              No notifications yet
            </p>
            <p className="text-xs text-[var(--color-charcoal)]/40 mt-1">
              When other artists follow you or interact with your work, you&apos;ll see it here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-charcoal)]/5">
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onClose={onClose}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-2 border-t border-[var(--color-charcoal)]/10 bg-[var(--color-cream)]/30">
          <button
            onClick={onClose}
            className="w-full text-center text-xs text-[var(--color-charcoal)]/60 hover:text-[var(--color-teal)] transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
