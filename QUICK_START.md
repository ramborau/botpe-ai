# Quick Start
# BotPe AI - Immediate Action Plan (START NOW)

**Updated**: 2025-11-07
**Solo Developer**: Optimized workflow
**Timeline**: Aggressive (start immediately)
**Priority**: Bot Builder + AI + Inbox + Campaigns

---

## 🚀 TODAY - Get Development Environment Running (Day 1)

### Step 1: Install Prerequisites (30 min)

```bash
# Check if installed, install if missing:
node --version  # Need v18 or v20
pnpm --version  # If not installed: npm install -g pnpm
docker --version  # Download from docker.com if missing
psql --version  # PostgreSQL client
redis-cli --version  # Redis client
```

### Step 2: Initialize Project Structure (30 min)

```bash
cd /Users/rahul/BULID/BotPeAI

# Initialize pnpm workspace
pnpm init

# Create workspace structure
mkdir -p apps/web apps/api packages/ui packages/types packages/utils services/ai services/whatsapp

# Initialize apps
cd apps/web && pnpx create-next-app@latest . --typescript --tailwind --app --no-src-dir
cd ../api && pnpm init

# Setup monorepo workspace
# Create pnpm-workspace.yaml in root
```

**pnpm-workspace.yaml**:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'
```

### Step 3: Start Databases with Docker (15 min)

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: botpe
      POSTGRES_PASSWORD: dev_password_123
      POSTGRES_DB: botpe_dev
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    restart: always
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

```bash
# Start databases
docker-compose up -d

# Verify they're running
docker ps
psql -h localhost -U botpe -d botpe_dev  # password: dev_password_123
redis-cli ping  # Should return PONG
```

### Step 4: Backend Setup (1 hour)

```bash
cd apps/api

# Install dependencies
pnpm add express cors helmet compression dotenv
pnpm add @prisma/client
pnpm add -D typescript @types/node @types/express tsx nodemon prisma

# Initialize TypeScript
pnpx tsc --init

# Initialize Prisma
pnpx prisma init
```

**apps/api/.env**:
```
DATABASE_URL="postgresql://botpe:dev_password_123@localhost:5432/botpe_dev"
REDIS_URL="redis://localhost:6379"
PORT=3001
NODE_ENV=development
JWT_SECRET="dev_super_secret_jwt_key_change_in_production"
ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
```

**apps/api/src/index.ts** (basic Express server):
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});
```

**apps/api/package.json** scripts:
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

```bash
# Test backend
pnpm dev
# Visit http://localhost:3001/health
```

### Step 5: Frontend Setup (1 hour)

```bash
cd apps/web

# Install additional dependencies
pnpm add @tanstack/react-query axios socket.io-client
pnpm add -D @types/node

# Install shadcn/ui
pnpx shadcn-ui@latest init
# Choose: Default style, San Francisco font
```

**apps/web/.env.local**:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

**apps/web/tailwind.config.ts** - Add BotPe colors:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00c307',
        'primary-foreground': '#ffffff',
        secondary: '#128c7e',
        'secondary-foreground': '#ffffff',
        dark: '#075e54',
        light: '#dcf8c6',
        'light-2': '#ece5dd',
      },
    },
  },
  plugins: [],
};
export default config;
```

```bash
# Start frontend
pnpm dev
# Visit http://localhost:3000
```

---

## ⚡ WEEK 1 - Core Foundation (Days 1-7)

### Day 1: Environment ✅ (DONE ABOVE)
- [x] Project structure
- [x] Databases running
- [x] Backend server
- [x] Frontend app

### Day 2: Database Schema & Prisma

**File**: `apps/api/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Organization {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  plan        Plan     @default(FREE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  users            User[]
  whatsappAccounts WhatsAppAccount[]
  bots             Bot[]
  conversations    Conversation[]
  templates        Template[]
  campaigns        Campaign[]
  contacts         Contact[]
}

enum Plan {
  FREE
  STARTER
  PROFESSIONAL
  ENTERPRISE
}

model User {
  id             String   @id @default(uuid())
  email          String   @unique
  passwordHash   String
  name           String
  role           Role     @default(AGENT)
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([organizationId])
}

enum Role {
  ADMIN
  AGENT
  VIEWER
}

model WhatsAppAccount {
  id                  String   @id @default(uuid())
  organizationId      String
  organization        Organization @relation(fields: [organizationId], references: [id])
  wabaId              String
  phoneNumberId       String
  displayPhoneNumber  String
  accessTokenEncrypted String
  status              AccountStatus @default(PENDING)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  bots         Bot[]
  conversations Conversation[]
  templates    Template[]
  campaigns    Campaign[]

  @@index([organizationId])
}

enum AccountStatus {
  ACTIVE
  PENDING
  SUSPENDED
}

model Bot {
  id                String   @id @default(uuid())
  name              String
  description       String?
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id])
  whatsappAccountId String
  whatsappAccount   WhatsAppAccount @relation(fields: [whatsappAccountId], references: [id])
  status            BotStatus @default(DRAFT)
  nodes             Json
  edges             Json
  variables         Json     @default("[]")
  entryNodeId       String?
  personality       Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  conversations Conversation[]

  @@index([organizationId])
  @@index([whatsappAccountId])
}

