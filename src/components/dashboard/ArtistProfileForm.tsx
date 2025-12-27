'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { createUntypedClient } from '@/lib/supabase/client';
import {
  Profile,
  Artist,
  MediumCategory,
  LocationArea,
  ExperienceLevel,
  PriceRange,
} from '@/lib/supabase/types';

interface ArtistProfileFormProps {
  profile: Profile;
  artist: Artist | null;
}

const MEDIUM_OPTIONS: { value: MediumCategory; label: string }[] = [
  { value: 'visual-art', label: 'Visual Art' },
  { value: 'photography', label: 'Photography' },
  { value: 'craft', label: 'Craft' },
  { value: 'illustration', label: 'Illustration' },
  { value: 'murals-street-art', label: 'Murals & Street Art' },
  { value: 'tattoo', label: 'Tattoo' },
  { value: 'music', label: 'Music' },
  { value: 'performance', label: 'Performance' },
];

const LOCATION_OPTIONS: { value: LocationArea; label: string }[] = [
  { value: 'georgetown', label: 'George Town' },
  { value: 'bayan-lepas', label: 'Bayan Lepas' },
  { value: 'batu-ferringhi', label: 'Batu Ferringhi' },
  { value: 'air-itam', label: 'Air Itam' },
  { value: 'jelutong', label: 'Jelutong' },
  { value: 'tanjung-bungah', label: 'Tanjung Bungah' },
  { value: 'butterworth', label: 'Butterworth' },
  { value: 'bukit-mertajam', label: 'Bukit Mertajam' },
  { value: 'balik-pulau', label: 'Balik Pulau' },
  { value: 'other', label: 'Other' },
];

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string }[] = [
  { value: 'emerging', label: 'Emerging (0-3 years)' },
  { value: 'established', label: 'Established (3-10 years)' },
  { value: 'master', label: 'Master (10+ years)' },
];

const PRICE_RANGE_OPTIONS: { value: PriceRange; label: string }[] = [
  { value: 'budget', label: 'Budget-friendly' },
  { value: 'mid', label: 'Mid-range' },
  { value: 'premium', label: 'Premium' },
  { value: 'contact', label: 'Contact for pricing' },
];

