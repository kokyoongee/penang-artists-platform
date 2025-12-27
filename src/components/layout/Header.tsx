'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/artists', label: 'Artists' },
  { href: '/stories', label: 'Stories' },
  { href: '/funding', label: 'Funding' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <Link href="/register">
            <Button className="bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)] text-white text-sm font-medium px-5 py-2 rounded-full">
              Join as Artist
            </Button>
          </Link>
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
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)] text-white font-medium rounded-full mt-4">
                  Join as Artist
                </Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
