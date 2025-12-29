'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  Loader2,
  X,
  Save,
  Package,
  Eye,
  EyeOff,
  Star,
  Clock,
  DollarSign,
} from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { createUntypedClient } from '@/lib/supabase/client';
import { Service, ServiceType, PriceType } from '@/lib/supabase/types';

interface ServicesManagerProps {
  artistId: string;
  services: Service[];
}

const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  commission: 'Commission',
  workshop: 'Workshop',
  performance: 'Performance',
  consultation: 'Consultation',
  print: 'Art Print',
  original: 'Original Artwork',
  merchandise: 'Merchandise',
  other: 'Other',
};

const PRICE_TYPE_LABELS: Record<PriceType, string> = {
  fixed: 'Fixed Price',
  from: 'Starting From',
  range: 'Price Range',
  hourly: 'Per Hour',
  quote: 'Contact for Quote',
};

interface EditingService {
  id?: string;
  title: string;
  description: string;
  service_type: ServiceType;
  price_type: PriceType;
  price_min: string;
  price_max: string;
  delivery_time: string;
  image_url: string;
  is_active: boolean;
  is_featured: boolean;
}

const defaultService: EditingService = {
  title: '',
  description: '',
  service_type: 'commission',
  price_type: 'quote',
  price_min: '',
  price_max: '',
  delivery_time: '',
  image_url: '',
  is_active: true,
  is_featured: false,
};

function formatPrice(service: Service): string {
  if (service.price_type === 'quote') {
    return 'Contact for quote';
  }

  const currency = service.currency || 'MYR';
  const formatNum = (n: number) => n.toLocaleString('en-MY');

  if (service.price_type === 'fixed' && service.price_min) {
    return `${currency} ${formatNum(service.price_min)}`;
  }

  if (service.price_type === 'from' && service.price_min) {
    return `From ${currency} ${formatNum(service.price_min)}`;
  }

  if (service.price_type === 'range' && service.price_min && service.price_max) {
    return `${currency} ${formatNum(service.price_min)} - ${formatNum(service.price_max)}`;
  }

  if (service.price_type === 'hourly' && service.price_min) {
    return `${currency} ${formatNum(service.price_min)}/hour`;
  }

  return 'Price not set';
}

