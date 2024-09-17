import { Hono } from "hono";
import { Field, Form } from "../db/models";
import { zValidator } from "@hono/zod-validator";
import {
  createFieldSchema,
  getFieldSchema,
  getFieldsSchema,
  queryParamsSchema,
  refinedCreateFieldSchema,
  refinedUpdateFieldSchema,
  updateFieldSchema,
} from "../validators/schemas";
import { HTTPException } from "hono/http-exception";
import { zCustomErrorMessage } from "../validators/zCustomError";
import { authGuard } from "../middlewares/auth-guard";
import { Context } from "../lib/context";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890", 6);

const fieldsRouter = new Hono<Context>();

//helper function to update a form's # of fields when a field is added or deleted from it
const updateFormNumberOfFields = async (
  deck_id: number,
  changeInCards: number,
) => {
  const form = await Form.findById(deck_id);
  if (!form) {
    throw new HTTPException(404, { message: "Form not found" });
  }
  form.numberOfFields += changeInCards;
  await form.save();
};

// GET all fields from a specific form
fieldsRouter.get(
  "/forms/:form_id/fields",
  authGuard,
  zValidator("query", queryParamsSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  zValidator("param", getFieldsSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { form_id } = c.req.valid("param");
    const {
      sort = "asc",
      search = "",
      page = 1,
      limit = 10,
    } = c.req.valid("query");

    // Find the form and ensure the user is authorized to access it
    const form = await Form.findById(form_id);
    if (!form) {
      throw new HTTPException(404, { message: "Form not found" });
    }
    const user = c.get("user");
    if (form.userId.toString() !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to fetch fields in this form",
      });
    }

    // Build query for fields
    const fieldQuery: Record<string, any> = {
      formId: form_id,
    };
    if (search) {
      fieldQuery["label"] = { $regex: search, $options: "i" };
    }

    // Handle sorting
    const sortOptions: Record<string, 1 | -1> = {
      date: sort === "desc" ? -1 : 1, // Use -1 for descending and 1 for ascending
    };

    // Paginate results
    const fieldsData = await Field.find(fieldQuery)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const modifiedFieldsData = fieldsData.map((field) => ({
      ...field,
      id: field._id, // Create `id` field from `_id`
      _id: undefined, // Remove the `_id` field
    }));

    const totalCount = await Field.countDocuments(fieldQuery);

    return c.json({
      success: true,
      message: "Fields retrieved successfully",
      data: modifiedFieldsData,
      meta: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    });
  },
);

// GET a specific field from a specific form
fieldsRouter.get(
  "/forms/:form_id/fields/:id",
  authGuard,
  zValidator("param", getFieldSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { form_id, id } = c.req.valid("param");

    // Find the deck and ensure the user is authorized
    const form = await Form.findById(form_id);
    if (!form) {
      throw new HTTPException(404, { message: "Form not found" });
    }
    const user = c.get("user");
    if (form.userId.toString() !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to fetch fields in this form",
      });
    }

    // Find the card
    const field = await Field.findOne({ _id: id, formId: form_id });
    if (!field) {
      throw new HTTPException(404, { message: "Field not found" });
    }

    return c.json({
      success: true,
      message: "Field retrieved successfully",
      data: field,
    });
  },
);

// DELETE a specific field from a specific form
fieldsRouter.delete(
  "/forms/:form_id/fields/:id",
  authGuard,
  zValidator("param", getFieldSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { form_id, id } = c.req.valid("param");
    const user = c.get("user");

    // Ensure form exists and belongs to the user
    const form = await Form.findById(form_id);
    if (!form) {
      throw new HTTPException(404, { message: "Form not found" });
    }
    if (form.userId.toString() !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to delete fields in this form",
      });
    }

    // Find and delete the card
    const field = await Field.findOneAndDelete({ _id: id, formId: form_id });
    if (!field) {
      throw new HTTPException(404, { message: "Field not found" });
    }

    // Update the deck's number of cards
    await updateFormNumberOfFields(form_id, -1);

    return c.json({
      success: true,
      message: "Field deleted successfully",
      data: field,
    });
  },
);

// POST route to add a field to a form
fieldsRouter.post(
  "/forms/:form_id/fields",
  authGuard,
  zValidator("json", refinedCreateFieldSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  zValidator("param", getFieldsSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { form_id } = c.req.valid("param");
    const user = c.get("user");

    // Find the form and ensure user is authorized
    const form = await Form.findById(form_id);
    if (!form) {
      throw new HTTPException(404, { message: "Form not found" });
    }
    if (form.userId.toString() !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to add fields to this form",
      });
    }

    const { label, type, required, options } = c.req.valid("json");

    let fieldOptions = undefined;
    if (
      type === "multiple_choice" ||
      type === "dropdown" ||
      type === "checkbox"
    ) {
      fieldOptions = options || [];
    }

    // Create the new field
    const newField = await Field.create({
      _id: Number(nanoid()),
      label,
      type,
      required,
      options: fieldOptions,
      date: new Date(),
      formId: form_id,
    });

    // Update the form's number of fields
    await updateFormNumberOfFields(form_id, 1);

    return c.json(
      {
        success: true,
        message: "Field created successfully",
        data: newField,
      },
      201,
    );
  },
);

// PATCH route to update a field
fieldsRouter.patch(
  "/forms/:form_id/fields/:id",
  authGuard,
  zValidator("json", refinedUpdateFieldSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  zValidator("param", getFieldSchema, (result, c) => {
    if (!result.success) {
      return zCustomErrorMessage(result, c);
    }
  }),
  async (c) => {
    const { label, type, required, options } = c.req.valid("json");
    const { form_id, id } = c.req.valid("param");

    const user = c.get("user");

    // Ensure the form exists and the user is authorized
    const form = await Form.findById(form_id);
    if (!form) {
      throw new HTTPException(404, { message: "Form not found" });
    }
    if (form.userId.toString() !== user!.id) {
      throw new HTTPException(403, {
        message: "Unauthorized to edit fields in this form",
      });
    }

    let fieldOptions = undefined;
    if (
      type === "multiple_choice" ||
      type === "dropdown" ||
      type === "checkbox"
    ) {
      fieldOptions = options || [];
    }

    // Find and update the field
    const updatedField = await Field.findOneAndUpdate(
      { _id: id, formId: form_id },
      { label, type, required, options: fieldOptions },
      { new: true },
    );

    if (!updatedField) {
      throw new HTTPException(404, { message: "Field not found" });
    }

    return c.json({
      success: true,
      message: "Field updated successfully",
      data: updatedField,
    });
  },
);

export default fieldsRouter;
