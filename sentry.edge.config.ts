import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',

  // Performance Monitoring - lower sample rate for edge
  tracesSampleRate: 0.05, // 5% of transactions

  // Debug mode
  debug: false,
});
