# Setup Instructions

This document contains important setup instructions for the podcast website's new features.

## Google OAuth Setup for Admin Access

To enable admin functionality, you need to configure Google OAuth in Supabase:

### 1. Configure Google OAuth in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and enable it
4. You'll need to create a Google Cloud Console project if you haven't already

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure the OAuth consent screen if prompted
6. Select **Web application** as the application type
7. Add authorized redirect URIs:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - For local development: `http://localhost:54321/auth/v1/callback`
8. Copy the **Client ID** and **Client Secret**

### 3. Add Credentials to Supabase

1. Back in Supabase dashboard, paste the Client ID and Client Secret into the Google provider settings
2. Save the configuration

### 4. Add Admin Users

After Google OAuth is configured, you need to manually add admin user emails to the database:

1. Go to **SQL Editor** in Supabase dashboard
2. Run this query to add an admin user:

```sql
INSERT INTO admin_users (email)
VALUES ('your-email@example.com');
```

Replace `your-email@example.com` with the Google email address that should have admin access.

## Features Overview

### Episode Detail Pages

- Each episode now has its own page at `/episode/{episode-number}`
- Includes full episode information, audio player, and platform links
- Displays transcriptions for SEO optimization
- Shows related resources and links

### Admin Panel (`/admin`)

Protected by Google authentication. Features include:

1. **Transcriptions Management** (`/admin/transcriptions`)
   - Add or edit episode transcriptions
   - Select episode from dropdown
   - Save transcription text for SEO

2. **Links Management** (`/admin/links`)
   - Add related resources for each episode
   - Include title, URL, and description
   - Links are displayed on episode detail pages

### SEO Optimization

- Each episode page includes:
  - Full transcription text in HTML (indexed by Google)
  - Structured data markup (Schema.org PodcastEpisode)
  - Open Graph meta tags
  - Canonical URLs
  - Episode-specific keywords and descriptions

## Important Notes

- Only users whose email is in the `admin_users` table can access admin features
- The first admin must be added manually via SQL
- Subsequent admins can be added through the database by existing admins
- All episode pages are publicly accessible without authentication
- Admin pages require Google login and authorized email
