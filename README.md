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

## Google Search Indexing

To get your website indexed by Google and appearing in search results, follow these steps:

### Step 1: Verify Your Sitemap is Accessible

1. **Deploy your website** to Vercel (or your hosting provider)
2. **Test your sitemap** by visiting:
   ```
   https://kanatachessclub.vercel.app/sitemap.xml
   ```
   You should see an XML file listing all your public pages.

3. **Test your robots.txt** by visiting:
   ```
   https://kanatachessclub.vercel.app/robots.txt
   ```
   Verify it shows the correct sitemap URL.

### Step 2: Set Up Google Search Console

1. **Go to Google Search Console**:
   - Visit [https://search.google.com/search-console](https://search.google.com/search-console)
   - Sign in with your Google account

2. **Add Your Property**:
   - Click "Add Property" button
   - Select "URL prefix" (recommended for most sites)
   - Enter your website URL: `https://kanatachessclub.vercel.app`
   - Click "Continue"

### Step 3: Verify Website Ownership

Google will ask you to verify that you own the website. You have several options:

#### Option A: HTML Meta Tag (Recommended - Easiest)

1. **Get the verification code**:
   - In Google Search Console, select "HTML tag" as the verification method
   - Copy the `content` value from the meta tag (it looks like: `abc123def456...`)

2. **Add it to your website**:
   - Open `app/layout.js`
   - Find line 82 where it says: `// google: 'your-verification-code',`
   - Replace it with: `google: 'your-actual-verification-code-here',`
   - Save and commit the file
   - Deploy to Vercel

3. **Verify in Google Search Console**:
   - Go back to Google Search Console
   - Click "Verify" button
   - Google will check for the meta tag on your homepage
   - If successful, you'll see a success message

#### Option B: HTML File Upload

1. **Download the verification file** from Google Search Console
2. **Upload it to your public folder**:
   - Place the HTML file in the `public/` directory
   - Commit and deploy
3. **Verify in Google Search Console**

#### Option C: DNS Verification (For Custom Domains)

If you have a custom domain (not just vercel.app):
1. Select "DNS record" in Google Search Console
2. Add the TXT record to your domain's DNS settings
3. Wait for DNS propagation (can take up to 48 hours)
4. Click "Verify" in Google Search Console

### Step 4: Submit Your Sitemap

1. **In Google Search Console**, after verification:
   - Go to the left sidebar
   - Click on "Sitemaps" (under "Indexing")

2. **Add your sitemap**:
   - In the "Add a new sitemap" field, enter: `sitemap.xml`
   - Click "Submit"

3. **Wait for processing**:
   - Google will process your sitemap (usually takes a few minutes to a few hours)
   - You'll see the status change from "Couldn't fetch" to "Success"
   - The number of discovered URLs will appear

### Step 5: Request Indexing (Optional but Recommended)

1. **Request indexing for your homepage**:
   - In Google Search Console, use the "URL Inspection" tool (search bar at the top)
   - Enter your homepage URL: `https://kanatachessclub.vercel.app`
   - Click "Test Live URL"
   - If the page is accessible, click "Request Indexing"
   - This tells Google to prioritize crawling this page

2. **Request indexing for key pages**:
   - Repeat for important pages like:
     - `/learning`
     - `/chess-for-kids`
     - `/auth/register`

### Step 6: Monitor Your Indexing Status

1. **Check Coverage Report**:
   - In Google Search Console, go to "Coverage" (under "Indexing")
   - This shows which pages are indexed, which have errors, etc.

2. **Check Performance**:
   - Go to "Performance" to see search analytics (data appears after your site starts getting traffic)

3. **Regular Monitoring**:
   - Check back weekly to see indexing progress
   - Fix any errors Google reports
   - Monitor search queries and click-through rates

### Step 7: Best Practices for Faster Indexing

1. **Create quality content**:
   - Ensure your pages have unique, valuable content
   - Use proper headings (H1, H2, etc.)
   - Include relevant keywords naturally

2. **Internal linking**:
   - Link between your pages (e.g., link to `/learning` from homepage)
   - This helps Google discover all your pages

3. **Update content regularly**:
   - Google prefers sites with fresh content
   - Update your pages periodically

4. **Share your website**:
   - Share on social media
   - Get backlinks from other websites
   - This signals to Google that your site is valuable

### Troubleshooting

**Sitemap shows errors:**
- Verify the sitemap URL is accessible
- Check that all URLs in the sitemap are publicly accessible (not behind authentication)
- Ensure URLs use HTTPS and match your actual domain

**Pages not being indexed:**
- Check that pages are not blocked in `robots.txt`
- Verify pages have proper meta tags (already set up in `app/layout.js`)
- Ensure pages return 200 status codes (not 404 or 403)
- Wait - indexing can take days or weeks for new sites

**Verification fails:**
- Make sure you deployed the changes with the verification code
- Clear your browser cache and try again
- Try a different verification method

### Expected Timeline

- **Verification**: Immediate to 24 hours
- **Sitemap processing**: Few minutes to 24 hours
- **Initial indexing**: 1-7 days
- **Full indexing**: 1-4 weeks (depending on site size and authority)

Your website is already configured with:
- ✅ Proper meta tags and descriptions
- ✅ Open Graph tags for social sharing
- ✅ Structured data (JSON-LD)
- ✅ Robots meta tags set to allow indexing
- ✅ Sitemap.xml file
- ✅ Robots.txt file

Once you complete the Google Search Console setup, Google will start crawling and indexing your site!

