'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Ticket, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Event,
  EVENT_TYPE_LABELS,
  EVENT_TYPE_ICONS,
  LOCATION_LABELS,
  Location,
} from '@/types';

interface UpcomingEventsSectionProps {
  events: Event[];
  artistSlug: string;
}

function formatEventDate(startDate: string, endDate: string | null, isAllDay: boolean): string {
  const start = new Date(startDate);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };

  if (isAllDay) {
    if (endDate) {
      const end = new Date(endDate);
      if (start.toDateString() === end.toDateString()) {
        return start.toLocaleDateString('en-MY', options);
      }
      return `${start.toLocaleDateString('en-MY', options)} - ${end.toLocaleDateString('en-MY', { month: 'short', day: 'numeric' })}`;
    }
    return start.toLocaleDateString('en-MY', options);
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
  };

  const dateStr = start.toLocaleDateString('en-MY', options);
  const timeStr = start.toLocaleTimeString('en-MY', timeOptions);

  if (endDate) {
    const end = new Date(endDate);
    if (start.toDateString() === end.toDateString()) {
      return `${dateStr}, ${timeStr} - ${end.toLocaleTimeString('en-MY', timeOptions)}`;
    }
  }

  return `${dateStr}, ${timeStr}`;
}

export function UpcomingEventsSection({ events, artistSlug }: UpcomingEventsSectionProps) {
  if (events.length === 0) return null;

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className={`bg-[var(--color-cream)] rounded-xl overflow-hidden border border-[var(--color-charcoal)]/5 hover:border-[var(--color-teal)]/20 transition-colors ${
            event.is_featured ? 'ring-2 ring-[var(--color-ochre)]/50' : ''
          }`}
        >
          <div className="flex flex-col sm:flex-row">
            {/* Event Image */}
            {event.image_url && (
              <div className="relative w-full sm:w-32 h-32 sm:h-auto flex-shrink-0">
                <Image
                  src={event.image_url}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Event Content */}
            <div className="flex-1 p-4">
              {/* Type & Featured Badge */}
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {EVENT_TYPE_ICONS[event.event_type]} {EVENT_TYPE_LABELS[event.event_type]}
                </Badge>
                {event.is_featured && (
                  <Badge className="bg-[var(--color-ochre)] text-[var(--color-soft-black)] text-xs">
                    Featured
                  </Badge>
                )}
                {event.is_free ? (
                  <Badge className="bg-green-100 text-green-800 text-xs">Free</Badge>
                ) : event.price_info ? (
                  <Badge variant="secondary" className="text-xs">{event.price_info}</Badge>
                ) : null}
              </div>

              {/* Title */}
              <h3 className="font-display text-lg font-semibold text-[var(--color-charcoal)] mb-2">
                {event.title}
              </h3>

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-[var(--color-charcoal)]/70 mb-1">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{formatEventDate(event.start_date, event.end_date, event.is_all_day)}</span>
              </div>

              {/* Location */}
              {(event.venue || event.location) && (
                <div className="flex items-center gap-2 text-sm text-[var(--color-charcoal)]/70 mb-3">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {event.venue}
                    {event.venue && event.location && ', '}
                    {event.location && LOCATION_LABELS[event.location as Location]}
                  </span>
                </div>
              )}

              {/* Ticket Link */}
              {event.ticket_url && (
                <a
                  href={event.ticket_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-teal)] hover:text-[var(--color-deep-teal)]"
                >
                  <Ticket className="w-4 h-4" />
                  Get Tickets
                </a>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* View All Events Link */}
      <Link href="/events">
        <Button
          variant="outline"
          className="w-full mt-2 border-[var(--color-charcoal)]/20 text-[var(--color-charcoal)] hover:bg-[var(--color-cream)]"
        >
          View All Events
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}
