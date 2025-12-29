'use client';

import Image from 'next/image';
import { DollarSign, Clock, Star, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Service, ServiceType, PriceType } from '@/types';

interface ServicesSectionProps {
  services: Service[];
  onSelectService?: (service: Service) => void;
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

  return 'Price on request';
}

export function ServicesSection({ services, onSelectService }: ServicesSectionProps) {
  if (!services || services.length === 0) {
    return null;
  }

  // Show featured services first
  const sortedServices = [...services].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return a.sort_order - b.sort_order;
  });

  return (
    <div className="space-y-4">
      {sortedServices.map((service) => (
        <div
          key={service.id}
          onClick={() => onSelectService?.(service)}
          className={`bg-[var(--color-warm-white)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${
            onSelectService ? 'cursor-pointer hover:-translate-y-0.5' : ''
          } ${service.is_featured ? 'ring-2 ring-[var(--color-ochre)]' : ''}`}
        >
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            {service.image_url && (
              <div className="relative w-full sm:w-40 h-32 flex-shrink-0">
                <Image
                  src={service.image_url}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
                {service.is_featured && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-[var(--color-ochre)] text-[var(--color-soft-black)]">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-display font-semibold text-[var(--color-charcoal)]">
                      {service.title}
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      {SERVICE_TYPE_LABELS[service.service_type]}
                    </Badge>
                    {service.is_featured && !service.image_url && (
                      <Badge className="bg-[var(--color-ochre)] text-[var(--color-soft-black)] text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>

                  {service.description && (
                    <p className="mt-1 text-sm text-[var(--color-charcoal)]/60 line-clamp-2">
                      {service.description}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5 font-medium text-[var(--color-teal)]">
                      <DollarSign className="w-4 h-4" />
                      {formatPrice(service)}
                    </span>
                    {service.delivery_time && (
                      <span className="flex items-center gap-1.5 text-[var(--color-charcoal)]/60">
                        <Clock className="w-4 h-4" />
                        {service.delivery_time}
                      </span>
                    )}
                  </div>
                </div>

                {onSelectService && (
                  <button className="flex-shrink-0 px-4 py-2 bg-[var(--color-teal)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-deep-teal)] transition-colors">
                    Inquire
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
