# Tasks
# BotPe AI - Development Tasks

**Last Updated**: 2025-11-07
**Status**: Planning Phase

---

## Project Setup & Infrastructure

### 1. Project Initialization
- [ ] Initialize monorepo with pnpm workspaces
- [ ] Set up TypeScript configuration
- [ ] Configure ESLint and Prettier
- [ ] Set up Git hooks (husky + lint-staged)
- [ ] Create .env.example files
- [ ] Configure VS Code workspace settings

### 2. Database Setup
- [ ] Install PostgreSQL 15 locally
- [ ] Install Redis 7 locally
- [ ] Set up Docker Compose for databases
- [ ] Initialize Prisma
- [ ] Create initial database schema
- [ ] Set up database migrations system
- [ ] Configure connection pooling

### 3. Backend Foundation (apps/api)
- [ ] Initialize Express.js server
- [ ] Set up TypeScript compilation
- [ ] Configure middleware (cors, helmet, compression)
- [ ] Set up logging (winston/pino)
- [ ] Configure error handling
- [ ] Set up environment variable validation
- [ ] Create health check endpoint

### 4. Frontend Foundation (apps/web)
- [ ] Initialize Next.js 14 with App Router
- [ ] Configure Tailwind CSS
- [ ] Set up shadcn/ui components
- [ ] Implement San Francisco font
- [ ] Configure color tokens (BotPe brand)
- [ ] Set up React Query
- [ ] Configure environment variables

---

## Authentication & Authorization

### 5. Authentication System
- [ ] Design User and Organization schema
- [ ] Implement JWT token generation
- [ ] Create refresh token mechanism
- [ ] Build /api/auth/register endpoint
- [ ] Build /api/auth/login endpoint
- [ ] Build /api/auth/refresh endpoint
- [ ] Build /api/auth/logout endpoint
- [ ] Create password hashing utilities (bcrypt)

### 6. Authorization Middleware
- [ ] Create authenticate middleware
- [ ] Create authorize middleware with RBAC
- [ ] Define permission matrix (admin/agent/viewer)
- [ ] Implement multi-tenant filtering
- [ ] Add rate limiting
- [ ] Create API key authentication for webhooks

### 7. Frontend Authentication
- [ ] Create auth context/provider
- [ ] Build login page
- [ ] Build register page
- [ ] Build forgot password flow
- [ ] Implement protected routes
- [ ] Add token refresh logic
- [ ] Handle session expiration

---

## WhatsApp Integration

### 8. WhatsApp Client Library
- [ ] Create WhatsAppClient class
- [ ] Implement sendTextMessage method
- [ ] Implement sendTemplateMessage method
- [ ] Implement sendMediaMessage method
- [ ] Implement sendInteractiveMessage method
- [ ] Implement uploadMedia method
- [ ] Implement getMediaUrl method
- [ ] Implement markAsRead method
- [ ] Add error handling and retries

### 9. WhatsApp Account Management
- [ ] Create WhatsAppAccount schema
- [ ] Build account connection flow
- [ ] Implement token encryption/decryption
- [ ] Create /api/whatsapp-accounts endpoints (CRUD)
- [ ] Build account verification
- [ ] Add phone number verification
- [ ] Create UI for account management

### 10. Webhook Handler
- [ ] Create webhook verification endpoint (GET)
- [ ] Create webhook receiver endpoint (POST)
- [ ] Implement message event handler
- [ ] Implement status update handler
- [ ] Add webhook signature verification
- [ ] Create message processing queue (BullMQ)
- [ ] Add error logging and monitoring

### 11. Message Processing
- [ ] Create message queue worker
- [ ] Implement conversation creation/retrieval
- [ ] Build message storage system
- [ ] Add media download and S3 upload
- [ ] Implement 24-hour window tracking
- [ ] Add rate limit handling

---

## Core Features

### 12. Database Schema Design
- [ ] Design complete Prisma schema
  - [ ] User, Organization, Role models
  - [ ] WhatsAppAccount, BusinessProfile models
  - [ ] Bot, BotNode, BotEdge models
  - [ ] Intent, Entity, Response models
  - [ ] Conversation, Message models
  - [ ] Template, TemplateComponent models
  - [ ] Campaign, Segment models
  - [ ] Contact, Tag models
  - [ ] Analytics models
- [ ] Create migrations
- [ ] Seed development data
- [ ] Add indexes for performance
- [ ] Set up foreign key constraints

