import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Penang Artists',
  description: 'Privacy Policy for the Penang Artists platform.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Header */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,var(--color-ochre)_0%,transparent_70%)] opacity-10 blur-[80px]" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-charcoal)]/60 hover:text-[var(--color-teal)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <h1 className="font-display text-4xl md:text-5xl font-light text-[var(--color-soft-black)] leading-tight tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-[var(--color-charcoal)]/70">
            Last updated: December 28, 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-black/5 space-y-8">

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                1. Introduction
              </h2>
              <p className="text-[var(--color-charcoal)]/70 leading-relaxed">
                Penang Artists (&quot;we&quot;, &quot;our&quot;, or &quot;the Platform&quot;) is committed to protecting
                your privacy. This policy explains how we collect, use, and safeguard your
                information when you use our platform.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                2. Information We Collect
              </h2>
              <div className="text-[var(--color-charcoal)]/70 leading-relaxed space-y-4">
                <div>
                  <h3 className="font-medium text-[var(--color-soft-black)] mb-2">Account Information</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Name and email address</li>
                    <li>Password (encrypted)</li>
                    <li>Profile information (bio, location, art medium)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-[var(--color-soft-black)] mb-2">Content You Provide</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Artwork images and portfolio content</li>
                    <li>Social media links</li>
                    <li>Contact information you choose to display</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-[var(--color-soft-black)] mb-2">Automatically Collected</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Usage data (pages visited, features used)</li>
                    <li>Device information (browser type, operating system)</li>
                    <li>IP address and approximate location</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                3. How We Use Your Information
              </h2>
              <div className="text-[var(--color-charcoal)]/70 leading-relaxed space-y-3">
                <p>We use collected information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide and maintain the Platform</li>
                  <li>Display your artist profile to visitors</li>
                  <li>Enable communication between artists and interested parties</li>
                  <li>Send important updates about your account</li>
                  <li>Improve our services and user experience</li>
                  <li>Ensure platform security and prevent abuse</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                4. Information Sharing
              </h2>
              <div className="text-[var(--color-charcoal)]/70 leading-relaxed space-y-3">
                <p>We do not sell your personal information. We may share information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Publicly:</strong> Profile information you choose to make public</li>
                  <li><strong>With service providers:</strong> Trusted third parties that help operate the Platform (hosting, analytics)</li>
                  <li><strong>For legal reasons:</strong> When required by law or to protect rights and safety</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                5. Third-Party Services
              </h2>
              <div className="text-[var(--color-charcoal)]/70 leading-relaxed space-y-3">
                <p>We use the following third-party services:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Supabase:</strong> Database and authentication</li>
                  <li><strong>Vercel:</strong> Hosting and analytics</li>
                  <li><strong>Sentry:</strong> Error monitoring (no personal data collected)</li>
                </ul>
                <p>Each service has its own privacy policy governing their use of data.</p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                6. Data Security
              </h2>
              <p className="text-[var(--color-charcoal)]/70 leading-relaxed">
                We implement appropriate security measures to protect your information, including
                encrypted connections (HTTPS), secure password storage, and access controls.
                However, no method of transmission over the internet is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                7. Your Rights
              </h2>
              <div className="text-[var(--color-charcoal)]/70 leading-relaxed space-y-3">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> View the personal data we hold about you</li>
                  <li><strong>Correct:</strong> Update or correct your information</li>
                  <li><strong>Delete:</strong> Request deletion of your account and data</li>
                  <li><strong>Export:</strong> Request a copy of your data</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                </ul>
                <p>To exercise these rights, contact us or use the settings in your dashboard.</p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                8. Cookies
              </h2>
              <p className="text-[var(--color-charcoal)]/70 leading-relaxed">
                We use essential cookies to maintain your session and preferences. We also use
                analytics cookies to understand how visitors use the Platform. You can control
                cookie settings through your browser.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                9. Data Retention
              </h2>
              <p className="text-[var(--color-charcoal)]/70 leading-relaxed">
                We retain your data while your account is active. Upon account deletion, we will
                remove your personal information within 30 days, except where retention is required
                by law or for legitimate business purposes.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                10. Children&apos;s Privacy
              </h2>
              <p className="text-[var(--color-charcoal)]/70 leading-relaxed">
                The Platform is not intended for children under 13. We do not knowingly collect
                personal information from children. If you believe a child has provided us with
                personal information, please contact us.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                11. Changes to This Policy
              </h2>
              <p className="text-[var(--color-charcoal)]/70 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of
                significant changes via email or platform announcement. Your continued use
                of the Platform after changes constitutes acceptance of the updated policy.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                12. Contact Us
              </h2>
              <p className="text-[var(--color-charcoal)]/70 leading-relaxed">
                If you have questions about this Privacy Policy or your data, please contact us at{' '}
                <a
                  href="mailto:hello@penangartists.com"
                  className="text-[var(--color-teal)] hover:underline"
                >
                  hello@penangartists.com
                </a>
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
