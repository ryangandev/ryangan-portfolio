import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { type Auth, getAuth } from '@/auth';

export type Admin = Auth['$Infer']['Session']['user'];

/**
 * The signed-in admin, or null.
 *
 * Every admin page and every admin server action checks this itself. A layout
 * is not enough: server actions and route handlers are reachable without
 * rendering it.
 */
export const getAdmin = async (): Promise<Admin | null> => {
  // Headers first: prerendering stops at them, before Better Auth is created.
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });

  return session?.user.role === 'ADMIN' ? session.user : null;
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
