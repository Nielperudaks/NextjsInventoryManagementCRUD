'use server';

import { stackServerApp } from '@/stack';
import { neon } from '@neondatabase/serverless';

export async function getUserDetails(userId: string | undefined) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  if (!userId) {
    return null;
  }

  const sql = neon(process.env.DATABASE_URL!);
  const [user] =
    await sql`SELECT * FROM neon_auth.users_sync WHERE id = ${userId};`;
  return user;
}

export async function getUserID() {
  try {
    console.log("getUserID called");
    const user = await stackServerApp.getUser();
    console.log("Stack user:", user);
    
    if(!user?.id){
      console.log("No user ID found in stack user");
      return;
    }
    
    console.log("Returning user ID:", user.id);
    return user?.id;
  } catch (error) {
    console.error("Error in getUserID:", error);
    return;
  }
}