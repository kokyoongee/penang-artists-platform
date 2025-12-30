'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Comment } from '@/types';
import { cn } from '@/lib/utils';

interface CommentItemProps {
  comment: Comment & {
    artist: {
      id: string;
      display_name: string;
      slug: string;
      profile_photo: string | null;
    };
  };
  currentArtistId: string | null;
  isPortfolioOwner: boolean;
  onDelete: (commentId: string) => Promise<void>;
  onEdit: (commentId: string, content: string) => Promise<void>;
  onReply?: (commentId: string) => void;
  depth?: number;
}

export function CommentItem({
  comment,
  currentArtistId,
  isPortfolioOwner,
  onDelete,
  onEdit,
  onReply,
  depth = 0,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const canEdit = currentArtistId === comment.artist_id;
  const canDelete = canEdit || isPortfolioOwner;

  const handleSaveEdit = async () => {
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false);
      setEditContent(comment.content);
      return;
    }

    setIsSaving(true);
    try {
      await onEdit(comment.id, editContent.trim());
      setIsEditing(false);
    } catch {
      // Keep editing state on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this comment?')) return;

    setIsDeleting(true);
    try {
      await onDelete(comment.id);
    } catch {
      setIsDeleting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditContent(comment.content);
    }
  };

  return (
    <div
      className={cn(
        'group',
        depth > 0 && 'ml-8 pl-4 border-l-2 border-[var(--color-charcoal)]/10'
      )}
    >
      <div className="flex gap-3 py-3">
        {/* Avatar */}
        <Link href={`/artists/${comment.artist.slug}`} className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--color-cream)]">
            {comment.artist.profile_photo ? (
              <Image
                src={comment.artist.profile_photo}
                alt={comment.artist.display_name}
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[var(--color-teal)] text-white text-sm font-medium">
                {comment.artist.display_name.charAt(0)}
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/artists/${comment.artist.slug}`}
              className="text-sm font-medium text-[var(--color-charcoal)] hover:text-[var(--color-teal)] transition-colors"
            >
              {comment.artist.display_name}
            </Link>
            <span className="text-xs text-[var(--color-charcoal)]/50">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
            {comment.is_edited && (
              <span className="text-xs text-[var(--color-charcoal)]/40">(edited)</span>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 text-sm border border-[var(--color-charcoal)]/20 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent"
                rows={2}
                maxLength={1000}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="px-3 py-1 text-xs font-medium text-white bg-[var(--color-teal)] rounded-md hover:bg-[var(--color-teal)]/90 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="px-3 py-1 text-xs font-medium text-[var(--color-charcoal)]/70 hover:text-[var(--color-charcoal)]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--color-charcoal)]/80 whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          )}

          {/* Actions */}
          {!isEditing && (
            <div className="flex items-center gap-3 mt-2">
              {onReply && depth === 0 && (
                <button
                  onClick={() => onReply(comment.id)}
                  className="text-xs text-[var(--color-charcoal)]/50 hover:text-[var(--color-teal)] transition-colors"
                >
                  Reply
                </button>
              )}
            </div>
          )}
        </div>

        {/* Menu */}
        {(canEdit || canDelete) && !isEditing && (
          <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-[var(--color-charcoal)]/50 hover:text-[var(--color-charcoal)] transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg shadow-lg border border-[var(--color-charcoal)]/10 py-1 min-w-[120px]">
                  {canEdit && (
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--color-charcoal)]/70 hover:bg-[var(--color-cream)] transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => {
                        handleDelete();
                        setShowMenu(false);
                      }}
                      disabled={isDeleting}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
