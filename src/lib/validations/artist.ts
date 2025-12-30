import { z } from 'zod';

// Enum schemas matching database types
export const mediumCategorySchema = z.enum([
  'visual-art',
  'photography',
  'craft',
  'illustration',
  'murals-street-art',
  'tattoo',
  'music',
  'performance',
]);

export const locationAreaSchema = z.enum([
  'georgetown',
  'bayan-lepas',
  'batu-ferringhi',
  'air-itam',
  'jelutong',
  'tanjung-bungah',
  'butterworth',
  'bukit-mertajam',
  'balik-pulau',
  'other',
]);

export const experienceLevelSchema = z.enum(['emerging', 'established', 'master']);

export const priceRangeSchema = z.enum(['budget', 'mid', 'premium', 'contact']);

export const artistStatusSchema = z.enum([
  'draft',
  'pending',
  'approved',
  'rejected',
  'suspended',
]);

// Helper to convert empty strings to null for optional URL fields
const optionalUrl = z.string().transform(val => val === '' ? null : val).pipe(z.string().url().nullable()).nullable().optional();

// Helper for optional string fields that should be null when empty
const optionalString = z.string().transform(val => val === '' ? null : val).nullable().optional();

// Artist create/update schema
export const artistSchema = z.object({
  display_name: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(100, 'Display name must be less than 100 characters'),
  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters')
    .max(2000, 'Bio must be less than 2000 characters'),
  tagline: z.string().max(200, 'Tagline must be less than 200 characters').transform(val => val === '' ? null : val).nullable().optional(),
  email: z.string().email('Invalid email address'),
  location: locationAreaSchema,
  primary_medium: mediumCategorySchema,
  secondary_mediums: z.array(mediumCategorySchema).optional().default([]),
  styles: z.array(z.string().max(50)).max(10, 'Maximum 10 styles allowed').optional().default([]),
  experience: experienceLevelSchema.nullable().optional(),
  profile_photo: optionalUrl,
  featured_image: optionalUrl,
  video_url: optionalUrl,
  audio_url: optionalUrl,
  whatsapp: z
    .string()
    .transform(val => val === '' ? null : val)
    .pipe(z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid WhatsApp number').nullable())
    .nullable()
    .optional(),
  whatsapp_public: z.boolean().optional().default(false),
  instagram: optionalString.pipe(z.string().max(30).nullable().optional()),
  facebook: optionalUrl,
  website: optionalUrl,
  open_for_commissions: z.boolean().optional().default(false),
  open_for_collaboration: z.boolean().optional().default(false),
  open_for_events: z.boolean().optional().default(false),
  price_range: priceRangeSchema.optional().default('contact'),
  status: artistStatusSchema.optional(),
});

// For updates, all fields are optional except id
export const artistUpdateSchema = artistSchema.partial().extend({
  id: z.string().uuid('Invalid artist ID'),
});

// For admin actions (single artist)
export const adminActionSchema = z.object({
  action: z.enum(['approve', 'reject', 'suspend', 'feature', 'verify', 'delete']),
  artistId: z.string().uuid('Invalid artist ID'),
  reason: z.string().max(500).optional(),
});

// For admin bulk actions (multiple artists)
export const adminBulkActionSchema = z.object({
  action: z.enum(['bulk-approve', 'bulk-suspend', 'bulk-feature']),
  artistIds: z.array(z.string().uuid('Invalid artist ID')).min(1).max(50),
});

// Admin create/update (can set any field including status)
export const adminArtistSchema = artistSchema.partial().extend({
  id: z.string().uuid().optional(),
  status: artistStatusSchema.optional(),
  featured: z.boolean().optional(),
  verified: z.boolean().optional(),
});

export type ArtistInput = z.infer<typeof artistSchema>;
export type ArtistUpdateInput = z.infer<typeof artistUpdateSchema>;
export type AdminActionInput = z.infer<typeof adminActionSchema>;
