import { Router, Request, Response } from 'express';
import { whatsappService } from '../services/whatsapp.service';
import { authenticate } from '../middleware/auth';
import { logger } from '../config/logger';

const router = Router();

/**
 * POST /api/whatsapp/embedded-signup/callback
 * Handle embedded signup callback after OAuth authorization
 */
router.post('/embedded-signup/callback', authenticate, async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const organizationId = req.user!.organizationId;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Authorization code is required',
      });
    }

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: 'Organization ID is required',
      });
    }

    logger.info('Processing embedded signup callback', {
      userId: req.user!.id,
      organizationId,
    });

    const account = await whatsappService.handleEmbeddedSignupCallback(code, organizationId);

    res.json({
      success: true,
      data: {
        id: account.id,
        wabaId: account.wabaId,
        phoneNumberId: account.phoneNumberId,
        displayPhoneNumber: account.displayPhoneNumber,
        verifiedName: account.verifiedName,
        status: account.status,
      },
    });
  } catch (error: any) {
    logger.error('Embedded signup callback error', {
      error: error.message,
      userId: req.user?.id,
    });

    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process WhatsApp signup',
    });
  }
});

/**
 * GET /api/whatsapp/accounts
 * Get all WhatsApp accounts for the organization
 */
router.get('/accounts', authenticate, async (req: Request, res: Response) => {
  try {
    const organizationId = req.user!.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: 'Organization ID is required',
      });
    }

    const accounts = await whatsappService.getAccounts(organizationId);

    res.json({
      success: true,
      data: accounts,
    });
  } catch (error: any) {
    logger.error('Failed to fetch WhatsApp accounts', {
      error: error.message,
      userId: req.user?.id,
    });

    res.status(500).json({
      success: false,
      error: 'Failed to fetch WhatsApp accounts',
    });
  }
});

/**
 * DELETE /api/whatsapp/accounts/:id
 * Delete a WhatsApp account
 */
router.delete('/accounts/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = req.user!.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: 'Organization ID is required',
      });
    }

    await whatsappService.deleteAccount(id, organizationId);

    res.json({
      success: true,
      message: 'WhatsApp account deleted successfully',
    });
  } catch (error: any) {
    logger.error('Failed to delete WhatsApp account', {
      error: error.message,
      userId: req.user?.id,
      accountId: req.params.id,
    });

    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete WhatsApp account',
    });
  }
});

/**
 * POST /api/whatsapp/messages/send
 * Send a text message via WhatsApp
 */
router.post('/messages/send', authenticate, async (req: Request, res: Response) => {
  try {
    const { phoneNumberId, to, message } = req.body;
    const organizationId = req.user!.organizationId;

    if (!phoneNumberId || !to || !message) {
      return res.status(400).json({
        success: false,
        error: 'phoneNumberId, to, and message are required',
      });
    }

    // Verify the phone number belongs to this organization
    const accounts = await whatsappService.getAccounts(organizationId!);
    const account = accounts.find(a => a.phoneNumberId === phoneNumberId);

    if (!account) {
      return res.status(403).json({
        success: false,
        error: 'Phone number not found or access denied',
      });
    }

    const result = await whatsappService.sendTextMessage(phoneNumberId, to, message);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error('Failed to send WhatsApp message', {
      error: error.message,
      userId: req.user?.id,
    });

    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send message',
    });
  }
});

export default router;
