'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Heart, UserPlus, MessageCircle, Reply } from 'lucide-react';
import { NotificationType } from '@/types';
import { cn } from '@/lib/utils';

interface NotificationActor {
  id: string;
  display_name: string;
  slug: string;
  profile_photo: string | null;
}

interface NotificationItemData {
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

interface NotificationItemProps {
  notification: NotificationItemData;
  onMarkAsRead: (id: string) => void;
  onClose?: () => void;
}

const NOTIFICATION_CONFIG: Record<NotificationType, {
  icon: typeof Heart;
  color: string;
  getMessage: (actorName: string, payload?: NotificationItemData['payload']) => string;
  getLink: (notification: NotificationItemData) => string;
}> = {
  new_follower: {
    icon: UserPlus,
    color: 'text-[var(--color-teal)]',
    getMessage: (actorName) => `${actorName} started following you`,
    getLink: (n) => `/artists/${n.actor.slug}`,
  },
  portfolio_like: {
    icon: Heart,
    color: 'text-red-500',
    getMessage: (actorName, payload) =>
      `${actorName} liked ${payload?.portfolio_item_title ? `"${payload.portfolio_item_title}"` : 'your work'}`,
    getLink: (n) => n.payload?.portfolio_item_id
      ? `/dashboard/portfolio#${n.payload.portfolio_item_id}`
      : '/dashboard/portfolio',
  },
  portfolio_comment: {
    icon: MessageCircle,
    color: 'text-blue-500',
    getMessage: (actorName, payload) =>
      `${actorName} commented on ${payload?.portfolio_item_title ? `"${payload.portfolio_item_title}"` : 'your work'}`,
    getLink: (n) => n.payload?.portfolio_item_id
      ? `/dashboard/portfolio#${n.payload.portfolio_item_id}`
      : '/dashboard/portfolio',
  },
  comment_reply: {
    icon: Reply,
    color: 'text-purple-500',
    getMessage: (actorName) => `${actorName} replied to your comment`,
    getLink: (n) => n.payload?.portfolio_item_id
      ? `/dashboard/portfolio#${n.payload.portfolio_item_id}`
      : '/dashboard/portfolio',
  },
};

export function NotificationItem({
  notification,
  onMarkAsRead,
  onClose,
}: NotificationItemProps) {
  const config = NOTIFICATION_CONFIG[notification.notification_type];
  const Icon = config.icon;

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
    onClose?.();
  };

  return (
    <Link
      href={config.getLink(notification)}
      onClick={handleClick}
      className={cn(
        'flex items-start gap-3 p-3 hover:bg-[var(--color-cream)]/50 transition-colors',
        !notification.is_read && 'bg-[var(--color-teal)]/5'
      )}
    >
      {/* Avatar with icon badge */}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--color-cream)]">
          {notification.actor.profile_photo ? (
            <Image
              src={notification.actor.profile_photo}
              alt={notification.actor.display_name}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[var(--color-teal)] text-white font-medium">
              {notification.actor.display_name.charAt(0)}
            </div>
          )}
        </div>
        <div className={cn(
          'absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm',
          config.color
        )}>
          <Icon className="w-3 h-3" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm text-[var(--color-charcoal)]',
          !notification.is_read && 'font-medium'
        )}>
          {config.getMessage(notification.actor.display_name, notification.payload)}
        </p>
        {notification.payload?.comment_preview && (
          <p className="text-xs text-[var(--color-charcoal)]/60 mt-0.5 line-clamp-1">
            &ldquo;{notification.payload.comment_preview}&rdquo;
          </p>
        )}
        <p className="text-xs text-[var(--color-charcoal)]/50 mt-1">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p>
      </div>

      {/* Unread indicator */}
      {!notification.is_read && (
        <div className="w-2 h-2 rounded-full bg-[var(--color-teal)] flex-shrink-0 mt-2" />
      )}
    </Link>
  );
}
