import { Hono } from "hono";
import formsRouter from "./routes/forms";
import fieldsRouter from "./routes/fields";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import authRoutes from "./routes/auth";
import { logger } from "hono/logger";
import { auth } from "./middlewares/auth";
import { Context } from "./lib/context";
import { connectToDatabase } from "./db/index"; // Adjust the path as necessary
import shareLinksRouter from "./routes/shareLinks";
import responsesRouter from "./routes/responses";

// Connect to MongoDB
connectToDatabase()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
  });

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
app.route("/", formsRouter);
app.route("/", fieldsRouter);
app.route("/", shareLinksRouter);
app.route("/", responsesRouter);

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
