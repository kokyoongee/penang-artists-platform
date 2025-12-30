import { describe, it, expect } from 'vitest';
import {
  artistSchema,
  artistUpdateSchema,
  mediumCategorySchema,
  locationAreaSchema,
  experienceLevelSchema,
  priceRangeSchema,
  artistStatusSchema,
} from '@/lib/validations/artist';

describe('Artist Validation Schema', () => {
  // Valid base data for testing
  const validArtistData = {
    display_name: 'Test Artist',
    bio: 'This is a test bio that is at least 10 characters long for validation purposes.',
    email: 'test@example.com',
    location: 'georgetown' as const,
    primary_medium: 'visual-art' as const,
  };

  describe('artistSchema', () => {
    describe('required fields', () => {
      it('should pass with all required fields', () => {
        const result = artistSchema.safeParse(validArtistData);
        expect(result.success).toBe(true);
      });

      it('should fail without display_name', () => {
        const { display_name, ...data } = validArtistData;
        const result = artistSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should fail without bio', () => {
        const { bio, ...data } = validArtistData;
        const result = artistSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should fail without email', () => {
        const { email, ...data } = validArtistData;
        const result = artistSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should fail without location', () => {
        const { location, ...data } = validArtistData;
        const result = artistSchema.safeParse(data);
        expect(result.success).toBe(false);
      });

      it('should fail without primary_medium', () => {
        const { primary_medium, ...data } = validArtistData;
        const result = artistSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });

    describe('display_name validation', () => {
      it('should fail if display_name is too short', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          display_name: 'A',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('at least 2 characters');
        }
      });

      it('should fail if display_name is too long', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          display_name: 'A'.repeat(101),
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('less than 100 characters');
        }
      });

      it('should pass with valid display_name length', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          display_name: 'Valid Name',
        });
        expect(result.success).toBe(true);
      });
    });

    describe('bio validation', () => {
      it('should fail if bio is too short', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          bio: 'Short',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('at least 10 characters');
        }
      });

      it('should fail if bio is too long', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          bio: 'A'.repeat(2001),
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('less than 2000 characters');
        }
      });
    });

    describe('email validation', () => {
      it('should fail with invalid email format', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          email: 'not-an-email',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Invalid email');
        }
      });

      it('should pass with valid email', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          email: 'valid@example.com',
        });
        expect(result.success).toBe(true);
      });
    });

    describe('optional URL fields - empty string handling', () => {
      it('should transform empty profile_photo to null', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          profile_photo: '',
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.profile_photo).toBeNull();
        }
      });

      it('should transform empty featured_image to null', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          featured_image: '',
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.featured_image).toBeNull();
        }
      });

      it('should transform empty website to null', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          website: '',
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.website).toBeNull();
        }
      });

      it('should transform empty facebook to null', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          facebook: '',
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.facebook).toBeNull();
        }
      });

      it('should transform empty video_url to null', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          video_url: '',
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.video_url).toBeNull();
        }
      });

      it('should transform empty audio_url to null', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          audio_url: '',
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.audio_url).toBeNull();
        }
      });
    });

    describe('optional URL fields - valid URLs', () => {
      it('should accept valid profile_photo URL', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          profile_photo: 'https://example.com/photo.jpg',
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.profile_photo).toBe('https://example.com/photo.jpg');
        }
      });

      it('should accept valid website URL', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          website: 'https://myportfolio.com',
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.website).toBe('https://myportfolio.com');
        }
      });

      it('should accept valid facebook URL', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          facebook: 'https://facebook.com/artist',
        });
        expect(result.success).toBe(true);
      });
    });

    describe('optional URL fields - invalid URLs', () => {
      it('should fail with invalid profile_photo URL', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          profile_photo: 'not-a-url',
        });
        expect(result.success).toBe(false);
      });

      it('should fail with invalid website URL', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          website: 'not-a-valid-url',
        });
        expect(result.success).toBe(false);
      });
    });

    describe('whatsapp validation', () => {
      it('should transform empty whatsapp to null', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          whatsapp: '',
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.whatsapp).toBeNull();
        }
      });

      it('should accept valid whatsapp number with country code', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          whatsapp: '+60123456789',
        });
        expect(result.success).toBe(true);
      });

      it('should accept valid whatsapp number without plus', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          whatsapp: '60123456789',
        });
        expect(result.success).toBe(true);
      });

      it('should fail with invalid whatsapp format', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          whatsapp: 'not-a-number',
        });
        expect(result.success).toBe(false);
      });

      it('should fail with too short whatsapp number', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          whatsapp: '12345',
        });
        expect(result.success).toBe(false);
      });
    });

    describe('secondary_mediums validation', () => {
      it('should default to empty array if not provided', () => {
        const result = artistSchema.safeParse(validArtistData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.secondary_mediums).toEqual([]);
        }
      });

      it('should accept valid medium categories', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          secondary_mediums: ['photography', 'illustration'],
        });
        expect(result.success).toBe(true);
      });

      it('should fail with invalid medium category', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          secondary_mediums: ['invalid-medium'],
        });
        expect(result.success).toBe(false);
      });
    });

    describe('styles validation', () => {
      it('should default to empty array if not provided', () => {
        const result = artistSchema.safeParse(validArtistData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.styles).toEqual([]);
        }
      });

      it('should accept valid styles array', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          styles: ['Abstract', 'Minimalist', 'Contemporary'],
        });
        expect(result.success).toBe(true);
      });

      it('should fail if more than 10 styles', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          styles: Array(11).fill('Style'),
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Maximum 10 styles');
        }
      });
    });

    describe('boolean fields', () => {
      it('should default open_for_commissions to false', () => {
        const result = artistSchema.safeParse(validArtistData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.open_for_commissions).toBe(false);
        }
      });

      it('should default open_for_collaboration to false', () => {
        const result = artistSchema.safeParse(validArtistData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.open_for_collaboration).toBe(false);
        }
      });

      it('should default open_for_events to false', () => {
        const result = artistSchema.safeParse(validArtistData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.open_for_events).toBe(false);
        }
      });

      it('should accept true values for boolean fields', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          open_for_commissions: true,
          open_for_collaboration: true,
          open_for_events: true,
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.open_for_commissions).toBe(true);
          expect(result.data.open_for_collaboration).toBe(true);
          expect(result.data.open_for_events).toBe(true);
        }
      });
    });

    describe('price_range validation', () => {
      it('should default to "contact"', () => {
        const result = artistSchema.safeParse(validArtistData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.price_range).toBe('contact');
        }
      });

      it('should accept valid price ranges', () => {
        const priceRanges = ['budget', 'mid', 'premium', 'contact'] as const;
        for (const priceRange of priceRanges) {
          const result = artistSchema.safeParse({
            ...validArtistData,
            price_range: priceRange,
          });
          expect(result.success).toBe(true);
        }
      });

      it('should fail with invalid price range', () => {
        const result = artistSchema.safeParse({
          ...validArtistData,
          price_range: 'invalid',
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('artistUpdateSchema', () => {
    it('should require id field', () => {
      const result = artistUpdateSchema.safeParse({
        display_name: 'Updated Name',
      });
      expect(result.success).toBe(false);
    });

    it('should pass with valid UUID id', () => {
      const result = artistUpdateSchema.safeParse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        display_name: 'Updated Name',
      });
      expect(result.success).toBe(true);
    });

    it('should fail with invalid UUID format', () => {
      const result = artistUpdateSchema.safeParse({
        id: 'not-a-uuid',
        display_name: 'Updated Name',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid artist ID');
      }
    });

    it('should allow partial updates', () => {
      const result = artistUpdateSchema.safeParse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        bio: 'This is an updated bio that is at least 10 characters.',
      });
      expect(result.success).toBe(true);
    });

    it('should handle empty strings in partial updates', () => {
      const result = artistUpdateSchema.safeParse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        profile_photo: '',
        website: '',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.profile_photo).toBeNull();
        expect(result.data.website).toBeNull();
      }
    });
  });

  describe('Enum Schemas', () => {
    describe('mediumCategorySchema', () => {
      const validCategories = [
        'visual-art',
        'photography',
        'craft',
        'illustration',
        'murals-street-art',
        'tattoo',
        'music',
        'performance',
      ];

      it.each(validCategories)('should accept "%s"', (category) => {
        const result = mediumCategorySchema.safeParse(category);
        expect(result.success).toBe(true);
      });

      it('should reject invalid category', () => {
        const result = mediumCategorySchema.safeParse('painting');
        expect(result.success).toBe(false);
      });
    });

    describe('locationAreaSchema', () => {
      const validLocations = [
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
      ];

      it.each(validLocations)('should accept "%s"', (location) => {
        const result = locationAreaSchema.safeParse(location);
        expect(result.success).toBe(true);
      });

      it('should reject invalid location', () => {
        const result = locationAreaSchema.safeParse('kuala-lumpur');
        expect(result.success).toBe(false);
      });
    });

    describe('experienceLevelSchema', () => {
      const validLevels = ['emerging', 'established', 'master'];

      it.each(validLevels)('should accept "%s"', (level) => {
        const result = experienceLevelSchema.safeParse(level);
        expect(result.success).toBe(true);
      });

      it('should reject invalid level', () => {
        const result = experienceLevelSchema.safeParse('beginner');
        expect(result.success).toBe(false);
      });
    });

    describe('priceRangeSchema', () => {
      const validRanges = ['budget', 'mid', 'premium', 'contact'];

      it.each(validRanges)('should accept "%s"', (range) => {
        const result = priceRangeSchema.safeParse(range);
        expect(result.success).toBe(true);
      });

      it('should reject invalid range', () => {
        const result = priceRangeSchema.safeParse('expensive');
        expect(result.success).toBe(false);
      });
    });

    describe('artistStatusSchema', () => {
      const validStatuses = ['draft', 'pending', 'approved', 'rejected', 'suspended'];

      it.each(validStatuses)('should accept "%s"', (status) => {
        const result = artistStatusSchema.safeParse(status);
        expect(result.success).toBe(true);
      });

      it('should reject invalid status', () => {
        const result = artistStatusSchema.safeParse('active');
        expect(result.success).toBe(false);
      });
    });
  });
});
