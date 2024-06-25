import NextAuth from 'next-auth';

import authConfig from '@/libs/auth.config';

// Note (why we can't implement RBAC in middleware):
// This middleware implements on the authConfig object instead of auth
// Whatever modification to the Session object in the auth.ts won't be in the Session object in authConfig
// But we can't use auth.ts here directly because it's using prisma query and prisma doesn't work on the Edge
// TODO: If we want to implement RBAC in middleware, we need to use drizzle or postgres for db
const { auth } = NextAuth(authConfig);
export default auth((req) => {});

// Optionally, don't invoke Middleware on some paths
// And all routes besides some next static files and images will invoke the middleware
// And from above middleware function we decide what to do with those route regardless of whether they are public or private
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
