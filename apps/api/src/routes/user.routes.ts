import { Router, Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { prisma } from '../config/database';
import { logger } from '../config/logger';

const router = Router();

/**
 * GET /api/users/me
 * Get current user profile with organization
 */
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            plan: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        image: user.image,
        organization: user.organization,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile',
    });
  }
});

/**
 * PATCH /api/users/me
 * Update current user profile
 */
router.patch('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const { name, image } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(name && { name }),
        ...(image && { image }),
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            plan: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
        organization: user.organization,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user profile',
    });
  }
});

/**
 * GET /api/users/organization
 * Get all users in the current user's organization
 * Requires ADMIN role
 */
router.get(
  '/organization',
  requireAuth,
  requireRole('ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        where: {
          organizationId: req.user!.organizationId,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json({
        success: true,
        data: users,
        count: users.length,
      });
    } catch (error) {
      logger.error('Get organization users error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch organization users',
      });
    }
  }
);

/**
 * PATCH /api/users/:userId/role
 * Update user role (admin only)
 */
router.patch(
  '/:userId/role',
  requireAuth,
  requireRole('ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      // Validate role
      if (!['ADMIN', 'AGENT', 'VIEWER'].includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role. Must be ADMIN, AGENT, or VIEWER',
        });
      }

      // Check if user exists and belongs to same organization
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!targetUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      if (targetUser.organizationId !== req.user!.organizationId) {
        return res.status(403).json({
          success: false,
          error: 'Cannot modify users from other organizations',
        });
      }

      // Prevent self-demotion from admin
      if (userId === req.user!.id && role !== 'ADMIN') {
        return res.status(400).json({
          success: false,
          error: 'Cannot change your own admin role',
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      res.json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      logger.error('Update user role error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update user role',
      });
    }
  }
);

export default router;
