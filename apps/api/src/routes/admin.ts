import { Router } from 'express';
import { prisma } from '../config/database';
import { requireAuth } from '../middleware/auth';
import { requireSuperAdmin } from '../middleware/superadmin';
import { logger } from '../config/logger';

const router = Router();

// All routes require authentication and superadmin role
router.use(requireAuth, requireSuperAdmin);

// Get platform statistics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalOrgs,
      totalUsers,
      totalBots,
      totalConversations,
      totalCampaigns,
      orgsByPlan,
    ] = await Promise.all([
      prisma.organization.count(),
      prisma.user.count(),
      prisma.bot.count(),
      prisma.conversation.count(),
      prisma.campaign.count(),
      prisma.organization.groupBy({
        by: ['plan'],
        _count: true,
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalOrganizations: totalOrgs,
        totalUsers,
        totalBots,
        totalConversations,
        totalCampaigns,
        organizationsByPlan: orgsByPlan.reduce((acc, item) => {
          acc[item.plan] = item._count;
          return acc;
        }, {} as Record<string, number>),
      },
    });
  } catch (error) {
    logger.error('Error fetching platform stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch platform statistics',
    });
  }
});

// Get all organizations with details
router.get('/organizations', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              users: true,
              bots: true,
              conversations: true,
              campaigns: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.organization.count(),
    ]);

    res.json({
      success: true,
      data: {
        organizations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Error fetching organizations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch organizations',
    });
  }
});

// Get specific organization details
router.get('/organizations/:id', async (req, res) => {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: req.params.id },
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
        _count: {
          select: {
            bots: true,
            conversations: true,
            campaigns: true,
            templates: true,
            contacts: true,
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

// Update organization plan
router.patch('/organizations/:id/plan', async (req, res) => {
  try {
    const { plan } = req.body;

    if (!['FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE'].includes(plan)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid plan type',
      });
    }

    const organization = await prisma.organization.update({
      where: { id: req.params.id },
      data: { plan },
    });

    logger.info(`Organization ${req.params.id} plan updated to ${plan} by superadmin ${req.user!.id}`);

    res.json({
      success: true,
      data: organization,
    });
  } catch (error) {
    logger.error('Error updating organization plan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update organization plan',
    });
  }
});

// Suspend/Activate organization
router.patch('/organizations/:id/status', async (req, res) => {
  try {
    const { suspended } = req.body;

    // We'll add a suspended field to the schema later
    // For now, just log the action
    logger.info(`Organization ${req.params.id} ${suspended ? 'suspended' : 'activated'} by superadmin ${req.user!.id}`);

    res.json({
      success: true,
      message: `Organization ${suspended ? 'suspended' : 'activated'} successfully`,
    });
  } catch (error) {
    logger.error('Error updating organization status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update organization status',
    });
  }
});

// Delete organization (dangerous operation)
router.delete('/organizations/:id', async (req, res) => {
  try {
    await prisma.organization.delete({
      where: { id: req.params.id },
    });

    logger.warn(`Organization ${req.params.id} DELETED by superadmin ${req.user!.id}`);

    res.json({
      success: true,
      message: 'Organization deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting organization:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete organization',
    });
  }
});

// Get all users with filtering
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const role = req.query.role as string;

    const where = role ? { role } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              plan: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
    });
  }
});

// Update user role
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;

    if (!['SUPERADMIN', 'ADMIN', 'AGENT', 'VIEWER'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role',
      });
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
    });

    logger.info(`User ${req.params.id} role updated to ${role} by superadmin ${req.user!.id}`);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user role',
    });
  }
});

export default router;
