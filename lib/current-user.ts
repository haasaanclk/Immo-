import "server-only";
import { getSession } from "./auth";
import { getUserById } from "@/db";

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  tier: string;
}

/** Identity comes from the signed cookie; tier is always read fresh from the DB. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getSession();
  if (!session) return null;
  const user = await getUserById(session.userId);
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name, tier: user.tier };
}
