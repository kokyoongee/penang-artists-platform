import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, Mail, Phone, Calendar, User, AlertCircle } from 'lucide-react';
import { createServerClient, getProfile } from '@/lib/supabase/server';
import { Artist, Inquiry } from '@/lib/supabase/types';

const INQUIRY_TYPE_LABELS: Record<string, string> = {
  commission: 'Commission',
  collaboration: 'Collaboration',
  purchase: 'Purchase',
  event: 'Event',
  general: 'General',
};

const INQUIRY_TYPE_COLORS: Record<string, string> = {
  commission: 'bg-purple-100 text-purple-700',
  collaboration: 'bg-blue-100 text-blue-700',
  purchase: 'bg-green-100 text-green-700',
  event: 'bg-orange-100 text-orange-700',
  general: 'bg-gray-100 text-gray-700',
};

export default async function DashboardInquiriesPage() {
  const profile = await getProfile();
  const supabase = await createServerClient();

  if (!profile) {
    redirect('/login');
  }

  // Get artist data
  const { data: artistData } = await supabase
    .from('artists')
    .select('*')
    .eq('user_id', profile.id)
    .single();

  const artist = artistData as Artist | null;

  // If no artist, show message
  if (!artist) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
          <div>
            <h2 className="font-semibold text-yellow-800">Create Your Profile First</h2>
            <p className="text-yellow-700 mt-1">
              You need to create your artist profile before you can receive inquiries.
            </p>
            <Link
              href="/dashboard/profile"
              className="inline-block mt-4 text-[var(--color-teal)] hover:underline font-medium"
            >
              Create Profile →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get inquiries for this artist
  const { data: inquiriesData } = await supabase
    .from('inquiries')
    .select('*')
    .eq('artist_id', artist.id)
    .order('created_at', { ascending: false });

  const inquiries = inquiriesData as Inquiry[] | null;

  // Get counts
  const { count: totalCount } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('artist_id', artist.id);

  const { count: weekCount } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('artist_id', artist.id)
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        <p className="text-gray-500 mt-1">
          Messages from visitors interested in your work
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-100">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Inquiries</p>
              <p className="text-2xl font-bold text-gray-900">{totalCount || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-100">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Last 7 Days</p>
              <p className="text-2xl font-bold text-gray-900">{weekCount || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {inquiries?.length ? (
          <div className="divide-y divide-gray-100">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-6">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        INQUIRY_TYPE_COLORS[inquiry.inquiry_type] ||
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {INQUIRY_TYPE_LABELS[inquiry.inquiry_type] ||
                        inquiry.inquiry_type}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(inquiry.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center gap-4 flex-wrap text-sm">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <User className="w-4 h-4 text-gray-400" />
                      {inquiry.name}
                    </div>
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="flex items-center gap-1.5 text-gray-700 hover:text-[var(--color-teal)]"
                    >
                      <Mail className="w-4 h-4 text-gray-400" />
                      {inquiry.email}
                    </a>
                    {inquiry.phone && (
                      <a
                        href={`tel:${inquiry.phone}`}
                        className="flex items-center gap-1.5 text-gray-700 hover:text-[var(--color-teal)]"
                      >
                        <Phone className="w-4 h-4 text-gray-400" />
                        {inquiry.phone}
                      </a>
                    )}
                  </div>

                  {/* Message */}
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {inquiry.message}
                  </p>

                  {/* Quick reply buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <a
                      href={`mailto:${inquiry.email}?subject=Re: Your inquiry about my artwork&body=Hi ${inquiry.name},%0D%0A%0D%0AThank you for reaching out!%0D%0A%0D%0A`}
                      className="text-sm px-3 py-1.5 bg-[var(--color-teal)] text-white rounded-lg hover:bg-[var(--color-teal)]/90"
                    >
                      Reply via Email
                    </a>
                    {inquiry.phone && (
                      <a
                        href={`https://wa.me/${inquiry.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-2">No inquiries yet</p>
            <p className="text-sm text-gray-400">
              {artist.status === 'approved'
                ? 'Inquiries from visitors will appear here'
                : 'Once your profile is approved, visitors can send you inquiries'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
