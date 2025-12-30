'use client';

import { useReveal } from '@/hooks/useReveal';

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
  delay?: number;
}

export function RevealSection({
  children,
  className = '',
  stagger = false,
  delay = 0,
}: RevealSectionProps) {
  const { ref, isRevealed } = useReveal<HTMLDivElement>();

  const baseClass = stagger ? 'reveal-stagger' : 'reveal-section';
  const revealedClass = isRevealed ? 'revealed' : '';

  return (
    <div
      ref={ref}
      className={`${baseClass} ${revealedClass} ${className}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}
