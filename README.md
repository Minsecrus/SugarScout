# SugarScout

SugarScout is a public beverage sugar tracker backed by Supabase. It does not require login: anyone can read, add, and delete beverage data.

## Supabase Setup

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase-schema.sql`.
3. Copy your project URL and anon public key from **Project Settings -> API**.

The anon key is safe for browser apps when Row Level Security policies are configured. Do not use the service role key in frontend code or GitHub Pages.

## Run Locally

Create `.env.local`:

```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

Install dependencies and run:

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

Push the repository:

```bash
git remote add origin https://github.com/Minsecrus/SugarScout.git
git branch -M main
git push -u origin main
```

In GitHub, add these repository secrets under **Settings -> Secrets and variables -> Actions**:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Then open **Settings -> Pages** and set **Source** to **GitHub Actions**.

Every push to `main` will build and deploy the app. The GitHub Pages build uses the same Supabase project as local development.
