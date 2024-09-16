import { Hono } from "hono";
import { Deck, Card, User } from "../db/models"; // Use Mongoose models
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

// GET route for retrieving all decks
decksRouter.get(
  "/decks",
  authGuard,
  zValidator("query", queryParamsSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { sort = "asc", search = "", page = 1, limit = 10 } = c.req.valid("query");

    const user = c.get("user");

    // Build query for filtering decks
    const deckQuery: Record<string, any> = {
      userId: user!.id,
    };

    if (search) {
      deckQuery["title"] = { $regex: search, $options: "i" };
    }

    // Sort options
    const sortOptions: Record<string, 1 | -1> = sort === "desc" ? { date: -1 } : { date: 1 };

    const decksData = await Deck.find(deckQuery)
      .populate("userId", "name username") // Populate author info
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await Deck.countDocuments(deckQuery);

    return c.json({
      success: true,
      message: "Decks retrieved successfully",
      data: decksData,
      meta: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    });
  }
);

// GET route for retrieving a specific deck by id
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

    const deck = await Deck.findById(id).populate("userId", "name username");
    if (!deck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }

    const user = c.get("user");
    if (deck.userId._id.toString() !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to fetch this deck",
      });
    }

    return c.json({
      success: true,
      message: "Deck retrieved successfully",
      data: deck,
    });
  }
);

// DELETE route for removing a specific deck by id from db
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

    const deck = await Deck.findById(id);
    if (!deck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }
    if (deck.userId.toString() !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to delete this deck",
      });
    }

    // Delete all related cards first
    await Card.deleteMany({ deckId: id });

    // Delete the deck
    const deletedDeck = await Deck.findByIdAndDelete(id);

    return c.json({
      success: true,
      message: "Deck deleted successfully",
      data: deletedDeck,
    });
  }
);

// POST route for creating a new deck
decksRouter.post(
  "/decks",
  authGuard,
  zValidator("json", createDeckSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { title } = c.req.valid("json");
    const user = c.get("user");

    // Create the new deck
    const newDeck = await Deck.create({
      title,
      numberOfCards: 0,
      date: new Date(),
      userId: user!.id,
    });

    return c.json(
      {
        success: true,
        message: "Deck created successfully",
        data: newDeck,
      },
      201
    );
  }
);

// PATCH route for updating an existing deck by id
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
    const { title } = c.req.valid("json");
    const user = c.get("user");

    const deck = await Deck.findById(id);
    if (!deck) {
      throw new HTTPException(404, { message: "Deck not found" });
    }
    if (deck.userId.toString() !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to update this deck",
      });
    }

    deck.title = title!;
    const updatedDeck = await deck.save();

    return c.json({
      success: true,
      message: "Deck updated successfully",
      data: updatedDeck,
    });
  }
);

export default decksRouter;
