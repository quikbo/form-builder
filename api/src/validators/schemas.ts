import { z } from "zod";

//FORM SCHEMAS
export const createFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less")
    .regex(
      /^[a-z A-Z 0-9 ]+$/,
      "Title must only include alphanumeric characters",
    ),
});

export const updateFormSchema = createFormSchema.partial();

export const getFormSchema = z.object({
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

//FIELD SCHEMAS
export const createFieldSchema = z.object({
  label: z
    .string()
    .min(1, "Label is required")
    .max(500, "Label must be 500 characters or less"),
  type: z.enum(["text", "multiple_choice", "checkbox", "dropdown"]),
  required: z.boolean(),
  options: z
    .array(z.string().min(1, "Option must be at least 1 character"))
    .optional(),
});

// Update field schema by making it partial before adding refinement
export const updateFieldSchema = createFieldSchema.partial();

// Apply refinement to both create and update schemas
const fieldSchemaWithRefinement = createFieldSchema.refine(
  (data) => {
    if (["multiple_choice", "checkbox", "dropdown"].includes(data.type)) {
      return data.options && data.options.length > 0;
    }
    return true; // If type is not one of the listed, no need for options
  },
  {
    message:
      "Options are required for multiple choice, checkbox, or dropdown fields",
    path: ["options"], // Attach error to the options field
  },
);

// Use the schema with refinement for field creation
export const refinedCreateFieldSchema = fieldSchemaWithRefinement;

// Use the schema with refinement for field updates
export const refinedUpdateFieldSchema = updateFieldSchema.refine(
  (data) => {
    if (["multiple_choice", "checkbox", "dropdown"].includes(data.type!)) {
      return data.options && data.options.length > 0;
    }
    return true;
  },
  {
    message:
      "Options are required for multiple choice, checkbox, or dropdown fields",
    path: ["options"],
  },
);

export const getFieldsSchema = z.object({
  form_id: z.coerce.number().int().positive(),
});

export const getFieldSchema = z.object({
  form_id: z.coerce.number().int().positive(),
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

// Schema to validate the form ID for creating a share link
export const createShareLinkSchema = z.object({
  formId: z.coerce.number().int().positive({
    message: "Form ID must be a positive integer",
  }),
});

// Schema to validate the share ID parameter
export const getShareLinkSchema = z.object({
  shareId: z
    .string()
    .min(1, "Share ID is required")
    .max(20, "Share ID must be 20 characters or less"),
});