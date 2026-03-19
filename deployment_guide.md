# Shigruvedas Deployment Guide

This guide outlines the steps to deploy the Shigruvedas organic moringa store to production using Netlify and Supabase.

## 1. Supabase Setup

### Database Schema
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of `supabase/schema.sql` from the project.
4. Paste and run the SQL to create all necessary tables (products, variants, orders, etc.) and RLS policies.

### Authentication
1. Go to **Authentication > Providers**.
2. Enable **Google** and provide your Google Client ID and Secret (from Google Cloud Console).
3. Set the redirect URL to `https://your-app-url.netlify.app/api/auth/callback/google`.

## 2. Environment Variables

Add the following variables to your Netlify site settings (**Site configuration > Environment variables**):

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

## 4. Deployment to Netlify

1. Connect your repository to Netlify.
2. Netlify should automatically detect the `netlify.toml` and Next.js setup.
3. Ensure the Build Command is `npm run build` and the Publish Directory is `.next`.
4. Trigger a deploy.

## 5. Admin Access

To access the admin dashboard (`/admin`):
1. Sign in to the application using Google.
2. Manually update your user role to `admin` in the Supabase `profiles` table:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

---
*Note: Ensure all `NEXT_PUBLIC_` variables are accessible in the browser.*
