'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUpload } from './ImageUpload';
import {
  Artist,
  MediumCategory,
  LocationArea,
  ExperienceLevel,
  PriceRange,
  ArtistStatus,
} from '@/lib/supabase/types';

interface ArtistFormProps {
  artist?: Artist;
  isEditing?: boolean;
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
  { value: 'georgetown', label: 'Georgetown' },
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
  { value: 'emerging', label: 'Emerging' },
  { value: 'established', label: 'Established' },
  { value: 'master', label: 'Master' },
];

const PRICE_OPTIONS: { value: PriceRange; label: string }[] = [
  { value: 'budget', label: 'Budget Friendly' },
  { value: 'mid', label: 'Mid Range' },
  { value: 'premium', label: 'Premium' },
  { value: 'contact', label: 'Contact for Pricing' },
];

const STATUS_OPTIONS: { value: ArtistStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'suspended', label: 'Suspended' },
];

export function ArtistForm({ artist, isEditing = false }: ArtistFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [styleInput, setStyleInput] = useState('');

  const [formData, setFormData] = useState({
    display_name: artist?.display_name || '',
    email: artist?.email || '',
    tagline: artist?.tagline || '',
    bio: artist?.bio || '',
    location: artist?.location || 'georgetown',
    primary_medium: artist?.primary_medium || 'visual-art',
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
    price_range: artist?.price_range || 'contact',
    status: artist?.status || 'draft',
    featured: artist?.featured ?? false,
    verified: artist?.verified ?? false,
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addStyle = () => {
    if (styleInput.trim() && !formData.styles.includes(styleInput.trim())) {
      updateField('styles', [...formData.styles, styleInput.trim()]);
      setStyleInput('');
    }
  };

  const removeStyle = (style: string) => {
    updateField(
      'styles',
      formData.styles.filter((s) => s !== style)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const baseData = {
        display_name: formData.display_name,
        email: formData.email,
        tagline: formData.tagline || null,
        bio: formData.bio,
        location: formData.location as LocationArea,
        primary_medium: formData.primary_medium as MediumCategory,
        secondary_mediums: formData.secondary_mediums as MediumCategory[],
        styles: formData.styles,
        experience: (formData.experience as ExperienceLevel) || null,
        profile_photo: formData.profile_photo || null,
        featured_image: formData.featured_image || null,
        whatsapp: formData.whatsapp || null,
        whatsapp_public: formData.whatsapp_public,
        instagram: formData.instagram || null,
        facebook: formData.facebook || null,
        website: formData.website || null,
        open_for_commissions: formData.open_for_commissions,
        open_for_collaboration: formData.open_for_collaboration,
        open_for_events: formData.open_for_events,
        price_range: formData.price_range as PriceRange,
        status: formData.status as ArtistStatus,
        featured: formData.featured,
        verified: formData.verified,
        ...(isEditing && artist && { id: artist.id }),
      };

      const response = await fetch('/api/admin/artists', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(baseData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save artist');
      }

      router.push('/admin/artists');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save artist');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/artists"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Artist' : 'Add New Artist'}
            </h1>
            <p className="text-gray-500">
              {isEditing
                ? `Editing ${artist?.display_name}`
                : 'Create a new artist profile'}
            </p>
          </div>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Artist
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name *</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => updateField('display_name', e.target.value)}
                    required
                    placeholder="Artist name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    required
                    placeholder="artist@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => updateField('tagline', e.target.value)}
                  placeholder="A short description of the artist"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                  required
                  rows={5}
                  placeholder="Full bio and background..."
                />
              </div>
            </div>
          </div>

          {/* Art Practice */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Art Practice</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Medium *</Label>
                  <Select
                    value={formData.primary_medium}
                    onValueChange={(v) => updateField('primary_medium', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select medium" />
                    </SelectTrigger>
                    <SelectContent>
                      {MEDIUM_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <Select
                    value={formData.experience || 'none'}
                    onValueChange={(v) =>
                      updateField('experience', v === 'none' ? null : v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not specified</SelectItem>
                      {EXPERIENCE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Styles</Label>
                <div className="flex gap-2">
                  <Input
                    value={styleInput}
                    onChange={(e) => setStyleInput(e.target.value)}
                    placeholder="Add a style (e.g., Abstract, Traditional)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addStyle();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addStyle}>
                    Add
                  </Button>
                </div>
                {formData.styles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.styles.map((style) => (
                      <Badge
                        key={style}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeStyle(style)}
                      >
                        {style} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Contact & Social</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => updateField('whatsapp', e.target.value)}
                    placeholder="60123456789"
                  />
                  <p className="text-xs text-gray-500">Include country code without +</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => updateField('instagram', e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input
                    id="facebook"
                    value={formData.facebook}
                    onChange={(e) => updateField('facebook', e.target.value)}
                    placeholder="https://facebook.com/..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Images</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Profile Photo</Label>
                <ImageUpload
                  value={formData.profile_photo}
                  onChange={(url) => updateField('profile_photo', url)}
                  folder="profiles"
                  aspectRatio="square"
                  placeholder="Upload profile photo"
                />
              </div>
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <ImageUpload
                  value={formData.featured_image}
                  onChange={(url) => updateField('featured_image', url)}
                  folder="featured"
                  aspectRatio="landscape"
                  placeholder="Upload banner image"
                />
                <p className="text-xs text-gray-500">
                  Banner image shown at top of profile page
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Status</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Profile Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => updateField('status', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => updateField('featured', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[var(--color-teal)]"
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Featured on homepage
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="verified"
                  checked={formData.verified}
                  onChange={(e) => updateField('verified', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[var(--color-teal)]"
                />
                <Label htmlFor="verified" className="cursor-pointer">
                  Verified artist badge
                </Label>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Location</h2>
            <Select
              value={formData.location}
              onValueChange={(v) => updateField('location', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCATION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Availability</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="commissions"
                  checked={formData.open_for_commissions}
                  onChange={(e) =>
                    updateField('open_for_commissions', e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300 text-[var(--color-teal)]"
                />
                <Label htmlFor="commissions" className="cursor-pointer">
                  Open for commissions
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="collaboration"
                  checked={formData.open_for_collaboration}
                  onChange={(e) =>
                    updateField('open_for_collaboration', e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300 text-[var(--color-teal)]"
                />
                <Label htmlFor="collaboration" className="cursor-pointer">
                  Open to collaborate
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="events"
                  checked={formData.open_for_events}
                  onChange={(e) => updateField('open_for_events', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[var(--color-teal)]"
                />
                <Label htmlFor="events" className="cursor-pointer">
                  Available for events
                </Label>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <Label>Price Range</Label>
              <Select
                value={formData.price_range}
                onValueChange={(v) => updateField('price_range', v)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
