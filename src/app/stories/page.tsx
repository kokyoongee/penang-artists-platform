'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample stories data
const stories = [
  {
    id: 1,
    title: "Chen Wei Lin: 15 Years of Painting Penang's Heritage",
    excerpt: "From a small studio in Armenian Street, Chen Wei Lin has spent 15 years capturing the soul of George Town's shophouses and streets through delicate watercolours.",
    category: "spotlight",
    categoryLabel: "Artist Spotlight",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=500&fit=crop",
    date: "Dec 26, 2025",
    readTime: "6 min read",
    featured: true,
  },
  {
    id: 2,
    title: "How Aishah's Batik Reached International Collectors",
    excerpt: "When a Singapore gallery discovered Aishah's contemporary batik work on the platform, it opened doors she never imagined possible.",
    category: "success",
    categoryLabel: "Success Story",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop",
    date: "Dec 24, 2025",
    readTime: "5 min read",
    featured: false,
  },
  {
    id: 3,
    title: "Inside Ahmad's Mural Workshop",
    excerpt: "Step behind the scenes as Ahmad Faris prepares for his largest mural yet—a 40-foot celebration of Malaysian folklore in Butterworth.",
    category: "behind",
    categoryLabel: "Behind the Scenes",
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&h=500&fit=crop",
    date: "Dec 22, 2025",
    readTime: "4 min read",
    featured: false,
  },
  {
    id: 4,
    title: "George Town Festival 2025 Open Call Announced",
    excerpt: "The annual festival is now accepting submissions for visual art, performance, and installation works. Application deadline: March 31, 2025.",
    category: "community",
    categoryLabel: "Community",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=500&fit=crop",
    date: "Dec 20, 2025",
    readTime: "3 min read",
    featured: false,
  },
  {
    id: 5,
    title: "From Grant to Gallery: Kavitha's Dance Journey",
    excerpt: "An ArtsFAS grant transformed Kavitha Devi's vision of a contemporary Bharatanatyam production into reality, culminating in a sold-out show.",
    category: "success",
    categoryLabel: "Success Story",
    image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=500&fit=crop",
    date: "Dec 18, 2025",
    readTime: "7 min read",
    featured: false,
    sponsor: "ArtsFAS",
  },
  {
    id: 6,
    title: "The Craft of Penang Ceramics with Soo Hui Wen",
    excerpt: "In her Tanjung Bungah studio, Soo Hui Wen shares how the coastal landscape and her Nyonya heritage influence every piece she creates.",
    category: "spotlight",
    categoryLabel: "Artist Spotlight",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=500&fit=crop",
    date: "Dec 15, 2025",
    readTime: "5 min read",
    featured: false,
  },
];

const categories = [
  { key: 'all', label: 'All Stories' },
  { key: 'spotlight', label: 'Artist Spotlight' },
  { key: 'success', label: 'Success Stories' },
  { key: 'behind', label: 'Behind the Scenes' },
  { key: 'community', label: 'Community' },
];

export default function StoriesPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredStories = activeCategory === 'all'
    ? stories
    : stories.filter(story => story.category === activeCategory);

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Hero Section */}
      <section className="pt-32 pb-12 md:pb-16 relative overflow-hidden">
        {/* Decorative gradients */}
        <div className="absolute -top-1/2 -right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,var(--color-terracotta)_0%,transparent_70%)] opacity-10 blur-[80px]" />
        <div className="absolute -bottom-1/3 -left-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,var(--color-ochre)_0%,transparent_70%)] opacity-[0.08] blur-[60px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-semibold text-[var(--color-teal)] uppercase tracking-[0.2em]">
              Stories
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-[var(--color-soft-black)] mt-4 leading-tight tracking-tight">
              Artist <em className="text-[var(--color-terracotta)]">Stories</em> & Spotlights
            </h1>
            <p className="mt-6 text-lg text-[var(--color-charcoal)]/70 max-w-xl mx-auto">
              Discover the journeys, successes, and creative processes of Penang&apos;s vibrant artist community.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-[68px] z-40 bg-[var(--color-cream)] border-b border-black/5 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all ${
                  activeCategory === cat.key
                    ? 'bg-[var(--color-teal)] text-white'
                    : 'bg-white border border-black/10 text-[var(--color-charcoal)] hover:border-[var(--color-teal)] hover:bg-[var(--color-teal)]/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          {filteredStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStories.map((story, index) => (
                <article
                  key={story.id}
                  className={`group cursor-pointer transition-transform duration-300 hover:-translate-y-1 ${
                    index === 0 && activeCategory === 'all' ? 'md:col-span-2' : ''
                  }`}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden rounded-lg ${
                    index === 0 && activeCategory === 'all' ? 'h-[380px]' : 'h-[280px]'
                  }`}>
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    {story.sponsor && (
                      <span className="absolute top-4 right-4 text-xs font-medium px-2 py-1 bg-white/95 rounded flex items-center gap-1">
                        <span className="text-[var(--color-ochre)]">★</span>
                        Presented by {story.sponsor}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="pt-4">
                    <span className={`text-xs font-semibold uppercase tracking-wide ${
                      story.category === 'spotlight' ? 'text-[var(--color-teal)]' :
                      story.category === 'success' ? 'text-[var(--color-ochre)]' :
                      story.category === 'behind' ? 'text-[var(--color-terracotta)]' :
                      'text-[var(--color-deep-teal)]'
                    }`}>
                      {story.categoryLabel}
                    </span>
                    <h3 className={`font-display font-medium text-[var(--color-soft-black)] leading-snug mt-2 group-hover:text-[var(--color-teal)] transition-colors ${
                      index === 0 && activeCategory === 'all' ? 'text-2xl' : 'text-lg'
                    }`}>
                      {story.title}
                    </h3>
                    <p className="text-sm text-[var(--color-charcoal)]/50 mt-2">
                      {story.date}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-[var(--color-teal)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-[var(--color-teal)] opacity-60">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-semibold text-[var(--color-soft-black)]">
                No stories found
              </h3>
              <p className="text-[var(--color-charcoal)]/60 mt-2">
                Try selecting a different category
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-[var(--color-warm-white)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-[var(--color-charcoal)]">
            Have a Story to Share?
          </h2>
          <p className="mt-4 text-[var(--color-charcoal)]/70 max-w-lg mx-auto">
            We&apos;re always looking for inspiring stories from Penang&apos;s creative community.
            Share your journey or nominate an artist.
          </p>
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
    </div>
  );
}
