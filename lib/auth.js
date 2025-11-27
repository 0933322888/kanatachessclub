import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from './mongodb';
import User from '../models/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email.toLowerCase() });

        if (!user) {
          throw new Error('No user found with this email');
        }

        // Check if user signed up with Google
        if (user.provider === 'google') {
          throw new Error('Please sign in with Google');
        }

        const isPasswordValid = await user.comparePassword(credentials.password);

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          avatar: user.chessComData?.avatar || null,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account && account.provider === 'google') {
        await connectDB();
        
        const email = user.email?.toLowerCase();
        if (!email) {
          return false;
        }

        let dbUser = await User.findOne({ email });

        if (!dbUser) {
          // Create new user from Google account
          const nameParts = user.name?.split(' ') || ['', ''];
          const firstName = nameParts[0] || user.email.split('@')[0];
          const lastName = nameParts.slice(1).join(' ') || '';

          dbUser = new User({
            firstName,
            lastName,
            email,
            provider: 'google',
            providerId: account.providerAccountId,
            // password not set - will be null/undefined for OAuth users
            role: 'user',
            chessComData: {
              avatar: user.image || null,
            },
          });
          await dbUser.save();
        } else {
          // User exists - update provider info if needed
          if (!dbUser.provider || dbUser.provider === 'credentials') {
            // Link Google account to existing credentials account
            dbUser.provider = 'google';
            dbUser.providerId = account.providerAccountId;
            if (user.image && !dbUser.chessComData?.avatar) {
              if (!dbUser.chessComData) {
                dbUser.chessComData = {};
              }
              dbUser.chessComData.avatar = user.image;
            }
            await dbUser.save();
          }
        }

        // Update user object for JWT
        user.id = dbUser._id.toString();
        user.role = dbUser.role;
        user.avatar = dbUser.chessComData?.avatar || user.image || null;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

