# Shigruvedas Deployment Guide

This guide outlines the steps to deploy the Shigruvedas organic moringa store to production using Vercel (recommended) or Netlify, and Supabase.

## 1. Supabase Setup

### Database Schema
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of `supabase/schema.sql` from the project.
4. Paste and run the SQL to create all necessary tables (products, variants, orders, etc.) and RLS policies.
5. Also run `supabase/migrations.sql` and the other Supabase SQL files in the repository so later columns such as `checkout_session_id`, `shiprocket_*`, `coupon_id`, `points_used`, and `addresses.user_email` exist in the live database.

### Authentication
1. Go to **Authentication > Providers**.
2. Enable **Google** and provide your Google Client ID and Secret (from Google Cloud Console).
3. Set the redirect URL to `https://your-app-url.netlify.app/api/auth/callback/google`.

Add the following variables to your production site settings (Vercel: **Project Settings > Environment Variables** | Netlify: **Site configuration > Environment variables**):

| Key | Description |
|-----|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase Service Role Key (Admin) |
| `AUTH_SECRET` | A random 32-character string for NextAuth |
| `AUTH_URL` | Your production URL (e.g., `https://shigruvedas.com`) |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret |
| `NEXT_PUBLIC_APP_URL` | Your production URL |

## 3. Razorpay Integration

1. Sign up for a [Razorpay](https://razorpay.com) account.
2. Go to **Settings > API Keys** to generate your Key ID and Secret.
3. In production, ensure you use the Live keys.

## 4. Deployment

### Vercel (Recommended)
1. Import your repository into [Vercel](https://vercel.com/new).
2. During setup, expand the **Environment Variables** section.
3. Add all the keys listed in the **Environment Variables** section above.
4. Click **Deploy**. Next.js 15 features like `generateStaticParams` will be automatically optimized.

### Netlify
1. Connect your repository to Netlify.
2. Ensure you have added the Environment Variables in the Netlify UI before the first build.
3. Netlify should automatically detect the `netlify.toml` and Next.js setup.
4. Ensure the Build Command is `npm run build` and the Publish Directory is `.next`.
5. Trigger a deploy.

## 5. Admin Access

To access the admin dashboard (`/admin`):
1. Sign in to the application using Google.
2. Manually update your user role to `admin` in the Supabase `profiles` table:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

---
*Note: Ensure all `NEXT_PUBLIC_` variables are accessible in the browser.*
