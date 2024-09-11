import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { signInSchema, signUpSchema } from "../validators/schemas";
import { hash, verify } from "@node-rs/argon2";
import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { lucia } from "../db/auth";
import { Context } from "../lib/context";
import { zCustomErrorMessage } from "../validators/zCustomError";

const authRoutes = new Hono<Context>();

// Recommended minimum parameters for Argon2 hashing
export const hashOptions = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

authRoutes.post("/sign-in", zValidator("json", signInSchema), async (c) => {
  const { username, password } = c.req.valid("json");
  console.log(username, password);

  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .get();

  if (!user) {
    throw new HTTPException(401, {
      message: "Incorrect username or password",
    });
  }

  const validPassword = await verify(user.password_hash, password, hashOptions);

  if (!validPassword) {
    throw new HTTPException(401, {
      message: "Incorrect username or password",
    });
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  c.header("Set-Cookie", sessionCookie.serialize(), {
    append: true,
  });

  return c.json({
    message: "You have been signed in!",
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
    },
  });
});

authRoutes.post(
  "/sign-up",
  zValidator("json", signUpSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { name, username, password } = c.req.valid("json");
    //checking is username already in use
    const sameUserNameUsers = await db.query.users.findMany({
      where: eq(users.username, username),
    });

    if (sameUserNameUsers.length !== 0) {
      throw new HTTPException(401, {
        message: "Username already in use, please try a different one",
      });
    }

    const passwordHash = await hash(password, hashOptions);

    const newUser = await db
      .insert(users)
      .values({
        username,
        name,
        password_hash: passwordHash,
      })
      .returning()
      .get();

    const session = await lucia.createSession(newUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    //console.log(sessionCookie)
    c.header("Set-Cookie", sessionCookie.serialize(), {
      append: true,
    });

    return c.json(
      {
        success: true,
        message: "You have been signed up!",
        user: {
          id: newUser.id,
          name: newUser.name,
          username: newUser.username,
        },
      },
      201,
    );
  },
);

authRoutes.post("/sign-out", async (c) => {
  const cookie = c.req.header("Cookie") ?? "";
  const sessionId = lucia.readSessionCookie(cookie);
  console.log(cookie, sessionId);
  if (!sessionId) {
    throw new HTTPException(401, { message: "No session found" });
  }
  await lucia.invalidateSession(sessionId);
  const sessionCookie = lucia.createBlankSessionCookie();
  //console.log(sessionCookie)
  c.header("Set-Cookie", sessionCookie.serialize(), {
    append: true,
  });
  return c.json({ success: true, message: "You have been signed out!" });
});

authRoutes.post("/validate-session", async (c) => {
  const cookie = c.req.header("Cookie") ?? "";
  const sessionId = lucia.readSessionCookie(cookie);
  if (!sessionId) {
    return c.json({ success: false, message: "Session is not valid" });
  }
  return c.json({ success: true, message: "Session is valid" });
});

export default authRoutes;
