# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**BotPe AI** is a comprehensive multi-channel WhatsApp automation and bot creation platform. Phase 1 focuses on WhatsApp Business capabilities, providing intelligent conversational experiences through drag-and-drop bot building and AI-powered automation.

### Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui, ReactFlow
- **Backend**: Node.js 20, Express.js, TypeScript
- **Database**: PostgreSQL 15 with Prisma ORM
- **Caching**: Redis 7 (caching, sessions, job queues with BullMQ)
- **AI/ML**: Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
- **Real-time**: Socket.io
- **Storage**: AWS S3 (media files)
- **Package Manager**: pnpm (monorepo workspace)

---

## Development Commands

### Initial Setup

```bash
# Start databases (PostgreSQL & Redis)
docker-compose up -d

# Install dependencies
pnpm install

# Generate Prisma Client
cd apps/api && npx prisma generate

# Run database migrations
cd apps/api && npx prisma migrate dev
```

### Development

```bash
# Start frontend (http://localhost:3000)
cd apps/web && pnpm dev

# Start backend API (http://localhost:3001)
cd apps/api && pnpm dev

# Open Prisma Studio (database GUI)
cd apps/api && npx prisma studio
```

### Database Operations

```bash
# Create new migration
cd apps/api && npx prisma migrate dev --name <migration_name>

# Reset database (WARNING: destroys data)
cd apps/api && npx prisma migrate reset

# Generate Prisma Client after schema changes
cd apps/api && npx prisma generate
```

### Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# E2E tests
pnpm test:e2e
```

---

## Project Structure

```
botpe-ai/
├── apps/
│   ├── web/              # Next.js frontend (Port 3000)
│   ├── api/              # Express backend (Port 3001)
│   └── admin/            # Admin dashboard
├── packages/
│   ├── ui/               # Shared UI components
│   ├── config/           # Shared configurations
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── services/
│   ├── whatsapp/         # WhatsApp Business API integration
│   ├── ai/               # Claude AI service & agents
│   └── analytics/        # Analytics service
├── prisma/
│   └── schema.prisma     # Database schema (in apps/api)
└── docker/               # Docker configurations
```

---

## Architecture Guidelines

### Multi-Tenant Design

- **ALL database queries** must filter by `organizationId`
- Users belong to organizations (many-to-one relationship)
- Never expose data across organizations
- Use `req.user.organizationId` from authentication middleware

### Database Patterns

**All Prisma models follow these conventions:**

```prisma
model Example {
  id             String       @id @default(uuid())  // Always UUID
  organizationId String                             // Multi-tenancy
  organization   Organization @relation(...)        // Foreign key
  createdAt      DateTime     @default(now())       // Timestamp
  updatedAt      DateTime     @updatedAt            // Auto-update

  @@index([organizationId])  // Index for performance
}
```

- Primary keys: UUID (`@id @default(uuid())`)
- Timestamps: Always include `createdAt` and `updatedAt`
- Enums: Use Prisma enums for status fields
- Flexible data: Store in JSON columns (e.g., bot nodes/edges, settings)
- Multi-tenancy: Every model links to `Organization` via `organizationId`

### Bot Architecture

**Bot flows are stored as ReactFlow graph data:**

```typescript
{
  nodes: Json,  // Array of ReactFlow nodes (message, condition, action, etc.)
  edges: Json,  // Array of ReactFlow edges (connections)
  variables: Json,  // Bot-level variables
  entryNodeId: String  // Starting node
}
```

- Nodes represent bot actions (send message, check condition, call API)
- Edges define conversation flow
- Execution is event-driven through BullMQ job queues
- State is maintained in Redis during conversations

### WhatsApp Integration

**API Version**: v18.0
**Base URL**: `https://graph.facebook.com/v18.0`

**Key endpoints:**

```typescript
// Send message
POST /{phone-number-id}/messages
{
  messaging_product: "whatsapp",
  to: "recipient-phone",
  type: "text",
  text: { body: "message" }
}

// Webhook (incoming messages)
POST /api/webhooks/whatsapp
```

**Always:**
- Verify webhooks with `verify_token`
- Store access tokens encrypted
- Mark messages as read after processing
- Handle rate limits (80 msg/sec per phone number)

### Claude AI Integration

**Model**: claude-sonnet-4-5-20250929
**Usage Pattern**:

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4000,
  temperature: 0.7,  // 0.3 for analytical, 0.7 for creative
  messages: [{ role: 'user', content: prompt }]
});

