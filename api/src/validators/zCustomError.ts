import { Context } from "hono";
import { ZodError } from "zod";

type Z = {
  success: false;
  error: ZodError<any>;
  data:
    | { id: number }
    | { front?: string; back?: string }
    | { deck_id: number }
    | { title?: string }
    | { sort?: "asc" | "desc"; search?: string; page?: number; limit?: number }
    | { username: string; password: string; name: string };
};

export const zCustomErrorMessage = (zError: Z, c: Context) => {
  return c.json(
    {
      success: zError.success,
      message: `${zError.error.issues[0].path}: ${zError.error.issues[0].message}`,
      meta: zError.error,
    },
    400,
  );
};
