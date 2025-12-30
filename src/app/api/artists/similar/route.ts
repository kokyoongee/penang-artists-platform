import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { apiError } from '@/lib/api-error';

// GET - Fetch similar artists based on medium and location
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const artistId = searchParams.get('artistId');
    const limit = parseInt(searchParams.get('limit') || '6');

    if (!artistId) {
      return apiError('BAD_REQUEST', 'artistId is required');
    }

    const adminClient = createAdminClient();

    // Get the source artist's details
    const { data: sourceArtist, error: artistError } = await adminClient
      .from('artists')
      .select('id, primary_medium, secondary_mediums, location')
      .eq('id', artistId)
      .single();

    if (artistError || !sourceArtist) {
      return apiError('NOT_FOUND', 'Artist not found');
    }

    // Build similarity query
    // Priority: 1) Same primary medium + same location
    //           2) Same primary medium
    //           3) Primary medium in secondary mediums
    //           4) Same location

    const { data: similarArtists, error } = await adminClient
      .from('artists')
      .select(`
        id,
        display_name,
        slug,
        tagline,
        primary_medium,
        location,
        profile_photo,
        featured_image,
        follower_count
      `)
      .eq('status', 'approved')
      .neq('id', artistId)
      .or(`primary_medium.eq.${sourceArtist.primary_medium},location.eq.${sourceArtist.location}`)
      .order('follower_count', { ascending: false })
      .limit(limit * 2); // Get more to allow filtering

    if (error) {
      console.error('[Similar Artists Error]', error);
      return apiError('INTERNAL_ERROR');
    }

    // Score and sort by similarity
    const scoredArtists = (similarArtists || []).map(artist => {
      let score = 0;

      // Primary medium match = 3 points
      if (artist.primary_medium === sourceArtist.primary_medium) {
        score += 3;
      }

      // Location match = 2 points
      if (artist.location === sourceArtist.location) {
        score += 2;
      }

      // Bonus for having followers (popularity) = 1 point
      if ((artist.follower_count || 0) > 0) {
        score += 1;
      }

      return { ...artist, similarityScore: score };
    });

    // Sort by score descending, then by follower count
    scoredArtists.sort((a, b) => {
      if (b.similarityScore !== a.similarityScore) {
        return b.similarityScore - a.similarityScore;
      }
      return (b.follower_count || 0) - (a.follower_count || 0);
    });

    // Take top results
    const topArtists = scoredArtists.slice(0, limit).map(({ similarityScore, ...artist }) => artist);

    return NextResponse.json({
      data: topArtists,
      sourceArtist: {
        primary_medium: sourceArtist.primary_medium,
        location: sourceArtist.location,
      },
    });
  } catch (error) {
    console.error('[Similar Artists Error]', error);
    return apiError('INTERNAL_ERROR');
  }
}