const text = response.content[0].text;
```

**For JSON responses**, extract from markdown code blocks or use regex matching.

---

## Code Conventions

### TypeScript Style

```typescript
// Interfaces for data structures
interface User {
  id: string;
  email: string;
  name: string;
}

// Types for unions and utilities
type UserRole = 'admin' | 'agent' | 'viewer';

// Async functions ALWAYS have try-catch
async function fetchUser(id: string): Promise<User> {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    logger.error('Failed to fetch user:', error);
    throw error;
  }
}

// Services use class-based pattern
class WhatsAppService {
  async sendMessage(to: string, message: any): Promise<void> {
    // Implementation
  }
}
```

### React/Next.js Patterns

```typescript
// Client components must have directive
'use client';

// Server components (default, no directive needed)
export default function Page() {
  return <div>Server Component</div>;
}

// API routes in app/api/
export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ success: true });
}
```

**Next.js App Router conventions:**
- `page.tsx` - Page components
- `layout.tsx` - Shared layouts
- `loading.tsx` - Loading states
- `error.tsx` - Error boundaries
- `route.ts` - API routes

### File Naming

- Components: `PascalCase.tsx` (e.g., `BotBuilder.tsx`)
- Services: `camelCase.service.ts` (e.g., `whatsapp.service.ts`)
- Types: `PascalCase.types.ts` (e.g., `Bot.types.ts`)
- Utils: `camelCase.util.ts` (e.g., `validation.util.ts`)
- API routes: `kebab-case.routes.ts` (e.g., `bot-builder.routes.ts`)
- Tests: `*.test.ts` or `*.spec.ts`

### API Response Format

**Success:**
```typescript
{
  success: true,
  data: any,
  meta?: { page: number, total: number }
}
```

**Error:**
```typescript
{
  success: false,
  error: string,
  code?: string
}
```

### Authentication Pattern

```typescript
// All protected routes use authenticate middleware
import { authenticate, authorize } from './middlewares/auth.middleware';

router.get('/api/bots',
  authenticate,
  authorize(['admin', 'agent']),
  async (req, res) => {
    // ALWAYS filter by organization
    const bots = await prisma.bot.findMany({
      where: { organizationId: req.user.organizationId }
    });
    res.json({ success: true, data: bots });
  }
);
```

**JWT tokens:**
- Access token: 15-minute expiry
- Refresh token: 7-day expiry
- Always check `req.user` in protected routes

---

## AI Agent System

BotPe AI uses a multi-agent architecture powered by Claude:

### Core Agents (Phase 1 - MVP)

1. **Bot Builder Agent** - Generates bot flows from natural language
2. **Intent Recognition Agent** - Classifies user intents and extracts entities
3. **Response Generation Agent** - Creates contextual WhatsApp responses
4. **Template Generator Agent** - Creates WhatsApp-compliant message templates
5. **Customer Support Agent** - Provides AI-powered inbox assistance

### Agent Base Pattern

```typescript
abstract class BaseAgent {
  protected name: string;
  protected capabilities: string[];

  abstract async process(input: any): Promise<any>;

  protected async callClaude(prompt: string): Promise<string> {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    });
    return response.content[0].text;
  }
}
```

**When implementing agents:**
- Inherit from `BaseAgent`
- Define specific capabilities
- Cache expensive prompts in Redis
- Log all agent activities
- Use temperature 0.7 for creative, 0.3 for analytical tasks

---

## Common Patterns

### Real-time Communication (Socket.io)

```typescript
// Server setup
io.on('connection', (socket) => {
  socket.join(`org:${socket.data.organizationId}`);
  socket.join(`user:${socket.data.userId}`);
});

// Emit to organization
io.to(`org:${orgId}`).emit('event', data);

// Emit to specific conversation
io.to(`conversation:${conversationId}`).emit('message', message);
```

### Background Jobs (BullMQ)

```typescript
// Add job to queue
await messageQueue.add('send-campaign', {
  campaignId,
  recipients
}, {
  delay: 1000,
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 }
});

// Process jobs
messageQueue.process('send-campaign', async (job) => {
  const { campaignId, recipients } = job.data;
  // Implementation
});
```

### Caching Strategy

```typescript
// Cache pattern (Redis)
const cacheKey = `bot:${botId}`;
let bot = await redis.get(cacheKey);

