'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Clock, Ticket, ExternalLink, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  EventWithArtist,
  EventType,
  EVENT_TYPE_LABELS,
  EVENT_TYPE_ICONS,
  LOCATION_LABELS,
  Location,
} from '@/types';

interface EventsDirectoryProps {
  upcomingEvents: EventWithArtist[];
  pastEvents: EventWithArtist[];
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
      return `${start.toLocaleDateString('en-MY', options)} - ${end.toLocaleDateString('en-MY', options)}`;
    }
    return start.toLocaleDateString('en-MY', options);
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    ...options,
    hour: 'numeric',
    minute: '2-digit',
  };

  if (endDate) {
    const end = new Date(endDate);
    if (start.toDateString() === end.toDateString()) {
      return `${start.toLocaleDateString('en-MY', options)}, ${start.toLocaleTimeString('en-MY', { hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString('en-MY', { hour: 'numeric', minute: '2-digit' })}`;
    }
    return `${start.toLocaleDateString('en-MY', timeOptions)} - ${end.toLocaleDateString('en-MY', timeOptions)}`;
  }

  return start.toLocaleDateString('en-MY', timeOptions);
}

function EventCard({ event, isPast = false }: { event: EventWithArtist; isPast?: boolean }) {
  return (
    <div
      className={`bg-[var(--color-warm-white)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all ${
        isPast ? 'opacity-70' : ''
      } ${event.is_featured ? 'ring-2 ring-[var(--color-ochre)]' : ''}`}
    >
      {/* Image */}
      <div className="relative h-48 bg-[var(--color-cream)]">
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {EVENT_TYPE_ICONS[event.event_type]}
          </div>
        )}
        {event.is_featured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-[var(--color-ochre)] text-[var(--color-soft-black)]">
              Featured
            </Badge>
          </div>
        )}
        {isPast && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary">Past Event</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Event Type Badge */}
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {EVENT_TYPE_ICONS[event.event_type]} {EVENT_TYPE_LABELS[event.event_type]}
          </Badge>
          {event.is_free ? (
            <Badge className="bg-green-100 text-green-800 text-xs">Free</Badge>
          ) : event.price_info ? (
            <Badge variant="secondary" className="text-xs">{event.price_info}</Badge>
          ) : null}
        </div>

        {/* Title */}
        <h3 className="font-display text-xl font-semibold text-[var(--color-charcoal)] mb-2 line-clamp-2">
          {event.title}
        </h3>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-sm text-[var(--color-charcoal)]/70 mb-2">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>{formatEventDate(event.start_date, event.end_date, event.is_all_day)}</span>
        </div>

        {/* Location */}
        {(event.venue || event.location) && (
          <div className="flex items-center gap-2 text-sm text-[var(--color-charcoal)]/70 mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">
              {event.venue}
              {event.venue && event.location && ', '}
              {event.location && LOCATION_LABELS[event.location as Location]}
            </span>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <p className="text-sm text-[var(--color-charcoal)]/60 line-clamp-2 mb-4">
            {event.description}
          </p>
        )}

        {/* Artist */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-charcoal)]/10">
          <Link
            href={`/artists/${event.artist.slug}`}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--color-teal)]">
              {event.artist.profile_photo ? (
                <Image
                  src={event.artist.profile_photo}
                  alt={event.artist.display_name}
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-sm font-medium">
                  {event.artist.display_name.charAt(0)}
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-[var(--color-charcoal)]">
              {event.artist.display_name}
            </span>
          </Link>

          {event.ticket_url && !isPast && (
            <a
              href={event.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-teal)] hover:text-[var(--color-deep-teal)]"
            >
              <Ticket className="w-4 h-4" />
              Get Tickets
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function EventsDirectory({ upcomingEvents, pastEvents }: EventsDirectoryProps) {
  const [selectedType, setSelectedType] = useState<EventType | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<Location | 'all'>('all');
  const [showPast, setShowPast] = useState(false);

  // Get unique event types and locations from upcoming events
  const eventTypes = useMemo(() => {
    const types = new Set<EventType>();
    upcomingEvents.forEach((e) => types.add(e.event_type));
    return Array.from(types);
  }, [upcomingEvents]);

  const locations = useMemo(() => {
    const locs = new Set<Location>();
    upcomingEvents.forEach((e) => {
      if (e.location) locs.add(e.location as Location);
    });
    return Array.from(locs);
  }, [upcomingEvents]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return upcomingEvents.filter((event) => {
      if (selectedType !== 'all' && event.event_type !== selectedType) return false;
      if (selectedLocation !== 'all' && event.location !== selectedLocation) return false;
      return true;
    });
  }, [upcomingEvents, selectedType, selectedLocation]);

  const clearFilters = () => {
    setSelectedType('all');
    setSelectedLocation('all');
  };

  const hasActiveFilters = selectedType !== 'all' || selectedLocation !== 'all';

  return (
    <div>
      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          {/* Event Type Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedType === 'all'
                  ? 'bg-[var(--color-charcoal)] text-white'
                  : 'bg-[var(--color-warm-white)] text-[var(--color-charcoal)] hover:bg-[var(--color-charcoal)]/10'
              }`}
            >
              All Types
            </button>
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedType === type
                    ? 'bg-[var(--color-teal)] text-white'
                    : 'bg-[var(--color-warm-white)] text-[var(--color-charcoal)] hover:bg-[var(--color-teal)]/10'
                }`}
              >
                {EVENT_TYPE_ICONS[type]} {EVENT_TYPE_LABELS[type]}
              </button>
            ))}
          </div>

          {/* Location Filter */}
          {locations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-[var(--color-charcoal)]/50 self-center">|</span>
              <button
                onClick={() => setSelectedLocation('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedLocation === 'all'
                    ? 'bg-[var(--color-charcoal)] text-white'
                    : 'bg-[var(--color-warm-white)] text-[var(--color-charcoal)] hover:bg-[var(--color-charcoal)]/10'
                }`}
              >
                All Locations
              </button>
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedLocation === loc
                      ? 'bg-[var(--color-terracotta)] text-white'
                      : 'bg-[var(--color-warm-white)] text-[var(--color-charcoal)] hover:bg-[var(--color-terracotta)]/10'
                  }`}
                >
                  {LOCATION_LABELS[loc]}
                </button>
              ))}
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-[var(--color-charcoal)]/60 hover:text-[var(--color-charcoal)] underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mb-12">
        <h2 className="font-display text-2xl font-semibold text-[var(--color-charcoal)] mb-6">
          Upcoming Events
          {filteredEvents.length > 0 && (
            <span className="text-[var(--color-charcoal)]/50 font-normal ml-2">
              ({filteredEvents.length})
            </span>
          )}
        </h2>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center py-16 bg-[var(--color-warm-white)] rounded-2xl">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="font-display text-xl font-semibold text-[var(--color-charcoal)] mb-2">
              No Upcoming Events
            </h3>
            <p className="text-[var(--color-charcoal)]/60 max-w-md mx-auto">
              Check back soon for exhibitions, workshops, and more from Penang&apos;s creative community.
            </p>
          </div>
        ) : (
          <div className="text-center py-12 bg-[var(--color-warm-white)] rounded-2xl">
            <p className="text-[var(--color-charcoal)]/60">
              No events match your filters.{' '}
              <button onClick={clearFilters} className="text-[var(--color-teal)] underline">
                Clear filters
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <button
            onClick={() => setShowPast(!showPast)}
            className="flex items-center gap-2 font-display text-xl font-semibold text-[var(--color-charcoal)]/70 hover:text-[var(--color-charcoal)] mb-6"
          >
            Past Events
            <ChevronDown
              className={`w-5 h-5 transition-transform ${showPast ? 'rotate-180' : ''}`}
            />
          </button>

          {showPast && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} isPast />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
