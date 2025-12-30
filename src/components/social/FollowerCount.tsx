'use client';

import { useState } from 'react';
import { FollowersModal } from './FollowersModal';

interface FollowerCountProps {
  artistId: string;
  artistName: string;
  followerCount: number;
  followingCount: number;
}

export function FollowerCount({
  artistId,
  artistName,
  followerCount,
  followingCount,
}: FollowerCountProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following'>('followers');

  const handleOpenFollowers = () => {
    setModalType('followers');
    setModalOpen(true);
  };

  const handleOpenFollowing = () => {
    setModalType('following');
    setModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-4 text-sm">
        <button
          onClick={handleOpenFollowers}
          className="hover:text-[var(--color-teal)] transition-colors"
        >
          <span className="font-semibold text-[var(--color-charcoal)]">
            {followerCount.toLocaleString()}
          </span>{' '}
          <span className="text-[var(--color-charcoal)]/60">
            {followerCount === 1 ? 'Follower' : 'Followers'}
          </span>
        </button>
        <button
          onClick={handleOpenFollowing}
          className="hover:text-[var(--color-teal)] transition-colors"
        >
          <span className="font-semibold text-[var(--color-charcoal)]">
            {followingCount.toLocaleString()}
          </span>{' '}
          <span className="text-[var(--color-charcoal)]/60">Following</span>
        </button>
      </div>

      <FollowersModal
        artistId={artistId}
        artistName={artistName}
        type={modalType}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
