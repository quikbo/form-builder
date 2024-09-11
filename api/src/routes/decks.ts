import { Hono } from "hono";
import { db } from "../db";
import { cards, decks, users } from "../db/schema";
import { and, asc, count, desc, eq, like, SQL } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import {
  createDeckSchema,
  getDeckSchema,
  queryParamsSchema,
  updateDeckSchema,
} from "../validators/schemas";
import { HTTPException } from "hono/http-exception";
import { zCustomErrorMessage } from "../validators/zCustomError";
import { authGuard } from "../middlewares/auth-guard";
import { Context } from "../lib/context";

const decksRouter = new Hono<Context>();
const standardResponse =
  //GET route for retrieving all decks
  decksRouter.get(
    "/decks",
    authGuard,
    zValidator("query", queryParamsSchema, (result, c) => {
      if (!result.success) {
        return zCustomErrorMessage(result, c);
      }
    }),
    async (c) => {
      const { sort, search, page = 1, limit = 10 } = c.req.valid("query");

      const whereClause: (SQL | undefined)[] = [];
      if (search) {
        whereClause.push(like(decks.title, `%${search}%`));
      }

      const user = c.get("user");
      whereClause.push(eq(decks.userId, user!.id));

      const orderByClause: SQL[] = [];
      if (sort === "desc") {
        orderByClause.push(desc(decks.date));
      } else if (sort === "asc") {
        orderByClause.push(asc(decks.date));
      }

      const offset = (page - 1) * limit;

      const [decksData, [{ totalCount }]] = await Promise.all([
        db
          .select({
            id: decks.id,
            title: decks.title,
            date: decks.date,
            numberOfCards: decks.numberOfCards,
            author: {
              id: users.id,
              name: users.name,
              username: users.username,
            },
          })
          .from(decks)
          .leftJoin(users, eq(decks.userId, users.id))
          .where(and(...whereClause))
          .orderBy(...orderByClause)
          .limit(limit)
          .offset(offset),
        db
          .select({ totalCount: count() })
          .from(decks)
          .where(and(...whereClause)),
      ]);

      return c.json({
        success: true,
        message: "Decks retrieved successfully",
        data: decksData,
        meta: {
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
          totalCount: totalCount,
        },
      });
    },
  );

//GET route for retrieving a specific deck by id
decksRouter.get(
  "/decks/:id",
  authGuard,
  zValidator("param", getDeckSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const deck = await db
      .select({
        id: decks.id,
        title: decks.title,
        date: decks.date,
        numberOfCards: decks.numberOfCards,
        author: {
          id: users.id,
          name: users.name,
          username: users.username,
        },
      })
      .from(decks)
      .leftJoin(users, eq(decks.userId, users.id))
      .where(eq(decks.id, id))
      .get();

    if (!deck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }
    const user = c.get("user");
    if (deck.author!.id !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to fetch this deck",
      });
    }

    return c.json({
      success: true,
      message: "Deck retrieved successfully",
      data: deck,
    });
  },
);

//DELETE route for removing a specific deck by id from db
decksRouter.delete(
  "/decks/:id",
  authGuard,
  zValidator("param", getDeckSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const user = c.get("user");

    const deck = await db.select().from(decks).where(eq(decks.id, id)).get();
    if (!deck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }
    if (deck.userId !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to delete this deck",
      });
    }

    //delete child cards before deleting deck
    //onDelete: 'cascade' was not working
    await db.delete(cards).where(eq(cards.deckId, id));
    const deletedDeck = await db
      .delete(decks)
      .where(eq(decks.id, id))
      .returning()
      .get();

    return c.json({
      success: true,
      message: "Deck deleted successfully",
      data: deletedDeck,
    });
  },
);

//POST route for creating a new deck
decksRouter.post(
  "/decks",
  authGuard,
  zValidator("json", createDeckSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { title } = await c.req.valid("json");
    const user = c.get("user");
    const newDeck = await db
      .insert(decks)
      .values({
        title,
        numberOfCards: 0,
        date: new Date(),
        userId: user!.id,
      })
      .returning()
      .get();
    return c.json(
      {
        success: true,
        message: "Deck created successfully",
        data: newDeck,
      },
      201,
    );
  },
);

//PATCH route for updating an existing deck by id
decksRouter.patch(
  "/decks/:id",
  authGuard,
  zValidator("json", updateDeckSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  zValidator("param", getDeckSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const { title } = await c.req.valid("json");
    const user = c.get("user");

    const deck = await db.select().from(decks).where(eq(decks.id, id)).get();
    if (!deck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }
    if (deck.userId !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to update this deck",
      });
    }

    const updatedDeck = await db
      .update(decks)
      .set({ title })
      .where(eq(decks.id, id))
      .returning()
      .get();

    return c.json({
      success: true,
      message: "Deck updated successfully",
      data: updatedDeck,
    });
  },
);

export default decksRouter;
