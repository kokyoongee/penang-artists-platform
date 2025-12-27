# Monitoring & Observability Setup

This document describes the monitoring, error tracking, and performance monitoring setup for Penang Artists Platform.

## Overview

| Component | Service | Status |
|-----------|---------|--------|
| Error Tracking | Sentry | Ready (needs DSN) |
| Performance Monitoring | Vercel Speed Insights | Auto-enabled |
| Analytics | Vercel Analytics | Auto-enabled |
| Rate Limiting | Upstash Redis | Ready (needs credentials) |

## 1. Error Tracking (Sentry)

### Setup

1. Create a free account at [sentry.io](https://sentry.io)
2. Create a new project (select "Next.js")
3. Copy the DSN and add to Vercel environment variables:

```bash
NEXT_PUBLIC_SENTRY_DSN=https://xxx@o123.ingest.sentry.io/456
SENTRY_ORG=your-org
SENTRY_PROJECT=penang-artists
SENTRY_AUTH_TOKEN=xxx  # For source map uploads
```

### Features Enabled

- **Client-side error capture**: Automatically captures unhandled exceptions
- **Server-side error capture**: Captures API route and SSR errors
- **Performance tracing**: 10% sample rate (configurable)
- **Session replay**: 10% of sessions, 100% of error sessions
- **Source maps**: Uploaded during build for readable stack traces
- **Error tunnel**: Routes through `/monitoring` to bypass ad blockers

### Error Filtering

The following are automatically filtered out:
- `AbortError` (cancelled requests)
- `ResizeObserver loop` errors (common browser noise)
- Script errors from browser extensions

### Configuration Files

| File | Purpose |
|------|---------|
| `sentry.client.config.ts` | Browser-side Sentry init |
| `sentry.server.config.ts` | Node.js server-side init |
| `sentry.edge.config.ts` | Edge runtime init |
| `src/instrumentation.ts` | Next.js instrumentation hook |

## 2. Performance Monitoring (Vercel)

### Vercel Speed Insights

Automatically tracks Core Web Vitals:
- **LCP** (Largest Contentful Paint)
- **FID** (First Input Delay)
- **CLS** (Cumulative Layout Shift)
- **TTFB** (Time to First Byte)
- **FCP** (First Contentful Paint)
- **INP** (Interaction to Next Paint)

View in Vercel Dashboard → Speed Insights tab.

### Vercel Analytics

Tracks page views and visitor data:
- Page views by route
- Unique visitors
- Geographic data
- Referrer sources
- Device/browser breakdown

View in Vercel Dashboard → Analytics tab.

### Setup

Both are automatically enabled when deployed to Vercel. Components added to `layout.tsx`:

```tsx
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// In body:
<Analytics />
<SpeedInsights />
```

## 3. Rate Limiting (Upstash)

### Setup

1. Create a free account at [upstash.com](https://upstash.com)
2. Create a new Redis database (choose closest region)
3. Copy credentials to Vercel environment variables:

```bash
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
```

### Rate Limits

| Operation | Limit | Window |
|-----------|-------|--------|
| Standard API calls | 10 requests | 60 seconds |
| Sensitive operations | 5 requests | 60 seconds |

### Behavior

- **Production (with Upstash)**: Rate limiting enforced
- **Development (no Upstash)**: Rate limiting disabled (fails open)
- **Upstash unavailable**: Requests allowed (graceful degradation)

### Response Headers

When rate limited, response includes:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1703764800
```

## 4. Error Pages

Custom error pages with Sentry integration:

| Page | File | Purpose |
|------|------|---------|
| 404 | `app/not-found.tsx` | Page not found |
| Error | `app/error.tsx` | Runtime errors |
| Critical | `app/global-error.tsx` | Root-level errors |

All error pages automatically report to Sentry with:
- Error message and stack trace
- Error digest (for correlation)
- Severity level (error vs fatal)

## 5. Vercel Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

### Required
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### Optional (Recommended for Production)
```
NEXT_PUBLIC_SENTRY_DSN
SENTRY_ORG
SENTRY_PROJECT
SENTRY_AUTH_TOKEN
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

## 6. Monitoring Checklist

Before launching:

- [ ] Sentry DSN configured
- [ ] Test error captured in Sentry dashboard
- [ ] Upstash credentials configured
- [ ] Rate limiting working (test with rapid requests)
- [ ] Vercel Analytics showing data
- [ ] Speed Insights showing Core Web Vitals
- [ ] Error pages styled and working

## 7. Alert Configuration (Sentry)

Recommended alerts to set up in Sentry:

1. **High error rate**: > 10 errors/hour
2. **New error types**: First seen errors
3. **Critical errors**: `level: fatal`
4. **Performance regression**: LCP > 2.5s

## Troubleshooting

### Sentry not receiving events
1. Check DSN is correct
2. Verify `NODE_ENV === 'production'` (Sentry disabled in dev)
3. Check browser console for Sentry initialization

### Rate limiting not working
1. Verify Upstash credentials
2. Check `isUpstashConfigured` returns true
3. Test with `curl -v` to see rate limit headers

### Analytics not showing
1. Deployed to Vercel? (required for auto-enabling)
2. Check components are in `layout.tsx`
3. Wait 24 hours for data to populate
