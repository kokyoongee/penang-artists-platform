'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArtistCard } from '@/components/artists/ArtistCard';
import { Artist, MEDIUM_LABELS, LOCATION_LABELS } from '@/types';

interface ArtistsDirectoryProps {
  artists: Artist[];
}

export function ArtistsDirectory({ artists }: ArtistsDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedium, setSelectedMedium] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredArtists = useMemo(() => {
    let results = artists;

    if (selectedMedium !== 'all') {
      results = results.filter(
        (a) =>
          a.primary_medium === selectedMedium ||
          (a.secondary_mediums && a.secondary_mediums.includes(selectedMedium as any))
      );
    }

    if (selectedLocation !== 'all') {
      results = results.filter((a) => a.location === selectedLocation);
    }

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      results = results.filter(
        (a) =>
          a.display_name.toLowerCase().includes(searchLower) ||
          a.tagline?.toLowerCase().includes(searchLower) ||
          a.bio?.toLowerCase().includes(searchLower)
      );
    }

    return results;
  }, [artists, searchQuery, selectedMedium, selectedLocation]);

  const hasActiveFilters = selectedMedium !== 'all' || selectedLocation !== 'all' || searchQuery;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMedium('all');
    setSelectedLocation('all');
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Header */}
      <section className="bg-[var(--color-deep-teal)] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-sm font-medium text-[var(--color-ochre)] uppercase tracking-wider">
            Directory
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mt-2">
            Discover Artists
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl">
            Explore our curated collection of Penang&apos;s finest creative talents.
            Filter by medium, location, or search for specific artists.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[72px] z-40 bg-[var(--color-warm-white)] border-b border-black/5 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-charcoal)]/40" />
              <Input
                type="text"
                placeholder="Search artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-5 bg-white border-[var(--color-charcoal)]/10 focus:border-[var(--color-teal)] rounded-xl"
              />
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:flex gap-3">
              <Select value={selectedMedium} onValueChange={setSelectedMedium}>
                <SelectTrigger className="w-[180px] py-5 bg-white border-[var(--color-charcoal)]/10 rounded-xl">
                  <SelectValue placeholder="All Mediums" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Mediums</SelectItem>
                  {Object.entries(MEDIUM_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-[180px] py-5 bg-white border-[var(--color-charcoal)]/10 rounded-xl">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {Object.entries(LOCATION_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-[var(--color-charcoal)]/60 hover:text-[var(--color-charcoal)]"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden border-[var(--color-charcoal)]/10 rounded-xl"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <Badge className="ml-2 bg-[var(--color-teal)] text-white text-xs">
                  Active
                </Badge>
              )}
            </Button>
          </div>

          {/* Mobile Filters Dropdown */}
          {showFilters && (
            <div className="md:hidden mt-4 pt-4 border-t border-[var(--color-charcoal)]/10 space-y-3">
              <Select value={selectedMedium} onValueChange={setSelectedMedium}>
                <SelectTrigger className="w-full py-5 bg-white border-[var(--color-charcoal)]/10 rounded-xl">
                  <SelectValue placeholder="All Mediums" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Mediums</SelectItem>
                  {Object.entries(MEDIUM_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full py-5 bg-white border-[var(--color-charcoal)]/10 rounded-xl">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {Object.entries(LOCATION_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="w-full text-[var(--color-charcoal)]/60"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Artists Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Results Count */}
          <div className="mb-8 flex items-center justify-between">
            <p className="text-[var(--color-charcoal)]/60">
              Showing <span className="font-medium text-[var(--color-charcoal)]">{filteredArtists.length}</span> artist{filteredArtists.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Grid */}
          {filteredArtists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-[var(--color-charcoal)]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-[var(--color-charcoal)]/30" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[var(--color-charcoal)] mb-2">
                No artists found
              </h3>
              <p className="text-[var(--color-charcoal)]/60 mb-6">
                {artists.length === 0
                  ? 'No approved artists yet. Check back soon!'
                  : 'Try adjusting your search or filters'}
              </p>
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  className="bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)] text-white rounded-full"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
