import type { DefaultSession } from 'next-auth';

import type { UserRole } from '@/generated/prisma/enums';

// What `src/auth.ts` adds to the session. The token itself is not augmented:
// its type lives in `@auth/core`, which pnpm does not expose to the app, so
// `src/auth.ts` checks the fields it reads back from it instead.
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role?: UserRole;
      /** GitHub username */
      login?: string;
    } & DefaultSession['user'];
  }
}
