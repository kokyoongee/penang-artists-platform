import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Palette, Users, Sparkles, Gift, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArtistCard } from '@/components/artists/ArtistCard';
import { getFeaturedArtists } from '@/lib/sample-data';

// Sample stories for preview
const featuredStories = [
  {
    id: 1,
    title: "Chen Wei Lin: 15 Years of Painting Heritage",
    category: "Artist Spotlight",
    categoryClass: "text-[var(--color-teal)]",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80",
    date: "Dec 26, 2025",
  },
  {
    id: 2,
    title: "How Aishah's Batik Found International Collectors",
    category: "Success Story",
    categoryClass: "text-[var(--color-ochre)]",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80",
    date: "Dec 24, 2025",
  },
  {
    id: 5,
    title: "From Grant to Gallery: Kavitha's Dance Journey",
    category: "Success Story",
    categoryClass: "text-[var(--color-ochre)]",
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&q=80",
    date: "Dec 20, 2025",
    sponsor: "ArtsFAS",
  },
];

export default function HomePage() {
  const featuredArtists = getFeaturedArtists(4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-street-art.png"
            alt="Penang Street Art"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/75" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24 pb-16">
          <span className="inline-block text-xs font-semibold text-white uppercase tracking-[0.25em] mb-6 bg-white/15 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/40 shadow-lg">
            A Platform for Our Creative Community
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight [text-shadow:_0_4px_12px_rgb(0_0_0_/_50%)]">
            Where Penang&apos;s{' '}
            <span className="text-[#F5C54A]">Artists</span>{' '}
            Shine
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white max-w-xl mx-auto [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
            A free platform to showcase your work, connect with fellow creatives,
            and be discovered by the world.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link href="/artists">
              <Button className="bg-[var(--color-terracotta)] hover:bg-[#B5503A] text-white font-semibold px-8 py-6 text-lg rounded-full shadow-xl">
                Browse Artists
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-white/20 backdrop-blur-sm border-2 border-white text-white font-semibold px-8 py-6 text-lg rounded-full hover:bg-white hover:text-[var(--color-soft-black)]">
                Join as Artist
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/80">
          <span className="text-xs uppercase tracking-[0.15em]">Discover More</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </section>

      {/* Why Section - The Problem */}
      <section className="mx-4 md:mx-8 my-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_1.2fr] min-h-[500px] rounded-3xl overflow-hidden">
          {/* Image side */}
          <div className="relative h-[250px] md:h-auto">
            <Image
              src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&h=600&fit=crop"
              alt="Artist at work"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[var(--color-deep-teal)]/60" />
          </div>

          {/* Content side */}
          <div className="bg-[var(--color-soft-black)] p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
            <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,...')]" />
            <div className="relative z-10">
              <span className="text-xs font-semibold text-[var(--color-ochre)] uppercase tracking-[0.2em]">
                The Problem
              </span>
              <p className="font-display text-xl md:text-2xl lg:text-3xl font-light text-white leading-relaxed mt-6">
                Penang is home to <strong className="text-[var(--color-ochre)] font-normal">incredible talent</strong> — painters, musicians, craftspeople, performers. But too often, our work is scattered across social media, hard to find, easy to miss.
                <br /><br />
                <strong className="text-[var(--color-ochre)] font-normal">It&apos;s time for a home of our own.</strong>
              </p>
              <p className="mt-8 text-sm text-white/50">
                — For the artists of Penang
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Bento Grid */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <span className="text-xs font-semibold text-[var(--color-teal)] uppercase tracking-[0.2em]">
            Why Join
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-normal text-[var(--color-soft-black)] mt-2">
            Built for artists, by the community
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {/* Featured large card */}
            <div className="md:row-span-2 relative rounded-3xl overflow-hidden min-h-[500px] group">
              <Image
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=1000&fit=crop"
                alt="Artist portfolio"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <span className="font-display text-sm font-semibold tracking-wide opacity-60">01</span>
                <h3 className="font-display text-2xl md:text-3xl font-semibold mt-2">
                  Your Portfolio,<br />Your Way
                </h3>
                <p className="mt-3 text-white/85 max-w-md">
                  A dedicated space to showcase your best work. No algorithms, no noise — just your art, beautifully presented to the world.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative rounded-3xl overflow-hidden min-h-[240px] group">
              <Image
                src="https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&h=500&fit=crop"
                alt="Artists connecting"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="font-display text-sm font-semibold tracking-wide opacity-60">02</span>
                <h3 className="font-display text-xl font-semibold mt-1">Connect with Creatives</h3>
                <p className="mt-2 text-sm text-white/85">
                  Find collaborators, discover new artists, and grow Penang&apos;s creative network together.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative rounded-3xl overflow-hidden min-h-[240px] group">
              <Image
                src="https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=500&fit=crop"
                alt="Art discovery"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="font-display text-sm font-semibold tracking-wide opacity-60">03</span>
                <h3 className="font-display text-xl font-semibold mt-1">Get Discovered</h3>
                <p className="mt-2 text-sm text-white/85">
                  Tourists and collectors looking for authentic Penang art will find you here.
                </p>
              </div>
            </div>
          </div>

          {/* Free highlight - full width */}
          <div className="relative rounded-3xl overflow-hidden min-h-[200px] mt-6 bg-[var(--color-soft-black)]">
            <div className="absolute inset-0 opacity-5">
              <span className="font-display text-[8rem] md:text-[12rem] font-light italic text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                Free Forever
              </span>
            </div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center text-white">
              <span className="font-display text-sm font-semibold tracking-wide opacity-60">04</span>
              <h3 className="font-display text-2xl md:text-3xl font-semibold mt-2">
                No fees. No commissions. No catch.
              </h3>
              <p className="mt-3 text-white/85 max-w-lg">
                This is our gift to the Penang creative community. We believe every artist deserves a platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="py-20 md:py-28 bg-[var(--color-cream)]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-sm font-medium text-[var(--color-teal)] uppercase tracking-wider">
                Featured
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-charcoal)] mt-2">
                Meet Our Artists
              </h2>
            </div>
            <Link
              href="/artists"
              className="text-[var(--color-teal)] font-medium flex items-center gap-2 hover:gap-3 transition-all"
            >
              View all artists
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Artists Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </div>
      </section>

      {/* Stories Section */}
      <section className="py-20 md:py-28 bg-[var(--color-warm-white)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-[var(--color-teal)] uppercase tracking-[0.2em]">
              Stories & Spotlights
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-normal text-[var(--color-soft-black)] mt-2">
              Voices from the community
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredStories.map((story) => (
              <Link key={story.id} href={`/stories`} className="group block">
                <div className="relative h-[220px] rounded-lg overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {story.sponsor && (
                    <span className="absolute top-3 right-3 text-xs font-medium px-2 py-1 bg-white/95 rounded flex items-center gap-1">
                      <span className="text-[var(--color-ochre)]">★</span>
                      Presented by {story.sponsor}
                    </span>
                  )}
                </div>
                <div className="pt-4">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${story.categoryClass}`}>
                    {story.category}
                  </span>
                  <h3 className="font-display text-lg font-medium text-[var(--color-soft-black)] mt-1 leading-snug group-hover:text-[var(--color-teal)] transition-colors">
                    {story.title}
                  </h3>
                  <span className="text-sm text-[var(--color-charcoal)]/50 mt-1 block">
                    {story.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/stories">
              <Button
                variant="outline"
                className="border-2 border-[var(--color-charcoal)]/20 text-[var(--color-charcoal)] font-medium px-8 py-5 rounded-full hover:bg-[var(--color-charcoal)] hover:text-white"
              >
                View All Stories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-semibold text-[var(--color-teal)] uppercase tracking-[0.2em]">
            How It Works
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-normal text-[var(--color-soft-black)] mt-2">
            Simple steps to join
          </h2>

          <div className="flex flex-col gap-6 mt-12">
            {[
              {
                num: '01',
                title: 'Sign Up',
                desc: "Tell us about yourself and your art. No gatekeeping — all Penang-based artists are welcome.",
              },
              {
                num: '02',
                title: 'Build Your Profile',
                desc: 'Upload your best work, write your story, add your links. Make it uniquely yours.',
              },
              {
                num: '03',
                title: 'Go Live',
                desc: "Your profile is published and shareable. You're now part of the directory.",
              },
              {
                num: '04',
                title: 'Grow Together',
                desc: 'Connect with fellow artists, get discovered by audiences, and help shape what comes next.',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-[var(--color-warm-white)] rounded-2xl p-6 md:p-8 grid grid-cols-[80px_1fr] gap-4 md:gap-8 items-start hover:translate-x-2 transition-transform"
              >
                <span className="font-display text-4xl md:text-5xl font-light text-[var(--color-terracotta)]">
                  {step.num}
                </span>
                <div>
                  <h4 className="font-display text-xl md:text-2xl font-semibold text-[var(--color-soft-black)]">
                    {step.title}
                  </h4>
                  <p className="text-[var(--color-charcoal)]/80 mt-2">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Penang Artists Section */}
      <section className="py-20 md:py-28 bg-[var(--color-warm-white)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-medium text-[var(--color-teal)] uppercase tracking-wider">
              Why Choose Us
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-charcoal)] mt-2">
              Connecting Art Lovers with Creators
            </h2>
            <p className="mt-4 text-[var(--color-charcoal)]/70">
              We make it easy to discover, connect, and collaborate with
              Penang&apos;s talented artists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-[var(--color-cream)] rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-[var(--color-teal)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Palette className="w-8 h-8 text-[var(--color-teal)]" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[var(--color-charcoal)] mb-3">
                Diverse Talent
              </h3>
              <p className="text-[var(--color-charcoal)]/70 leading-relaxed">
                From traditional watercolors to contemporary street art, find the
                perfect artist for your vision.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[var(--color-cream)] rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-[var(--color-ochre)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-[var(--color-ochre)]" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[var(--color-charcoal)] mb-3">
                Direct Connection
              </h3>
              <p className="text-[var(--color-charcoal)]/70 leading-relaxed">
                Contact artists directly through our platform. No middlemen, just
                genuine conversations.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[var(--color-cream)] rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-[var(--color-terracotta)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-[var(--color-terracotta)]" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[var(--color-charcoal)] mb-3">
                Quality Curated
              </h3>
              <p className="text-[var(--color-charcoal)]/70 leading-relaxed">
                Every artist is verified and their portfolio reviewed to ensure
                quality and authenticity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-[var(--color-deep-teal)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Are You an Artist?
          </h2>
          <p className="mt-6 text-xl text-white/70 max-w-2xl mx-auto">
            Join Penang&apos;s growing community of creatives. Showcase your work,
            connect with collectors, and grow your artistic career.
          </p>
          <div className="mt-10">
            <Link href="/register">
              <Button className="bg-[var(--color-ochre)] hover:bg-[var(--color-ochre)]/90 text-[var(--color-soft-black)] font-semibold px-10 py-6 text-lg rounded-full">
                Join the Platform
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/50">
            Free to join • Get discovered • Connect with collectors
          </p>
        </div>
      </section>
    </div>
  );
}
