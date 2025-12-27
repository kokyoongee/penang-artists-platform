'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const supabase = createClient();

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    // Get user role to determine redirect
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    const profile = profileData as { role: string } | null;

    // Redirect based on role (unless redirectTo is specified)
    if (redirectTo) {
      router.push(redirectTo);
    } else if (profile?.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
    router.refresh();
  };

  return (
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
            Sign In
          </h1>
          <p className="mt-2 text-sm text-[var(--color-charcoal)]/60">
            Sign in to your artist or admin account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white border-[var(--color-charcoal)]/10 focus:border-[var(--color-teal)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)] text-white py-5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 space-y-3 text-center">
          <p className="text-sm text-[var(--color-charcoal)]/60">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-[var(--color-teal)] hover:underline font-medium"
            >
              Join as an artist
            </Link>
          </p>
          <Link
            href="/"
            className="block text-sm text-[var(--color-charcoal)]/60 hover:text-[var(--color-teal)]"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
