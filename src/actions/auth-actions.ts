'use server';

import { signIn, signOut } from '@/libs/auth';

export async function githubSignInAction() {
  await signIn('github', {
    // redirectTo: '/guestbook',
  });
}

export async function signOutAction() {
  await signOut();
}
