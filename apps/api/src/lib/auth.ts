import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";
import { prisma } from "../config/database";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Will enable after email service setup
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache for 5 minutes
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "AGENT",
        input: false, // Don't allow users to set this during registration
      },
      organizationId: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },
  advanced: {
    generateId: () => {
      // Use UUID v4
      return crypto.randomUUID();
    },
  },
  plugins: [
    organization({
      async createOrganization(data) {
        // Create organization in our database
        const org = await prisma.organization.create({
          data: {
            name: data.name,
            slug: data.slug,
            plan: "FREE",
          },
        });
        return {
          id: org.id,
          name: org.name,
          slug: org.slug,
          createdAt: org.createdAt,
        };
      },
      async getOrganization(organizationId) {
        const org = await prisma.organization.findUnique({
          where: { id: organizationId },
        });
        if (!org) return null;
        return {
          id: org.id,
          name: org.name,
          slug: org.slug,
          createdAt: org.createdAt,
        };
      },
      roles: {
        admin: {
          name: "Admin",
          permissions: ["*"], // Full access
        },
        agent: {
          name: "Agent",
          permissions: [
            "bots:read",
            "bots:write",
            "bots:delete",
            "conversations:*",
            "contacts:*",
            "templates:read",
            "campaigns:read",
          ],
        },
        viewer: {
          name: "Viewer",
          permissions: [
            "bots:read",
            "conversations:read",
            "contacts:read",
            "templates:read",
            "campaigns:read",
          ],
        },
      },
    }),
  ],
  trustedOrigins: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "http://localhost:3000",
  ],
});

export type Auth = typeof auth;
