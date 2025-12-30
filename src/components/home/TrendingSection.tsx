'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TrendingUp, ArrowRight, MapPin, Users } from 'lucide-react';
import { FollowButton } from '@/components/social';
import { RevealSection } from '@/components/ui/RevealSection';
import { MediumCategory, Location, MEDIUM_LABELS, LOCATION_LABELS } from '@/types';

interface TrendingArtist {
  id: string;
  display_name: string;
  slug: string;
  tagline: string | null;
  primary_medium: MediumCategory;
  location: Location;
  profile_photo: string | null;
  featured_image: string | null;
  follower_count: number;
  new_followers?: number;
}

export function TrendingSection() {
  const [artists, setArtists] = useState<TrendingArtist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<string>('7_days');

  useEffect(() => {
    const fetchTrendingArtists = async () => {
      try {
        const response = await fetch('/api/artists/trending?limit=4');
        if (response.ok) {
          const data = await response.json();
          setArtists(data.data || []);
          setPeriod(data.period);
        }
      } catch (error) {
        console.error('Failed to fetch trending artists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingArtists();
  }, []);

  // Don't render if no trending artists
  if (!isLoading && artists.length === 0) {
    return null;
  }

  const getPeriodLabel = () => {
    switch (period) {
      case '7_days':
        return 'Trending This Week';
      case 'featured':
        return 'Featured Artists';
      case 'all_time':
        return 'Popular Artists';
      default:
        return 'Trending Artists';
    }
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-[var(--color-cream)] to-[var(--color-warm-white)]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <RevealSection>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[var(--color-terracotta)]" />
                <span className="text-sm font-medium text-[var(--color-terracotta)] uppercase tracking-wider">
                  {period === '7_days' ? 'Trending' : 'Discover'}
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-charcoal)] mt-2">
                {getPeriodLabel()}
              </h2>
              {period === '7_days' && (
                <p className="mt-2 text-[var(--color-charcoal)]/60">
                  Artists gaining momentum in the community
                </p>
              )}
            </div>
            <Link
              href="/artists"
              className="text-[var(--color-teal)] font-medium flex items-center gap-2 hover:gap-3 transition-all"
            >
              View all artists
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </RevealSection>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
              >
                <div className="h-48 bg-[var(--color-charcoal)]/10" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-[var(--color-charcoal)]/10 rounded w-2/3" />
                  <div className="h-4 bg-[var(--color-charcoal)]/10 rounded w-full" />
                  <div className="h-4 bg-[var(--color-charcoal)]/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <RevealSection delay={100} stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {artists.map((artist, index) => (
                <div
                  key={artist.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Image */}
                  <Link href={`/artists/${artist.slug}`} className="block relative h-48 overflow-hidden">
                    {artist.featured_image || artist.profile_photo ? (
                      <Image
                        src={artist.featured_image || artist.profile_photo || ''}
                        alt={artist.display_name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--color-teal)] to-[var(--color-deep-teal)] flex items-center justify-center">
                        <span className="font-display text-5xl text-white">
                          {artist.display_name.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Trending Badge */}
                    {period === '7_days' && artist.new_followers && artist.new_followers > 0 && (
                      <div className="absolute top-3 left-3 bg-[var(--color-terracotta)] text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +{artist.new_followers} this week
                      </div>
                    )}

                    {/* Rank Badge */}
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="font-display font-bold text-[var(--color-charcoal)]">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/artists/${artist.slug}`}
                          className="font-display text-lg font-semibold text-[var(--color-charcoal)] hover:text-[var(--color-teal)] transition-colors line-clamp-1"
                        >
                          {artist.display_name}
                        </Link>
                        <p className="text-sm text-[var(--color-charcoal)]/60 mt-0.5">
                          {MEDIUM_LABELS[artist.primary_medium]}
                        </p>
                      </div>
                    </div>

                    {artist.tagline && (
                      <p className="mt-2 text-sm text-[var(--color-charcoal)]/70 line-clamp-2">
                        {artist.tagline}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-[var(--color-charcoal)]/50">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {LOCATION_LABELS[artist.location]}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {artist.follower_count || 0}
                        </span>
                      </div>
                      <FollowButton
                        targetArtistId={artist.id}
                        initialFollowerCount={artist.follower_count}
                        variant="compact"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        )}
      </div>
    </section>
  );
}
