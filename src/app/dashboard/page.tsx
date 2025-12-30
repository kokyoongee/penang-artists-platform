import Link from 'next/link';
import {
  User,
  Images,
  MessageSquare,
  Eye,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { createAdminClient, getProfileWithClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Artist } from '@/lib/supabase/types';
import { getCachedArtist, getCachedDashboardCounts } from '@/lib/cache';

export default async function DashboardPage() {
  // Get profile and userId - cached queries handle their own clients
  const { profile, userId } = await getProfileWithClient();

  if (!profile || !userId) {
    return null;
  }

  // Get artist data from cache (60s TTL)
  let artistData = await getCachedArtist(userId);

  // Auto-create draft artist profile if none exists (fixes "join twice" UX issue)
  if (!artistData) {
    const adminClient = createAdminClient();
    const userName = profile.full_name || profile.email?.split('@')[0] || 'Artist';

    const baseSlug = userName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    const { data: newArtist } = await adminClient
      .from('artists')
      .insert({
        user_id: userId,
        display_name: userName,
        slug: slug,
        email: profile.email,
        bio: '',
        location: 'georgetown',
        primary_medium: 'visual-art',
        secondary_mediums: [],
        status: 'draft',
      })
      .select()
      .single();

    if (newArtist) {
      artistData = newArtist;
    }
  }

  const artist = artistData as Artist | null;

  // Get counts from cache (30s TTL) - uses parallel queries internally
  const { portfolioCount, inquiriesCount } = artist
    ? await getCachedDashboardCounts(artist.id)
    : { portfolioCount: 0, inquiriesCount: 0 };

  // No artist profile yet - show onboarding
  if (!artist) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-[var(--color-teal)]/10 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-[var(--color-teal)]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Penang Artists!
          </h1>
          <p className="text-gray-600 mb-6">
            You're just a few steps away from showcasing your art to the world.
            Create your profile to get started.
          </p>

          <div className="space-y-4 mb-8 text-left max-w-sm mx-auto">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--color-teal)]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[var(--color-teal)]">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Create your profile</p>
                <p className="text-sm text-gray-500">
                  Add your bio, photo, and contact info
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-gray-400">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-400">Upload your portfolio</p>
                <p className="text-sm text-gray-400">
                  Showcase your best work
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-gray-400">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-400">Submit for review</p>
                <p className="text-sm text-gray-400">
                  We'll approve your profile within 24 hours
                </p>
              </div>
            </div>
          </div>

          <Link href="/dashboard/profile">
            <Button className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90">
              Create Your Profile
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Has artist profile - show dashboard
  return (
    <div className="space-y-6">
      {/* Status Alert */}
      {artist.status === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Profile Under Review</p>
            <p className="text-sm text-yellow-700">
              Your profile is being reviewed by our team. We'll notify you once it's approved.
            </p>
          </div>
        </div>
      )}

      {artist.status === 'approved' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-800">Profile Live!</p>
            <p className="text-sm text-green-700">
              Your profile is visible to visitors.{' '}
              <Link
                href={`/artists/${artist.slug}`}
                target="_blank"
                className="underline hover:no-underline"
              >
                View your public profile →
              </Link>
            </p>
          </div>
        </div>
      )}

      {artist.status === 'suspended' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Profile Suspended</p>
            <p className="text-sm text-red-700">
              {artist.rejection_reason || 'Your profile has been suspended. Please contact support.'}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-100">
              <Images className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Portfolio Items</p>
              <p className="text-2xl font-bold text-gray-900">{portfolioCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-100">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Inquiries</p>
              <p className="text-2xl font-bold text-gray-900">{inquiriesCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-green-100">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Profile Status</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">{artist.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/profile"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[var(--color-teal)]/10">
                <User className="w-6 h-6 text-[var(--color-teal)]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Edit Profile</h3>
                <p className="text-sm text-gray-500">
                  Update your bio, photo, and contact info
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[var(--color-teal)] transition-colors" />
          </div>
        </Link>

        <Link
          href="/dashboard/portfolio"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <Images className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Portfolio</h3>
                <p className="text-sm text-gray-500">
                  Add, edit, or remove portfolio items
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Profile completeness */}
      {artist.status === 'draft' && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Complete Your Profile</h3>
          <div className="space-y-3">
            <ProfileCheckItem
              label="Add profile photo"
              completed={!!artist.profile_photo}
              href="/dashboard/profile"
            />
            <ProfileCheckItem
              label="Write your bio"
              completed={artist.bio.length > 50}
              href="/dashboard/profile"
            />
            <ProfileCheckItem
              label="Add WhatsApp number"
              completed={!!artist.whatsapp}
              href="/dashboard/profile"
            />
            <ProfileCheckItem
              label="Upload at least 3 portfolio items"
              completed={portfolioCount >= 3}
              href="/dashboard/portfolio"
            />
          </div>

          {artist.profile_photo &&
            artist.bio.length > 50 &&
            artist.whatsapp &&
            portfolioCount >= 3 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-3">
                  Your profile is ready! Submit it for review to go live.
                </p>
                <SubmitForReviewButton artistId={artist.id} />
              </div>
            )}
        </div>
      )}
    </div>
  );
}

function ProfileCheckItem({
  label,
  completed,
  href,
}: {
  label: string;
  completed: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
        completed
          ? 'bg-green-50 text-green-700'
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center ${
          completed ? 'bg-green-500 text-white' : 'border-2 border-gray-300'
        }`}
      >
        {completed && <CheckCircle2 className="w-3.5 h-3.5" />}
      </div>
      <span className={completed ? 'line-through' : ''}>{label}</span>
    </Link>
  );
}

function SubmitForReviewButton({ artistId }: { artistId: string }) {
  'use client';

  return (
    <form action={`/api/artists/${artistId}/submit`} method="POST">
      <Button
        type="submit"
        className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90"
      >
        Submit for Review
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </form>
  );
}
