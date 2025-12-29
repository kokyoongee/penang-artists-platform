'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Palette,
  LayoutDashboard,
  User,
  Images,
  Package,
  MessageSquare,
  Settings,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { Profile, Artist } from '@/lib/supabase/types';

interface DashboardSidebarProps {
  profile: Profile;
  artist: Artist | null;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Profile', href: '/dashboard/profile', icon: User },
  { name: 'Portfolio', href: '/dashboard/portfolio', icon: Images },
  { name: 'Services', href: '/dashboard/services', icon: Package },
  { name: 'Inquiries', href: '/dashboard/inquiries', icon: MessageSquare },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-600' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  approved: { bg: 'bg-green-100', text: 'text-green-700' },
  suspended: { bg: 'bg-red-100', text: 'text-red-700' },
};

export function DashboardSidebar({ profile, artist }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r border-gray-100">
      {/* Logo */}
      <div className="px-6 py-4 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <Palette className="w-6 h-6 text-[var(--color-teal)]" />
          <span className="font-fraunces text-lg font-bold text-gray-900">
            Penang Artists
          </span>
        </Link>
      </div>

      {/* Profile Status */}
      <div className="px-4 py-4 border-b border-gray-100">
        {artist ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Profile Status</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  STATUS_COLORS[artist.status]?.bg || 'bg-gray-100'
                } ${STATUS_COLORS[artist.status]?.text || 'text-gray-600'}`}
              >
                {artist.status}
              </span>
            </div>
            {artist.status === 'approved' && artist.slug && (
              <Link
                href={`/artists/${artist.slug}`}
                target="_blank"
                className="flex items-center gap-1.5 text-sm text-[var(--color-teal)] hover:underline"
              >
                View public profile
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
            {artist.status === 'pending' && (
              <div className="flex items-start gap-2 text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Your profile is under review. We'll notify you once approved.</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">No profile yet</p>
            <Link
              href="/dashboard/profile"
              className="inline-block text-sm text-[var(--color-teal)] hover:underline"
            >
              Create your profile →
            </Link>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
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

      {/* User info */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--color-teal)]/10 flex items-center justify-center">
            <span className="text-sm font-medium text-[var(--color-teal)]">
              {profile.full_name?.charAt(0) || profile.email.charAt(0).toUpperCase()}
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
    </aside>
  );
}
