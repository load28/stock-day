import GoogleProvider from 'next-auth/providers/google';
import { NextAuthConfig } from 'next-auth';
import { SupabaseAdapter } from '@auth/supabase-adapter';

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    })
  ],
  session: {
    strategy: 'database'
  },
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!
  }),
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  },
  debug: process.env.NODE_ENV === 'development'
} satisfies NextAuthConfig;
