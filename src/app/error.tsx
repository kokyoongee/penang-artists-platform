'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report error to Sentry
    Sentry.captureException(error, {
      extra: {
        digest: error.digest,
      },
    });
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[var(--color-terracotta)]/10 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-[var(--color-terracotta)]" />
          </div>
        </div>

        {/* Content */}
        <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-charcoal)] mb-4">
          Something Went Wrong
        </h1>
        <p className="text-[var(--color-charcoal)]/60 mb-8 leading-relaxed">
          We encountered an unexpected error. Don&apos;t worry, our team has been notified.
          Please try again or return to the homepage.
        </p>

        {/* Error Details (development only) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-left">
            <p className="text-xs font-medium text-red-800 mb-1">Error Details:</p>
            <p className="text-sm text-red-600 font-mono break-all">{error.message}</p>
            {error.digest && (
              <p className="text-xs text-red-500 mt-2">Digest: {error.digest}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            className="bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)] text-white rounded-full px-6"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-[var(--color-charcoal)]/20 text-[var(--color-charcoal)] hover:bg-[var(--color-charcoal)]/5 rounded-full px-6"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
