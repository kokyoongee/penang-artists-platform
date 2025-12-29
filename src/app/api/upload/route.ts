import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, getUser } from '@/lib/supabase/server';
import { apiError } from '@/lib/api-error';
import { checkRateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

// POST - Upload file to storage
export async function POST(request: NextRequest) {
  try {
    // Rate limit check (stricter for uploads)
    const clientIP = getClientIP(request);
    const rateLimitResult = await checkRateLimit(`upload:${clientIP}`, true);
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    // Verify user is authenticated
    const user = await getUser();
    if (!user) {
      return apiError('UNAUTHORIZED', 'Please sign in to upload files');
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = (formData.get('bucket') as string) || 'images';
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return apiError('BAD_REQUEST', 'No file provided');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return apiError('BAD_REQUEST', 'Only image files are allowed');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return apiError('BAD_REQUEST', 'File must be less than 5MB');
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!allowedExtensions.includes(fileExt)) {
      return apiError('BAD_REQUEST', 'Invalid file extension');
    }

    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Use admin client to bypass RLS for storage
    const adminClient = createAdminClient();

    // Convert file to buffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error: uploadError } = await adminClient.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('[Upload Error]', uploadError);
      return apiError('INTERNAL_ERROR', 'Failed to upload file');
    }

    // Get public URL
    const { data: { publicUrl } } = adminClient.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return NextResponse.json({
      url: publicUrl,
      path: data.path,
    });
  } catch (error) {
    console.error('[Upload Error]', error);
    return apiError('INTERNAL_ERROR', 'Upload failed');
  }
}
