import { Hono } from 'hono';
import { ShareLink, Form } from '../db/models'; // Use Mongoose models
import { zValidator } from '@hono/zod-validator';
import { createShareLinkSchema, getShareLinkSchema } from '../validators/schemas';
import { HTTPException } from 'hono/http-exception';
import { authGuard } from '../middlewares/auth-guard';
import { Context } from '../lib/context';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 10);

const shareLinksRouter = new Hono<Context>();

// POST route to generate a new share link for a form
shareLinksRouter.post(
  '/share/form/:formId',
  authGuard,
  zValidator('param', createShareLinkSchema, (result, c) => {
    if (!result.success) {
      return c.json({
        success: false,
        message: 'Invalid form ID'
      });
    }
  }),
  async (c) => {
    const { formId } = c.req.valid('param');
    const user = c.get('user');

    // Check if the form exists and belongs to the user
    const form = await Form.findById(formId);
    if (!form) {
      throw new HTTPException(404, { message: 'Form not found' });
    }
    if (form.userId.toString() !== user!.id) {
      throw new HTTPException(403, { message: 'Unauthorized to generate share link for this form' });
    }

    // Check if a share link already exists for this form
    let shareLink = await ShareLink.findOne({ formId });
    if (!shareLink) {
      // Create a new share link if none exists
      shareLink = new ShareLink({ formId, shareId: nanoid() });
      await shareLink.save();
    }

    return c.json({
      success: true,
      message: 'Share link generated successfully',
      data: { shareId: shareLink.shareId }
    });
  }
);

shareLinksRouter.get(
  '/share/:shareId',
  zValidator('param', getShareLinkSchema, (result, c) => {
    if (!result.success) {
      return c.json({
        success: false,
        message: 'Invalid share link ID',
      });
    }
  }),
  async (c) => {
    const { shareId } = c.req.param();

    // Find the share link document to get the formId
    const shareLink = await ShareLink.findOne({ shareId });
    if (!shareLink || !shareLink.formId) {
      throw new HTTPException(404, { message: 'Share link not found or invalid' });
    }

    // Retrieve the form document directly using the formId
    const form = await Form.findById(shareLink.formId);
    if (!form) {
      throw new HTTPException(404, { message: 'Form not found' });
    }

    // Map through the results and replace _id with id
    const modifiedForm = ({
      ...form,
      id: form._id, // Create `id` field from `_id`
      _id: undefined, // Remove the `_id` field
    });

    return c.json({
      success: true,
      message: 'Form retrieved successfully',
      data: modifiedForm, // Return the modified form object directly
    });
  }
);


// DELETE route to remove a specific share link
shareLinksRouter.delete(
  '/share/:shareId',
  authGuard,
  async (c) => {
    const { shareId } = c.req.param();
    const user = c.get('user');

    // Find the share link using the shareId
    const shareLink = await ShareLink.findOne({ shareId });
    if (!shareLink) {
      throw new HTTPException(404, { message: 'Share link not found' });
    }

    // Use the formId from the shareLink to get the form details
    const form = await Form.findById(shareLink.formId);
    if (!form) {
      throw new HTTPException(404, { message: 'Form associated with this share link not found' });
    }

    // Verify if the current user is the owner of the form
    if (form.userId.toString() !== user!.id) {
      throw new HTTPException(403, { message: 'Unauthorized to delete this share link' });
    }

    // Remove the share link
    await ShareLink.findByIdAndDelete(shareLink._id);

    return c.json({
      success: true,
      message: 'Share link deleted successfully',
    });
  }
);

// GET route to check if a share link already exists for a form
shareLinksRouter.get(
  '/share/form/:formId',
  authGuard, // Apply auth middleware if needed
  async (c) => {
    const { formId } = c.req.param();

    try {
      // Find the existing share link for the form
      const shareLink = await ShareLink.findOne({ formId });
      if (!shareLink) {
        return c.json({
          success: true,
          message: 'No share link found for this form.',
          data: null,
        });
      }

      return c.json({
        success: true,
        message: 'Share link found.',
        data: { shareId: shareLink.shareId },
      });
    } catch (error) {
      return c.json({
        success: false,
        message: 'Error checking for existing share link.',
      }, 500);
    }
  }
);



export default shareLinksRouter;
