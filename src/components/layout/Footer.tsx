import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[var(--color-deep-teal)] text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
              Penang<span className="text-[var(--color-ochre)]">Artists</span>
            </Link>
            <p className="mt-4 text-white/70 max-w-md leading-relaxed">
              Connecting Penang&apos;s vibrant creative community with art lovers,
              collectors, and collaborators from around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/artists" className="text-white/70 hover:text-white transition-colors">
                  Artist Directory
                </Link>
              </li>
              <li>
                <Link href="/stories" className="text-white/70 hover:text-white transition-colors">
                  Stories
                </Link>
              </li>
              <li>
                <Link href="/funding" className="text-white/70 hover:text-white transition-colors">
                  Funding
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/70 hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* For Artists */}
          <div>
            <h4 className="font-display font-semibold mb-4">For Artists</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/register" className="text-white/70 hover:text-white transition-colors">
                  Join the Platform
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-white/70 hover:text-white transition-colors">
                  Artist Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-white/70 hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            &copy; {new Date().getFullYear()} Penang Artists. A project by{' '}
            <a
              href="https://lumina.my"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-ochre)] hover:underline"
            >
              Lumina
            </a>
          </p>
          <div className="flex items-center gap-6 text-sm text-white/50">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
