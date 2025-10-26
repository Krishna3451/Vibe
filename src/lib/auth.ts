import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function getCurrentUser() {
  const { userId: clerkUserId } = await auth()
  
  if (!clerkUserId) {
    return null
  }
  
  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId }
  });
  
  if (!user) {
    // Create user if they don't exist in our database
    user = await prisma.user.create({
      data: {
        clerkId: clerkUserId,
      }
    });
  }
  
  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  return user
}
