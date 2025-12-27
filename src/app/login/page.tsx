import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center px-6">
      <Suspense fallback={
        <div className="w-full max-w-md">
          <div className="bg-[var(--color-warm-white)] rounded-2xl shadow-sm p-8">
            <div className="text-center mb-8">
              <span className="font-display text-2xl font-bold">
                <span className="text-[var(--color-teal)]">Penang</span>
                <span className="text-[var(--color-ochre)]">Artists</span>
              </span>
              <h1 className="mt-4 font-display text-2xl font-semibold text-[var(--color-charcoal)]">
                Loading...
              </h1>
            </div>
          </div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