export function ArtistProfileForm({ profile, artist }: ArtistProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    display_name: artist?.display_name || profile.full_name || '',
    tagline: artist?.tagline || '',
    bio: artist?.bio || '',
    email: artist?.email || profile.email,
    location: artist?.location || ('georgetown' as LocationArea),
    primary_medium: artist?.primary_medium || ('visual-art' as MediumCategory),
    secondary_mediums: artist?.secondary_mediums || [],
    styles: artist?.styles || [],
    experience: artist?.experience || null,
    profile_photo: artist?.profile_photo || '',
    featured_image: artist?.featured_image || '',
    whatsapp: artist?.whatsapp || '',
    whatsapp_public: artist?.whatsapp_public ?? true,
    instagram: artist?.instagram || '',
    facebook: artist?.facebook || '',
    website: artist?.website || '',
    open_for_commissions: artist?.open_for_commissions ?? false,
    open_for_collaboration: artist?.open_for_collaboration ?? false,
    open_for_events: artist?.open_for_events ?? false,
    price_range: artist?.price_range || ('contact' as PriceRange),
  });

  const [stylesInput, setStylesInput] = useState(formData.styles.join(', '));

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const toggleMedium = (medium: MediumCategory) => {
    setFormData((prev) => ({
      ...prev,
      secondary_mediums: prev.secondary_mediums.includes(medium)
        ? prev.secondary_mediums.filter((m) => m !== medium)
        : [...prev.secondary_mediums, medium],
    }));
    setIsSaved(false);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent, submitForReview = false) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const supabase = createUntypedClient();

      // Parse styles from comma-separated input
      const styles = stylesInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      // Generate slug from display name
      const baseSlug = generateSlug(formData.display_name);
      let slug = baseSlug;

      // Only check for unique slug when creating new artist
      if (!artist) {
        // Check if slug exists, add random suffix if needed
        const { data: existing } = await supabase
          .from('artists')
          .select('slug')
          .eq('slug', baseSlug)
          .single();

        if (existing) {
          slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
        }
      }

      const artistData = {
        ...formData,
        styles,
        slug: artist?.slug || slug, // Keep existing slug on update
        user_id: profile.id,
        status: submitForReview ? 'pending' : (artist?.status || 'draft'),
      };

      if (artist) {
        // Update existing artist
        const { error: updateError } = await supabase
          .from('artists')
          .update(artistData)
          .eq('id', artist.id);

        if (updateError) throw updateError;
      } else {
        // Create new artist
        const { error: insertError } = await supabase
          .from('artists')
          .insert(artistData);

        if (insertError) throw insertError;
      }

      setIsSaved(true);
      router.refresh();

      if (submitForReview) {
        router.push('/dashboard?submitted=true');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <ImageUpload
                value={formData.profile_photo}
                onChange={(url) => updateField('profile_photo', url)}
                folder="profiles"
                aspectRatio="square"
                placeholder="Upload photo"
              />
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name *</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => updateField('display_name', e.target.value)}
                  placeholder="Your artist name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => updateField('tagline', e.target.value)}
                  placeholder="e.g. Contemporary artist exploring identity"
                  maxLength={100}
                />
                <p className="text-xs text-gray-400">
                  A short description that appears under your name
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="bio">Bio *</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              placeholder="Tell visitors about yourself, your journey, and your art..."
              rows={5}
              required
            />
            <p className="text-xs text-gray-400">
              Write at least 50 characters to tell your story
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Select
              value={formData.location}
              onValueChange={(value: LocationArea) =>
                updateField('location', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {LOCATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experience Level</Label>
            <Select
              value={formData.experience || ''}
              onValueChange={(value: ExperienceLevel) =>
                updateField('experience', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Art Practice */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Art</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="primary_medium">Primary Medium *</Label>
            <Select
              value={formData.primary_medium}
              onValueChange={(value: MediumCategory) =>
                updateField('primary_medium', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select primary medium" />
              </SelectTrigger>
              <SelectContent>
                {MEDIUM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Secondary Mediums</Label>
            <div className="flex flex-wrap gap-2">
              {MEDIUM_OPTIONS.filter(
                (m) => m.value !== formData.primary_medium
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleMedium(option.value)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    formData.secondary_mediums.includes(option.value)
                      ? 'bg-[var(--color-teal)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="styles">Art Styles</Label>
            <Input
              id="styles"
              value={stylesInput}
              onChange={(e) => setStylesInput(e.target.value)}
              placeholder="e.g. Abstract, Minimalist, Street Art"
            />
            <p className="text-xs text-gray-400">
              Comma-separated list of styles that describe your work
            </p>
          </div>

          <div className="space-y-2">
            <Label>Featured Image</Label>
            <ImageUpload
              value={formData.featured_image}
              onChange={(url) => updateField('featured_image', url)}
              folder="featured"
              aspectRatio="landscape"
              placeholder="Upload your best work"
            />
            <p className="text-xs text-gray-400">
              This will be shown prominently on your profile
            </p>
          </div>
        </div>
      </div>

      {/* Contact & Social */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact & Social</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input
              id="whatsapp"
              value={formData.whatsapp}
              onChange={(e) => updateField('whatsapp', e.target.value)}
              placeholder="+60123456789"
            />
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={formData.whatsapp_public}
                onChange={(e) =>
                  updateField('whatsapp_public', e.target.checked)
                }
                className="rounded"
              />
              Show WhatsApp link on profile
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-200 rounded-l-md">
                @
              </span>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => updateField('instagram', e.target.value)}
                placeholder="username"
                className="rounded-l-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={formData.facebook}
              onChange={(e) => updateField('facebook', e.target.value)}
              placeholder="facebook.com/yourpage"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => updateField('website', e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.open_for_commissions}
                onChange={(e) =>
                  updateField('open_for_commissions', e.target.checked)
                }
                className="rounded"
              />
              Open for commissions
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.open_for_collaboration}
                onChange={(e) =>
                  updateField('open_for_collaboration', e.target.checked)
                }
                className="rounded"
              />
              Open for collaboration
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.open_for_events}
                onChange={(e) =>
                  updateField('open_for_events', e.target.checked)
                }
                className="rounded"
              />
              Available for events
            </label>
          </div>

          <div className="space-y-2 max-w-xs">
            <Label htmlFor="price_range">Price Range</Label>
            <Select
              value={formData.price_range}
              onValueChange={(value: PriceRange) =>
                updateField('price_range', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                {PRICE_RANGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-white rounded-xl shadow-sm p-6">
        <div className="text-sm text-gray-500">
          {isSaved && (
            <span className="text-green-600 font-medium">
              ✓ Changes saved
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Draft
          </Button>

          {(!artist || artist.status === 'draft') && (
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading}
              className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Submit for Review
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
