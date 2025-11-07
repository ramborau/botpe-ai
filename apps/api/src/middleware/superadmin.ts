import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export async function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    if (req.user.role !== 'SUPERADMIN') {
      logger.warn(`Unauthorized superadmin access attempt by user ${req.user.id}`);
      return res.status(403).json({
        success: false,
        error: 'Access denied. Superadmin role required.',
      });
    }

    next();
  } catch (error) {
    logger.error('Superadmin middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
