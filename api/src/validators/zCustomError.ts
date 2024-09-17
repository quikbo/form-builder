import { Context } from "hono";
import { ZodError } from "zod";

type Z = {
  success: false;
  error: ZodError<any>;
  data: any;
};

export const zCustomErrorMessage = (zError: Z, c: Context) => {
  // Create an array of error messages for all issues
  const errorMessages = zError.error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  return c.json(
    {
      success: zError.success,
      message: "Validation error",
      errors: errorMessages, // Include all error messages in the response
      meta: zError.error,
    },
    400,
  );
};

/*
import { Context } from "hono";
import { ZodError } from "zod";

type Z = {
  success: false;
  error: ZodError<any>;
  data:
    | { id: number }
    | { front?: string; back?: string }
    | { form_id: number }
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
*/
