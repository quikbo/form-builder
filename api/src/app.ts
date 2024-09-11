import { Hono } from "hono";
import decksRouter from "./routes/decks";
import cardsRouter from "./routes/cards";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import authRoutes from "./routes/auth";
import { logger } from "hono/logger";
import { auth } from "./middlewares/auth";
import { Context } from "./lib/context";

const app = new Hono<Context>();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: (origin) => origin,
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTION"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Set-Cookie"],
  }),
);
app.use(auth);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/", authRoutes);
app.route("/", decksRouter);
app.route("/", cardsRouter);

app.onError((err, c) => {
  console.error(`${err}`);

  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        message: err.message,
      },
      err.getResponse(),
    );
  }

  return c.json({ message: "An unexpected error occurred" }, 500);
});

export default app;
