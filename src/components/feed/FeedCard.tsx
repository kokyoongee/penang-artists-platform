'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ImageIcon, CalendarDays, Briefcase, MoreHorizontal } from 'lucide-react';
import { LikeButton } from '@/components/social';
import { ActivityType, MediumCategory, MEDIUM_LABELS } from '@/types';
import { cn } from '@/lib/utils';

interface FeedArtist {
  id: string;
  display_name: string;
  slug: string;
  profile_photo: string | null;
  primary_medium: MediumCategory;
}

interface FeedActivity {
  id: string;
  activity_type: ActivityType;
  created_at: string;
  artist: FeedArtist;
  entity_data: {
    // Portfolio item
    title?: string;
    description?: string;
    image_url?: string;
    portfolio_item_id?: string;
    like_count?: number;
    // Event
    event_title?: string;
    event_type?: string;
    start_date?: string;
    venue?: string;
    event_id?: string;
    // Service
    service_title?: string;
    service_type?: string;
    price_display?: string;
    service_id?: string;
  } | null;
}

interface FeedCardProps {
  activity: FeedActivity;
}

const ACTIVITY_CONFIG: Record<ActivityType, {
  icon: typeof ImageIcon;
  getLabel: () => string;
}> = {
  portfolio_item_added: {
    icon: ImageIcon,
    getLabel: () => 'added new work',
  },
  event_created: {
    icon: CalendarDays,
    getLabel: () => 'created an event',
  },
  service_added: {
    icon: Briefcase,
    getLabel: () => 'added a service',
  },
};

export function FeedCard({ activity }: FeedCardProps) {
  const config = ACTIVITY_CONFIG[activity.activity_type];
  const Icon = config.icon;
  const data = activity.entity_data;

  return (
    <article className="bg-white rounded-xl border border-[var(--color-charcoal)]/10 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <Link href={`/artists/${activity.artist.slug}`}>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--color-cream)] flex-shrink-0">
            {activity.artist.profile_photo ? (
              <Image
                src={activity.artist.profile_photo}
                alt={activity.artist.display_name}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[var(--color-teal)] text-white font-medium">
                {activity.artist.display_name.charAt(0)}
              </div>
            )}
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link
              href={`/artists/${activity.artist.slug}`}
              className="font-medium text-[var(--color-charcoal)] hover:text-[var(--color-teal)] transition-colors"
            >
              {activity.artist.display_name}
            </Link>
            <span className="text-[var(--color-charcoal)]/60 text-sm">
              {config.getLabel()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-charcoal)]/50">
            <span>{MEDIUM_LABELS[activity.artist.primary_medium]}</span>
            <span>&bull;</span>
            <span>{formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}</span>
          </div>
        </div>

        <button className="p-1.5 text-[var(--color-charcoal)]/40 hover:text-[var(--color-charcoal)] transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content based on activity type */}
      {activity.activity_type === 'portfolio_item_added' && data?.image_url && (
        <>
          {/* Image */}
          <div className="relative aspect-[4/3] bg-[var(--color-cream)]">
            <Image
              src={data.image_url}
              alt={data.title || 'Portfolio item'}
              fill
              className="object-cover"
            />
          </div>

          {/* Caption */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {data.title && (
                  <h3 className="font-medium text-[var(--color-charcoal)] mb-1">
                    {data.title}
                  </h3>
                )}
                {data.description && (
                  <p className="text-sm text-[var(--color-charcoal)]/70 line-clamp-2">
                    {data.description}
                  </p>
                )}
              </div>
              {data.portfolio_item_id && (
                <LikeButton
                  portfolioItemId={data.portfolio_item_id}
                  initialLikeCount={data.like_count ?? 0}
                  variant="compact"
                />
              )}
            </div>
          </div>
        </>
      )}

      {activity.activity_type === 'event_created' && data && (
        <div className="p-4 pt-0">
          <Link
            href={`/events#${data.event_id}`}
            className="block p-4 rounded-lg bg-[var(--color-cream)]/50 hover:bg-[var(--color-cream)] transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-teal)]/10 flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-6 h-6 text-[var(--color-teal)]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[var(--color-charcoal)] mb-1">
                  {data.event_title}
                </h3>
                <p className="text-sm text-[var(--color-charcoal)]/60">
                  {data.start_date && new Date(data.start_date).toLocaleDateString('en-MY', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                  {data.venue && ` • ${data.venue}`}
                </p>
              </div>
            </div>
          </Link>
        </div>
      )}

      {activity.activity_type === 'service_added' && data && (
        <div className="p-4 pt-0">
          <Link
            href={`/artists/${activity.artist.slug}#services`}
            className="block p-4 rounded-lg bg-[var(--color-cream)]/50 hover:bg-[var(--color-cream)] transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-ochre)]/10 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-[var(--color-ochre)]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[var(--color-charcoal)] mb-1">
                  {data.service_title}
                </h3>
                <p className="text-sm text-[var(--color-charcoal)]/60">
                  {data.service_type}
                  {data.price_display && ` • ${data.price_display}`}
                </p>
              </div>
            </div>
          </Link>
        </div>
      )}
    </article>
  );
}