### 13. Bot Builder Backend
- [ ] Create Bot service class
- [ ] Implement /api/bots endpoints
  - [ ] GET /bots (list)
  - [ ] POST /bots (create)
  - [ ] GET /bots/:id (get single)
  - [ ] PUT /bots/:id (update)
  - [ ] DELETE /bots/:id (delete)
  - [ ] POST /bots/:id/publish (activate)
  - [ ] POST /bots/:id/test (test with sample message)
- [ ] Implement bot validation logic
- [ ] Add bot versioning system
- [ ] Create bot cloning functionality

### 14. Bot Execution Engine
- [ ] Create BotEngine class
- [ ] Implement node execution logic
  - [ ] Message node executor
  - [ ] Condition node executor
  - [ ] AI node executor
  - [ ] API node executor
  - [ ] Action node executor
- [ ] Build conversation context manager
- [ ] Implement variable substitution
- [ ] Add fallback handling
- [ ] Create human escalation logic

### 15. Bot Builder Frontend - Canvas
- [ ] Set up ReactFlow
- [ ] Create custom node components
  - [ ] MessageNode component
  - [ ] ConditionNode component
  - [ ] AINode component
  - [ ] APINode component
  - [ ] ActionNode component
- [ ] Build node palette (drag source)
- [ ] Implement drag and drop
- [ ] Add node connection logic
- [ ] Create minimap and controls
- [ ] Add zoom and pan controls

### 16. Bot Builder Frontend - Configuration
- [ ] Create PropertyPanel component
- [ ] Build MessageNodeConfig form
- [ ] Build ConditionNodeConfig form
- [ ] Build AINodeConfig form
- [ ] Build APINodeConfig form
- [ ] Build ActionNodeConfig form
- [ ] Add variable picker
- [ ] Implement template message selector
- [ ] Create rich text editor for messages

### 17. Bot Builder Frontend - Management
- [ ] Create bot list page
- [ ] Build bot creation wizard
- [ ] Add bot testing panel
- [ ] Implement save/autosave
- [ ] Add undo/redo functionality
- [ ] Create bot duplication feature
- [ ] Build bot export/import
- [ ] Add validation warnings

---

## AI Agent System

### 18. AI Infrastructure
- [ ] Install @anthropic-ai/sdk
- [ ] Create BaseAgent abstract class
- [ ] Set up Redis caching for AI responses
- [ ] Create AgentOrchestrator class
- [ ] Implement cost tracking system
- [ ] Add monitoring and logging
- [ ] Create rate limiting for API calls

### 19. Bot Builder Agent
- [ ] Implement BotBuilderAgent class
- [ ] Create generateBot method
- [ ] Build bot flow validation
- [ ] Implement optimizeFlow method
- [ ] Create /api/agents/bot-builder endpoints
- [ ] Add frontend integration
- [ ] Build "Generate with AI" UI

### 20. Intent Recognition Agent
- [ ] Implement IntentRecognitionAgent class
- [ ] Create recognizeIntent method
- [ ] Build extractEntities method
- [ ] Add sentiment detection
- [ ] Implement urgency classification
- [ ] Create /api/agents/intent endpoints
- [ ] Integrate with bot execution

### 21. Response Generation Agent
- [ ] Implement ResponseGenerationAgent class
- [ ] Create generateResponse method
- [ ] Build personality adaptation
- [ ] Add response variation generator
- [ ] Implement tone adjustment
- [ ] Create /api/agents/response endpoints
- [ ] Integrate with bot nodes

### 22. Template Generator Agent
- [ ] Implement TemplateGeneratorAgent class
- [ ] Create generateTemplate method
- [ ] Build WhatsApp compliance validator
- [ ] Add template categorization
- [ ] Implement sample value generator
- [ ] Create /api/agents/template endpoints
- [ ] Build template AI assistant UI

### 23. Customer Support Agent
- [ ] Implement CustomerSupportAgent class
- [ ] Create suggestResponse method
- [ ] Build summarizeConversation method
- [ ] Add issue detection
- [ ] Implement action recommendations
- [ ] Create /api/agents/support endpoints
- [ ] Integrate with inbox UI

---

## Templates System

### 24. Template Management Backend
- [ ] Create Template schema
- [ ] Build /api/templates endpoints (CRUD)
- [ ] Implement template submission to WhatsApp
- [ ] Add template status webhook handler
- [ ] Create template approval tracking
- [ ] Build template versioning

### 25. Template Management Frontend
- [ ] Create template list page
- [ ] Build template creation form
- [ ] Add component builders (header/body/footer/buttons)
- [ ] Implement variable insertion
- [ ] Create template preview
- [ ] Add sample value testing
- [ ] Build template approval status display

