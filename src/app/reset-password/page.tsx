'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      // If user clicked reset link, they should have a session
      setIsValidToken(!!session);
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    const supabase = createClient();

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(updateError.message);
      setIsLoading(false);
      return;
    }

    setIsSuccess(true);
    setIsLoading(false);

    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  };

  // Loading state while checking token
  if (isValidToken === null) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-[var(--color-warm-white)] rounded-2xl shadow-sm p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--color-teal)]" />
            <p className="mt-4 text-[var(--color-charcoal)]/60">Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid or expired token
  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-[var(--color-warm-white)] rounded-2xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-semibold text-[var(--color-charcoal)]">
              Invalid or Expired Link
            </h1>
            <p className="mt-2 text-sm text-[var(--color-charcoal)]/60">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link href="/forgot-password">
              <Button className="mt-6 bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)] text-white">
                Request New Link
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              Set New Password
            </h1>
            <p className="mt-2 text-sm text-[var(--color-charcoal)]/60">
              Enter your new password below
            </p>
          </div>

          {isSuccess ? (
            /* Success State */
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-charcoal)]">
                Password Updated!
              </h2>
              <p className="text-sm text-[var(--color-charcoal)]/60">
                Your password has been successfully updated. Redirecting to login...
              </p>
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
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-white border-[var(--color-charcoal)]/10 focus:border-[var(--color-teal)] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-charcoal)]/40 hover:text-[var(--color-charcoal)]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-white border-[var(--color-charcoal)]/10 focus:border-[var(--color-teal)]"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)] text-white py-5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
