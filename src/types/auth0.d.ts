import { User } from '@auth0/nextjs-auth0';

declare module '@auth0/nextjs-auth0' {
  interface User {
    email?: string;
    email_verified?: boolean;
    name?: string;
    nickname?: string;
    picture?: string;
    sub?: string;
    updated_at?: string;
  }
} 