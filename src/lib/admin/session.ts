import { redirect } from 'next/navigation';
import type { Session } from 'next-auth';

import { auth } from '@/auth';

export type Admin = Session['user'];

/**
 * The signed-in admin, or null.
 *
 * Every admin page and every admin server action checks this itself. A layout
 * is not enough: server actions and route handlers are reachable without
 * rendering it.
 */
export const getAdmin = async (): Promise<Admin | null> => {
  const session = await auth();

  return session?.user.role === 'ADMIN' && session.user.id
    ? session.user
    : null;
};

/**
 * The signed-in admin, redirecting to the sign-in page otherwise
 * @param returnTo the admin path to come back to after signing in
 */
export const requireAdmin = async (returnTo: string): Promise<Admin> => {
  const admin = await getAdmin();

  if (!admin) {
    redirect(`/admin/sign-in?callbackUrl=${encodeURIComponent(returnTo)}`);
  }

  return admin;
};
