import { Hono } from "hono";
import { Form, Field, User } from "../db/models"; // Use Mongoose models
import { zValidator } from "@hono/zod-validator";
import {
  createFormSchema,
  getFormSchema,
  queryParamsSchema,
  updateFormSchema,
} from "../validators/schemas";
import { HTTPException } from "hono/http-exception";
import { zCustomErrorMessage } from "../validators/zCustomError";
import { authGuard } from "../middlewares/auth-guard";
import { Context } from "../lib/context";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890", 6);

const formsRouter = new Hono<Context>();

// GET route for retrieving all forms
formsRouter.get(
  "/forms",
  authGuard,
  zValidator("query", queryParamsSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const {
      sort = "asc",
      search = "",
      page = 1,
      limit = 10,
    } = c.req.valid("query");

    const user = c.get("user");

    // Build query for filtering forms
    const formQuery: Record<string, any> = {
      userId: user!.id,
    };

    if (search) {
      formQuery["title"] = { $regex: search, $options: "i" };
    }

    // Sort options
    const sortOptions: Record<string, 1 | -1> =
      sort === "desc" ? { date: -1 } : { date: 1 };

    const formsData = await Form.find(formQuery)
      .populate("userId", "name username") // Populate author info
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Map through the results and replace _id with id
    const modifiedFormsData = formsData.map((form) => ({
      ...form,
      id: form._id, // Create `id` field from `_id`
      _id: undefined, // Remove the `_id` field
    }));

    const totalCount = await Form.countDocuments(formQuery);

    return c.json({
      success: true,
      message: "Forms retrieved successfully",
      data: modifiedFormsData,
      meta: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    });
  },
);

// GET route for retrieving a specific form by id
formsRouter.get(
  "/forms/:id",
  authGuard,
  zValidator("param", getFormSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { id } = c.req.valid("param");

    const form = await Form.findById(id).populate("userId", "name username");
    if (!form) {
      throw new HTTPException(404, { message: "Form not found" });
    }

    const user = c.get("user");
    if (form.userId.toString() !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to fetch this form",
      });
    }

    return c.json({
      success: true,
      message: "Form retrieved successfully",
      data: form,
    });
  },
);

// DELETE route for removing a specific form by id from db
formsRouter.delete(
  "/forms/:id",
  authGuard,
  zValidator("param", getFormSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const user = c.get("user");

    const form = await Form.findById(id);
    if (!form) {
      throw new HTTPException(404, { message: "Form not found" });
    }
    if (form.userId.toString() !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to delete this form",
      });
    }

    // Delete all related cards first
    await Field.deleteMany({ formId: id });

    // Delete the deck
    const deletedForm = await Form.findByIdAndDelete(id);

    return c.json({
      success: true,
      message: "Form deleted successfully",
      data: deletedForm,
    });
  },
);

// POST route for creating a new form
formsRouter.post(
  "/forms",
  authGuard,
  zValidator("json", createFormSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { title } = c.req.valid("json");
    const user = c.get("user");

    // Create the new deck
    const newForm = await Form.create({
      _id: Number(nanoid()),
      title,
      numberOfFields: 0,
      date: new Date(),
      userId: user!.id,
    });

    return c.json(
      {
        success: true,
        message: "Form created successfully",
        data: newForm,
      },
      201,
    );
  },
);

// PATCH route for updating an existing form by id
formsRouter.patch(
  "/forms/:id",
  authGuard,
  zValidator("json", updateFormSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  zValidator("param", getFormSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const { title } = c.req.valid("json");
    const user = c.get("user");

    const form = await Form.findById(id);
    if (!form) {
      throw new HTTPException(404, { message: "Form not found" });
    }
    if (form.userId.toString() !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to update this form",
      });
    }

    form.title = title!;
    const updatedForm = await form.save();

    return c.json({
      success: true,
      message: "Form updated successfully",
      data: updatedForm,
    });
  },
);

export default formsRouter;