if (!bot) {
  bot = await prisma.bot.findUnique({ where: { id: botId } });
  await redis.set(cacheKey, JSON.stringify(bot), 'EX', 3600);
}
```

---

## Environment Variables

**Required variables** (never commit `.env` files):

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/botpe_dev"
REDIS_URL="redis://localhost:6379"

# WhatsApp
WHATSAPP_APP_ID="your-app-id"
WHATSAPP_APP_SECRET="your-secret"
WHATSAPP_VERIFY_TOKEN="your-verify-token"
WHATSAPP_API_VERSION="v18.0"

# Claude AI
CLAUDE_API_KEY="sk-ant-..."

# AWS
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_S3_BUCKET="botpe-media"

# Application
NODE_ENV="development"
PORT="3001"
FRONTEND_URL="http://localhost:3000"
JWT_SECRET="your-super-secret-jwt-key"
ENCRYPTION_KEY="your-256-bit-encryption-key"
```

---

## Important Development Notes

### Before Creating New Features

1. Check if a Prisma model exists or needs creation
2. Run `npx prisma generate` after schema changes
3. Create migration with descriptive name: `npx prisma migrate dev --name add_feature_x`
4. Update TypeScript types if needed
5. Follow existing service patterns (check `whatsapp.service.ts` as template)

### When Working with Bots

- Bot configurations are stored as JSON in PostgreSQL
- Use ReactFlow format for nodes and edges
- Always validate node types before execution
- Test flows in isolated environment first
- Cache active bot configs in Redis

### WhatsApp Compliance

- **24-hour window**: Can send free-form messages only within 24 hours of last user message
- **Templates required**: Use approved templates for business-initiated messages outside 24-hour window
- **Rate limits**: 80 messages/second per phone number (tier-dependent)
- **Media limits**: Images (5MB), Videos (16MB), Documents (100MB)
- **Message length**: Max 4096 characters for text

### Security Reminders

- Always encrypt WhatsApp access tokens before storing
- Never expose organization data across boundaries
- Validate all user inputs
- Use prepared statements (Prisma handles this)
- Sanitize data before sending to WhatsApp
- Implement rate limiting on public endpoints

---

## Testing Guidelines

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';

describe('BotService', () => {
  it('should create a bot with valid data', async () => {
    const bot = await botService.createBot(orgId, data);
    expect(bot.id).toBeDefined();
    expect(bot.organizationId).toBe(orgId);
  });
});
```

### E2E Tests (Playwright)

```typescript
test('should create and save bot flow', async ({ page }) => {
  await page.goto('/dashboard/bots/new');
  await page.click('[data-testid="add-message-node"]');
  await page.fill('[data-testid="message-content"]', 'Hello!');
  await page.click('[data-testid="save-bot"]');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

---

## Performance Considerations

- Use Redis for frequently accessed data
- Implement cursor-based pagination for large datasets
- Optimize Prisma queries with `select` and `include`
- Use BullMQ for long-running tasks
- Cache Claude AI responses when appropriate
- Monitor token usage for AI features

---

## Deployment Notes

**Ports:**
- Frontend: 3000
- Backend: 3001
- PostgreSQL: 5432
- Redis: 6379

**Production checklist:**
- Set `NODE_ENV=production`
- Use environment-specific `.env` files
- Enable Prisma query logging in production
- Set up monitoring (errors, performance)
- Configure CORS properly
- Use connection pooling for PostgreSQL
- Enable Redis persistence

---

## Quick Reference

**Terminology (use consistently):**
- "User" (not "Customer" or "Account")
- "Organization" (not "Company" or "Tenant")
- "Bot" (not "Chatbot" or "Agent")
- "WhatsApp Account" (for WABA)
- "Template" (for WhatsApp message templates)
- "Campaign" (for broadcast messages)
- "Conversation" (for user chat sessions)

**Common abbreviations:**
- WABA: WhatsApp Business Account
- PRD: Product Requirements Document
- MCP: Model Context Protocol
- JWT: JSON Web Token
- ORM: Object-Relational Mapping

---

## Resources

- **Documentation**: See `prd.md`, `tech.md`, `how.md` for detailed specifications
- **Agent Architecture**: See `agents.md` for AI agent system details
- **Memory Guide**: See `memory.md` for Claude Code context strategies
- **MCP Servers**: See `mcp.md` for integration documentation
- **Postman Collections**: `Postman Collections/` contains WhatsApp API collections

---

## Getting Help

When stuck:
1. Check existing service implementations for patterns
2. Review Prisma schema for data models
3. Consult `how.md` for implementation examples
4. Reference `prd.md` for feature requirements
5. Check WhatsApp API Postman collections for endpoint details
