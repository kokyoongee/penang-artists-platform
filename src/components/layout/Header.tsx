'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const navLinks = [
  { href: '/artists', label: 'Artists' },
  { href: '/events', label: 'Events' },
  { href: '/stories', label: 'Stories' },
  { href: '/funding', label: 'Funding' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-cream)] border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display text-xl font-semibold text-[var(--color-deep-teal)] tracking-tight">
          Penang<span className="text-[var(--color-terracotta)]">Artists</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-[var(--color-teal)] ${
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'text-[var(--color-teal)]'
                  : 'text-[var(--color-charcoal)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!loading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color-teal)] text-white hover:bg-[var(--color-deep-teal)] transition-colors">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm text-gray-500 truncate">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-[var(--color-charcoal)] hover:text-[var(--color-teal)] transition-colors">
                  Sign In
                </Link>
                <Link href="/register">
                  <Button className="bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)] text-white text-sm font-medium px-5 py-2 rounded-full">
                    Join as Artist
                  </Button>
                </Link>
              </div>
            )
          )}
        </nav>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <button className="p-2" aria-label="Open menu">
              <Menu className="w-6 h-6 text-[var(--color-charcoal)]" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-[var(--color-cream)]">
            <nav className="flex flex-col gap-6 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-medium transition-colors hover:text-[var(--color-teal)] ${
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'text-[var(--color-teal)]'
                      : 'text-[var(--color-charcoal)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Auth section in mobile menu */}
              {!loading && (
                <div className="border-t border-black/10 pt-6 mt-2">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        {user.user_metadata?.avatar_url ? (
                          <img
                            src={user.user_metadata.avatar_url}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[var(--color-teal)] flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--color-charcoal)] truncate">
                            {user.user_metadata?.full_name || 'Artist'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 text-[var(--color-charcoal)] hover:text-[var(--color-teal)] mb-4"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="text-lg font-medium">Dashboard</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 w-full"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="text-lg font-medium">Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-lg font-medium text-[var(--color-charcoal)] hover:text-[var(--color-teal)] text-center py-2"
                      >
                        Sign In
                      </Link>
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)] text-white font-medium rounded-full">
                          Join as Artist
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