---

## Inbox & Conversations

### 26. Conversation Management Backend
- [ ] Create Conversation and Message schemas
- [ ] Build /api/conversations endpoints
  - [ ] GET /conversations (list with filters)
  - [ ] GET /conversations/:id (get with messages)
  - [ ] POST /conversations/:id/messages (send message)
  - [ ] PATCH /conversations/:id/assign (assign to agent)
  - [ ] PATCH /conversations/:id/status (update status)
  - [ ] POST /conversations/:id/tags (add tags)
- [ ] Implement conversation search
- [ ] Add message pagination
- [ ] Create contact merging logic

### 27. Real-time Communication
- [ ] Set up Socket.io server
- [ ] Implement authentication middleware
- [ ] Create room management (user, org, conversation)
- [ ] Build message sync events
- [ ] Add typing indicators
- [ ] Implement presence system
- [ ] Create notification system

### 28. Inbox Frontend
- [ ] Build inbox layout (sidebar + chat)
- [ ] Create conversation list component
- [ ] Build message thread component
- [ ] Add message composer
- [ ] Implement file upload for media
- [ ] Create quick replies component
- [ ] Build conversation filters
- [ ] Add search functionality
- [ ] Implement AI suggestions panel
- [ ] Add conversation assignment UI
- [ ] Create tag management UI

---

## Campaign System

### 29. Segment Management
- [ ] Create Segment schema
- [ ] Build /api/segments endpoints (CRUD)
- [ ] Implement dynamic segmentation logic
- [ ] Add contact filtering
- [ ] Create segment preview
- [ ] Build segment export

### 30. Campaign Management Backend
- [ ] Create Campaign schema
- [ ] Build /api/campaigns endpoints (CRUD)
- [ ] Implement campaign scheduling
- [ ] Create message sending queue
- [ ] Add rate limiting per phone number
- [ ] Implement campaign analytics tracking
- [ ] Build campaign reporting

### 31. Campaign Management Frontend
- [ ] Create campaign list page
- [ ] Build campaign creation wizard
- [ ] Add audience selection UI
- [ ] Implement template selection
- [ ] Create scheduling interface
- [ ] Build A/B testing UI
- [ ] Add campaign analytics dashboard
- [ ] Create campaign reports

---

## Analytics & Reporting

### 32. Analytics Backend
- [ ] Create analytics event tracking
- [ ] Build aggregation queries
- [ ] Implement /api/analytics endpoints
  - [ ] GET /analytics/overview
  - [ ] GET /analytics/bots/:id
  - [ ] GET /analytics/campaigns/:id
  - [ ] GET /analytics/conversations
  - [ ] GET /analytics/templates
- [ ] Create daily/weekly/monthly reports
- [ ] Add export functionality (CSV/PDF)

### 33. Analytics Frontend
- [ ] Build dashboard page
- [ ] Create overview cards (KPIs)
- [ ] Add charts (Chart.js or Recharts)
  - [ ] Message volume chart
  - [ ] Response time chart
  - [ ] Bot performance chart
  - [ ] Campaign performance chart
- [ ] Build bot analytics page
- [ ] Create conversation analytics
- [ ] Add funnel visualization

---

## Contact Management

### 34. Contact System Backend
- [ ] Create Contact schema
- [ ] Build /api/contacts endpoints (CRUD)
- [ ] Implement contact import (CSV)
- [ ] Add contact deduplication
- [ ] Create custom field system
- [ ] Build contact export
- [ ] Add GDPR compliance (data deletion)

### 35. Contact System Frontend
- [ ] Create contact list page
- [ ] Build contact detail page
- [ ] Add contact creation form
- [ ] Implement bulk import UI
- [ ] Create custom field manager
- [ ] Build contact search
- [ ] Add contact segments view

---

## Settings & Configuration

### 36. Organization Settings
- [ ] Create /api/settings endpoints
- [ ] Build business hours configuration
- [ ] Add timezone settings
- [ ] Implement branding customization
- [ ] Create webhook management
- [ ] Add API key management

### 37. User Management
- [ ] Build /api/users endpoints (CRUD)
- [ ] Create team invitation system
- [ ] Add role assignment UI
- [ ] Implement user permissions
- [ ] Build user activity logs

### 38. Settings Frontend
- [ ] Create settings navigation
- [ ] Build general settings page
- [ ] Add WhatsApp accounts page
- [ ] Create team members page
- [ ] Build billing page (placeholder)
- [ ] Add integrations page
- [ ] Create API keys page

