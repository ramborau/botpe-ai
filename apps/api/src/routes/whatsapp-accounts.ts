import { Router } from 'express';
import { prisma } from '../config/database';
import { requireAuth } from '../middleware/auth';
import { logger } from '../config/logger';

const router = Router();

// Get all WhatsApp accounts for organization
router.get('/', requireAuth, async (req, res) => {
  try {
    const accounts = await prisma.whatsAppAccount.findMany({
      where: {
        organizationId: req.user!.organizationId,
      },
      select: {
        id: true,
        phoneNumber: true,
        displayName: true,
        businessAccountId: true,
        phoneNumberId: true,
        isConnected: true,
        verifiedName: true,
        qualityRating: true,
        messagingLimit: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: accounts,
    });
  } catch (error) {
    logger.error('Error fetching WhatsApp accounts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch WhatsApp accounts',
    });
  }
});

// Get single WhatsApp account
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const account = await prisma.whatsAppAccount.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId,
      },
      include: {
        _count: {
          select: {
            conversations: true,
            campaigns: true,
          },
        },
      },
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'WhatsApp account not found',
      });
    }

    res.json({
      success: true,
      data: account,
    });
  } catch (error) {
    logger.error('Error fetching WhatsApp account:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch WhatsApp account',
    });
  }
});

// Create/Connect new WhatsApp account
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      phoneNumber,
      displayName,
      accessToken,
      businessAccountId,
      phoneNumberId,
      verifiedName,
    } = req.body;

    if (!phoneNumber || !accessToken || !businessAccountId || !phoneNumberId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Check if phone number already exists
    const existing = await prisma.whatsAppAccount.findFirst({
      where: {
        phoneNumber,
        organizationId: req.user!.organizationId,
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'This phone number is already connected',
      });
    }

    // TODO: Verify the access token with WhatsApp API

    const account = await prisma.whatsAppAccount.create({
      data: {
        phoneNumber,
        displayName: displayName || phoneNumber,
        accessToken, // TODO: Encrypt this
        businessAccountId,
        phoneNumberId,
        verifiedName,
        isConnected: true,
        organizationId: req.user!.organizationId,
      },
    });

    logger.info(`WhatsApp account connected: ${account.id} for org ${req.user!.organizationId}`);

    res.status(201).json({
      success: true,
      data: {
        ...account,
        accessToken: undefined, // Don't send token back
      },
    });
  } catch (error) {
    logger.error('Error connecting WhatsApp account:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to connect WhatsApp account',
    });
  }
});

// Update WhatsApp account
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { displayName, isConnected } = req.body;

    const account = await prisma.whatsAppAccount.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId,
      },
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'WhatsApp account not found',
      });
    }

    const updated = await prisma.whatsAppAccount.update({
      where: { id: req.params.id },
      data: {
        ...(displayName && { displayName }),
        ...(isConnected !== undefined && { isConnected }),
      },
    });

    logger.info(`WhatsApp account updated: ${updated.id}`);

    res.json({
      success: true,
      data: {
        ...updated,
        accessToken: undefined,
      },
    });
  } catch (error) {
    logger.error('Error updating WhatsApp account:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update WhatsApp account',
    });
  }
});

// Delete WhatsApp account
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const account = await prisma.whatsAppAccount.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId,
      },
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'WhatsApp account not found',
      });
    }

    // Only ADMIN can delete accounts
    if (req.user!.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can delete WhatsApp accounts',
      });
    }

    await prisma.whatsAppAccount.delete({
      where: { id: req.params.id },
    });

    logger.info(`WhatsApp account deleted: ${req.params.id}`);

    res.json({
      success: true,
      message: 'WhatsApp account deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting WhatsApp account:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete WhatsApp account',
    });
  }
});

export default router;
