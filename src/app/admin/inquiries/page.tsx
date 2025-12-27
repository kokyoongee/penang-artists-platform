import Link from 'next/link';
import { MessageSquare, Mail, Phone, Calendar, User, ExternalLink } from 'lucide-react';
import { createServerClient } from '@/lib/supabase/server';

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

interface InquiryWithArtist {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  inquiry_type: string;
  message: string;
  created_at: string;
  artists: {
    display_name: string;
    slug: string;
  } | null;
}

export default async function AdminInquiriesPage() {
  const supabase = await createServerClient();

  const { data: inquiries } = await supabase
    .from('inquiries')
    .select(`
      id,
      name,
      email,
      phone,
      inquiry_type,
      message,
      created_at,
      artists (display_name, slug)
    `)
    .order('created_at', { ascending: false });

  // Get counts by type
  const { count: totalCount } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true });

  const { count: todayCount } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', new Date().toISOString().split('T')[0]);

  const { count: weekCount } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        <p className="text-gray-500">View contact inquiries from visitors</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Inquiries</p>
              <p className="text-xl font-bold text-gray-900">{totalCount || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-xl font-bold text-gray-900">{todayCount || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Last 7 Days</p>
              <p className="text-xl font-bold text-gray-900">{weekCount || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {(inquiries as InquiryWithArtist[] | null)?.length ? (
          <div className="divide-y divide-gray-100">
            {(inquiries as InquiryWithArtist[]).map((inquiry) => (
              <div key={inquiry.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
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
                      {inquiry.artists && (
                        <Link
                          href={`/artists/${inquiry.artists.slug}`}
                          target="_blank"
                          className="text-sm text-[var(--color-teal)] hover:underline flex items-center gap-1"
                        >
                          To: {inquiry.artists.display_name}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
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
              Inquiries will appear here when visitors contact artists through the
              platform
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
