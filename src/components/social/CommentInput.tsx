'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Send, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommentInputProps {
  currentArtist: {
    id: string;
    display_name: string;
    profile_photo: string | null;
  } | null;
  onSubmit: (content: string, parentId?: string) => Promise<void>;
  placeholder?: string;
  replyingTo?: {
    id: string;
    artistName: string;
  } | null;
  onCancelReply?: () => void;
  className?: string;
}

export function CommentInput({
  currentArtist,
  onSubmit,
  placeholder = 'Add a comment...',
  replyingTo,
  onCancelReply,
  className,
}: CommentInputProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus when replying
  useEffect(() => {
    if (replyingTo && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyingTo]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim(), replyingTo?.id);
      setContent('');
      onCancelReply?.();
    } catch {
      // Keep content on error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    if (e.key === 'Escape' && replyingTo) {
      onCancelReply?.();
    }
  };

  if (!currentArtist) {
    return (
      <div className={cn('px-4 py-3 bg-[var(--color-cream)]/50 rounded-lg text-center', className)}>
        <p className="text-sm text-[var(--color-charcoal)]/60">
          <a href="/login" className="text-[var(--color-teal)] hover:underline">Sign in</a> to leave a comment
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-2', className)}>
      {/* Replying to indicator */}
      {replyingTo && (
        <div className="flex items-center gap-2 text-xs text-[var(--color-charcoal)]/60 bg-[var(--color-cream)]/50 px-3 py-1.5 rounded-md">
          <span>Replying to <span className="font-medium">{replyingTo.artistName}</span></span>
          <button
            type="button"
            onClick={onCancelReply}
            className="ml-auto p-0.5 hover:text-[var(--color-charcoal)] transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--color-cream)] flex-shrink-0">
          {currentArtist.profile_photo ? (
            <Image
              src={currentArtist.profile_photo}
              alt={currentArtist.display_name}
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[var(--color-teal)] text-white text-sm font-medium">
              {currentArtist.display_name.charAt(0)}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex-1 flex gap-2">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={replyingTo ? `Reply to ${replyingTo.artistName}...` : placeholder}
            className="flex-1 px-3 py-2 text-sm bg-[var(--color-cream)]/50 border border-[var(--color-charcoal)]/10 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent min-h-[38px]"
            rows={1}
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="self-end p-2 text-white bg-[var(--color-teal)] rounded-lg hover:bg-[var(--color-teal)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <p className="text-xs text-[var(--color-charcoal)]/40 text-right">
        {content.length}/1000
      </p>
    </form>
  );
}
