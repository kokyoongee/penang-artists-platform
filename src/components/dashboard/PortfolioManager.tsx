'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  GripVertical,
  Loader2,
  X,
  Save,
  Images,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { createUntypedClient } from '@/lib/supabase/client';
import { PortfolioItem } from '@/lib/supabase/types';

interface PortfolioManagerProps {
  artistId: string;
  items: PortfolioItem[];
}

interface EditingItem {
  id?: string;
  image_url: string;
  title: string;
  description: string;
}

export function PortfolioManager({ artistId, items }: PortfolioManagerProps) {
  const router = useRouter();
  const [portfolioItems, setPortfolioItems] = useState(items);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleAddNew = () => {
    setEditingItem({
      image_url: '',
      title: '',
      description: '',
    });
    setIsAdding(true);
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem({
      id: item.id,
      image_url: item.image_url,
      title: item.title,
      description: item.description || '',
    });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAdding(false);
    setError('');
  };

  const handleSave = async () => {
    if (!editingItem) return;
    if (!editingItem.image_url || !editingItem.title) {
      setError('Image and title are required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const supabase = createUntypedClient();

      if (editingItem.id) {
        // Update existing
        const { error: updateError } = await supabase
          .from('portfolio_items')
          .update({
            image_url: editingItem.image_url,
            title: editingItem.title,
            description: editingItem.description || null,
          })
          .eq('id', editingItem.id);

        if (updateError) throw updateError;

        setPortfolioItems((prev) =>
          prev.map((item) =>
            item.id === editingItem.id
              ? {
                  ...item,
                  image_url: editingItem.image_url,
                  title: editingItem.title,
                  description: editingItem.description || null,
                }
              : item
          )
        );
      } else {
        // Create new
        const newSortOrder =
          portfolioItems.length > 0
            ? Math.max(...portfolioItems.map((i) => i.sort_order)) + 1
            : 0;

        const { data, error: insertError } = await supabase
          .from('portfolio_items')
          .insert({
            artist_id: artistId,
            image_url: editingItem.image_url,
            title: editingItem.title,
            description: editingItem.description || null,
            sort_order: newSortOrder,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setPortfolioItems((prev) => [...prev, data]);
      }

      setEditingItem(null);
      setIsAdding(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setDeletingId(id);

    try {
      const supabase = createUntypedClient();

      const { error: deleteError } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setPortfolioItems((prev) => prev.filter((item) => item.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {editingItem && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              {isAdding ? 'Add New Item' : 'Edit Item'}
            </h3>
            <button
              onClick={handleCancel}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Image *</Label>
              <ImageUpload
                value={editingItem.image_url}
                onChange={(url) =>
                  setEditingItem({ ...editingItem, image_url: url })
                }
                folder="portfolio"
                aspectRatio="square"
                placeholder="Upload artwork"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={editingItem.title}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, title: e.target.value })
                  }
                  placeholder="Artwork title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
                  }
                  placeholder="Medium, dimensions, year, story behind the work..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save
            </Button>
          </div>
        </div>
      )}

      {/* Portfolio Grid */}
      {portfolioItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="aspect-square relative">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1.5 bg-white text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-medium text-gray-900 truncate">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-sm text-gray-500 truncate">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Add button as grid item */}
          {!editingItem && (
            <button
              onClick={handleAddNew}
              className="aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl hover:border-[var(--color-teal)] hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500">Add Item</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Images className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No portfolio items yet
          </h3>
          <p className="text-gray-500 mb-6">
            Add your best work to showcase your talent
          </p>
          {!editingItem && (
            <Button
              onClick={handleAddNew}
              className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Item
            </Button>
          )}
        </div>
      )}

      {/* Add button (when there are items but not editing) */}
      {portfolioItems.length > 0 && !editingItem && (
        <div className="flex justify-center">
          <Button
            onClick={handleAddNew}
            variant="outline"
            className="border-[var(--color-teal)] text-[var(--color-teal)] hover:bg-[var(--color-teal)]/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Item
          </Button>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h4 className="font-medium text-blue-900 mb-2">Portfolio Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Add at least 3 items to complete your profile</li>
          <li>• Use high-quality images (recommended: 1200x1200px)</li>
          <li>• Include descriptions with medium, size, and year created</li>
          <li>• Showcase a variety of your work and styles</li>
        </ul>
      </div>
    </div>
  );
}
