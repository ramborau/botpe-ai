# BotPe AI - MCP Servers & Context7 Documentation

## Document Overview

This document lists all technology stacks needed for BotPe AI with links to their Model Context Protocol (MCP) servers and documentation on Context7.com. Use these resources to get up-to-date documentation for your AI coding assistants.

---

## Table of Contents

1. [Core MCP Servers](#1-core-mcp-servers)
2. [Frontend Technologies](#2-frontend-technologies)
3. [Backend Technologies](#3-backend-technologies)
4. [Databases & Storage](#4-databases--storage)
5. [AI & Machine Learning](#5-ai--machine-learning)
6. [DevOps & Infrastructure](#6-devops--infrastructure)
7. [Third-Party Services](#7-third-party-services)
8. [Development Tools](#8-development-tools)
9. [How to Use MCPs](#9-how-to-use-mcps)

---

## 1. Core MCP Servers

### Model Context Protocol (Official)

-   **Description:** Official MCP specification and protocol schema
-   **Context7 URL:** https://context7.com/modelcontextprotocol/modelcontextprotocol
-   **GitHub:** https://github.com/modelcontextprotocol/modelcontextprotocol
-   **Tokens:** 220,186
-   **Use Cases:** Understanding MCP protocol, building custom servers
-   **Status:** ✅ Available

### MCP Servers Collection

-   **Description:** Reference implementations and community-built MCP servers
-   **Context7 URL:** https://context7.com/modelcontextprotocol/servers
-   **GitHub:** https://github.com/modelcontextprotocol/servers
-   **Tokens:** 20,315
-   **Snippets:** 113
-   **Includes:**
    -   File system server
    -   GitHub integration
    -   Google Drive integration
    -   Database connectors
    -   Web scraping tools
-   **Status:** ✅ Available

### MCP Python SDK

-   **Description:** Python implementation for building MCP servers and clients
-   **Context7 URL:** https://context7.com/modelcontextprotocol/python-sdk
-   **GitHub:** https://github.com/modelcontextprotocol/python-sdk
-   **Tokens:** 27,993
-   **Snippets:** 119
-   **Use Cases:** Building Python-based MCP servers
-   **Status:** ✅ Available

### FastMCP

-   **Description:** Fast Python framework for building MCP servers
-   **Context7 URL:** https://context7.com/jlowin/fastmcp
-   **GitHub:** https://github.com/jlowin/fastmcp
-   **Tokens:** 196,787
-   **Snippets:** 1,218
-   **Use Cases:** Rapid MCP server development
-   **Status:** ✅ Available

### MCP Inspector

-   **Description:** Developer tool for testing and debugging MCP servers
-   **Context7 URL:** https://context7.com/modelcontextprotocol/inspector
-   **GitHub:** https://github.com/modelcontextprotocol/inspector
-   **Tokens:** 6,858
-   **Use Cases:** Testing MCP implementations
-   **Status:** ✅ Available

---

## 2. Frontend Technologies

### Next.js

-   **Description:** React framework for production with server-side rendering
-   **Context7 URL:** https://context7.com/vercel/next.js
-   **GitHub:** https://github.com/vercel/next.js
-   **Official Docs:** https://nextjs.org/docs
-   **Tokens:** Available
-   **Use Cases:** Main web application, admin dashboard
-   **Priority:** P0 (Critical)
-   **Status:** ✅ Available

### React

-   **Description:** JavaScript library for building user interfaces
-   **Context7 URL:** https://context7.com/websites/react_dev/llms.txt
-   **Official Docs:** https://react.dev
-   **Use Cases:** UI components, state management
-   **Priority:** P0 (Critical)
-   **Status:** ✅ Available

### Tailwind CSS

-   **Description:** Utility-first CSS framework
-   **Context7 URL:** https://context7.com/tailwindlabs/tailwindcss.com
-   **GitHub:** https://github.com/tailwindlabs/tailwindcss.com
-   **Tokens:** 559,289
-   **Snippets:** 1,747
-   **Use Cases:** Styling, responsive design
-   **Priority:** P0 (Critical)
-   **Status:** ✅ Available

### ReactFlow

-   **Description:** Library for building node-based editors and interactive diagrams
-   **Context7 URL:** https://context7.com/websites/reactflow_dev/llms.txt
-   **GitHub:** https://github.com/xyflow/xyflow
-   **Official Docs:** https://reactflow.dev
-   **Use Cases:** Bot builder, flow designer, automation builder
-   **Priority:** P0 (Critical)
-   **Status:** ✅ Available

### shadcn/ui

-   **Description:** Re-usable components built with Radix UI and Tailwind
-   **MCP URL:** https://www.shadcn.io/api/mcp
-   **GitHub:** https://github.com/shadcnio/react-shadcn-components
-   **Official Docs:** https://www.shadcn.io/
-   **Use Cases:** UI component library
-   **Priority:** P1 (High)
-   **Status:** ✅ Available

### Radix UI

-   **Description:** Unstyled, accessible component library
-   **Context7 URL:** Search for "radix-ui" on context7.com
-   **GitHub:** https://github.com/radix-ui/primitives
-   **Official Docs:** https://www.radix-ui.com
-   **Use Cases:** Headless UI components
-   **Priority:** P1 (High)
-   **Status:** ⚠️ Check context7.com or add manually

### Framer Motion

-   **Description:** Animation library for React
-   **Context7 URL:** Search for "framer/motion" on context7.com
-   **GitHub:** https://github.com/framer/motion
-   **Official Docs:** https://www.framer.com/motion
-   **Use Cases:** Animations, transitions
-   **Priority:** P2 (Medium)
-   **Status:** ⚠️ Check context7.com or add manually

---

## 3. Backend Technologies

### Node.js

-   **Description:** JavaScript runtime built on Chrome's V8 engine
-   **Context7 URL:** https://context7.com/nodejs/node/llms.txt
-   **Official Docs:** https://nodejs.org/docs
-   **Use Cases:** Backend server, API
-   **Priority:** P0 (Critical)
-   **Status:** ✅ Available

### Express.js

-   **Description:** Fast, unopinionated web framework for Node.js
-   **Context7 URL:** https://context7.com/websites/expressjs_en/llms.txt
-   **GitHub:** https://github.com/expressjs/express
-   **Official Docs:** https://expressjs.com
-   **Use Cases:** REST API, middleware
-   **Priority:** P0 (Critical)
-   **Status:** ✅ Available

### Hono

-   **Description:** Ultra-fast web framework (alternative to Express)
-   **Context7 URL:** https://context7.com/honojs/website
-   **GitHub:** https://github.com/honojs/website
-   **Tokens:** 151,521
-   **Snippets:** 656
-   **Use Cases:** Alternative fast API framework
-   **Priority:** P2 (Alternative)
-   **Status:** ✅ Available

### Socket.io

-   **Description:** Real-time bidirectional event-based communication
-   **Context7 URL:** https://context7.com/socketio/socket.io/llms.txt
-   **GitHub:** https://github.com/socketio/socket.io
-   **Official Docs:** https://socket.io/docs
-   **Use Cases:** Real-time inbox, typing indicators, live updates
-   **Priority:** P0 (Critical)
-   **Status:** ✅ Available

### Prisma

-   **Description:** Next-generation ORM for Node.js and TypeScript
-   **Context7 URL:** Search for "prisma/prisma" on context7.com
-   **GitHub:** https://github.com/prisma/prisma
-   **Official Docs:** https://www.prisma.io/docs
-   **Use Cases:** Database ORM, migrations
-   **Priority:** P0 (Critical)
-   **Status:** ✅ Available

---

## 4. Databases & Storage

### PostgreSQL

-   **Description:** Powerful, open-source relational database
-   **Context7 URL:** https://context7.com/postgres/postgres/llms.txt
-   **Official Docs:** https://www.postgresql.org/docs
-   **MCP Server:** Available in modelcontextprotocol/servers
-   **Use Cases:** Primary database for users, bots, templates
-   **Priority:** P0 (Critical)
-   **Status:** ✅ MCP Server Available

### Redis

-   **Description:** In-memory data structure store
-   **Context7 URL:** https://context7.com/websites/redis_io/llms.txt
-   **Official Docs:** https://redis.io/docs
-   **MCP Server:** Check modelcontextprotocol/servers
-   **Use Cases:** Caching, sessions, job queues
-   **Priority:** P0 (Critical)
-   **Status:** ✅ MCP Server Available

### MongoDB

-   **Description:** NoSQL document database
-   **Context7 URL:** https://context7.com/mongodb/docs
-   **GitHub:** https://github.com/mongodb/docs
-   **Tokens:** 1,467,030
-   **Snippets:** 10,367
-   **Use Cases:** Conversation logs, analytics
-   **Priority:** P1 (High)
-   **Status:** ✅ Available

### Upstash (Redis/Kafka)

-   **Description:** Serverless data platform for Redis and Kafka
-   **Context7 URL:** https://context7.com/upstash/docs
-   **GitHub:** https://github.com/upstash/docs
-   **Use Cases:** Serverless Redis, message queues
-   **Priority:** P2 (Alternative)
-   **Status:** ✅ Available

### AWS S3

-   **Description:** Object storage service
-   **Context7 URL:** Search for "aws-sdk" on context7.com
-   **Official Docs:** https://docs.aws.amazon.com/s3
-   **Use Cases:** Media storage (images, videos, documents)
-   **Priority:** P0 (Critical)
-   **Status:** ⚠️ Check context7.com or add manually

---

## 5. AI & Machine Learning

### Claude AI (Anthropic)

-   **Description:** Advanced language model for AI-powered features
-   **Context7 URL:** Search for "anthropic" on context7.com
-   **Official Docs:** https://docs.anthropic.com
-   **Claude Code:** https://context7.com/anthropics/claude-code
-   **Anthropic Skills:** https://context7.com/anthropics/skills
-   **Use Cases:** Bot generation, intent recognition, response generation
-   **Priority:** P0 (Critical)
-   **Status:** ✅ Related docs available

### OpenAI

-   **Description:** Advanced language model for AI-powered features
-   **Context7 URL:** https://context7.com/websites/platform_openai/llms.txt
-   **Official Docs:** https://platform.openai.com/docs/overview
-   **Use Cases:** Bot generation, intent recognition, response generation
-   **Priority:** P0 (Critical)
-   **Status:** ✅ Related docs available

### Claude SDK

-   **Description:** TypeScript/JavaScript SDK for Claude API
-   **NPM:** @anthropic-ai/sdk
-   **Context7 URL:** Search for "anthropic-ai/sdk" on context7.com
-   **Official Docs:** https://github.com/anthropics/anthropic-sdk-typescript
-   **Use Cases:** Integrating Claude AI
-   **Priority:** P0 (Critical)
-   **Status:** ⚠️ Check context7.com or add manually

---

## 6. DevOps & Infrastructure

### Docker

-   **Description:** Containerization platform
-   **Context7 URL:** Search for "docker" on context7.com
-   **Official Docs:** https://docs.docker.com
-   **Use Cases:** Development environment, deployment
-   **Priority:** P0 (Critical)
-   **Status:** ⚠️ Check context7.com

### Kubernetes

-   **Description:** Container orchestration system
-   **Context7 URL:** Search for "kubernetes" on context7.com
-   **Official Docs:** https://kubernetes.io/docs
-   **Use Cases:** Production scaling, container management
-   **Priority:** P1 (High)
-   **Status:** ⚠️ Check context7.com

### GitHub

-   **Description:** Version control and collaboration platform
-   **Context7 URL:** Multiple GitHub-related resources available
-   **MCP Server:** Available in modelcontextprotocol/servers
-   **Use Cases:** Code repository, CI/CD, version control
-   **Priority:** P0 (Critical)
-   **Status:** ✅ MCP Server Available

### GitHub Actions

-   **Description:** CI/CD automation
-   **Context7 URL:** Search with GitHub documentation
-   **Official Docs:** https://docs.github.com/actions
-   **Use Cases:** Automated testing, deployment
-   **Priority:** P0 (Critical)
-   **Status:** ⚠️ Check context7.com

---

## 7. Third-Party Services

### WhatsApp Business API

-   **Description:** Official WhatsApp API for businesses
-   **Context7 URL:** https://context7.com/websites/developers_facebook-whatsapp (if available)
-   **Official Docs:** https://developers.facebook.com/docs/whatsapp
-   **Use Cases:** Core messaging functionality
-   **Priority:** P0 (Critical)
-   **Status:** ⚠️ Check context7.com for Meta docs

### Razorpay

-   **Description:** Payment processing platform
-   **MCP URL:** https://www.postman.com/razorpaydev/razorpay-public-workspace/collection/6883495714c37a0089e3ae66
-   **Official Docs:** https://razorpay.com/docs/?
-   **Use Cases:** Subscription management, payments
-   **Priority:** P1 (High)
-   **Status:** ✅ Related docs available

### SendGrid

-   **Description:** Email delivery service
-   **Context7 URL:** Search for "sendgrid" on context7.com
-   **Official Docs:** https://docs.sendgrid.com
-   **Use Cases:** Transactional emails, notifications
-   **Priority:** P1 (High)
-   **Status:** ⚠️ Check context7.com or add manually

### Twilio

-   **Description:** Communication APIs (SMS, Voice)
-   **Context7 URL:** Search for "twilio" on context7.com
-   **Official Docs:** https://www.twilio.com/docs
-   **Use Cases:** SMS notifications, 2FA
-   **Priority:** P2 (Medium)
-   **Status:** ⚠️ Check context7.com or add manually

---

## 8. Development Tools

### TypeScript

-   **Description:** Typed superset of JavaScript
-   **Context7 URL:** Search for "typescript" on context7.com
-   **Official Docs:** https://www.typescriptlang.org/docs
-   **Use Cases:** Type-safe development
-   **Priority:** P0 (Critical)
-   **Status:** ⚠️ Check context7.com

### ESLint

-   **Description:** JavaScript linting utility
-   **Context7 URL:** Search for "eslint" on context7.com
-   **Official Docs:** https://eslint.org/docs
-   **Use Cases:** Code quality, linting
-   **Priority:** P0 (Critical)
-   **Status:** ⚠️ Check context7.com

### Prettier

-   **Description:** Code formatter
-   **Context7 URL:** Search for "prettier" on context7.com
-   **Official Docs:** https://prettier.io/docs
-   **Use Cases:** Code formatting
-   **Priority:** P1 (High)
-   **Status:** ⚠️ Check context7.com

### Vitest

-   **Description:** Fast unit test framework
-   **Context7 URL:** Search for "vitest" on context7.com
-   **Official Docs:** https://vitest.dev
-   **Use Cases:** Unit testing
-   **Priority:** P0 (Critical)
-   **Status:** ⚠️ Check context7.com

### Playwright

-   **Description:** End-to-end testing framework
-   **Context7 URL:** Search for "playwright" on context7.com
-   **Official Docs:** https://playwright.dev
-   **Use Cases:** E2E testing
-   **Priority:** P1 (High)
-   **Status:** ⚠️ Check context7.com

---

## 9. How to Use MCPs

### For Claude Desktop App

1. **Add MCP Server to Config:**

```json
{
	"mcpServers": {
		"github": {
			"command": "npx",
			"args": ["-y", "@modelcontextprotocol/server-github"],
			"env": {
				"GITHUB_PERSONAL_ACCESS_TOKEN": "your-token"
			}
		},
		"postgres": {
			"command": "npx",
			"args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://..."]
		}
	}
}
```

2. **Restart Claude Desktop** to load the MCP servers

3. **Use in Conversations:** MCPs provide additional context automatically

### For Cursor / AI Code Editors

1. **Copy Documentation from Context7:**

    - Visit the Context7 URL
    - Click "Copy" button
    - Paste into your AI editor's context

2. **Example:**

```
Visit: https://context7.com/vercel/next.js
Click: Copy latest docs
Paste: In Cursor/Claude chat
```

### Adding Custom Libraries to Context7

If a library isn't available on Context7:

1. Visit: https://context7.com/add-package
2. Enter the GitHub repository URL
3. Wait for processing
4. Use the generated Context7 URL

---

## 10. Priority Matrix

### P0 - Critical (Must Have)

-   ✅ MCP Servers Collection
-   ✅ Next.js
-   ✅ Tailwind CSS
-   ✅ MongoDB
-   ⚠️ PostgreSQL (MCP Available)
-   ⚠️ React
-   ⚠️ Express/Node.js
-   ⚠️ Prisma
-   ⚠️ Socket.io
-   ⚠️ Claude AI SDK
-   ⚠️ WhatsApp API
-   ⚠️ GitHub (MCP Available)

### P1 - High Priority (Should Have)

-   ✅ Upstash
-   ⚠️ Redis
-   ⚠️ ReactFlow
-   ⚠️ shadcn/ui
-   ⚠️ Razorpay
-   ⚠️ AWS S3
-   ⚠️ Docker

### P2 - Medium Priority (Nice to Have)

-   ✅ Hono
-   ⚠️ Kubernetes
-   ⚠️ Framer Motion
-   ⚠️ Twilio

---

## 11. Community MCP Servers

### Database Servers

-   **PostgreSQL MCP Server**

    -   Part of: modelcontextprotocol/servers
    -   Features: Query execution, schema inspection

-   **SQLite MCP Server**
    -   Part of: modelcontextprotocol/servers
    -   Features: Local database access

### Integration Servers

-   **GitHub MCP Server**

    -   Part of: modelcontextprotocol/servers
    -   Features: Repository operations, issue management, PR handling

-   **Google Drive MCP Server**

    -   Part of: modelcontextprotocol/servers
    -   Features: File operations, folder management

-   **Slack MCP Server**
    -   Part of: modelcontextprotocol/servers
    -   Features: Channel messaging, user management

### Utility Servers

-   **File System MCP Server**

    -   Part of: modelcontextprotocol/servers
    -   Features: File operations, directory traversal

-   **Fetch MCP Server**
    -   Part of: modelcontextprotocol/servers
    -   Features: HTTP requests, web scraping

---

## 12. Search Strategy for Missing Libraries

For libraries not listed here, use these search patterns on Context7:

1. **Direct Search:**

    ```
    https://context7.com/[org]/[repo]
    Example: https://context7.com/facebook/react
    ```

2. **Site Search:**

    ```
    site:context7.com [library-name]
    Example: site:context7.com prisma
    ```

3. **Add Package:**

    ```
    Visit: https://context7.com/add-package
    Enter: GitHub URL
    ```

4. **Alternative Documentation:**
    - Check official documentation
    - Use GitHub repository directly
    - Search for "awesome-[library]" lists

---

## 13. MCP Best Practices

### Security

-   Never commit MCP config with tokens
-   Use environment variables for secrets
-   Regularly rotate access tokens

### Performance

-   Enable only needed MCP servers
-   Use caching where possible
-   Monitor token usage on Context7

### Development

-   Test MCPs in development first
-   Use MCP Inspector for debugging
-   Document custom MCP implementations

---

## 14. Additional Resources

### Official MCP Resources

-   **Specification:** https://spec.modelcontextprotocol.io
-   **Documentation:** https://modelcontextprotocol.io
-   **GitHub Org:** https://github.com/modelcontextprotocol
-   **Discord:** https://discord.gg/mcp (check for official link)

### Context7 Resources

-   **Homepage:** https://context7.com
-   **Add Package:** https://context7.com/add-package
-   **MCP Libraries:** https://context7.com/_MCP
-   **Plans:** https://context7.com/plans

### Community

-   **Awesome MCP:** Search GitHub for "awesome-mcp"
-   **MCP Servers List:** https://github.com/modelcontextprotocol/servers
-   **Community Servers:** Check GitHub topic "mcp-server"

---

## 15. Quick Reference

### Essential MCPs for BotPe AI

```bash
# Install core MCP servers
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-postgres
npm install -g @modelcontextprotocol/server-filesystem

# Add to Claude Desktop config
# Location: ~/Library/Application Support/Claude/claude_desktop_config.json (Mac)
# Location: %APPDATA%\Claude\claude_desktop_config.json (Windows)
```

### Context7 URLs to Bookmark

1. Next.js: https://context7.com/vercel/next.js
2. Tailwind: https://context7.com/tailwindlabs/tailwindcss.com
3. MongoDB: https://context7.com/mongodb/docs
4. MCP Servers: https://context7.com/modelcontextprotocol/servers
5. Upstash: https://context7.com/upstash/docs
6. Hono: https://context7.com/honojs/website
7. Claude Code: https://context7.com/anthropics/claude-code
8. Anthropic Skills: https://context7.com/anthropics/skills

---

## 16. Status Legend

-   ✅ **Available:** Confirmed available on Context7.com
-   ⚠️ **Check:** Need to verify on Context7.com
-   ❌ **Not Found:** Not available, use alternative documentation
-   🔨 **Add Manually:** Can be added via Context7.com/add-package

---

## Document Control

**Version:** 1.0
**Last Updated:** November 2025
**Next Review:** Weekly during development
**Owner:** Development Team

**Notes:**

-   This is a living document
-   Add new MCPs as they become available
-   Update status as libraries are verified
-   Report missing libraries to Context7.com

---

## Action Items

### Immediate Actions:

1. ✅ Verify Next.js MCP
2. ✅ Verify Tailwind CSS MCP
3. ⚠️ Search for React on Context7
4. ⚠️ Search for Prisma on Context7
5. ⚠️ Search for Express.js on Context7
6. ⚠️ Add ReactFlow to Context7
7. ⚠️ Verify WhatsApp API docs availability

### Weekly Tasks:

-   Check for new MCP servers
-   Update Context7 URLs
-   Test MCP integrations
-   Document custom MCPs

### Monthly Reviews:

-   Review all MCPs for updates
-   Optimize MCP usage
-   Update documentation
-   Share learnings with team

---

This document provides a comprehensive list of all technology stacks and their corresponding MCPs. Use it as a reference throughout the development of BotPe AI to ensure you have the most up-to-date documentation available for your AI coding assistants.