export function ServicesManager({ artistId, services }: ServicesManagerProps) {
  const router = useRouter();
  const [servicesList, setServicesList] = useState(services);
  const [isAdding, setIsAdding] = useState(false);
  const [editingService, setEditingService] = useState<EditingService | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleAddNew = () => {
    setEditingService({ ...defaultService });
    setIsAdding(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService({
      id: service.id,
      title: service.title,
      description: service.description || '',
      service_type: service.service_type,
      price_type: service.price_type,
      price_min: service.price_min?.toString() || '',
      price_max: service.price_max?.toString() || '',
      delivery_time: service.delivery_time || '',
      image_url: service.image_url || '',
      is_active: service.is_active,
      is_featured: service.is_featured,
    });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingService(null);
    setIsAdding(false);
    setError('');
  };

  const handleSave = async () => {
    if (!editingService) return;
    if (!editingService.title) {
      setError('Title is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const supabase = createUntypedClient();

      const serviceData = {
        title: editingService.title,
        description: editingService.description || null,
        service_type: editingService.service_type,
        price_type: editingService.price_type,
        price_min: editingService.price_min ? parseFloat(editingService.price_min) : null,
        price_max: editingService.price_max ? parseFloat(editingService.price_max) : null,
        delivery_time: editingService.delivery_time || null,
        image_url: editingService.image_url || null,
        is_active: editingService.is_active,
        is_featured: editingService.is_featured,
      };

      if (editingService.id) {
        // Update existing
        const { error: updateError } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);

        if (updateError) throw updateError;

        setServicesList((prev) =>
          prev.map((s) =>
            s.id === editingService.id
              ? { ...s, ...serviceData }
              : s
          )
        );
      } else {
        // Create new
        const newSortOrder =
          servicesList.length > 0
            ? Math.max(...servicesList.map((s) => s.sort_order)) + 1
            : 0;

        const { data, error: insertError } = await supabase
          .from('services')
          .insert({
            artist_id: artistId,
            ...serviceData,
            sort_order: newSortOrder,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setServicesList((prev) => [...prev, data]);
      }

      setEditingService(null);
      setIsAdding(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    setDeletingId(id);

    try {
      const supabase = createUntypedClient();

      const { error: deleteError } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setServicesList((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (service: Service) => {
    setTogglingId(service.id);

    try {
      const supabase = createUntypedClient();

      const { error: updateError } = await supabase
        .from('services')
        .update({ is_active: !service.is_active })
        .eq('id', service.id);

      if (updateError) throw updateError;

      setServicesList((prev) =>
        prev.map((s) =>
          s.id === service.id ? { ...s, is_active: !s.is_active } : s
        )
      );
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {editingService && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              {isAdding ? 'Add New Service' : 'Edit Service'}
            </h3>
            <button
              onClick={handleCancel}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Image */}
            <div className="space-y-2">
              <Label>Service Image</Label>
              <ImageUpload
                value={editingService.image_url}
                onChange={(url) =>
                  setEditingService({ ...editingService, image_url: url })
                }
                folder="services"
                aspectRatio="landscape"
                placeholder="Upload image (optional)"
              />
            </div>

            {/* Right column - Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={editingService.title}
                  onChange={(e) =>
                    setEditingService({ ...editingService, title: e.target.value })
                  }
                  placeholder="e.g., Custom Portrait Commission"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_type">Service Type</Label>
                <Select
                  value={editingService.service_type}
                  onValueChange={(value: ServiceType) =>
                    setEditingService({ ...editingService, service_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe what's included, materials, sizes, etc."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="font-medium text-gray-900 mb-4">Pricing</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Price Type</Label>
                <Select
                  value={editingService.price_type}
                  onValueChange={(value: PriceType) =>
                    setEditingService({ ...editingService, price_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRICE_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {editingService.price_type !== 'quote' && (
                <>
                  <div className="space-y-2">
                    <Label>
                      {editingService.price_type === 'range' ? 'Min Price (MYR)' : 'Price (MYR)'}
                    </Label>
                    <Input
                      type="number"
                      value={editingService.price_min}
                      onChange={(e) =>
                        setEditingService({ ...editingService, price_min: e.target.value })
                      }
                      placeholder="0.00"
                    />
                  </div>

                  {editingService.price_type === 'range' && (
                    <div className="space-y-2">
                      <Label>Max Price (MYR)</Label>
                      <Input
                        type="number"
                        value={editingService.price_max}
                        onChange={(e) =>
                          setEditingService({ ...editingService, price_max: e.target.value })
                        }
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </>
              )}

              <div className="space-y-2">
                <Label>Delivery Time</Label>
                <Input
                  value={editingService.delivery_time}
                  onChange={(e) =>
                    setEditingService({ ...editingService, delivery_time: e.target.value })
                  }
                  placeholder="e.g., 2-4 weeks"
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingService.is_active}
                onChange={(e) =>
                  setEditingService({ ...editingService, is_active: e.target.checked })
                }
                className="rounded border-gray-300 text-[var(--color-teal)] focus:ring-[var(--color-teal)]"
              />
              <span className="text-sm text-gray-700">Active (visible to viewers)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingService.is_featured}
                onChange={(e) =>
                  setEditingService({ ...editingService, is_featured: e.target.checked })
                }
                className="rounded border-gray-300 text-[var(--color-ochre)] focus:ring-[var(--color-ochre)]"
              />
              <span className="text-sm text-gray-700">Featured (highlighted on profile)</span>
            </label>
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

      {/* Services List */}
      {servicesList.length > 0 ? (
        <div className="space-y-4">
          {servicesList.map((service) => (
            <div
              key={service.id}
              className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                !service.is_active ? 'opacity-60' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                {service.image_url && (
                  <div className="relative w-full md:w-48 h-32 flex-shrink-0">
                    <Image
                      src={service.image_url}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-gray-900">{service.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {SERVICE_TYPE_LABELS[service.service_type]}
                        </Badge>
                        {service.is_featured && (
                          <Badge className="bg-[var(--color-ochre)] text-[var(--color-soft-black)] text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {!service.is_active && (
                          <Badge variant="outline" className="text-xs text-gray-500">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Hidden
                          </Badge>
                        )}
                      </div>

                      {service.description && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {service.description}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-[var(--color-teal)]" />
                          {formatPrice(service)}
                        </span>
                        {service.delivery_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {service.delivery_time}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(service)}
                        disabled={togglingId === service.id}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title={service.is_active ? 'Hide' : 'Show'}
                      >
                        {togglingId === service.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : service.is_active ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(service)}
                        className="px-3 py-1.5 text-sm font-medium text-[var(--color-teal)] hover:bg-[var(--color-teal)]/10 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        disabled={deletingId === service.id}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deletingId === service.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No services yet
          </h3>
          <p className="text-gray-500 mb-6">
            Add services to let visitors know what you offer
          </p>
          {!editingService && (
            <Button
              onClick={handleAddNew}
              className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Service
            </Button>
          )}
        </div>
      )}

      {/* Add button (when there are services but not editing) */}
      {servicesList.length > 0 && !editingService && (
        <div className="flex justify-center">
          <Button
            onClick={handleAddNew}
            variant="outline"
            className="border-[var(--color-teal)] text-[var(--color-teal)] hover:bg-[var(--color-teal)]/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Service
          </Button>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h4 className="font-medium text-blue-900 mb-2">Service Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Add at least 2-3 services to show visitors what you offer</li>
          <li>• Use clear, descriptive titles that explain the service</li>
          <li>• Include pricing to help set expectations</li>
          <li>• Mark your most popular offering as "Featured"</li>
        </ul>
      </div>
    </div>
  );
}
