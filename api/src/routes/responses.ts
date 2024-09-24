import { Hono } from "hono";
import { Response, Form, Field } from "../db/models"; // Use Mongoose models
import { zValidator } from "@hono/zod-validator";
import {
  createResponseSchema,
  getResponsesByFormIdSchema,
  getResponseSchema,
  queryParamsSchema,
} from "../validators/schemas"; // Import the response validator schemas
import { HTTPException } from "hono/http-exception";
import { authGuard } from "../middlewares/auth-guard";
import { Context } from "../lib/context";

const responsesRouter = new Hono<Context>();

// POST route for creating a new response
responsesRouter.post(
  "/responses",
  zValidator("json", createResponseSchema, (result, c) => {
    if (!result.success) {
      return c.json({
        success: false,
        message: "Invalid response data",
      });
    }
  }),
  async (c) => {
    const { formId, fieldResponses } = c.req.valid("json");

    // Check if form exists
    const form = await Form.findById(formId);
    if (!form) {
      throw new HTTPException(404, { message: "Form not found" });
    }

    // Validate field responses against the form fields
    for (const fieldResponse of fieldResponses) {
      const field = await Field.findById(fieldResponse.fieldId);
      if (!field) {
        throw new HTTPException(400, { message: `Field ${fieldResponse.fieldId} not found` });
      }
      // Further validation can be done here, like checking the response type against the field type
    }

    const response = new Response({
      formId,
      fieldResponses,
      submittedAt: new Date(),
    });

    await response.save();

    return c.json({
      success: true,
      message: "Response created successfully",
      data: response,
    });
  }
);

// GET route for retrieving all responses for a specific form by form ID with pagination
responsesRouter.get(
  "/responses/form/:formId",
  zValidator("param", getResponsesByFormIdSchema, (result, c) => {
    if (!result.success) {
      return c.json({
        success: false,
        message: "Invalid form ID",
      });
    }
  }),
  zValidator("query", queryParamsSchema, (result, c) => { // Use the same schema for query params
    if (!result.success) {
      return c.json({
        success: false,
        message: "Invalid query parameters",
      });
    }
  }),
  async (c) => {
    const { formId } = c.req.valid("param");
    const {
      sort = "asc",
      search = "",
      page = 1,
      limit = 10,
    } = c.req.valid("query");

    // Pagination and sorting options
    const skip = (page - 1) * limit;
    const sortOptions: Record<string, 1 | -1> =
      sort === "desc" ? { submittedAt: -1 } : { submittedAt: 1 };

    // Build query for filtering responses
    const responseQuery: Record<string, any> = { formId };

    if (search) {
      // Search could be implemented based on field responses (e.g., searching within responses)
      responseQuery["fieldResponses.response"] = { $regex: search, $options: "i" };
    }

    // Fetch responses with pagination and sorting
    const responsesData = await Response.find(responseQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    if (responsesData.length === 0) {
      return c.json({
        success: false,
        message: "No responses found for this form",
      });
    }

    // Get all field IDs from responses to fetch corresponding field labels
    const fieldIds = responsesData.flatMap(response =>
      response.fieldResponses.map(fr => fr.fieldId)
    );

    // Fetch all field labels in one query
    const fields = await Field.find({ _id: { $in: fieldIds } }).select("id label").lean();

    //Define the type for fieldMap: keys are field IDs (strings), values are field labels (strings)
    const fieldMap: Record<string, string> = fields.reduce((map, field) => {
      map[field._id] = field.label; // Assuming `_id` is of type `string`
      return map;
    }, {} as Record<string, string>); // Explicitly specify the type for `map`

    // Modify responses to include field labels
    const modifiedResponses = responsesData.map(response => ({
      ...response,
      id: response._id, // Create `id` field from `_id`
      _id: undefined, // Remove the `_id` field
      fieldResponses: response.fieldResponses.map(fr => ({
        ...fr,
        label: fieldMap[fr.fieldId] || `Field ID: ${fr.fieldId}` // Add label if found in fieldMap
      })),
    }));


    // Get total count of responses for the form
    const totalCount = await Response.countDocuments(responseQuery);

    return c.json({
      success: true,
      message: "Responses retrieved successfully",
      data: modifiedResponses,
      meta: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    });
  }
);

// GET route for retrieving a specific response by ID
responsesRouter.get(
  "/responses/:id",
  zValidator("param", getResponseSchema, (result, c) => {
    if (!result.success) {
      return c.json({
        success: false,
        message: "Invalid response ID",
      });
    }
  }),
  async (c) => {
    const { id } = c.req.valid("param");

    const response = await Response.findById(id).lean();
    if (!response) {
      throw new HTTPException(404, { message: "Response not found" });
    }

    return c.json({
      success: true,
      message: "Response retrieved successfully",
      data: response,
    });
  }
);

// DELETE route for removing a specific response by ID
responsesRouter.delete(
  "/responses/:id",
  authGuard, // Only allow authenticated users to delete
  zValidator("param", getResponseSchema, (result, c) => {
    if (!result.success) {
      return c.json({
        success: false,
        message: "Invalid response ID",
      });
    }
  }),
  async (c) => {
    const { id } = c.req.valid("param");

    const response = await Response.findById(id);
    if (!response) {
      throw new HTTPException(404, { message: "Response not found" });
    }

    await Response.findByIdAndDelete(id);

    return c.json({
      success: true,
      message: "Response deleted successfully",
    });
  }
);

export default responsesRouter;
