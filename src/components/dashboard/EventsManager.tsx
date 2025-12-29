'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Eye,
  EyeOff,
  Star,
  Ticket,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createClient } from '@/lib/supabase/client';
import {
  Event,
  EventType,
  Location,
  EVENT_TYPE_LABELS,
  LOCATION_LABELS,
  EVENT_TYPE_ICONS,
} from '@/types';

interface EventsManagerProps {
  artistId: string;
  events: Event[];
}

interface EventFormData {
  title: string;
  description: string;
  event_type: EventType;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  is_all_day: boolean;
  venue: string;
  address: string;
  location: Location | '';
  image_url: string;
  ticket_url: string;
  is_free: boolean;
  price_info: string;
  is_published: boolean;
  is_featured: boolean;
}

const defaultFormData: EventFormData = {
  title: '',
  description: '',
  event_type: 'exhibition',
  start_date: '',
  start_time: '10:00',
  end_date: '',
  end_time: '18:00',
  is_all_day: false,
  venue: '',
  address: '',
  location: '',
  image_url: '',
  ticket_url: '',
  is_free: true,
  price_info: '',
  is_published: true,
  is_featured: false,
};

function formatEventDate(startDate: string, endDate: string | null, isAllDay: boolean): string {
  const start = new Date(startDate);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };

  if (isAllDay) {
    return start.toLocaleDateString('en-MY', options);
  }

  return start.toLocaleDateString('en-MY', {
    ...options,
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function EventsManager({ artistId, events: initialEvents }: EventsManagerProps) {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingEvent(null);
    setError(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (event: Event) => {
    const startDate = new Date(event.start_date);
    const endDate = event.end_date ? new Date(event.end_date) : null;

    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      event_type: event.event_type,
      start_date: startDate.toISOString().split('T')[0],
      start_time: event.is_all_day ? '10:00' : startDate.toTimeString().slice(0, 5),
      end_date: endDate ? endDate.toISOString().split('T')[0] : '',
      end_time: endDate && !event.is_all_day ? endDate.toTimeString().slice(0, 5) : '18:00',
      is_all_day: event.is_all_day,
      venue: event.venue || '',
      address: event.address || '',
      location: (event.location as Location) || '',
      image_url: event.image_url || '',
      ticket_url: event.ticket_url || '',
      is_free: event.is_free,
      price_info: event.price_info || '',
      is_published: event.is_published,
      is_featured: event.is_featured,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Combine date and time
      let startDateTime = formData.start_date;
      let endDateTime = formData.end_date || null;

      if (!formData.is_all_day) {
        startDateTime = `${formData.start_date}T${formData.start_time}:00`;
        if (formData.end_date) {
          endDateTime = `${formData.end_date}T${formData.end_time}:00`;
        }
      }

      const eventData = {
        artist_id: artistId,
        title: formData.title,
        description: formData.description || null,
        event_type: formData.event_type,
        start_date: startDateTime,
        end_date: endDateTime,
        is_all_day: formData.is_all_day,
        venue: formData.venue || null,
        address: formData.address || null,
        location: formData.location || null,
        image_url: formData.image_url || null,
        ticket_url: formData.ticket_url || null,
        is_free: formData.is_free,
        price_info: formData.is_free ? null : formData.price_info || null,
        is_published: formData.is_published,
        is_featured: formData.is_featured,
      };

      if (editingEvent) {
        // Update existing event
        const { data, error } = await (supabase as any)
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id)
          .select()
          .single();

        if (error) throw error;

        setEvents(events.map((e) => (e.id === editingEvent.id ? data : e)));
      } else {
        // Create new event
        const { data, error } = await (supabase as any)
          .from('events')
          .insert(eventData)
          .select()
          .single();

        if (error) throw error;

        setEvents([...events, data]);
      }

      setIsDialogOpen(false);
      resetForm();
      router.refresh();
    } catch (err: any) {
      console.error('Error saving event:', err);
      setError(err.message || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await (supabase as any)
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setEvents(events.filter((e) => e.id !== eventId));
      router.refresh();
    } catch (err: any) {
      console.error('Error deleting event:', err);
      alert('Failed to delete event');
    }
  };

  const togglePublished = async (event: Event) => {
    try {
      const { error } = await (supabase as any)
        .from('events')
        .update({ is_published: !event.is_published })
        .eq('id', event.id);

      if (error) throw error;

      setEvents(
        events.map((e) =>
          e.id === event.id ? { ...e, is_published: !e.is_published } : e
        )
      );
      router.refresh();
    } catch (err: any) {
      console.error('Error toggling event:', err);
    }
  };

  const updateField = (field: keyof EventFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Sort events by start date
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={openAddDialog}
            className="bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g., Street Art Exhibition"
                required
              />
            </div>

            {/* Event Type */}
            <div className="space-y-2">
              <Label htmlFor="event_type">Event Type *</Label>
              <Select
                value={formData.event_type}
                onValueChange={(value) => updateField('event_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {EVENT_TYPE_ICONS[value as EventType]} {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Tell people what this event is about..."
                rows={3}
              />
            </div>

            {/* Date and Time */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_all_day"
                  checked={formData.is_all_day}
                  onChange={(e) => updateField('is_all_day', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="is_all_day" className="font-normal">
                  All-day event
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => updateField('start_date', e.target.value)}
                    required
                  />
                </div>
                {!formData.is_all_day && (
                  <div className="space-y-2">
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => updateField('start_time', e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date (optional)</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => updateField('end_date', e.target.value)}
                  />
                </div>
                {!formData.is_all_day && formData.end_date && (
                  <div className="space-y-2">
                    <Label htmlFor="end_time">End Time</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => updateField('end_time', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="venue">Venue Name</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => updateField('venue', e.target.value)}
                  placeholder="e.g., Hin Bus Depot"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Area</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => updateField('location', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LOCATION_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Full Address (optional)</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="e.g., 31A Jalan Gurdwara, Georgetown"
              />
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_free"
                  checked={formData.is_free}
                  onChange={(e) => updateField('is_free', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="is_free" className="font-normal">
                  Free event
                </Label>
              </div>

              {!formData.is_free && (
                <div className="space-y-2">
                  <Label htmlFor="price_info">Price Info</Label>
                  <Input
                    id="price_info"
                    value={formData.price_info}
                    onChange={(e) => updateField('price_info', e.target.value)}
                    placeholder="e.g., RM 50 or RM 30-50"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="ticket_url">Ticket/RSVP Link (optional)</Label>
                <Input
                  id="ticket_url"
                  type="url"
                  value={formData.ticket_url}
                  onChange={(e) => updateField('ticket_url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image_url">Event Image URL (optional)</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => updateField('image_url', e.target.value)}
                placeholder="https://..."
              />
              <p className="text-xs text-gray-500">
                Paste a URL to an event poster or cover image
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => updateField('is_published', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="is_published" className="font-normal">
                  Published (visible to public)
                </Label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)]"
              >
                {isSubmitting
                  ? 'Saving...'
                  : editingEvent
                  ? 'Update Event'
                  : 'Create Event'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Events List */}
      {sortedEvents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
          <p className="text-gray-500 mb-4">
            Add your upcoming exhibitions, workshops, or performances.
          </p>
          <Button
            onClick={openAddDialog}
            className="bg-[var(--color-teal)] hover:bg-[var(--color-deep-teal)]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Event
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className={`bg-white rounded-xl p-4 shadow-sm border ${
                !event.is_published ? 'opacity-60 border-dashed' : 'border-transparent'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Image */}
                {event.image_url && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={event.image_url}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant="outline" className="text-xs">
                          {EVENT_TYPE_ICONS[event.event_type]}{' '}
                          {EVENT_TYPE_LABELS[event.event_type]}
                        </Badge>
                        {event.is_featured && (
                          <Badge className="bg-[var(--color-ochre)] text-[var(--color-soft-black)] text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {!event.is_published && (
                          <Badge variant="secondary" className="text-xs">
                            Draft
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => togglePublished(event)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        title={event.is_published ? 'Unpublish' : 'Publish'}
                      >
                        {event.is_published ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => openEditDialog(event)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatEventDate(event.start_date, event.end_date, event.is_all_day)}
                    </span>
                    {event.venue && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.venue}
                      </span>
                    )}
                    {event.is_free ? (
                      <span className="text-green-600">Free</span>
                    ) : event.price_info ? (
                      <span>{event.price_info}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
