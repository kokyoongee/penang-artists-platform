import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Penang Artists',
  description: 'Terms of Service for the Penang Artists platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Header */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,var(--color-teal)_0%,transparent_70%)] opacity-10 blur-[80px]" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-charcoal)]/60 hover:text-[var(--color-teal)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <h1 className="font-display text-4xl md:text-5xl font-light text-[var(--color-soft-black)] leading-tight tracking-tight">
            Terms of Service
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
                1. Acceptance of Terms
              </h2>
              <p className="text-[var(--color-charcoal)]/70 leading-relaxed">
                By accessing or using Penang Artists (&quot;the Platform&quot;), you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do not use the Platform.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                2. Description of Service
              </h2>
              <p className="text-[var(--color-charcoal)]/70 leading-relaxed">
                Penang Artists is a free platform that connects local artists in Penang with art lovers,
                collectors, and collaborators. We provide artist profiles, a searchable directory,
                and tools for artists to showcase their work.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                3. User Accounts
              </h2>
              <div className="text-[var(--color-charcoal)]/70 leading-relaxed space-y-3">
                <p>When creating an account, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Be responsible for all activities under your account</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                4. Artist Content
              </h2>
              <div className="text-[var(--color-charcoal)]/70 leading-relaxed space-y-3">
                <p>By uploading content to the Platform, you:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Retain ownership of your original artwork and content</li>
                  <li>Grant us a non-exclusive license to display your content on the Platform</li>
                  <li>Confirm that you have the right to share the content</li>
                  <li>Agree not to upload content that is illegal, offensive, or infringes on others&apos; rights</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                5. Acceptable Use
              </h2>
              <div className="text-[var(--color-charcoal)]/70 leading-relaxed space-y-3">
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the Platform for any unlawful purpose</li>
                  <li>Impersonate any person or entity</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Upload malicious code or interfere with the Platform&apos;s operation</li>
                  <li>Scrape or collect user data without consent</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                6. Intellectual Property
              </h2>
              <p className="text-[var(--color-charcoal)]/70 leading-relaxed">
                The Platform&apos;s design, features, and content (excluding user-uploaded artwork) are
                owned by Penang Artists and protected by intellectual property laws. You may not copy,
                modify, or distribute our proprietary content without permission.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                7. Third-Party Communications
              </h2>
              <p className="text-[var(--color-charcoal)]/70 leading-relaxed">
                The Platform facilitates connections between artists and interested parties via WhatsApp
                and email. We are not responsible for the content or outcome of these communications.
                Users engage with each other at their own discretion and risk.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                8. Disclaimer of Warranties
              </h2>
              <p className="text-[var(--color-charcoal)]/70 leading-relaxed">
                The Platform is provided &quot;as is&quot; without warranties of any kind. We do not guarantee
                that the Platform will be uninterrupted, secure, or error-free. We are not responsible
                for any transactions or agreements made between users.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                9. Limitation of Liability
              </h2>
              <p className="text-[var(--color-charcoal)]/70 leading-relaxed">
                To the maximum extent permitted by law, Penang Artists shall not be liable for any
                indirect, incidental, special, or consequential damages arising from your use of
                the Platform.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                10. Account Termination
              </h2>
              <p className="text-[var(--color-charcoal)]/70 leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate these terms or
                engage in behavior harmful to the community. You may also delete your account at
                any time through your dashboard settings.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                11. Changes to Terms
              </h2>
              <p className="text-[var(--color-charcoal)]/70 leading-relaxed">
                We may update these terms from time to time. Continued use of the Platform after
                changes constitutes acceptance of the new terms. We will notify users of significant
                changes via email or platform announcement.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-soft-black)] mb-4">
                12. Contact
              </h2>
              <p className="text-[var(--color-charcoal)]/70 leading-relaxed">
                If you have questions about these Terms of Service, please contact us at{' '}
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
