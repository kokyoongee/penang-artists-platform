import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Artist, MEDIUM_LABELS, LOCATION_LABELS } from '@/types';

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="group block bg-[var(--color-warm-white)] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Featured Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {artist.featured_image ? (
          <Image
            src={artist.featured_image}
            alt={artist.display_name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-[var(--color-cream)] flex items-center justify-center">
            <span className="text-[var(--color-charcoal)]/30 text-4xl font-display">
              {artist.display_name.charAt(0)}
            </span>
          </div>
        )}

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {artist.verified && (
            <Badge className="bg-[var(--color-teal)] text-white text-xs font-medium px-2 py-0.5">
              Verified
            </Badge>
          )}
          {artist.open_for_commissions && (
            <Badge className="bg-[var(--color-ochre)] text-[var(--color-soft-black)] text-xs font-medium px-2 py-0.5">
              Open for Work
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Profile Photo */}
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
            {artist.profile_photo ? (
              <Image
                src={artist.profile_photo}
                alt={artist.display_name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[var(--color-teal)] flex items-center justify-center text-white font-display text-lg">
                {artist.display_name.charAt(0)}
              </div>
            )}
          </div>

          {/* Name & Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-lg text-[var(--color-charcoal)] truncate group-hover:text-[var(--color-teal)] transition-colors">
              {artist.display_name}
            </h3>
            <p className="text-sm text-[var(--color-charcoal)]/60 flex items-center gap-1">
              <span>{MEDIUM_LABELS[artist.primary_medium]}</span>
              <span className="text-[var(--color-charcoal)]/30">•</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3" />
                {LOCATION_LABELS[artist.location]}
              </span>
            </p>
          </div>
        </div>

        {/* Tagline */}
        {artist.tagline && (
          <p className="mt-3 text-sm text-[var(--color-charcoal)]/70 line-clamp-2">
            {artist.tagline}
          </p>
        )}

        {/* Styles */}
        {artist.styles.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {artist.styles.slice(0, 3).map((style) => (
              <span
                key={style}
                className="text-xs px-2 py-0.5 bg-[var(--color-cream)] text-[var(--color-charcoal)]/70 rounded-full"
              >
                {style}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