---

## Testing

### 39. Backend Testing
- [ ] Set up Vitest
- [ ] Write unit tests for services
  - [ ] Auth service tests
  - [ ] Bot engine tests
  - [ ] WhatsApp client tests
  - [ ] Agent tests
- [ ] Write integration tests for API
  - [ ] Auth endpoints
  - [ ] Bot endpoints
  - [ ] Conversation endpoints
  - [ ] Campaign endpoints
- [ ] Add test coverage reporting
- [ ] Create test database setup

### 40. Frontend Testing
- [ ] Set up Vitest + React Testing Library
- [ ] Write component tests
  - [ ] Bot builder tests
  - [ ] Inbox tests
  - [ ] Campaign tests
- [ ] Add E2E tests with Playwright
  - [ ] Authentication flow
  - [ ] Bot creation flow
  - [ ] Message sending flow
  - [ ] Campaign creation flow

---

## Security & Performance

### 41. Security Implementation
- [ ] Implement encryption for sensitive data
- [ ] Add SQL injection prevention (Prisma handles)
- [ ] Create XSS prevention
- [ ] Add CSRF protection
- [ ] Implement content security policy
- [ ] Add request validation (Zod)
- [ ] Create security headers middleware

### 42. Performance Optimization
- [ ] Add Redis caching layer
- [ ] Implement database query optimization
- [ ] Add CDN for static assets
- [ ] Create image optimization pipeline
- [ ] Implement lazy loading
- [ ] Add code splitting
- [ ] Create database indexes
- [ ] Set up connection pooling

---

## Deployment & DevOps

### 43. Docker Configuration
- [ ] Create Dockerfile for backend
- [ ] Create Dockerfile for frontend
- [ ] Set up docker-compose for development
- [ ] Configure production docker-compose
- [ ] Add nginx configuration
- [ ] Create SSL setup

### 44. CI/CD Pipeline
- [ ] Set up GitHub Actions
- [ ] Create test workflow
- [ ] Add build workflow
- [ ] Implement deployment workflow
- [ ] Add environment variables management
- [ ] Create staging environment

### 45. Monitoring & Logging
- [ ] Set up error tracking (Sentry)
- [ ] Add performance monitoring
- [ ] Create log aggregation
- [ ] Add uptime monitoring
- [ ] Create alert system
- [ ] Build admin dashboard for metrics

---

## Documentation

### 46. API Documentation
- [ ] Set up Swagger/OpenAPI
- [ ] Document all API endpoints
- [ ] Add request/response examples
- [ ] Create authentication guide
- [ ] Add webhook documentation

### 47. User Documentation
- [ ] Create user guide
- [ ] Build bot building tutorials
- [ ] Add template creation guide
- [ ] Create campaign guide
- [ ] Write troubleshooting docs

---

## Future Enhancements (Post-MVP)

### Phase 2 Features
- [ ] WhatsApp Flow Builder
- [ ] Advanced analytics with AI insights
- [ ] Multi-language support
- [ ] WhatsApp Commerce integration
- [ ] Advanced automation rules
- [ ] Integration marketplace
- [ ] Mobile app (React Native)
- [ ] Voice message support
- [ ] Video message support
- [ ] Payment integration

---

## Task Organization

### Priority Levels
- **P0 (Critical)**: Must have for MVP
- **P1 (High)**: Important for good UX
- **P2 (Medium)**: Nice to have
- **P3 (Low)**: Future enhancement

### Status Tags
- **Not Started**: ⚪
- **In Progress**: 🟡
- **Completed**: ✅
- **Blocked**: 🔴
- **Testing**: 🔵

---

## Estimated Timeline

**MVP Development**: 12-16 weeks

### Weeks 1-2: Foundation
- Project setup
- Database schema
- Authentication

### Weeks 3-4: WhatsApp Integration
- WhatsApp client
- Webhook handling
- Message processing

### Weeks 5-7: Bot Builder
- Backend bot engine
- Frontend canvas
- Node configuration

### Weeks 8-10: AI Agents
- 5 core agents
- API integration
- Frontend integration

### Weeks 11-12: Inbox & Templates
- Conversation management
- Template system
- Real-time sync

### Weeks 13-14: Campaigns
- Campaign system
- Segment management
- Analytics

### Weeks 15-16: Testing & Polish
- Comprehensive testing
- Bug fixes
- Performance optimization
- Documentation

---

## Notes

- All tasks should update this file when status changes
- Add blockers and dependencies as comments
- Link related PRs and issues
- Update timeline estimates as needed
