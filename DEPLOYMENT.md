# Deployment Guide

## Environment Variables

### Required for Netlify/Vercel Deployment

The application will work without Supabase, but if you want authentication features, add these environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Netlify Setup

1. Go to your Netlify dashboard
2. Site settings → Build & deploy → Environment
3. Add the environment variables above
4. Redeploy your site

### Vercel Setup

1. Go to your Vercel dashboard
2. Project settings → Environment Variables
3. Add the environment variables above
4. Redeploy your site

## Graceful Degradation

The application is designed to work without Supabase:

- ✅ Typing test functionality works without authentication
- ✅ Theme switching works without authentication
- ✅ Dashboard works without authentication
- ❌ Login/signup features will be disabled
- ❌ User statistics will be unavailable

## Build Process

The application uses TypeScript and will fail the build if there are type errors. All Supabase usage is properly handled with null checks to prevent build failures.

## Troubleshooting

If you get "supabaseUrl is required" error:

1. Add the environment variables to your deployment platform
2. Or remove Supabase dependencies if you don't need authentication
