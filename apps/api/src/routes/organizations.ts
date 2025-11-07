import { Router } from 'express';
import { prisma } from '../config/database';
import { requireAuth } from '../middleware/auth';
import { logger } from '../config/logger';

const router = Router();

// Create organization (during signup)
router.post('/', async (req, res) => {
  try {
    const { name, userId } = req.body;

    if (!name || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Organization name and userId are required',
      });
    }

    // Create organization
    const organization = await prisma.organization.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      },
    });

    // Update user with organizationId and role
    await prisma.user.update({
      where: { id: userId },
      data: {
        organizationId: organization.id,
        role: 'ADMIN',
      },
    });

    // Fetch organization with users
    const orgWithUsers = await prisma.organization.findUnique({
      where: { id: organization.id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    logger.info(`Organization created: ${organization.id} by user ${userId}`);

    res.status(201).json({
      success: true,
      data: orgWithUsers,
    });
  } catch (error) {
    logger.error('Error creating organization:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create organization',
    });
  }
});

// Get current organization
router.get('/current', requireAuth, async (req, res) => {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: req.user!.organizationId },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
          },
        },
        whatsappAccounts: {
          select: {
            id: true,
            phoneNumber: true,
            displayName: true,
            isConnected: true,
          },
        },
        _count: {
          select: {
            bots: true,
            conversations: true,
            campaigns: true,
          },
        },
      },
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found',
      });
    }

    res.json({
      success: true,
      data: organization,
    });
  } catch (error) {
    logger.error('Error fetching organization:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch organization',
    });
  }
});

// Update organization
router.patch('/current', requireAuth, async (req, res) => {
  try {
    const { name } = req.body;

    // Only ADMIN can update organization
    if (req.user!.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can update organization settings',
      });
    }

    const organization = await prisma.organization.update({
      where: { id: req.user!.organizationId },
      data: { name },
    });

    logger.info(`Organization updated: ${organization.id}`);

    res.json({
      success: true,
      data: organization,
    });
  } catch (error) {
    logger.error('Error updating organization:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update organization',
    });
  }
});

export default router;