enum BotStatus {
  DRAFT
  ACTIVE
  PAUSED
}

model Conversation {
  id                String   @id @default(uuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id])
  whatsappAccountId String
  whatsappAccount   WhatsAppAccount @relation(fields: [whatsappAccountId], references: [id])
  phoneNumber       String
  contactId         String?
  contact           Contact? @relation(fields: [contactId], references: [id])
  botId             String?
  bot               Bot? @relation(fields: [botId], references: [id])
  assignedToId      String?
  status            ConversationStatus @default(OPEN)
  contextData       Json     @default("{}")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  lastMessageAt     DateTime @default(now())

  messages Message[]

  @@index([organizationId])
  @@index([whatsappAccountId])
  @@index([phoneNumber])
}

enum ConversationStatus {
  OPEN
  PENDING
  RESOLVED
  CLOSED
}

model Message {
  id             String   @id @default(uuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  direction      Direction
  type           String
  content        Json
  status         MessageStatus @default(SENT)
  waMessageId    String?
  sentById       String?
  createdAt      DateTime @default(now())

  @@index([conversationId])
  @@index([waMessageId])
}

enum Direction {
  INCOMING
  OUTGOING
}

enum MessageStatus {
  SENT
  DELIVERED
  READ
  FAILED
}

model Contact {
  id             String   @id @default(uuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  phoneNumber    String
  name           String?
  email          String?
  customFields   Json     @default("{}")
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  conversations Conversation[]

  @@unique([organizationId, phoneNumber])
  @@index([organizationId])
}

model Template {
  id                String   @id @default(uuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id])
  whatsappAccountId String
  whatsappAccount   WhatsAppAccount @relation(fields: [whatsappAccountId], references: [id])
  name              String
  category          TemplateCategory
  language          String   @default("en")
  status            TemplateStatus @default(DRAFT)
  components        Json
  waTemplateId      String?
  rejectionReason   String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  campaigns Campaign[]

  @@index([organizationId])
  @@index([whatsappAccountId])
}

enum TemplateCategory {
  MARKETING
  UTILITY
  AUTHENTICATION
}

enum TemplateStatus {
  DRAFT
  PENDING
  APPROVED
  REJECTED
}

model Campaign {
  id                String   @id @default(uuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id])
  whatsappAccountId String
  whatsappAccount   WhatsAppAccount @relation(fields: [whatsappAccountId], references: [id])
  templateId        String
  template          Template @relation(fields: [templateId], references: [id])
  name              String
  status            CampaignStatus @default(DRAFT)
  scheduledAt       DateTime?
  sentCount         Int      @default(0)
  deliveredCount    Int      @default(0)
  readCount         Int      @default(0)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([organizationId])
}

enum CampaignStatus {
  DRAFT
  SCHEDULED
  RUNNING
  COMPLETED
  PAUSED
}
```

```bash
# Generate Prisma client and create database
cd apps/api
pnpx prisma generate
pnpx prisma db push

# Open Prisma Studio to view database
pnpx prisma studio
```

### Day 3: Authentication System

Create these files in `apps/api/src/`:

**auth/auth.service.ts**:
```typescript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuthService {
  async register(data: { email: string; password: string; name: string; organizationName: string }) {
    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create organization and user in transaction
    const result = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: data.organizationName,
          slug: data.organizationName.toLowerCase().replace(/\s+/g, '-'),
        },
      });

      const user = await tx.user.create({
        data: {
          email: data.email,
          passwordHash,
          name: data.name,
          role: 'ADMIN',
          organizationId: org.id,
        },
      });

      return { user, org };
    });

    const accessToken = this.generateAccessToken(result.user);
    const refreshToken = this.generateRefreshToken(result.user.id);

    return {
      user: { ...result.user, passwordHash: undefined },
      organization: result.org,
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new Error('Invalid credentials');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user: { ...user, passwordHash: undefined },
      accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(user: any): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
  }
}
```

**middleware/authenticate.ts**:
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

### Days 4-7: Continue with WhatsApp Integration + Basic Bot System

---

## 📊 PROJECT STATUS TRACKING

I've created comprehensive documentation:

✅ **CLAUDE.md** - Architecture guide for AI development
✅ **AGENTS_SYSTEM.md** - AI agent specifications
✅ **TASKS.md** - Complete task breakdown (47 sections, 600+ tasks)
✅ **QUICK_START.md** - THIS FILE (immediate actions)

---

## 🎯 CRITICAL PRIORITIES (THIS WEEK)

Based on your requirements:
- ✅ AWS deployment target
- ✅ Embedded WhatsApp signup flow
- ✅ Cost-optimized AI (Redis caching strategy)
- ✅ All 4 MVP features (Bot Builder, AI Gen, Inbox, Campaigns)
- ✅ Razorpay integration needed
- ✅ Full seed data for development

---

## 📝 WHAT TO DO NEXT?

**Option 1**: Start implementing Day 1 setup right now
**Option 2**: Ask me to start coding specific features
**Option 3**: Request clarification on any technical decisions

**I'm ready to start writing code immediately. What would you like me to build first?**
