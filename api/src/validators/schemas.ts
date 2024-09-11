import { z } from "zod";

//DECK SCHEMAS
export const createDeckSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less")
    .regex(
      /^[a-z A-Z 0-9 ]+$/,
      "Title must only include alphanumeric characters",
    ),
});

export const updateDeckSchema = createDeckSchema.partial();

export const getDeckSchema = z.object({
  id: z.coerce.number().int().positive(),
});

//QUERY SCHEMAS FOR NON ID SPECIFIC GET REQUESTS
export const queryParamsSchema = z.object({
  sort: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  username: z.string().optional(),
});

//CARD SCHEMAS
export const createCardSchema = z.object({
  front: z
    .string()
    .min(1, "Front is required")
    .max(500, "Front must be 500 characters or less"),
  back: z
    .string()
    .min(1, "Back is required")
    .max(1000, "Back must be 1000 characters or less"),
});

export const updateCardSchema = createCardSchema.partial();

export const getCardsSchema = z.object({
  deck_id: z.coerce.number().int().positive(),
});

export const getCardSchema = z.object({
  deck_id: z.coerce.number().int().positive(),
  id: z.coerce.number().int().positive(),
});

//AUTH SCHEMAS
export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be 20 characters or less"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or less"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine(
      (value) => {
        return (
          /[a-z]/.test(value) && /[A-Z]/.test(value) && /[0-9]/.test(value)
        );
      },
      {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      },
    ),
});

export const signInSchema = z.object({
  username: z.string(),
  password: z.string(),
});
