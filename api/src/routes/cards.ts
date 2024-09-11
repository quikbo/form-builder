import { Hono } from "hono";
import { db } from "../db";
import { cards, decks, users } from "../db/schema";
import { eq, and, like, count, desc, asc, SQL } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import {
  createCardSchema,
  getCardSchema,
  getCardsSchema,
  queryParamsSchema,
  updateCardSchema,
} from "../validators/schemas";
import { HTTPException } from "hono/http-exception";
import { zCustomErrorMessage } from "../validators/zCustomError";
import { authGuard } from "../middlewares/auth-guard";
import { Context } from "../lib/context";

const cardsRouter = new Hono<Context>();

//helper function to retrieve a deck's # of cards in order to update that attribute
const getDeckNumberOfCards = async (
  deck_id: number,
  changeInCards: number,
  c: any,
): Promise<number> => {
  const deck = await db.select().from(decks).where(eq(decks.id, deck_id)).get();
  if (!deck) {
    throw new HTTPException(404, { message: "Deck not found" });
  }
  return deck.numberOfCards + changeInCards;
};

//helper function to update a deck's # of cards when a card is added or deleted from it
const updateDeckNumberOfCards = async (
  deck_id: number,
  changeInCards: number,
  c: any,
) => {
  const newNumberOfCards = await getDeckNumberOfCards(
    deck_id,
    changeInCards,
    c,
  );
  const updatedDeck = await db
    .update(decks)
    .set({ numberOfCards: newNumberOfCards })
    .where(eq(decks.id, deck_id))
    .returning()
    .get();
  if (!updatedDeck) {
    throw new HTTPException(404, { message: "Post not found" });
  }
  return c.json(updatedDeck);
};

//GET route for all cards from a specific deck
cardsRouter.get(
  "/decks/:deck_id/cards",
  authGuard,
  zValidator("query", queryParamsSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  zValidator("param", getCardsSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { deck_id } = c.req.valid("param");
    const { sort, search, page = 1, limit = 10 } = c.req.valid("query");

    const whereClause: (SQL | undefined)[] = [];
    if (search) {
      whereClause.push(like(cards.front || cards.back, `%${search}%`));
    }

    const orderByClause: SQL[] = [];
    if (sort === "desc") {
      orderByClause.push(desc(cards.date));
    } else if (sort === "asc") {
      orderByClause.push(asc(cards.date));
    }

    const offset = (page - 1) * limit;

    //ensuring deck and user are valid
    const deck = await db
      .select()
      .from(decks)
      .where(eq(decks.id, deck_id))
      .get();
    if (!deck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }
    const user = c.get("user");
    if (deck.userId !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to fetch cards in this deck",
      });
    }

    const [cardsData, [{ totalCount }]] = await Promise.all([
      db
        .select()
        .from(cards)
        .where(and(...whereClause, eq(cards.deckId, deck_id)))
        .orderBy(...orderByClause)
        .limit(limit)
        .offset(offset),
      db
        .select({ totalCount: count() })
        .from(cards)
        .where(and(...whereClause, eq(cards.deckId, deck_id))),
    ]);

    return c.json({
      success: true,
      message: "Cards retrieved successfully",
      data: cardsData,
      meta: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount: totalCount,
      },
    });
  },
);

//GET route for a specific card from a specific deck
cardsRouter.get(
  "/decks/:deck_id/cards/:id",
  authGuard,
  zValidator("param", getCardSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { deck_id, id } = c.req.valid("param");

    //ensuring deck and user are valid
    const deck = await db
      .select()
      .from(decks)
      .where(eq(decks.id, deck_id))
      .get();
    if (!deck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }
    const user = c.get("user");
    if (deck.userId !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to fetch cards in this deck",
      });
    }

    const card = await db
      .select()
      .from(cards)
      .where(and(eq(cards.id, id), eq(cards.deckId, deck_id)))
      .get();
    if (!card) {
      throw new HTTPException(404, { message: "Card not found" });
    }
    return c.json({
      success: true,
      message: "Card retrieved successfully",
      data: card,
    });
  },
);

//DELETE route for a specific card from a specific deck
cardsRouter.delete(
  "/decks/:deck_id/cards/:id",
  authGuard,
  zValidator("param", getCardSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { deck_id, id } = c.req.valid("param");
    const user = c.get("user");

    const card = await db
      .select()
      .from(cards)
      .where(and(eq(cards.id, Number(id)), eq(cards.deckId, Number(deck_id))))
      .get();
    if (!card) {
      throw new HTTPException(404, { message: "Card not found" });
    }
    //ensuring fdeck exists and same user
    const deck = await db
      .select()
      .from(decks)
      .where(eq(decks.id, deck_id))
      .get();
    if (!deck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }
    if (deck.userId !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to delete cards in this deck",
      });
    }

    const deletedCard = await db
      .delete(cards)
      .where(and(eq(cards.id, Number(id)), eq(cards.deckId, Number(deck_id))))
      .returning()
      .get();

    updateDeckNumberOfCards(deck_id, -1, c);
    return c.json({
      success: true,
      message: "Card deleted successfully",
      data: deletedCard,
    });
  },
);

//POST route for a card that gets assigned to a deck through foreign key
cardsRouter.post(
  "/decks/:deck_id/cards",
  authGuard,
  zValidator("json", createCardSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  zValidator("param", getCardsSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { deck_id } = c.req.valid("param");
    const user = c.get("user");

    const deck = await db
      .select()
      .from(decks)
      .where(eq(decks.id, deck_id))
      .get();
    if (!deck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }
    if (deck.userId !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to add cards to this deck",
      });
    }

    const { front, back } = await c.req.valid("json");
    const newCard = await db
      .insert(cards)
      .values({
        front,
        back,
        date: new Date(),
        deckId: deck_id,
      })
      .returning()
      .get();
    updateDeckNumberOfCards(deck_id, 1, c);
    return c.json(
      {
        success: true,
        message: "Card created successfully",
        data: newCard,
      },
      201,
    );
  },
);

//PATCH route for a card
cardsRouter.patch(
  "/decks/:deck_id/cards/:id",
  authGuard,
  zValidator("json", updateCardSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  zValidator("param", getCardSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: result.success,
          message: `${result.error.issues[0].path}: ${result.error.issues[0].message}`,
          meta: result.error,
        },
        400,
      );
    }
  }),
  async (c) => {
    const { front, back } = await c.req.valid("json");
    const { deck_id, id } = c.req.valid("param");

    const user = c.get("user");
    const card = await db
      .select()
      .from(cards)
      .where(and(eq(cards.id, Number(id)), eq(cards.deckId, Number(deck_id))))
      .get();
    if (!card) {
      throw new HTTPException(404, { message: "Card not found" });
    }
    const deck = await db
      .select()
      .from(decks)
      .where(eq(decks.id, deck_id))
      .get();
    if (!deck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }
    if (deck.userId !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to edit cards in this deck",
      });
    }

    const updatedCard = await db
      .update(cards)
      .set({ front, back })
      .where(and(eq(cards.id, Number(id)), eq(cards.deckId, Number(deck_id))))
      .returning()
      .get();

    return c.json({
      success: true,
      message: "Card updated successfully",
      data: updatedCard,
    });
  },
);

export default cardsRouter;
