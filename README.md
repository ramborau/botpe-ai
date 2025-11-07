# 🤖 BotPe AI - WhatsApp Automation Platform

**Status**: 🚧 In Active Development (15% Complete)
**Started**: Nov 7, 2025
**Target MVP**: Feb 2025
**Tech Stack**: Next.js 14, Node.js, PostgreSQL, Prisma, Redis, Claude AI

---

## 🎯 Project Overview

BotPe AI is a comprehensive WhatsApp automation and bot creation platform powered by AI. Create intelligent bots using drag-and-drop flow builder or natural language, manage conversations in a real-time inbox, and run targeted broadcast campaigns.

### Core Features (MVP)
- ✨ **Visual Bot Builder** - Drag-and-drop conversation flow designer
- 🤖 **AI-Powered Bot Generation** - Create bots from natural language descriptions
- 💬 **Smart Inbox** - Real-time conversation management with AI assistance
- 📢 **Broadcast Campaigns** - Targeted messaging to segmented audiences
- 📊 **Analytics Dashboard** - Track performance and user engagement

---

## 🏗️ Current Status

### ✅ Completed (Week 1 - Day 1)
- [x] Monorepo structure with pnpm workspaces
- [x] Comprehensive Prisma database schema (11 models)
- [x] Express backend foundation with TypeScript
- [x] Docker Compose for PostgreSQL & Redis
- [x] Environment configuration
- [x] Logger and database config
- [x] Backend dependencies installed

### 🔨 In Progress
- [ ] Authentication system (JWT + bcrypt)
- [ ] WhatsApp API client integration
- [ ] Next.js frontend initialization

### 📅 Next Week
- [ ] Bot builder backend
- [ ] AI agent system (5 core agents)
- [ ] Frontend UI components

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React Query (TanStack Query)
- **Realtime**: Socket.io Client
- **Bot Canvas**: ReactFlow

### Backend
- **Runtime**: Node.js 20 + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Cache**: Redis 7
- **Queue**: BullMQ
- **Realtime**: Socket.io Server

### AI & Automation
- **AI Model**: Claude Sonnet 4.5
- **SDK**: @anthropic-ai/sdk
- **WhatsApp**: WhatsApp Business API v18.0
- **Payment**: Razorpay

### DevOps
- **Package Manager**: pnpm
- **Containers**: Docker + Docker Compose
- **Deployment**: AWS (EC2, RDS, S3)
- **CI/CD**: GitHub Actions
- **Monitoring**: Winston (logging)

---

## 🚀 Getting Started

### Prerequisites
```bash
node >= 18.0.0
pnpm >= 8.0.0
docker >= 20.0.0
postgresql >= 15
redis >= 7
```

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd BotPeAI
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Start databases**
```bash
docker compose up -d
```

4. **Setup environment**
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
# Edit .env files with your credentials
```

5. **Setup database**
```bash
cd apps/api
pnpm prisma:generate
pnpm prisma:push
pnpm prisma:seed
```

6. **Start development servers**
```bash
# Terminal 1 - Backend
cd apps/api
pnpm dev

# Terminal 2 - Frontend
cd apps/web
pnpm dev
```

7. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Health: http://localhost:3001/health
- Prisma Studio: `pnpm prisma:studio`

---

## 📁 Project Structure

```
BotPeAI/
├── apps/
│   ├── web/              # Next.js frontend (Port 3000)
│   ├── api/              # Express backend (Port 3001)
│   └── admin/            # Admin dashboard (future)
├── packages/
│   ├── ui/               # Shared UI components
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Shared utilities
├── services/
│   ├── ai/               # AI agents & Claude integration
│   └── whatsapp/         # WhatsApp Business API client
├── docker-compose.yml    # Development databases
├── pnpm-workspace.yaml   # Monorepo configuration
└── TEAM_ASSIGNMENTS.md   # AI agent team assignments
```

---

## 🤖 AI Agent Team

Our development is powered by 6 specialized AI agents:

1. **ATLAS** - Infrastructure & DevOps
2. **MERCURY** - Backend Development
3. **AURORA** - Frontend Development
4. **SAGE** - AI & Intelligence
5. **GUARDIAN** - Security & Authentication
6. **VELOCITY** - Performance Optimization

See [TEAM_ASSIGNMENTS.md](./TEAM_ASSIGNMENTS.md) for detailed task allocation.

---

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Architecture guide for Claude Code
- **[AGENTS_SYSTEM.md](./AGENTS_SYSTEM.md)** - AI agents specification
- **[TASKS.md](./TASKS.md)** - Complete task breakdown (600+ tasks)
- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide
- **[TEAM_ASSIGNMENTS.md](./TEAM_ASSIGNMENTS.md)** - Current sprint assignments
- **[prd.md](./prd.md)** - Product requirements document
- **[tech.md](./tech.md)** - Technical specification
- **[how.md](./how.md)** - Implementation guide
- **[agents.md](./agents.md)** - AI agents documentation
- **[memory.md](./memory.md)** - Claude Code memory strategies
- **[mcp.md](./mcp.md)** - MCP servers documentation
- **[uirules.md](./uirules.md)** - UI/UX guidelines

---

## 🔐 Environment Variables

See `.env.example` files in each app directory for required environment variables.

### Key Variables
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `CLAUDE_API_KEY` - Claude AI API key
- `JWT_SECRET` - JWT signing secret
- `WHATSAPP_*` - WhatsApp Business API credentials
- `RAZORPAY_*` - Payment gateway credentials
- `AWS_*` - AWS S3 credentials

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:coverage
```

---

## 📈 Progress Tracking

**Overall**: 15%

- Infrastructure: 80% ✅
- Backend Core: 30% 🟡
- Authentication: 0% ⚪
- WhatsApp Integration: 0% ⚪
- Bot System: 0% ⚪
- AI Agents: 0% ⚪
- Frontend: 0% ⚪
- Deployment: 0% ⚪

---

## 🤝 Contributing

This is currently a private project. Contribution guidelines will be added when open-sourced.

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🔗 Links

- **Documentation**: [See docs folder]
- **API Documentation**: Coming soon
- **Demo**: Coming soon
- **Website**: Coming soon

---

## 📞 Support

For questions or issues, contact the development team.

---

**Built with ❤️ by the BotPe AI Team**

*Powered by Claude AI, Next.js, and WhatsApp Business API*
