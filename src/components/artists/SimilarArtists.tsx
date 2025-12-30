'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { FollowButton } from '@/components/social';
import { MediumCategory, Location, MEDIUM_LABELS, LOCATION_LABELS } from '@/types';
import { cn } from '@/lib/utils';

interface SimilarArtist {
  id: string;
  display_name: string;
  slug: string;
  tagline: string | null;
  primary_medium: MediumCategory;
  location: Location;
  profile_photo: string | null;
  featured_image: string | null;
  follower_count: number;
}

interface SimilarArtistsProps {
  artistId: string;
  artistName: string;
}

export function SimilarArtists({ artistId, artistName }: SimilarArtistsProps) {
  const [artists, setArtists] = useState<SimilarArtist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const fetchSimilarArtists = async () => {
      try {
        const response = await fetch(`/api/artists/similar?artistId=${artistId}&limit=8`);
        if (response.ok) {
          const data = await response.json();
          setArtists(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch similar artists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarArtists();
  }, [artistId]);

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('similar-artists-scroll');
    if (container) {
      const scrollAmount = 320; // Card width + gap
      const newPosition = direction === 'left'
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;

      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  // Don't render if no similar artists found
  if (!isLoading && artists.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[var(--color-charcoal)]">
            Similar Artists
          </h2>
          <p className="text-sm text-[var(--color-charcoal)]/60 mt-1">
            Artists you might also like
          </p>
        </div>

        {/* Navigation Arrows */}
        {artists.length > 3 && (
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scrollContainer('left')}
              className="p-2 rounded-full border border-[var(--color-charcoal)]/20 hover:bg-[var(--color-cream)] transition-colors disabled:opacity-50"
              disabled={scrollPosition === 0}
            >
              <ChevronLeft className="w-5 h-5 text-[var(--color-charcoal)]" />
            </button>
            <button
              onClick={() => scrollContainer('right')}
              className="p-2 rounded-full border border-[var(--color-charcoal)]/20 hover:bg-[var(--color-cream)] transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[var(--color-charcoal)]" />
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-72 bg-[var(--color-cream)] rounded-xl animate-pulse"
            >
              <div className="h-40 bg-[var(--color-charcoal)]/10 rounded-t-xl" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-[var(--color-charcoal)]/10 rounded w-2/3" />
                <div className="h-3 bg-[var(--color-charcoal)]/10 rounded w-full" />
                <div className="h-3 bg-[var(--color-charcoal)]/10 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Artists Scroll Container */
        <div
          id="similar-artists-scroll"
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
        >
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="flex-shrink-0 w-72 bg-[var(--color-warm-white)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow snap-start group"
            >
              {/* Image */}
              <Link href={`/artists/${artist.slug}`} className="block relative h-40 overflow-hidden">
                {artist.featured_image || artist.profile_photo ? (
                  <Image
                    src={artist.featured_image || artist.profile_photo || ''}
                    alt={artist.display_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--color-teal)] to-[var(--color-deep-teal)] flex items-center justify-center">
                    <span className="font-display text-4xl text-white">
                      {artist.display_name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/artists/${artist.slug}`}
                      className="font-medium text-[var(--color-charcoal)] hover:text-[var(--color-teal)] transition-colors line-clamp-1"
                    >
                      {artist.display_name}
                    </Link>
                    <p className="text-sm text-[var(--color-charcoal)]/60 mt-0.5">
                      {MEDIUM_LABELS[artist.primary_medium]}
                    </p>
                  </div>
                  <FollowButton
                    targetArtistId={artist.id}
                    initialFollowerCount={artist.follower_count}
                    variant="compact"
                  />
                </div>

                {artist.tagline && (
                  <p className="mt-2 text-sm text-[var(--color-charcoal)]/70 line-clamp-2">
                    {artist.tagline}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-1 text-xs text-[var(--color-charcoal)]/50">
                  <MapPin className="w-3 h-3" />
                  {LOCATION_LABELS[artist.location]}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hide scrollbar style */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
