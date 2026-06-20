# CineVerse 🎬

CineVerse is a modern, social movie and web-series tracking platform. It allows users to log their cinematic journey, discover new titles via the TMDB API, write personal journal entries, and follow friends to see their activity in real-time.

![CineVerse Dashboard](https://saicineverse.vercel.app/placeholder.svg)

## Live Demo
Check out the live production version here:
👉 **[saicineverse.vercel.app](https://saicineverse.vercel.app/)**

## Key Features

- **Global Discovery:** Search for both movies and TV shows using real data provided by the TMDB (The Movie Database) API.
- **Cinematic Journal:** Rate and review what you watch. Add detailed notes including your favorite scenes, characters, and quotes.
- **Social Feed:** Follow friends and see a real-time feed of what they are watching and reviewing.
- **Personal Passport:** Track your viewing stats (total movies, series, hours watched) on a beautifully animated profile page.
- **Premium UI:** Built with Framer Motion and Tailwind CSS, the application features buttery-smooth interactive glow effects, staggered animations, and a cinematic panning background.

## Technology Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + Framer Motion
- **Database:** PostgreSQL (hosted on Vercel)
- **ORM:** Prisma
- **Authentication:** NextAuth.js (Google OAuth)
- **Deployment:** Vercel

## Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ChSaiPrasad007/Cineverse.git
   cd Cineverse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   # TMDB API Key for fetching movie/TV data
   TMDB_KEY="your_tmdb_api_key"

   # PostgreSQL Connection URLs
   DATABASE_URL="your_prisma_postgres_url"
   POSTGRES_URL="your_prisma_postgres_url"

   # NextAuth Setup
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your_nextauth_secret"

   # Google OAuth
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   ```

4. **Initialize the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## Created By
**Sai Prasad Cheriyala**  
📧 chsaiprasad66@gmail.com
