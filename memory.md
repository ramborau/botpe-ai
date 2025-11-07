# BotPe AI - Claude Code Memory Guide

## Document Overview

This document provides strategies and best practices for leveraging Claude Code's memory features to accelerate BotPe AI development and maintain consistent project context.

---

## Table of Contents

1. [Understanding Claude Memory](#understanding-claude-memory)
2. [Project Context to Store](#project-context-to-store)
3. [Memory Optimization Strategies](#memory-optimization-strategies)
4. [Essential Memory Items](#essential-memory-items)
5. [Prompt Engineering for Memory](#prompt-engineering-for-memory)
6. [Memory Management](#memory-management)

---

## Understanding Claude Memory

### How Claude Memory Works

Claude can remember information across conversations within a project/chat context:

-   **Session Memory:** Context within current conversation
-   **Project Memory:** Information stored across multiple conversations
-   **Skill-Based Memory:** Loaded from `/mnt/skills/` directories
-   **User Edits:** Explicit instructions via `memory_user_edits` tool

### Memory Capabilities

✅ **What Claude Remembers:**

-   Project structure and architecture
-   Code patterns and conventions
-   Technology stack decisions
-   API endpoints and schemas
-   Common commands and workflows
-   User preferences and coding style

❌ **What Claude Doesn't Remember:**

-   Sensitive credentials (and shouldn't!)
-   Temporary debugging context
-   One-off experiments
-   Conversations from other projects

---

## Project Context to Store

### 1. Project Identity

**Store This:**

```
Project Name: BotPe AI
Description: WhatsApp automation and bot creation platform
Tech Stack: Next.js 14, Node.js, PostgreSQL, Prisma, Redis, Claude AI
Architecture: Microservices with monorepo structure
Primary Language: TypeScript
```

**How to Store:**

-   Create a `PROJECT.md` in root directory
-   Reference it frequently in conversations
-   Update as project evolves

---

### 2. Project Structure

**Essential Paths:**

```
botpe-ai/
├── apps/
│   ├── web/              # Next.js frontend (Port 3000)
│   ├── api/              # Express backend (Port 3001)
│   └── admin/            # Admin dashboard
├── packages/
│   ├── ui/               # Shared components
│   ├── config/           # Shared configs
│   ├── types/            # TypeScript types
│   └── utils/            # Utilities
├── services/
│   ├── whatsapp/         # WhatsApp integration
│   ├── ai/               # Claude AI service
│   └── analytics/        # Analytics service
└── prisma/
    └── schema.prisma     # Database schema
```

**Memory Prompt:**

> "Remember: Frontend is in apps/web using Next.js 14 with App Router. Backend is in apps/api using Express. Shared code is in packages/. WhatsApp logic is in services/whatsapp/."

---

### 3. Architecture Decisions

**Key Decisions to Remember:**

1. **Database Strategy:**

    - PostgreSQL for relational data (users, bots, templates)
    - Redis for caching and job queues
    - MongoDB for conversation logs (optional)

2. **Authentication:**

    - JWT tokens with 15-minute expiry
    - Refresh tokens with 7-day expiry
    - Passport.js for strategies

3. **Real-time Communication:**

    - Socket.io for inbox and live updates
    - Rooms: user:{id}, org:{id}, conversation:{id}

4. **Bot Execution:**

    - Node-based flow system using ReactFlow
    - Event-driven architecture
    - State stored in Redis

5. **API Design:**
    - RESTful endpoints at `/api/*`
    - tRPC for type-safe internal APIs
    - WebSocket for real-time features

**Memory Prompt:**

> "Remember: We use PostgreSQL with Prisma ORM as primary database. Redis handles caching and job queues with BullMQ. Real-time features use Socket.io. Bots execute as node-based flows stored in PostgreSQL JSON columns."

---

### 4. Code Conventions

**TypeScript Style:**

```typescript
// Use interfaces for data structures
interface User {
	id: string;
	email: string;
	name: string;
}

// Use types for unions and utilities
type UserRole = 'admin' | 'agent' | 'viewer';

// Async functions always have try-catch
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

**React/Next.js Patterns:**

```typescript
// Use 'use client' for client components
'use client';

// Server components by default (no directive)
export default function Page() {
	return <div>Server Component</div>;
}

// API routes in app/api/
export async function POST(request: Request) {
	const body = await request.json();
	return Response.json({ success: true });
}

// Use Next.js conventions
// - page.tsx for pages
// - layout.tsx for layouts
// - loading.tsx for loading states
// - error.tsx for error handling
```

**Memory Prompt:**

> "Remember: Use TypeScript interfaces for data structures, types for unions. All async functions have try-catch. Services are class-based. React components use 'use client' when needed. Follow Next.js 14 App Router conventions."

---

### 5. Database Schema Patterns

**Key Models:**

```prisma
// User & Organization (Multi-tenant)
model User {
  id             String       @id @default(uuid())
  email          String       @unique
  organizationId String
  role           Role
  organization   Organization @relation(fields: [organizationId])
}

model Organization {
  id    String @id @default(uuid())
  slug  String @unique
  plan  Plan   @default(FREE)
  users User[]
}

// Bot Configuration
model Bot {
  id                String  @id @default(uuid())
  name              String
  organizationId    String
  whatsappAccountId String
  nodes             Json    // ReactFlow nodes
  edges             Json    // ReactFlow edges
  status            BotStatus
}

// Always include: id (uuid), createdAt, updatedAt
// Use enums for status fields
// JSON columns for flexible data (nodes, settings)
```

**Memory Prompt:**

> "Remember: All models use UUID primary keys. Multi-tenant with organizationId foreign key. Bots store ReactFlow data in JSON columns. Always include createdAt/updatedAt timestamps. Use Prisma enums for status fields."

---

### 6. API Patterns

**Standard Response Format:**

```typescript
// Success response
{
  success: true,
  data: any,
  meta?: {
    page: number,
    total: number
  }
}

// Error response
{
  success: false,
  error: string,
  code?: string
}
```

**Authentication Pattern:**

```typescript
// Middleware
router.use('/api/bots', authenticate, authorize(['admin', 'agent']));

// All protected routes check req.user
router.get('/api/bots', authenticate, async (req, res) => {
	const bots = await getBots(req.user.organizationId);
	res.json({ success: true, data: bots });
});
```

**Memory Prompt:**

> "Remember: API responses use {success, data/error} format. All protected routes use authenticate middleware. Always filter by req.user.organizationId for multi-tenancy. Use try-catch and return proper error responses."

---

### 7. WhatsApp Integration

**Key Endpoints:**

```typescript
// Send message
POST https://graph.facebook.com/v18.0/{phone-number-id}/messages
Body: {
  messaging_product: "whatsapp",
  to: "{recipient-phone}",
  type: "text",
  text: { body: "message" }
}

// Webhook structure
POST /api/webhooks/whatsapp
{
  object: "whatsapp_business_account",
  entry: [{
    changes: [{
      field: "messages",
      value: {
        messages: [{ id, from, timestamp, type, text }],
        statuses: [{ id, status, timestamp }]
      }
    }]
  }]
}
```

**Memory Prompt:**

> "Remember: WhatsApp API uses phone-number-id in URL. Messages require messaging_product='whatsapp'. Webhooks send nested entry/changes structure. Always verify webhook with verify_token. Mark messages as read after processing."

---

### 8. Claude AI Integration

**Usage Pattern:**

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
	apiKey: process.env.CLAUDE_API_KEY,
});

// Standard completion
const response = await anthropic.messages.create({
	model: 'claude-sonnet-4-20250514',
	max_tokens: 4000,
	temperature: 0.7,
	messages: [{ role: 'user', content: prompt }],
});

// Extract text
const text = response.content[0].text;

// For JSON responses, parse carefully
const jsonMatch = text.match(/\{[\s\S]*\}/);
const data = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
```

**Memory Prompt:**

> "Remember: Use claude-sonnet-4-20250514 model. Always set max_tokens (typically 4000). For JSON responses, extract from markdown code blocks. Use temperature 0.7 for creative tasks, 0.3 for analytical tasks. Cache expensive prompts in Redis."

---

## Memory Optimization Strategies

### 1. Use Consistent Terminology

**Bad:**

-   "User profile"
-   "Customer data"
-   "Account info"

**Good (Pick one and stick with it):**

-   "User" for all references
-   "Organization" not "Company" or "Account"
-   "Bot" not "Chatbot" or "Agent"

**Memory Prompt:**

> "Remember: Use 'User' not 'Customer'. Use 'Organization' not 'Company'. Use 'Bot' not 'Chatbot'. Use 'WhatsApp Account' for WABA. Consistent terminology across codebase."

---

### 2. Document Common Commands

**Development:**

```bash
# Start all services
docker-compose up -d

# Start frontend (http://localhost:3000)
cd apps/web && pnpm dev

# Start backend (http://localhost:3001)
cd apps/api && pnpm dev

# Database operations
cd apps/api
npx prisma migrate dev      # Create/run migration
npx prisma generate         # Generate Prisma client
npx prisma studio          # Open database GUI

# Testing
pnpm test                  # All tests
pnpm test:watch           # Watch mode
pnpm test:e2e             # E2E tests
```

**Memory Prompt:**

> "Remember: Use docker-compose for databases. Frontend runs on 3000, backend on 3001. Prisma commands run from apps/api. Use pnpm as package manager, not npm."

---

### 3. Define File Naming Patterns

**Patterns:**

```
- Components: PascalCase (BotBuilder.tsx)
- Services: camelCase with .service.ts (whatsapp.service.ts)
- Types: PascalCase with .types.ts (Bot.types.ts)
- Utils: camelCase with .util.ts (validation.util.ts)
- API routes: kebab-case (apps/api/routes/bot-builder.routes.ts)
- React pages: page.tsx (Next.js convention)
- Tests: [name].test.ts or [name].spec.ts
```

**Memory Prompt:**

> "Remember: Components are PascalCase. Services end in .service.ts. Types end in .types.ts. API routes use kebab-case. Next.js pages are always page.tsx. Tests use .test.ts or .spec.ts suffix."

---

### 4. Store Integration Credentials Structure

**Environment Variables Pattern:**

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"
REDIS_URL="redis://localhost:6379"

# WhatsApp
WHATSAPP_APP_ID="your-app-id"
WHATSAPP_APP_SECRET="your-app-secret"
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
JWT_SECRET="..."
ENCRYPTION_KEY="..."
```

**Memory Prompt:**

> "Remember: All secrets in .env file. WhatsApp config uses WHATSAPP* prefix. Claude uses CLAUDE_API_KEY. AWS uses AWS* prefix. Never commit .env files. Use .env.example for documentation."

---

## Essential Memory Items

### Quick Reference Card

Store this in memory at project start:

```markdown
# BotPe AI Quick Reference

## Project Info

-   Name: BotPe AI
-   Stack: Next.js 14 + Node.js + PostgreSQL + Prisma + Redis + Claude AI
-   Monorepo: pnpm workspace

## Ports

-   Frontend: 3000
-   Backend API: 3001
-   PostgreSQL: 5432
-   Redis: 6379

## Key Directories

-   Frontend: apps/web/
-   Backend: apps/api/
-   Database: apps/api/prisma/
-   Shared: packages/

## Database

-   ORM: Prisma
-   Main DB: PostgreSQL
-   Cache: Redis
-   Schema: apps/api/prisma/schema.prisma

## Authentication

-   Strategy: JWT with refresh tokens
-   Middleware: authenticate, authorize
-   Access: 15 min, Refresh: 7 days

## WhatsApp

-   API Version: v18.0
-   Base URL: https://graph.facebook.com/v18.0
-   Auth: Bearer token in headers
-   Webhooks: POST /api/webhooks/whatsapp

## Claude AI

-   Model: claude-sonnet-4-20250514
-   Max Tokens: 4000 (typical)
-   Temperature: 0.7 (creative), 0.3 (analytical)

## Common Commands

-   Dev: pnpm dev
-   Build: pnpm build
-   Test: pnpm test
-   DB Migrate: npx prisma migrate dev
-   DB Studio: npx prisma studio

## Code Style

-   Language: TypeScript
-   Formatter: Prettier
-   Linter: ESLint
-   Components: PascalCase
-   Files: camelCase or kebab-case
```

**How to Use:**

> At the start of each session: "Here's the project quick reference: [paste above]"

---

## Prompt Engineering for Memory

### 1. Initial Context Setting

**First Message Template:**

```
I'm working on BotPe AI, a WhatsApp automation platform.

Tech Stack:
- Frontend: Next.js 14 (apps/web)
- Backend: Node.js + Express (apps/api)
- Database: PostgreSQL + Prisma
- Cache: Redis
- AI: Claude Sonnet 4.5

Current Task: [Describe what you're building]

Please remember this context for our conversation.
```

### 2. Referencing Previous Context

**Good Prompts:**

```
✅ "Following our bot builder architecture, create a new condition node type"
✅ "Using the WhatsApp service pattern we established, add template sending"
✅ "Based on our Prisma schema, add a campaigns table"
✅ "Continue the authentication flow we started earlier"
```

**Bad Prompts:**

```
❌ "Create a condition node" (no context)
❌ "Add WhatsApp templates" (too vague)
❌ "Make a database table" (missing specifics)
```

### 3. Correcting Memory

**When Claude gets something wrong:**

```
"Correction: We use Prisma, not Mongoose.
Please update your memory and redo the solution with Prisma."

"Note: Our bot config is stored in JSON columns, not separate tables.
Remember this for future bot-related code."
```

### 4. Building on Previous Work

**Effective Chaining:**

```
Session 1: "Create the bot builder backend service"
Session 2: "Add the React frontend for the bot builder we created yesterday"
Session 3: "Now add the AI-powered bot generation feature to our bot builder"
```

---

## Memory Management

### What to Store Long-Term

✅ **Do Remember:**

-   Project architecture and structure
-   Technology choices and why
-   Code patterns and conventions
-   API schemas and endpoints
-   Database models and relationships
-   Common workflows and commands
-   Integration patterns
-   Team coding standards

❌ **Don't Remember:**

-   Temporary debugging steps
-   One-off experiments
-   Specific bug fixes (unless pattern emerges)
-   Personal TODOs (use issue tracker)
-   Sensitive data (never!)

### Memory Refresh Strategy

**Weekly:**

-   Review and update PROJECT.md
-   Update architecture decisions if changed
-   Add new patterns discovered
-   Document new integrations

**Per Feature:**

-   Document new models/tables
-   Add new API endpoints to reference
-   Update code pattern examples
-   Note any tech stack additions

### Using Memory Edits Tool

**Examples:**

```typescript
// Add memory
memory_user_edits({
	command: 'add',
	control: 'Always use Prisma for database operations, not raw SQL',
});

// Update memory
memory_user_edits({
	command: 'replace',
	line_number: 3,
	replacement: 'Bot flows use ReactFlow library version 11.x',
});

// Remove outdated memory
memory_user_edits({
	command: 'remove',
	line_number: 5,
});
```

---

## Tips for Maximum Memory Leverage

### 1. Be Explicit Early

**First conversation:**

```
"I'm starting a new project called BotPe AI. It's a WhatsApp automation
platform using Next.js 14, Node.js, PostgreSQL with Prisma, and Claude AI.

Key decisions:
- Multi-tenant architecture with organizationId
- Bot configs stored as JSON in PostgreSQL
- Real-time features via Socket.io
- Claude AI for bot generation and NLP

Please remember this context throughout our development."
```

### 2. Reference Existing Code

```
"Following the pattern in apps/api/src/services/whatsapp.service.ts,
create a template.service.ts with similar structure."

"Using the same authentication middleware we have in auth.middleware.ts,
protect the new /api/campaigns routes."
```

### 3. Build Incrementally

```
Day 1: "Create bot data model in Prisma"
Day 2: "Add bot service with CRUD operations"
Day 3: "Create bot API routes"
Day 4: "Build bot builder frontend"
Day 5: "Integrate AI bot generation"
```

Each day builds on previous context.

### 4. Create Reusable Templates

**Store in project:**

```
templates/
├── service.template.ts
├── controller.template.ts
├── api-route.template.ts
├── react-component.template.tsx
└── test.template.ts
```

**Then reference:**

```
"Using our service template, create analytics.service.ts"
```

### 5. Document Decisions

**Create DECISIONS.md:**

```markdown
# Architecture Decisions

## Why PostgreSQL over MongoDB for main DB?

-   Need ACID compliance for billing/payments
-   Relational data (users, organizations, subscriptions)
-   JSON columns handle flexible bot configs

## Why JSON columns for bot flows?

-   Flexible structure (ReactFlow format)
-   No need for separate node/edge tables
-   Faster queries (single row fetch)
-   Easier migrations

## Why Redis for job queues?

-   BullMQ integration
-   Reliable delivery
-   Rate limiting built-in
-   Persistence for critical jobs
```

**Reference:** "See DECISIONS.md for why we use PostgreSQL"

---

## Sample Memory Session

### Session Start

```
User: Let's work on BotPe AI today. I need to add template management.

Claude: Got it! For BotPe AI template management, I'll follow our established patterns:
- Database: Prisma model in schema.prisma
- Service: template.service.ts with class-based pattern
- Routes: RESTful API in /api/templates
- Frontend: Next.js component in apps/web

Based on our WhatsApp integration, templates need:
- name, category (marketing/utility/authentication)
- language, status (draft/pending/approved/rejected)
- components (header, body, footer, buttons)

Should I start with the Prisma schema?
```

### Mid-Session

```
User: Yes, create the Prisma model.

Claude: [Creates model following project conventions]

I've created the Template model following our patterns:
- UUID primary key
- organizationId for multi-tenancy
- JSON column for components (like Bot model)
- Enum for status (like we do for AccountStatus)
- Standard timestamps

Next, I can create the template.service.ts following the whatsapp.service.ts
pattern, or would you like to review this first?
```

### Session End

```
User: Great! Remember this template structure for next time.

Claude: Stored in memory:
- Template model with components as JSON
- Status enum: draft/pending/approved/rejected
- Category enum: marketing/utility/authentication
- Follows same patterns as Bot and WhatsAppAccount models

Ready to continue with the service layer next session!
```

---

## Memory Checklist

Use this checklist at project start:

-   [ ] Share PROJECT.md or create quick reference
-   [ ] Explain tech stack and why chosen
-   [ ] Show project structure
-   [ ] Define code conventions
-   [ ] Share database schema overview
-   [ ] Explain authentication pattern
-   [ ] Document API response format
-   [ ] Share common commands
-   [ ] Establish naming conventions
-   [ ] Explain multi-tenancy approach

Then periodically:

-   [ ] Update when adding new services
-   [ ] Refresh when patterns change
-   [ ] Document new integrations
-   [ ] Note architectural changes
-   [ ] Update dependencies

---

## Advanced Memory Techniques

### 1. Context Layers

```
Layer 1: Project basics (always active)
Layer 2: Current feature context (session)
Layer 3: Specific task context (current task)

Example:
L1: "BotPe AI uses Next.js and PostgreSQL"
L2: "Working on template management feature"
L3: "Creating the approval workflow function"
```

### 2. Reference Anchors

Create memorable reference points:

```
"The WhatsApp service in apps/api/src/services/whatsapp.service.ts
is our template for all services"

"The Bot model in schema.prisma shows our pattern for JSON columns"

"The authenticate middleware is our standard auth check"
```

Then reference: "Following the WhatsApp service template..."

### 3. Pattern Library

Document patterns once, reference many times:

```markdown
# patterns/service.md

## Service Pattern

class XyzService {
async create(data) { try/catch }
async get(id) { try/catch }
async update(id, data) { try/catch }
async delete(id) { try/catch }
async list(filters) { try/catch }
}
```

Reference: "Use our standard service pattern"

---

## Troubleshooting Memory Issues

### Claude Doesn't Remember

**Possible causes:**

1. Too much time between sessions
2. Context not explicit enough
3. Pattern not clearly established
4. Information spread across many messages

**Solutions:**

1. Re-establish context at session start
2. Be more explicit about patterns
3. Create reference documents
4. Use memory_user_edits tool

### Inconsistent Responses

**Fix:**

```
"Correction: We always use Prisma, never Mongoose.
Please update your memory:
- Database ORM: Prisma
- Schema location: apps/api/prisma/schema.prisma
- Commands run from: apps/api directory
Acknowledge and redo using Prisma."
```

### Lost Context Mid-Session

**Recover:**

```
"Let me re-establish context:
- Project: BotPe AI
- Current work: Template management
- Already completed: Database model and service
- Now doing: API routes
- Following pattern from: whatsapp.routes.ts

Continue with the API routes."
```

---

## Document Control

**Version:** 1.0
**Last Updated:** November 2025
**Owner:** Development Team
**Review:** As needed

---

**Summary:** Use Claude Code memory strategically by establishing clear patterns, being explicit about context, and building incrementally. Store project structure, code conventions, and architectural decisions early. Reference established patterns consistently. Update memory when patterns evolve.
