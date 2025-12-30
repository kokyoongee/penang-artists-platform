'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Heart, Users, Sparkles, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const values = [
  {
    icon: Heart,
    title: 'Community First',
    description: 'Every decision we make prioritizes the needs of Penang\'s creative community. Artists aren\'t just users—they\'re the heart of everything we do.',
  },
  {
    icon: Users,
    title: 'Inclusive Access',
    description: 'Art knows no boundaries. Our platform is free for all artists, regardless of experience level, medium, or background.',
  },
  {
    icon: Sparkles,
    title: 'Celebrating Authenticity',
    description: 'We champion the unique stories and traditions that make Penang\'s art scene special—from heritage crafts to contemporary expressions.',
  },
  {
    icon: MapPin,
    title: 'Rooted in Penang',
    description: 'Built by locals, for locals. We understand the nuances of our creative ecosystem and the challenges our artists face.',
  },
];

const stats = [
  { value: '200+', label: 'Artists Registered' },
  { value: '15+', label: 'Art Categories' },
  { value: '50+', label: 'Collaborations Made' },
  { value: '100%', label: 'Free for Artists' },
];

const team = [
  {
    name: 'The Community',
    role: 'Artists, Patrons & Partners',
    image: '/images/community.webp',
    description: 'This platform belongs to Penang\'s creative community. Every artist, supporter, and partner shapes what we become.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pb-20 relative overflow-hidden">
        {/* Decorative gradients */}
        <div className="absolute -top-1/2 -right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,var(--color-terracotta)_0%,transparent_70%)] opacity-10 blur-[80px]" />
        <div className="absolute -bottom-1/3 -left-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,var(--color-ochre)_0%,transparent_70%)] opacity-[0.08] blur-[60px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-semibold text-[var(--color-teal)] uppercase tracking-[0.2em]">
              About Us
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-[var(--color-soft-black)] mt-4 leading-tight tracking-tight">
              Connecting Penang&apos;s <em className="text-[var(--color-terracotta)]">Creative</em> Community
            </h1>
            <p className="mt-6 text-lg text-[var(--color-charcoal)]/70 max-w-xl mx-auto">
              We&apos;re building a home for Penang&apos;s artists—a place to showcase work,
              find opportunities, and connect with those who value creativity.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/benefit-portfolio.webp"
                  alt="Artists working in Penang"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[var(--color-ochre)]/20 rounded-full blur-2xl" />
            </div>

            {/* Content */}
            <div>
              <span className="text-xs font-semibold text-[var(--color-ochre)] uppercase tracking-[0.2em]">
                Our Story
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-light text-[var(--color-soft-black)] mt-3 leading-tight">
                Born from a Simple Question
              </h2>
              <div className="mt-6 space-y-4 text-[var(--color-charcoal)]/70">
                <p>
                  <em className="text-[var(--color-soft-black)]">&ldquo;Where do I find local artists in Penang?&rdquo;</em>
                </p>
                <p>
                  This question, asked countless times by collectors, event organizers, and art lovers,
                  revealed a gap we couldn&apos;t ignore. Penang has an incredibly vibrant art scene—from
                  watercolour masters preserving heritage to street artists transforming our walls—yet
                  there was no central place to discover them all.
                </p>
                <p>
                  Artists were scattered across social media, relying on word-of-mouth, or simply
                  invisible to those who might commission their work. Meanwhile, opportunities from
                  galleries, festivals, and patrons often never reached the artists who deserved them.
                </p>
                <p>
                  We built this platform to bridge that gap—to give every Penang artist a
                  professional presence and every art seeker a way to find them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20 bg-[var(--color-warm-white)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs font-semibold text-[var(--color-teal)] uppercase tracking-[0.2em]">
            Our Mission
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-light text-[var(--color-soft-black)] mt-4 leading-tight">
            To amplify the voices of Penang&apos;s artists and connect them with opportunities
            that help their creativity thrive.
          </h2>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/artists">
              <Button className="bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)] text-white font-medium px-8 py-6 text-lg rounded-full">
                Explore Artists
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-[var(--color-terracotta)] uppercase tracking-[0.2em]">
              What We Believe
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-light text-[var(--color-soft-black)] mt-3">
              Our Values
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-black/5 hover:border-[var(--color-teal)]/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--color-teal)]/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-[var(--color-teal)]" />
                </div>
                <h3 className="font-display text-xl font-semibold text-[var(--color-soft-black)]">
                  {value.title}
                </h3>
                <p className="mt-3 text-[var(--color-charcoal)]/70">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-[var(--color-teal)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="mt-2 text-white/80 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-[var(--color-ochre)] uppercase tracking-[0.2em]">
              Who We Are
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-light text-[var(--color-soft-black)] mt-3">
              A Platform by the Community, for the Community
            </h2>
          </div>

          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 md:p-12 border border-black/5 text-center"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="font-display text-2xl font-semibold text-[var(--color-soft-black)]">
                {member.name}
              </h3>
              <p className="text-[var(--color-teal)] font-medium mt-1">
                {member.role}
              </p>
              <p className="mt-4 text-[var(--color-charcoal)]/70 max-w-lg mx-auto">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-[var(--color-warm-white)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-[var(--color-charcoal)]">
            Ready to Join Penang&apos;s Creative Community?
          </h2>
          <p className="mt-4 text-[var(--color-charcoal)]/70 max-w-lg mx-auto">
            Whether you&apos;re an artist looking to showcase your work or someone seeking
            to discover local talent, we&apos;d love to have you.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-[var(--color-terracotta)] hover:bg-[var(--color-terracotta)]/90 text-white font-medium px-8 py-6 text-lg rounded-full">
                Join as an Artist
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/artists">
              <Button variant="outline" className="border-[var(--color-charcoal)]/20 text-[var(--color-charcoal)] font-medium px-8 py-6 text-lg rounded-full hover:bg-[var(--color-charcoal)]/5">
                Browse Artists
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
