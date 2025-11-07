import { Request, Response, NextFunction } from 'express';
import { auth } from '../lib/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { logger } from '../config/logger';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        organizationId: string;
        role: string;
        emailVerified: boolean;
      };
      session?: {
        id: string;
        userId: string;
        expiresAt: Date;
      };
    }
  }
}

/**
 * Middleware to require authentication
 * Attaches user and session to req object
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Get session from Better-Auth using fromNodeHeaders
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - No valid session',
      });
    }

    // Attach user and session to request
    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      organizationId: session.user.organizationId as string,
      role: session.user.role as string,
      emailVerified: session.user.emailVerified,
    };

    req.session = {
      id: session.session.id,
      userId: session.session.userId,
      expiresAt: new Date(session.session.expiresAt),
    };

    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Invalid session',
    });
  }
}

/**
 * Middleware to require specific role
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - No user',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden - Insufficient permissions',
        required: roles,
        current: req.user.role,
      });
    }

    next();
  };
}

/**
 * Middleware to require organization access
 * Ensures user can only access resources from their organization
 */
export function requireOrganization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - No user',
    });
  }

  // Organization ID will be validated in route handlers
  // This middleware just ensures user has organizationId
  if (!req.user.organizationId) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden - No organization assigned',
    });
  }

  next();
}

/**
 * Optional auth middleware
 * Attaches user if session exists, but doesn't require it
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session) {
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        organizationId: session.user.organizationId as string,
        role: session.user.role as string,
        emailVerified: session.user.emailVerified,
      };

      req.session = {
        id: session.session.id,
        userId: session.session.userId,
        expiresAt: new Date(session.session.expiresAt),
      };
    }

    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
}
