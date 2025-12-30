'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { FollowButton } from './FollowButton';
import { MEDIUM_LABELS, LOCATION_LABELS, MediumCategory, Location } from '@/types';

interface FollowUser {
  id: string;
  display_name: string;
  slug: string;
  profile_photo: string | null;
  tagline: string | null;
  primary_medium: MediumCategory;
  location: Location;
}

interface FollowersModalProps {
  artistId: string;
  artistName: string;
  type: 'followers' | 'following';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FollowersModal({
  artistId,
  artistName,
  type,
  open,
  onOpenChange,
}: FollowersModalProps) {
  const [activeTab, setActiveTab] = useState(type);
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Update active tab when prop changes
  useEffect(() => {
    setActiveTab(type);
  }, [type]);

  // Fetch data when modal opens
  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [followersRes, followingRes] = await Promise.all([
          fetch(`/api/follows?artistId=${artistId}&type=followers&limit=50`),
          fetch(`/api/follows?artistId=${artistId}&type=following&limit=50`),
        ]);

        if (followersRes.ok) {
          const data = await followersRes.json();
          setFollowers(data.data || []);
          setFollowerCount(data.total || 0);
        }

        if (followingRes.ok) {
          const data = await followingRes.json();
          setFollowing(data.data || []);
          setFollowingCount(data.total || 0);
        }
      } catch (error) {
        console.error('Failed to fetch follow data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [open, artistId]);

  const renderUserList = (users: FollowUser[]) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--color-teal)]" />
        </div>
      );
    }

    if (users.length === 0) {
      return (
        <div className="text-center py-12 text-[var(--color-charcoal)]/60">
          {activeTab === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
        </div>
      );
    }

    return (
      <div className="divide-y divide-[var(--color-charcoal)]/10">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-4 py-4">
            {/* Avatar */}
            <Link href={`/artists/${user.slug}`} onClick={() => onOpenChange(false)}>
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--color-cream)] flex-shrink-0">
                {user.profile_photo ? (
                  <Image
                    src={user.profile_photo}
                    alt={user.display_name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[var(--color-teal)] text-white font-display text-lg">
                    {user.display_name.charAt(0)}
                  </div>
                )}
              </div>
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <Link
                href={`/artists/${user.slug}`}
                onClick={() => onOpenChange(false)}
                className="font-medium text-[var(--color-charcoal)] hover:text-[var(--color-teal)] transition-colors line-clamp-1"
              >
                {user.display_name}
              </Link>
              <p className="text-sm text-[var(--color-charcoal)]/60 line-clamp-1">
                {MEDIUM_LABELS[user.primary_medium]} &bull; {LOCATION_LABELS[user.location]}
              </p>
            </div>

            {/* Follow Button */}
            <FollowButton
              targetArtistId={user.id}
              variant="compact"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-xl">
            {artistName}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'followers' | 'following')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="followers">
              Followers {followerCount > 0 && `(${followerCount})`}
            </TabsTrigger>
            <TabsTrigger value="following">
              Following {followingCount > 0 && `(${followingCount})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="followers" className="mt-4 overflow-y-auto max-h-[50vh]">
            {renderUserList(followers)}
          </TabsContent>

          <TabsContent value="following" className="mt-4 overflow-y-auto max-h-[50vh]">
            {renderUserList(following)}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
