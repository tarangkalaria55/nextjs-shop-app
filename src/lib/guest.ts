import "server-only";

import { cookies } from "next/headers";

const GUEST_ID_COOKIE = "guest-id";

export const getGuestId = async () => {
  const cookieStore = await cookies();
  let guestId = cookieStore.get(GUEST_ID_COOKIE)?.value;
  if (!guestId) {
    guestId = crypto.randomUUID(); // Generate a unique ID
    cookieStore.set(GUEST_ID_COOKIE, guestId, {
      httpOnly: true, // Secure, not accessible via JS
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
  }
  return guestId;
};
