import type { Context, Next } from "hono";
import { lucia } from "../db/auth";

export const auth = async (c: Context, next: Next) => {
  const cookie = c.req.header("Cookie") ?? "";
  const sessionId = lucia.readSessionCookie(cookie);
  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }
  const { user, session } = await lucia.validateSession(sessionId);

  console.log("Auth middleware:", { user, session });

  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    c.header("Set-Cookie", sessionCookie.serialize());
  }

  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    c.header("Set-Cookie", sessionCookie.serialize(), {
      append: true,
    });
  }

  c.set("user", user);
  c.set("session", session);
  return next();
};
