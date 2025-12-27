'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const supabase = createClient();

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setIsLoading(false);
      return;
    }

    setIsSuccess(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-[var(--color-warm-white)] rounded-2xl shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="font-display text-2xl font-bold">
                <span className="text-[var(--color-teal)]">Penang</span>
                <span className="text-[var(--color-ochre)]">Artists</span>
              </span>
            </Link>
            <h1 className="mt-4 font-display text-2xl font-semibold text-[var(--color-charcoal)]">
              Reset Password
            </h1>
            <p className="mt-2 text-sm text-[var(--color-charcoal)]/60">
              Enter your email to receive a password reset link
            </p>
          </div>

          {isSuccess ? (
            /* Success State */
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-charcoal)]">
                Check your email
              </h2>
              <p className="text-sm text-[var(--color-charcoal)]/60">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-xs text-[var(--color-charcoal)]/40">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Button
                onClick={() => setIsSuccess(false)}
                variant="outline"
                className="mt-4"
              >
                Try again
              </Button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-charcoal)]/40" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white border-[var(--color-charcoal)]/10 focus:border-[var(--color-teal)] pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)] text-white py-5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-[var(--color-charcoal)]/60 hover:text-[var(--color-teal)]"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
