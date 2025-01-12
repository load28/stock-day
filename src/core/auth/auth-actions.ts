'use server';

import { signIn, signOut } from '@stock-day/core/auth/auth';

export async function googleSignIn() {
  return await signIn('google', { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}` });
}

export async function googleSignOut(redirectTo?: string) {
  return await signOut({ redirectTo: redirectTo || `${process.env.NEXT_PUBLIC_APP_URL}/login` });
}
