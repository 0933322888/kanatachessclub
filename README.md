# Kanata Chess Club Website

A local chess club website built with Next.js, MongoDB, and NextAuth.

## Features

- User registration and authentication
- Chess.com profile integration with automatic syncing
- Opponent matching for biweekly gatherings
- Tournament management (single/double elimination brackets)
- Admin panel for user and tournament management
- Responsive, mobile-first design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with your environment variables:
```
MONGODB_URI=mongodb://localhost:27017/kanatachess
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GATHERING_LOCATION=Tanger Outlets Food Court
GATHERING_LATITUDE=45.29691918721957
GATHERING_LONGITUDE=-75.9389548581184
```

3. (Optional) Seed an admin user:
```bash
node scripts/seed.mjs
```
Default admin credentials:
- Email: admin@kanatachess.com
- Password: admin123
**Change this password immediately after first login!**

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `NEXTAUTH_URL` - Your application URL (http://localhost:3000 for local, your domain for production)
- `NEXTAUTH_SECRET` - Secret key for NextAuth (generate a random string, e.g., using `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID (required for Google sign-in)
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret (required for Google sign-in)
- `GATHERING_LOCATION` - Location name for gatherings (optional, defaults to "Kanata Community Centre, 100 John Anson Lane, Kanata, ON")
- `GATHERING_LATITUDE` - Latitude coordinate for map (optional, defaults to 45.29691918721957)
- `GATHERING_LONGITUDE` - Longitude coordinate for map (optional, defaults to -75.9389548581184)

### Setting up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Set the authorized redirect URI to: `http://localhost:3000/api/auth/callback/google` (for local development)
6. For production, add: `https://yourdomain.com/api/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env.local` file

## Pages

- `/` - Homepage with club info and upcoming gatherings
- `/auth/login` - User login
- `/auth/register` - User registration
- `/profile` - Your own profile with Chess.com sync
- `/users/[id]` - View other users' public profiles
- `/next-gathering` - Opponent matching for next gathering with location map
- `/tournaments` - List of all tournaments
- `/tournaments/[id]` - Tournament bracket and details
- `/admin` - Admin panel (admin only)
- `/admin/tournaments/create` - Create new tournament (admin only)

## Deployment

This project is ready for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

Make sure to:
- Set `NEXTAUTH_URL` to your production domain
- Use a strong `NEXTAUTH_SECRET`
- Configure your MongoDB connection string (consider using MongoDB Atlas for production)

