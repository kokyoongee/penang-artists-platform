'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Star,
  StarOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Artist } from '@/lib/supabase/types';

interface ArtistsTableProps {
  artists: Artist[];
}

const MEDIUM_LABELS: Record<string, string> = {
  'visual-art': 'Visual Art',
  'photography': 'Photography',
  'craft': 'Craft',
  'illustration': 'Illustration',
  'murals-street-art': 'Murals & Street Art',
  'tattoo': 'Tattoo',
  'music': 'Music',
  'performance': 'Performance',
};

export function ArtistsTable({ artists }: ArtistsTableProps) {
  const router = useRouter();
  const [deleteArtist, setDeleteArtist] = useState<Artist | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (artist: Artist, newStatus: 'approved' | 'suspended') => {
    try {
      const response = await fetch('/api/admin/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: newStatus === 'approved' ? 'approve' : 'suspend',
          artistId: artist.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Admin action failed:', data.error);
      }

      router.refresh();
    } catch (error) {
      console.error('Admin action error:', error);
    }
  };

  const handleToggleFeatured = async (artist: Artist) => {
    try {
      const response = await fetch('/api/admin/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'feature',
          artistId: artist.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Feature toggle failed:', data.error);
      }

      router.refresh();
    } catch (error) {
      console.error('Feature toggle error:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteArtist) return;

    setIsDeleting(true);
    try {
      const response = await fetch('/api/admin/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          artistId: deleteArtist.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Delete failed:', data.error);
      }

      setDeleteArtist(null);
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (artists.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500 mb-4">No artists found</p>
        <Link href="/admin/artists/new">
          <Button className="bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)]">
            Add Your First Artist
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Artist
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medium
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {artists.map((artist) => (
              <tr key={artist.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      {artist.profile_photo ? (
                        <Image
                          src={artist.profile_photo}
                          alt={artist.display_name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[var(--color-teal)] flex items-center justify-center text-white text-sm font-medium">
                          {artist.display_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{artist.display_name}</p>
                      <p className="text-sm text-gray-500">{artist.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">
                    {MEDIUM_LABELS[artist.primary_medium] || artist.primary_medium}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600 capitalize">
                    {artist.location.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      artist.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : artist.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : artist.status === 'suspended'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {artist.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleFeatured(artist)}
                    className={`p-1 rounded ${
                      artist.featured
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    {artist.featured ? (
                      <Star className="w-5 h-5 fill-current" />
                    ) : (
                      <StarOff className="w-5 h-5" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(artist.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/artists/${artist.slug}`} target="_blank">
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/artists/${artist.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {artist.status !== 'approved' && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(artist, 'approved')}
                          className="text-green-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </DropdownMenuItem>
                      )}
                      {artist.status !== 'suspended' && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(artist, 'suspended')}
                          className="text-orange-600"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Suspend
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteArtist(artist)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteArtist} onOpenChange={() => setDeleteArtist(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Artist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteArtist?.display_name}&quot;? This action
              cannot be undone. All portfolio items and inquiries associated with this artist will
              also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
