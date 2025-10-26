import { initTRPC } from '@trpc/server';
import { cache } from 'react';
import superjson from "superjson"
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import { User } from '@/generated/prisma'

export type Context = {
  userId: string | null;
  clerkUserId: string | null;
  user: User | null;
};

export const createTRPCContext = cache(async (): Promise<Context> => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  const { userId: clerkUserId } = await auth()
  
  let user = null;
  if (clerkUserId) {
    // Find or create user in our database
    user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId }
    });
    
    if (!user) {
      // If user doesn't exist in our DB, create them
      // You might want to get user details from Clerk here
      user = await prisma.user.create({
        data: {
          clerkId: clerkUserId,
        }
      });
    }
  }
  
  return { 
    userId: user?.id || null,
    clerkUserId,
    user 
  };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;