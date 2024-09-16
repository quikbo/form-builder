import { Hono } from "hono";
import { Card, Deck, User } from "../db/models";
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

// // MIGHT NOT BE NECESSARYhelper function to retrieve a deck's # of cards in order to update that attribute
// const getDeckNumberOfCards = async (
//   deck_id: number,
//   changeInCards: number,
//   c: any,
// ): Promise<number> => {
//   const deck = await db.select().from(decks).where(eq(decks.id, deck_id)).get();
//   if (!deck) {
//     throw new HTTPException(404, { message: "Deck not found" });
//   }
//   return deck.numberOfCards + changeInCards;
// };

//helper function to update a deck's # of cards when a card is added or deleted from it
const updateDeckNumberOfCards = async (
  deck_id: number,
  changeInCards: number,
) => {
  const deck = await Deck.findById(deck_id);
  if (!deck) {
    throw new HTTPException(404, { message: "Deck not found" });
  }
  deck.numberOfCards += changeInCards;
  await deck.save();
};

// GET all cards from a specific deck
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
    const { sort = "asc", search = "", page = 1, limit = 10 } = c.req.valid("query");

    // Find the deck and ensure the user is authorized to access it
    const deck = await Deck.findById(deck_id);
    if (!deck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }
    const user = c.get("user");
    if (deck.userId.toString() !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to fetch cards in this deck",
      });
    }

    // Build query for cards
    const cardQuery: Record<string, any> = {
      deckId: deck_id,
    };
    if (search) {
      cardQuery["$or"] = [
        { front: { $regex: search, $options: "i" } },
        { back: { $regex: search, $options: "i" } },
      ];
    }

    // Handle sorting
    const sortOptions: Record<string, 1 | -1> = {
      date: sort === "desc" ? -1 : 1, // Use -1 for descending and 1 for ascending
    };

    // Paginate results
    const cardsData = await Card.find(cardQuery)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await Card.countDocuments(cardQuery);

    return c.json({
      success: true,
      message: "Cards retrieved successfully",
      data: cardsData,
      meta: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    });
  }
);

// GET a specific card from a specific deck
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

    // Find the deck and ensure the user is authorized
    const deck = await Deck.findById(deck_id);
    if (!deck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }
    const user = c.get("user");
    if (deck.userId.toString() !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to fetch cards in this deck",
      });
    }

    // Find the card
    const card = await Card.findOne({ _id: id, deckId: deck_id });
    if (!card) {
      throw new HTTPException(404, { message: "Card not found" });
    }

    return c.json({
      success: true,
      message: "Card retrieved successfully",
      data: card,
    });
  }
);

// DELETE a specific card from a specific deck
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

    // Ensure deck exists and belongs to the user
    const deck = await Deck.findById(deck_id);
    if (!deck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }
    if (deck.userId.toString() !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to delete cards in this deck",
      });
    }

    // Find and delete the card
    const card = await Card.findOneAndDelete({ _id: id, deckId: deck_id });
    if (!card) {
      throw new HTTPException(404, { message: "Card not found" });
    }

    // Update the deck's number of cards
    await updateDeckNumberOfCards(deck_id, -1);

    return c.json({
      success: true,
      message: "Card deleted successfully",
      data: card,
    });
  }
);

// POST route to add a card to a deck
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

    // Find the deck and ensure user is authorized
    const deck = await Deck.findById(deck_id);
    if (!deck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }
    if (deck.userId.toString() !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to add cards to this deck",
      });
    }

    const { front, back } = c.req.valid("json");

    // Create the new card
    const newCard = await Card.create({
      front,
      back,
      date: new Date(),
      deckId: deck_id,
    });

    // Update the deck's number of cards
    await updateDeckNumberOfCards(deck_id, 1);

    return c.json(
      {
        success: true,
        message: "Card created successfully",
        data: newCard,
      },
      201
    );
  }
);

// PATCH route to update a card
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
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { front, back } = c.req.valid("json");
    const { deck_id, id } = c.req.valid("param");

    const user = c.get("user");

    // Ensure the deck exists and the user is authorized
    const deck = await Deck.findById(deck_id);
    if (!deck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }
    if (deck.userId.toString() !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to edit cards in this deck",
      });
    }

    // Find and update the card
    const updatedCard = await Card.findOneAndUpdate(
      { _id: id, deckId: deck_id },
      { front, back },
      { new: true }
    );

    if (!updatedCard) {
      throw new HTTPException(404, { message: "Card not found" });
    }

    return c.json({
      success: true,
      message: "Card updated successfully",
      data: updatedCard,
    });
  }
);

export default cardsRouter;