import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Mail, ExternalLink, CheckCircle, Phone, DollarSign, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ContactForm } from '@/components/artists/ContactForm';
import { PortfolioGallery } from '@/components/artists/PortfolioGallery';
import { ServicesSection } from '@/components/artists/ServicesSection';
import { createServerClient } from '@/lib/supabase/server';
import { Artist, PortfolioItem, Service, MEDIUM_LABELS, LOCATION_LABELS, PRICE_RANGE_LABELS, EXPERIENCE_LABELS } from '@/types';

interface ArtistProfilePageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // Revalidate every 60 seconds

async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'approved')
    .single();

  if (error || !data) {
    return null;
  }

  return data as Artist;
}

async function getPortfolioItems(artistId: string): Promise<PortfolioItem[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('artist_id', artistId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching portfolio:', error);
    return [];
  }

  return (data as PortfolioItem[]) || [];
}

async function getServices(artistId: string): Promise<Service[]> {
  const supabase = await createServerClient();

  // Using type assertion since table may not exist yet
  const { data, error } = await (supabase as any)
    .from('services')
    .select('*')
    .eq('artist_id', artistId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    // Table may not exist yet, silently return empty array
    return [];
  }

  return (data as Service[]) || [];
}

export default async function ArtistProfilePage({ params }: ArtistProfilePageProps) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);

  if (!artist) {
    notFound();
  }

  const [portfolioItems, services] = await Promise.all([
    getPortfolioItems(artist.id),
    getServices(artist.id),
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Link
          href="/artists"
          className="inline-flex items-center gap-2 text-[var(--color-charcoal)]/60 hover:text-[var(--color-teal)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Artists
        </Link>
      </div>

      {/* Profile Header */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[var(--color-warm-white)] rounded-3xl overflow-hidden shadow-sm">
            {/* Featured Image */}
            {artist.featured_image && (
              <div className="relative h-64 md:h-80 lg:h-96">
                <Image
                  src={artist.featured_image}
                  alt={artist.display_name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            )}

            {/* Profile Info */}
            <div className="relative px-6 md:px-10 pb-8">
              {/* Profile Photo */}
              <div className="relative -mt-16 mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--color-warm-white)] shadow-lg">
                  {artist.profile_photo ? (
                    <Image
                      src={artist.profile_photo}
                      alt={artist.display_name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--color-teal)] flex items-center justify-center text-white font-display text-4xl">
                      {artist.display_name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              {/* Name and Badges */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-charcoal)]">
                      {artist.display_name}
                    </h1>
                    {artist.verified && (
                      <Badge className="bg-[var(--color-teal)] text-white gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  {artist.tagline && (
                    <p className="mt-2 text-lg text-[var(--color-charcoal)]/70 italic">
                      {artist.tagline}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-[var(--color-charcoal)]/60">
                    <span className="flex items-center gap-1.5">
                      {MEDIUM_LABELS[artist.primary_medium]}
                    </span>
                    <span className="text-[var(--color-charcoal)]/30">•</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {LOCATION_LABELS[artist.location]}
                    </span>
                  </div>
                </div>

                {/* Availability Badges */}
                <div className="flex flex-wrap gap-2">
                  {artist.open_for_commissions && (
                    <Badge className="bg-[var(--color-ochre)] text-[var(--color-soft-black)]">
                      Open for Commissions
                    </Badge>
                  )}
                  {artist.open_for_collaboration && (
                    <Badge variant="outline" className="border-[var(--color-teal)] text-[var(--color-teal)]">
                      Open to Collaborate
                    </Badge>
                  )}
                  {artist.open_for_events && (
                    <Badge variant="outline" className="border-[var(--color-terracotta)] text-[var(--color-terracotta)]">
                      Available for Events
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column - Bio and Portfolio */}
            <div className="lg:col-span-2 space-y-10">
              {/* About */}
              <div>
                <h2 className="font-display text-2xl font-semibold text-[var(--color-charcoal)] mb-4">
                  About
                </h2>
                <p className="text-[var(--color-charcoal)]/70 leading-relaxed whitespace-pre-line">
                  {artist.bio}
                </p>

                {/* Styles */}
                {artist.styles && artist.styles.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {artist.styles.map((style) => (
                      <span
                        key={style}
                        className="text-sm px-3 py-1 bg-[var(--color-cream)] text-[var(--color-charcoal)]/70 rounded-full"
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Services */}
              {services.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[var(--color-charcoal)] mb-6">
                    Services & Offerings
                  </h2>
                  <ServicesSection services={services} />
                </div>
              )}

              {/* Portfolio */}
              {portfolioItems.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[var(--color-charcoal)] mb-6">
                    Portfolio
                  </h2>
                  <PortfolioGallery items={portfolioItems} />
                </div>
              )}
            </div>

            {/* Right Column - Contact */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              {(artist.experience || artist.price_range) && (
                <div className="bg-[var(--color-warm-white)] rounded-2xl p-6 shadow-sm mb-6">
                  <div className="space-y-4">
                    {artist.experience && (
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-[var(--color-ochre)]" />
                        <div>
                          <p className="text-xs text-[var(--color-charcoal)]/50 uppercase tracking-wide">Experience</p>
                          <p className="text-sm font-medium text-[var(--color-charcoal)]">
                            {EXPERIENCE_LABELS[artist.experience]}
                          </p>
                        </div>
                      </div>
                    )}
                    {artist.price_range && artist.price_range !== 'contact' && (
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-[var(--color-teal)]" />
                        <div>
                          <p className="text-xs text-[var(--color-charcoal)]/50 uppercase tracking-wide">Price Range</p>
                          <p className="text-sm font-medium text-[var(--color-charcoal)]">
                            {PRICE_RANGE_LABELS[artist.price_range]}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Card */}
              <div className="bg-[var(--color-warm-white)] rounded-2xl p-6 shadow-sm sticky top-28">
                <h3 className="font-display text-xl font-semibold text-[var(--color-charcoal)] mb-4">
                  Get in Touch
                </h3>

                {/* Contact & Social Links */}
                <div className="space-y-3 mb-6">
                  <a
                    href={`mailto:${artist.email}`}
                    className="flex items-center gap-3 text-[var(--color-charcoal)] hover:text-[var(--color-teal)] transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="text-sm">{artist.email}</span>
                  </a>

                  {artist.whatsapp && artist.whatsapp_public && (
                    <a
                      href={`https://wa.me/${artist.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-[var(--color-charcoal)] hover:text-[var(--color-teal)] transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span className="text-sm">WhatsApp</span>
                    </a>
                  )}

                  {artist.instagram && (
                    <a
                      href={artist.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-[var(--color-charcoal)] hover:text-[var(--color-teal)] transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span className="text-sm">Instagram</span>
                    </a>
                  )}

                  {artist.facebook && (
                    <a
                      href={artist.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-[var(--color-charcoal)] hover:text-[var(--color-teal)] transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span className="text-sm">Facebook</span>
                    </a>
                  )}

                  {artist.website && (
                    <a
                      href={artist.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-[var(--color-charcoal)] hover:text-[var(--color-teal)] transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span className="text-sm">Website</span>
                    </a>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Contact Form */}
                {artist.whatsapp ? (
                  <ContactForm artist={artist} services={services} />
                ) : (
                  <p className="text-sm text-[var(--color-charcoal)]/60 text-center">
                    Contact this artist via email or social media.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
