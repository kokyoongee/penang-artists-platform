import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('@/lib/supabase/server', () => ({
  createAdminClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  })),
  getUser: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn(() => ({ success: true })),
  getClientIP: vi.fn(() => '127.0.0.1'),
  rateLimitResponse: vi.fn(),
}));

vi.mock('@/lib/api-error', () => ({
  apiError: vi.fn((code: string, message?: string) => {
    const statusMap: Record<string, number> = {
      UNAUTHORIZED: 401,
      BAD_REQUEST: 400,
      NOT_FOUND: 404,
      FORBIDDEN: 403,
      INTERNAL_ERROR: 500,
    };
    return new Response(
      JSON.stringify({ error: { code, message } }),
      { status: statusMap[code] || 500 }
    );
  }),
  handleValidationError: vi.fn((error: any) => {
    return new Response(
      JSON.stringify({ error: { code: 'VALIDATION_ERROR', issues: error.issues } }),
      { status: 400 }
    );
  }),
}));

import { POST, PUT } from '@/app/api/artists/route';
import { createAdminClient, getUser } from '@/lib/supabase/server';

describe('/api/artists', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' };

  const validArtistData = {
    display_name: 'Test Artist',
    bio: 'This is a test bio that is long enough for validation.',
    email: 'artist@example.com',
    location: 'georgetown',
    primary_medium: 'visual-art',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper to create request
  function createRequest(method: 'POST' | 'PUT', body: object): NextRequest {
    return new NextRequest('http://localhost/api/artists', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  describe('POST /api/artists', () => {
    describe('Authentication', () => {
      it('should return 401 if user is not authenticated', async () => {
        vi.mocked(getUser).mockResolvedValueOnce(null);

        const request = createRequest('POST', validArtistData);
        const response = await POST(request);

        expect(response.status).toBe(401);
      });
    });

    describe('Validation', () => {
      beforeEach(() => {
        vi.mocked(getUser).mockResolvedValue(mockUser as any);
      });

      it('should return 400 for missing required fields', async () => {
        const request = createRequest('POST', {
          display_name: 'Test',
          // Missing bio, email, location, primary_medium
        });

        const response = await POST(request);
        expect(response.status).toBe(400);
      });

      it('should return 400 for short display_name', async () => {
        const request = createRequest('POST', {
          ...validArtistData,
          display_name: 'A',
        });

        const response = await POST(request);
        expect(response.status).toBe(400);
      });

      it('should return 400 for short bio', async () => {
        const request = createRequest('POST', {
          ...validArtistData,
          bio: 'Short',
        });

        const response = await POST(request);
        expect(response.status).toBe(400);
      });

      it('should return 400 for invalid email', async () => {
        const request = createRequest('POST', {
          ...validArtistData,
          email: 'not-an-email',
        });

        const response = await POST(request);
        expect(response.status).toBe(400);
      });

      it('should return 400 for invalid location', async () => {
        const request = createRequest('POST', {
          ...validArtistData,
          location: 'invalid-location',
        });

        const response = await POST(request);
        expect(response.status).toBe(400);
      });

      it('should return 400 for invalid primary_medium', async () => {
        const request = createRequest('POST', {
          ...validArtistData,
          primary_medium: 'invalid-medium',
        });

        const response = await POST(request);
        expect(response.status).toBe(400);
      });
    });

    describe('Artist Creation', () => {
      beforeEach(() => {
        vi.mocked(getUser).mockResolvedValue(mockUser as any);
      });

      it('should return 400 if artist already exists', async () => {
        const mockClient = {
          from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: { id: 'existing-id' }, error: null }),
          })),
        };
        vi.mocked(createAdminClient).mockReturnValue(mockClient as any);

        const request = createRequest('POST', validArtistData);
        const response = await POST(request);

        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data.error.message).toContain('already exists');
      });

      it('should create artist with generated slug', async () => {
        const insertMock = vi.fn().mockReturnThis();
        const selectMock = vi.fn().mockReturnThis();
        const singleMock = vi.fn();

        // First call checks if artist exists (no data)
        // Second call checks if slug exists (no data)
        // Third call is the insert result
        let callCount = 0;
        singleMock.mockImplementation(() => {
          callCount++;
          if (callCount <= 2) {
            return Promise.resolve({ data: null, error: null });
          }
          return Promise.resolve({
            data: { id: 'new-id', slug: 'test-artist', ...validArtistData },
            error: null,
          });
        });

        const mockClient = {
          from: vi.fn(() => ({
            select: selectMock,
            insert: insertMock,
            eq: vi.fn().mockReturnThis(),
            single: singleMock,
          })),
        };
        vi.mocked(createAdminClient).mockReturnValue(mockClient as any);

        const request = createRequest('POST', validArtistData);
        const response = await POST(request);

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.artist).toBeDefined();
        expect(data.artist.slug).toBe('test-artist');
      });

      it('should handle empty string URL fields', async () => {
        let callCount = 0;
        const singleMock = vi.fn().mockImplementation(() => {
          callCount++;
          if (callCount <= 2) {
            return Promise.resolve({ data: null, error: null });
          }
          return Promise.resolve({
            data: { id: 'new-id', ...validArtistData },
            error: null,
          });
        });

        const mockClient = {
          from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: singleMock,
          })),
        };
        vi.mocked(createAdminClient).mockReturnValue(mockClient as any);

        const request = createRequest('POST', {
          ...validArtistData,
          profile_photo: '',
          website: '',
          facebook: '',
        });

        const response = await POST(request);
        expect(response.status).toBe(200);
      });
    });
  });

  describe('PUT /api/artists', () => {
    const artistId = '550e8400-e29b-41d4-a716-446655440000';

    describe('Authentication', () => {
      it('should return 401 if user is not authenticated', async () => {
        vi.mocked(getUser).mockResolvedValueOnce(null);

        const request = createRequest('PUT', { id: artistId });
        const response = await PUT(request);

        expect(response.status).toBe(401);
      });
    });

    describe('Validation', () => {
      beforeEach(() => {
        vi.mocked(getUser).mockResolvedValue(mockUser as any);
      });

      it('should return 400 if id is missing', async () => {
        const request = createRequest('PUT', { display_name: 'Updated' });
        const response = await PUT(request);

        expect(response.status).toBe(400);
      });

      it('should return 400 for invalid UUID format', async () => {
        const request = createRequest('PUT', {
          id: 'not-a-uuid',
          display_name: 'Updated',
        });

        const response = await PUT(request);
        expect(response.status).toBe(400);
      });
    });

    describe('Authorization', () => {
      beforeEach(() => {
        vi.mocked(getUser).mockResolvedValue(mockUser as any);
      });

      it('should return 404 if artist not found', async () => {
        const mockClient = {
          from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          })),
        };
        vi.mocked(createAdminClient).mockReturnValue(mockClient as any);

        const request = createRequest('PUT', { id: artistId, display_name: 'Updated' });
        const response = await PUT(request);

        expect(response.status).toBe(404);
      });

      it('should return 403 if user does not own the artist profile', async () => {
        const mockClient = {
          from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { user_id: 'different-user' },
              error: null,
            }),
          })),
        };
        vi.mocked(createAdminClient).mockReturnValue(mockClient as any);

        const request = createRequest('PUT', { id: artistId, display_name: 'Updated' });
        const response = await PUT(request);

        expect(response.status).toBe(403);
      });
    });

    describe('Update Success', () => {
      beforeEach(() => {
        vi.mocked(getUser).mockResolvedValue(mockUser as any);
      });

      it('should update artist profile', async () => {
        let callCount = 0;
        const singleMock = vi.fn().mockImplementation(() => {
          callCount++;
          if (callCount === 1) {
            // First call: get artist for authorization
            return Promise.resolve({ data: { user_id: mockUser.id }, error: null });
          }
          // Second call: update result
          return Promise.resolve({
            data: { id: artistId, display_name: 'Updated Artist' },
            error: null,
          });
        });

        const mockClient = {
          from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: singleMock,
          })),
        };
        vi.mocked(createAdminClient).mockReturnValue(mockClient as any);

        const request = createRequest('PUT', {
          id: artistId,
          display_name: 'Updated Artist',
        });

        const response = await PUT(request);
        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data.artist.display_name).toBe('Updated Artist');
      });

      it('should handle empty string fields in updates', async () => {
        let callCount = 0;
        const singleMock = vi.fn().mockImplementation(() => {
          callCount++;
          if (callCount === 1) {
            return Promise.resolve({ data: { user_id: mockUser.id }, error: null });
          }
          return Promise.resolve({
            data: { id: artistId, profile_photo: null },
            error: null,
          });
        });

        const mockClient = {
          from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: singleMock,
          })),
        };
        vi.mocked(createAdminClient).mockReturnValue(mockClient as any);

        const request = createRequest('PUT', {
          id: artistId,
          profile_photo: '',
          website: '',
        });

        const response = await PUT(request);
        expect(response.status).toBe(200);
      });
    });
  });
});
