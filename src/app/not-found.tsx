import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        {/* Decorative Element */}
        <div className="relative mb-8">
          <span className="font-display text-[150px] md:text-[200px] font-bold text-[var(--color-teal)]/10 leading-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[var(--color-ochre)]/10 flex items-center justify-center">
              <Search className="w-12 h-12 text-[var(--color-ochre)]" />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-charcoal)] mb-4">
          Page Not Found
        </h1>
        <p className="text-[var(--color-charcoal)]/60 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Perhaps the artist took it on a creative journey elsewhere.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)] text-white rounded-full px-6"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-[var(--color-charcoal)]/20 text-[var(--color-charcoal)] hover:bg-[var(--color-charcoal)]/5 rounded-full px-6"
          >
            <Link href="/artists">
              <Search className="w-4 h-4 mr-2" />
              Browse Artists
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-[var(--color-charcoal)]/40">
          If you believe this is an error, please contact us.
        </p>
      </div>
    </div>
  );
}
