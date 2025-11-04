import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  // what your authorize() returns (and what you use in the app)
  interface User {
    id: string;
    role: 'ADMIN' | 'USER';
    email: string;
    name: string;
    tokenVersion: number;
  }

  interface Session {
    user: {
      id: string;
      role: 'ADMIN' | 'USER';
      name: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    uid: string;
    role: 'ADMIN' | 'USER';
    name: string;
    tokenVersion: number;
  }
}

export {};
