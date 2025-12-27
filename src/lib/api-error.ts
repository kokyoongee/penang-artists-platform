import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Standardized API error responses
 * - Logs detailed errors server-side
 * - Returns generic messages to client (prevents info leak)
 */

export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'BAD_REQUEST'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

interface ErrorConfig {
  status: number;
  message: string;
}

const ERROR_MAP: Record<ApiErrorCode, ErrorConfig> = {
  UNAUTHORIZED: { status: 401, message: 'Authentication required' },
  FORBIDDEN: { status: 403, message: 'Access denied' },
  NOT_FOUND: { status: 404, message: 'Resource not found' },
  BAD_REQUEST: { status: 400, message: 'Invalid request' },
  VALIDATION_ERROR: { status: 400, message: 'Validation failed' },
  RATE_LIMITED: { status: 429, message: 'Too many requests' },
  INTERNAL_ERROR: { status: 500, message: 'Something went wrong' },
};

/**
 * Create standardized error response
 */
export function apiError(
  code: ApiErrorCode,
  details?: string,
  logContext?: Record<string, unknown>
) {
  const config = ERROR_MAP[code];

  // Log detailed error server-side only
  if (logContext) {
    console.error(`[API Error] ${code}:`, { details, ...logContext });
  }

  return NextResponse.json(
    {
      error: config.message,
      code,
      // Only include details for validation errors (safe to expose)
      ...(code === 'VALIDATION_ERROR' && details ? { details } : {}),
    },
    { status: config.status }
  );
}

/**
 * Handle Zod validation errors
 */
export function handleValidationError(error: ZodError) {
  const issues = error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));

  console.error('[Validation Error]', issues);

  return NextResponse.json(
    {
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      issues,
    },
    { status: 400 }
  );
}

/**
 * Safe error handler - wraps async route handlers
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        return handleValidationError(error);
      }

      // Log unknown errors
      console.error('[Unhandled API Error]', error);

      // Return generic error to client
      return apiError('INTERNAL_ERROR', undefined, {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }) as T;
}
