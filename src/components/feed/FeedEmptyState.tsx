'use client';

import Link from 'next/link';
import { Users, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeedEmptyStateProps {
  followingCount: number;
}

export function FeedEmptyState({ followingCount }: FeedEmptyStateProps) {
  if (followingCount === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-cream)] flex items-center justify-center">
          <Users className="w-8 h-8 text-[var(--color-teal)]" />
        </div>
        <h2 className="text-xl font-display font-semibold text-[var(--color-charcoal)] mb-2">
          Start Following Artists
        </h2>
        <p className="text-[var(--color-charcoal)]/60 max-w-md mx-auto mb-6">
          Your feed shows updates from artists you follow. Discover and follow artists to see their latest work, events, and more.
        </p>
        <Link href="/artists">
          <Button className="bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)] text-white rounded-full px-6">
            <Compass className="w-4 h-4 mr-2" />
            Discover Artists
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center py-16 px-4">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-cream)] flex items-center justify-center">
        <Compass className="w-8 h-8 text-[var(--color-teal)]" />
      </div>
      <h2 className="text-xl font-display font-semibold text-[var(--color-charcoal)] mb-2">
        No Recent Activity
      </h2>
      <p className="text-[var(--color-charcoal)]/60 max-w-md mx-auto mb-6">
        The artists you follow haven&apos;t posted anything recently. Check back later or discover more artists to follow.
      </p>
      <Link href="/artists">
        <Button variant="outline" className="rounded-full px-6 border-[var(--color-teal)] text-[var(--color-teal)] hover:bg-[var(--color-teal)]/10">
          Browse Artists
        </Button>
      </Link>
    </div>
  );
}
