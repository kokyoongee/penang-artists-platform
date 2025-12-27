'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LogOut,
  Palette,
  LayoutDashboard,
  User,
  Images,
  MessageSquare,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Profile, Artist } from '@/lib/supabase/types';

interface DashboardHeaderProps {
  profile: Profile;
  artist: Artist | null;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Profile', href: '/dashboard/profile', icon: User },
  { name: 'Portfolio', href: '/dashboard/portfolio', icon: Images },
  { name: 'Inquiries', href: '/dashboard/inquiries', icon: MessageSquare },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function DashboardHeader({ profile, artist }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page title - desktop */}
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-gray-900">
              {artist ? `Welcome, ${artist.display_name}` : 'Artist Dashboard'}
            </h1>
          </div>

          {/* Mobile logo */}
          <Link href="/" className="md:hidden flex items-center gap-2">
            <Palette className="w-5 h-5 text-[var(--color-teal)]" />
            <span className="font-fraunces font-bold text-gray-900">
              Penang Artists
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <Link href="/" className="flex items-center gap-2">
                <Palette className="w-6 h-6 text-[var(--color-teal)]" />
                <span className="font-fraunces text-lg font-bold text-gray-900">
                  Penang Artists
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="px-3 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--color-teal)]/10 text-[var(--color-teal)]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-teal)]/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-[var(--color-teal)]">
                    {profile.full_name?.charAt(0) ||
                      profile.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile.full_name || 'Artist'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{profile.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
