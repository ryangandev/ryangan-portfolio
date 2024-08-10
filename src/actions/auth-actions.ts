'use server';

import { signIn, signOut } from '@/lib/auth';

export async function githubSignInAction() {
  await signIn('github', {
    // redirectTo: '/guestbook',
  });
}

export async function signOutAction() {
  await signOut();
}
