'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Image,
  MessageSquare,
  Settings,
  ExternalLink,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Artists', href: '/admin/artists', icon: Users },
  { name: 'Portfolio Items', href: '/admin/portfolio', icon: Image },
  { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 bg-[var(--color-soft-black)] lg:block">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-white">
            <span className="text-[var(--color-teal)]">PA</span> Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-out ${
                isActive
                  ? 'bg-[var(--color-teal)] text-white shadow-lg shadow-[var(--color-teal)]/20'
                  : 'text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-1'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-200 ${!isActive && 'group-hover:scale-110'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* View Site */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2.5 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Site
        </Link>
      </div>
    </aside>
  );
}
