import { Router } from 'express';
import { prisma } from '../config/database';
import { requireAuth } from '../middleware/auth';
import { logger } from '../config/logger';

const router = Router();

// Get all bots for organization
router.get('/', requireAuth, async (req, res) => {
  try {
    const bots = await prisma.bot.findMany({
      where: {
        organizationId: req.user!.organizationId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        version: true,
        createdAt: true,
        updatedAt: true,
        whatsappAccount: {
          select: {
            phoneNumber: true,
            displayName: true,
          },
        },
        _count: {
          select: {
            nodes: true,
            conversations: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: bots,
    });
  } catch (error) {
    logger.error('Error fetching bots:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bots',
    });
  }
});

// Get single bot with nodes and edges
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const bot = await prisma.bot.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId,
      },
      include: {
        nodes: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        edges: true,
        whatsappAccount: {
          select: {
            id: true,
            phoneNumber: true,
            displayName: true,
          },
        },
        _count: {
          select: {
            conversations: true,
          },
        },
      },
    });

    if (!bot) {
      return res.status(404).json({
        success: false,
        error: 'Bot not found',
      });
    }

    res.json({
      success: true,
      data: bot,
    });
  } catch (error) {
    logger.error('Error fetching bot:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bot',
    });
  }
});

// Create new bot
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      name,
      description,
      whatsappAccountId,
      welcomeMessage,
      fallbackMessage,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Bot name is required',
      });
    }

    // Create bot with initial welcome node
    const bot = await prisma.bot.create({
      data: {
        name,
        description,
        whatsappAccountId,
        welcomeMessage: welcomeMessage || 'Hello! How can I help you today?',
        fallbackMessage: fallbackMessage || "I didn't understand that. Can you please rephrase?",
        isActive: false,
        version: 1,
        organizationId: req.user!.organizationId,
        nodes: {
          create: {
            nodeId: 'start',
            type: 'START',
            label: 'Start',
            data: {},
            position: { x: 250, y: 100 },
          },
        },
      },
      include: {
        nodes: true,
        whatsappAccount: {
          select: {
            phoneNumber: true,
            displayName: true,
          },
        },
      },
    });

    logger.info(`Bot created: ${bot.id} by user ${req.user!.id}`);

    res.status(201).json({
      success: true,
      data: bot,
    });
  } catch (error) {
    logger.error('Error creating bot:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create bot',
    });
  }
});

// Update bot
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const {
      name,
      description,
      welcomeMessage,
      fallbackMessage,
      isActive,
      nodes,
      edges,
    } = req.body;

    const bot = await prisma.bot.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId,
      },
    });

    if (!bot) {
      return res.status(404).json({
        success: false,
        error: 'Bot not found',
      });
    }

    // Update bot and nodes/edges if provided
    const updated = await prisma.$transaction(async (tx) => {
      // Update bot basic info
      const updatedBot = await tx.bot.update({
        where: { id: req.params.id },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(welcomeMessage && { welcomeMessage }),
          ...(fallbackMessage && { fallbackMessage }),
          ...(isActive !== undefined && { isActive }),
        },
      });

      // Update nodes if provided
      if (nodes) {
        // Delete existing nodes
        await tx.botNode.deleteMany({
          where: { botId: req.params.id },
        });

        // Create new nodes
        await tx.botNode.createMany({
          data: nodes.map((node: any) => ({
            botId: req.params.id,
            nodeId: node.nodeId,
            type: node.type,
            label: node.label,
            data: node.data,
            position: node.position,
          })),
        });
      }

      // Update edges if provided
      if (edges) {
        // Delete existing edges
        await tx.botEdge.deleteMany({
          where: { botId: req.params.id },
        });

        // Create new edges
        await tx.botEdge.createMany({
          data: edges.map((edge: any) => ({
            botId: req.params.id,
            edgeId: edge.edgeId,
            source: edge.source,
            target: edge.target,
            condition: edge.condition,
          })),
        });
      }

      // Fetch updated bot with relations
      return await tx.bot.findUnique({
        where: { id: req.params.id },
        include: {
          nodes: true,
          edges: true,
        },
      });
    });

    logger.info(`Bot updated: ${req.params.id}`);

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    logger.error('Error updating bot:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update bot',
    });
  }
});

// Delete bot
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const bot = await prisma.bot.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId,
      },
    });

    if (!bot) {
      return res.status(404).json({
        success: false,
        error: 'Bot not found',
      });
    }

    await prisma.bot.delete({
      where: { id: req.params.id },
    });

    logger.info(`Bot deleted: ${req.params.id}`);

    res.json({
      success: true,
      message: 'Bot deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting bot:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete bot',
    });
  }
});

// Clone bot
router.post('/:id/clone', requireAuth, async (req, res) => {
  try {
    const bot = await prisma.bot.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId,
      },
      include: {
        nodes: true,
        edges: true,
      },
    });

    if (!bot) {
      return res.status(404).json({
        success: false,
        error: 'Bot not found',
      });
    }

    const cloned = await prisma.bot.create({
      data: {
        name: `${bot.name} (Copy)`,
        description: bot.description,
        whatsappAccountId: bot.whatsappAccountId,
        welcomeMessage: bot.welcomeMessage,
        fallbackMessage: bot.fallbackMessage,
        isActive: false,
        version: 1,
        organizationId: req.user!.organizationId,
        nodes: {
          createMany: {
            data: bot.nodes.map((node) => ({
              nodeId: node.nodeId,
              type: node.type,
              label: node.label,
              data: node.data,
              position: node.position,
            })),
          },
        },
        edges: {
          createMany: {
            data: bot.edges.map((edge) => ({
              edgeId: edge.edgeId,
              source: edge.source,
              target: edge.target,
              condition: edge.condition,
            })),
          },
        },
      },
      include: {
        nodes: true,
        edges: true,
      },
    });

    logger.info(`Bot cloned: ${bot.id} -> ${cloned.id}`);

    res.status(201).json({
      success: true,
      data: cloned,
    });
  } catch (error) {
    logger.error('Error cloning bot:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clone bot',
    });
  }
});

export default router;
