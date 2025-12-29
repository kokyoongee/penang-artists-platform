'use client';

import { useState, useEffect } from 'react';
import { Send, MessageCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Artist, Service, INQUIRY_TYPE_LABELS, InquiryType } from '@/types';

interface ContactFormProps {
  artist: Artist;
  services?: Service[];
  preselectedServiceId?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  inquiryType: InquiryType | '';
  serviceId: string;
  message: string;
}

export function ContactForm({ artist, services = [], preselectedServiceId }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    serviceId: preselectedServiceId || '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update serviceId if preselectedServiceId changes
  useEffect(() => {
    if (preselectedServiceId) {
      setFormData((prev) => ({ ...prev, serviceId: preselectedServiceId }));
    }
  }, [preselectedServiceId]);

  const selectedService = services.find((s) => s.id === formData.serviceId);

  const formatWhatsAppMessage = () => {
    const inquiryLabel = formData.inquiryType
      ? INQUIRY_TYPE_LABELS[formData.inquiryType]
      : 'General Inquiry';

    let serviceInfo = '';
    if (selectedService) {
      serviceInfo = `\n*Service Interested In:* ${selectedService.title}`;
    }

    const message = `Hi ${artist.display_name}!

I found your profile on Penang Artists Platform and would like to reach out.

*Inquiry Type:* ${inquiryLabel}${serviceInfo}

*Message:*
${formData.message}

---
*From:* ${formData.name}
*Email:* ${formData.email}${formData.phone ? `\n*Phone:* ${formData.phone}` : ''}

_Sent via Penang Artists Platform_`;

    return encodeURIComponent(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.inquiryType || !formData.message) {
      return;
    }

    setIsSubmitting(true);

    // Save visitor data to database (future: Supabase integration)
    // For now, we'll just log it
    console.log('Visitor inquiry:', {
      artistId: artist.id,
      ...formData,
      serviceName: selectedService?.title || null,
      timestamp: new Date().toISOString(),
    });

    // Open WhatsApp with formatted message
    const whatsappUrl = `https://wa.me/${artist.whatsapp}?text=${formatWhatsAppMessage()}`;
    window.open(whatsappUrl, '_blank');

    setIsSubmitting(false);
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-[var(--color-charcoal)]/60 mb-4">
        <MessageCircle className="w-4 h-4" />
        <span>Send a message via WhatsApp</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Your Name *</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          required
          className="bg-white border-[var(--color-charcoal)]/10 focus:border-[var(--color-teal)]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          required
          className="bg-white border-[var(--color-charcoal)]/10 focus:border-[var(--color-teal)]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+60 12 345 6789"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          className="bg-white border-[var(--color-charcoal)]/10 focus:border-[var(--color-teal)]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="inquiryType">Inquiry Type *</Label>
        <Select
          value={formData.inquiryType}
          onValueChange={(value) => updateField('inquiryType', value)}
          required
        >
          <SelectTrigger className="bg-white border-[var(--color-charcoal)]/10">
            <SelectValue placeholder="Select inquiry type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(INQUIRY_TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Service Selection - only show if services available */}
      {services.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="serviceId" className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[var(--color-teal)]" />
            Interested in a specific service?
          </Label>
          <Select
            value={formData.serviceId}
            onValueChange={(value) => updateField('serviceId', value)}
          >
            <SelectTrigger className="bg-white border-[var(--color-charcoal)]/10">
              <SelectValue placeholder="Select a service (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No specific service</SelectItem>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedService && (
            <p className="text-xs text-[var(--color-charcoal)]/60 mt-1">
              {selectedService.description?.slice(0, 100)}
              {selectedService.description && selectedService.description.length > 100 ? '...' : ''}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="message">Your Message *</Label>
        <Textarea
          id="message"
          placeholder="Tell the artist about your project, event, or inquiry..."
          value={formData.message}
          onChange={(e) => updateField('message', e.target.value)}
          required
          rows={4}
          className="bg-white border-[var(--color-charcoal)]/10 focus:border-[var(--color-teal)] resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !formData.name || !formData.email || !formData.inquiryType || !formData.message}
        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full py-6 gap-2"
      >
        <Send className="w-4 h-4" />
        {isSubmitting ? 'Opening WhatsApp...' : 'Send via WhatsApp'}
      </Button>

      <p className="text-xs text-center text-[var(--color-charcoal)]/50">
        Your information helps us improve the platform. We don&apos;t share your data with third parties.
      </p>
    </form>
  );
}
