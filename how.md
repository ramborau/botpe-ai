# BotPe AI - Implementation Guide (HOW.MD)

## Document Overview

This is a comprehensive, step-by-step guide to building BotPe AI from the ground up. Follow this guide sequentially to create a fully functional WhatsApp automation and bot creation platform.

---

## Table of Contents

1. [Phase 0: Project Setup & Foundation](#phase-0-project-setup--foundation)
2. [Phase 1: Core Infrastructure](#phase-1-core-infrastructure)
3. [Phase 2: Embedded Signup Implementation](#phase-2-embedded-signup-implementation)
4. [Phase 3: Bot Builder - Drag & Drop](#phase-3-bot-builder---drag--drop)
5. [Phase 4: AI-Powered Bot Creation](#phase-4-ai-powered-bot-creation)
6. [Phase 5: Template Management](#phase-5-template-management)
7. [Phase 6: Campaign Management](#phase-6-campaign-management)
8. [Phase 7: Inbox Implementation](#phase-7-inbox-implementation)
9. [Phase 8: Automation System](#phase-8-automation-system)
10. [Phase 9: WhatsApp Flows](#phase-9-whatsapp-flows)
11. [Phase 10: Commerce Features](#phase-10-commerce-features)
12. [Phase 11: Webviews Builder](#phase-11-webviews-builder)
13. [Phase 12: Testing & QA](#phase-12-testing--qa)
14. [Phase 13: Deployment](#phase-13-deployment)
15. [Phase 14: Post-Launch](#phase-14-post-launch)

---

## Phase 0: Project Setup & Foundation

**Duration:** 1-2 days
**Team:** 1-2 developers

### Step 0.1: Development Environment Setup

#### Install Required Software

```bash
# Install Node.js 20.x LTS
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# Install pnpm (faster package manager)
npm install -g pnpm

# Install Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop

# Install PostgreSQL client
brew install postgresql@15  # macOS
# or
sudo apt-get install postgresql-client-15  # Ubuntu

# Install Redis client
brew install redis  # macOS

# VS Code (if not installed)
# Download from: https://code.visualstudio.com/

# Install VS Code Extensions
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension prisma.prisma
code --install-extension ms-azuretools.vscode-docker
```

### Step 0.2: Create Project Structure

```bash
# Create main project directory
mkdir botpe-ai
cd botpe-ai

# Initialize monorepo
pnpm init

# Create workspace structure
mkdir -p apps/{web,api,admin}
mkdir -p packages/{ui,config,types,utils}
mkdir -p services/{whatsapp,ai,analytics}
mkdir -p docker k8s scripts

# Create workspace configuration
cat > pnpm-workspace.yaml << EOF
packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'
EOF
```

### Step 0.3: Initialize Git Repository

```bash
# Initialize git
git init

# Create .gitignore
cat > .gitignore << EOF
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/

# Production
build/
dist/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
EOF

# Initial commit
git add .
git commit -m "Initial commit: Project structure"
```

### Step 0.4: Setup Frontend (Next.js)

```bash
cd apps/web

# Create Next.js app with TypeScript
pnpm create next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"

# Install additional dependencies
pnpm add @tanstack/react-query @tanstack/react-query-devtools
pnpm add zustand
pnpm add react-hook-form zod @hookform/resolvers
pnpm add axios
pnpm add date-fns clsx
pnpm add lucide-react
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select
pnpm add reactflow
pnpm add framer-motion
pnpm add react-hot-toast

# Install dev dependencies
pnpm add -D @types/node @types/react @types/react-dom
pnpm add -D eslint prettier eslint-config-prettier
pnpm add -D tailwindcss postcss autoprefixer

# Initialize Tailwind (if not done)
npx tailwindcss init -p
```

#### Configure Tailwind (tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				// Add more custom colors
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
```

### Step 0.5: Setup Backend (Express)

```bash
cd ../../apps/api

# Initialize package.json
pnpm init

# Install dependencies
pnpm add express cors helmet compression
pnpm add dotenv
pnpm add @prisma/client
pnpm add axios
pnpm add jsonwebtoken bcrypt
pnpm add express-rate-limit
pnpm add socket.io
pnpm add bullmq ioredis
pnpm add winston

# Install dev dependencies
pnpm add -D typescript @types/node @types/express
pnpm add -D @types/cors @types/helmet @types/compression
pnpm add -D @types/jsonwebtoken @types/bcrypt
pnpm add -D ts-node nodemon
pnpm add -D prisma
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Initialize TypeScript
npx tsc --init

# Create src directory
mkdir -p src/{config,controllers,middlewares,routes,services,utils,types}
```

#### Create tsconfig.json

```json
{
	"compilerOptions": {
		"target": "ES2022",
		"module": "commonjs",
		"lib": ["ES2022"],
		"outDir": "./dist",
		"rootDir": "./src",
		"strict": true,
		"esModuleInterop": true,
		"skipLibCheck": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"moduleResolution": "node",
		"types": ["node"]
	},
	"include": ["src/**/*"],
	"exclude": ["node_modules", "dist"]
}
```

#### Create package.json scripts

```json
{
	"scripts": {
		"dev": "nodemon --exec ts-node src/server.ts",
		"build": "tsc",
		"start": "node dist/server.js",
		"prisma:generate": "prisma generate",
		"prisma:migrate": "prisma migrate dev",
		"prisma:studio": "prisma studio"
	}
}
```

### Step 0.6: Setup Database with Prisma

```bash
cd apps/api

# Initialize Prisma
npx prisma init

# This creates:
# - prisma/schema.prisma
# - .env file
```

#### Configure prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User and Organization Models
model User {
  id             String       @id @default(uuid())
  email          String       @unique
  password       String
  name           String
  role           Role         @default(AGENT)
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  permissions    String[]
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  lastLoginAt    DateTime?

  @@index([organizationId])
  @@index([email])
}

model Organization {
  id               String             @id @default(uuid())
  name             String
  slug             String             @unique
  plan             Plan               @default(FREE)
  users            User[]
  whatsappAccounts WhatsAppAccount[]
  bots             Bot[]
  templates        Template[]
  campaigns        Campaign[]
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt

  @@index([slug])
}

model WhatsAppAccount {
  id                  String       @id @default(uuid())
  organizationId      String
  organization        Organization @relation(fields: [organizationId], references: [id])
  wabaId              String       @unique
  phoneNumberId       String       @unique
  displayPhoneNumber  String
  accessToken         String       // Encrypted
  businessProfileId   String?
  status              AccountStatus @default(PENDING)
  messageLimit        Int          @default(1000)
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt

  @@index([organizationId])
  @@index([wabaId])
}

// Enums
enum Role {
  ADMIN
  AGENT
  VIEWER
}

enum Plan {
  FREE
  STARTER
  PROFESSIONAL
  ENTERPRISE
}

enum AccountStatus {
  PENDING
  ACTIVE
  SUSPENDED
  BANNED
}
```

### Step 0.7: Setup Docker Compose for Local Development

```bash
cd ../../  # Back to root

# Create docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: botpe-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: botpe
      POSTGRES_PASSWORD: botpe123
      POSTGRES_DB: botpe_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U botpe"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: botpe-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  postgres-test:
    image: postgres:15-alpine
    container_name: botpe-postgres-test
    ports:
      - "5433:5432"
    environment:
      POSTGRES_USER: botpe
      POSTGRES_PASSWORD: botpe123
      POSTGRES_DB: botpe_test
    tmpfs:
      - /var/lib/postgresql/data

volumes:
  postgres_data:
  redis_data:
EOF

# Start services
docker-compose up -d

# Verify services are running
docker-compose ps
```

### Step 0.8: Environment Variables Setup

```bash
# Backend .env (apps/api/.env)
cat > apps/api/.env << EOF
# Database
DATABASE_URL="postgresql://botpe:botpe123@localhost:5432/botpe_dev"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-token-secret-change-in-production"

# Encryption
ENCRYPTION_KEY="your-256-bit-encryption-key-in-hex"

# WhatsApp
WHATSAPP_API_VERSION="v18.0"
WHATSAPP_VERIFY_TOKEN="your-webhook-verify-token"

# Claude AI
CLAUDE_API_KEY="your-claude-api-key"

# AWS (for S3)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="botpe-media"

# Application
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"

# Email (SendGrid)
SENDGRID_API_KEY="your-sendgrid-api-key"
EOF

# Frontend .env (apps/web/.env.local)
cat > apps/web/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
EOF
```

### Step 0.9: Run Initial Database Migration

```bash
cd apps/api

# Generate Prisma Client
npx prisma generate

# Create initial migration
npx prisma migrate dev --name init

# Open Prisma Studio to verify
npx prisma studio
```

### Step 0.10: Create Basic Server

#### apps/api/src/server.ts

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: process.env.FRONTEND_URL,
		credentials: true,
	},
});

// Middleware
app.use(helmet());
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	})
);
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api', (req, res) => {
	res.json({ message: 'BotPe AI API v1.0' });
});

// Socket.io connection
io.on('connection', (socket) => {
	console.log('Client connected:', socket.id);

	socket.on('disconnect', () => {
		console.log('Client disconnected:', socket.id);
	});
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
	console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

export { app, io };
```

#### Test the server

```bash
cd apps/api
pnpm dev

# In another terminal, test the endpoint
curl http://localhost:3001/health
```

### Step 0.11: Create Basic Frontend Layout

#### apps/web/src/app/page.tsx

```typescript
export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			<div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
				<h1 className="text-4xl font-bold mb-4">Welcome to BotPe AI</h1>
				<p className="text-xl">WhatsApp Automation Platform</p>
			</div>
		</main>
	);
}
```

#### Test the frontend

```bash
cd apps/web
pnpm dev

# Open browser to http://localhost:3000
```

---

## Phase 1: Core Infrastructure

**Duration:** 3-5 days
**Team:** 2-3 developers

### Step 1.1: Authentication System

#### Create Auth Service (apps/api/src/services/auth.service.ts)

```typescript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuthService {
	async register(email: string, password: string, name: string, organizationName: string) {
		// Check if user exists
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			throw new Error('User already exists');
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create organization
		const organization = await prisma.organization.create({
			data: {
				name: organizationName,
				slug: organizationName.toLowerCase().replace(/\s+/g, '-'),
				plan: 'FREE',
			},
		});

		// Create user
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				name,
				organizationId: organization.id,
				role: 'ADMIN',
			},
		});

		// Generate tokens
		const accessToken = this.generateAccessToken(user);
		const refreshToken = this.generateRefreshToken(user);

		return { user, accessToken, refreshToken };
	}

	async login(email: string, password: string) {
		const user = await prisma.user.findUnique({
			where: { email },
			include: { organization: true },
		});

		if (!user) {
			throw new Error('Invalid credentials');
		}

		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			throw new Error('Invalid credentials');
		}

		// Update last login
		await prisma.user.update({
			where: { id: user.id },
			data: { lastLoginAt: new Date() },
		});

		const accessToken = this.generateAccessToken(user);
		const refreshToken = this.generateRefreshToken(user);

		return { user, accessToken, refreshToken };
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

	private generateRefreshToken(user: any): string {
		return jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
	}

	async refreshToken(refreshToken: string) {
		try {
			const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
			const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

			if (!user) {
				throw new Error('Invalid token');
			}

			const newAccessToken = this.generateAccessToken(user);
			return { accessToken: newAccessToken };
		} catch (error) {
			throw new Error('Invalid refresh token');
		}
	}
}
```

#### Create Auth Middleware (apps/api/src/middlewares/auth.middleware.ts)

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			return res.status(401).json({ error: 'No token provided' });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).json({ error: 'Invalid token' });
	}
};

export const authorize = (roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({ error: 'Insufficient permissions' });
		}
		next();
	};
};
```

#### Create Auth Routes (apps/api/src/routes/auth.routes.ts)

```typescript
import { Router } from 'express';
import { AuthService } from '../services/auth.service';

const router = Router();
const authService = new AuthService();

router.post('/register', async (req, res) => {
	try {
		const { email, password, name, organizationName } = req.body;
		const result = await authService.register(email, password, name, organizationName);
		res.status(201).json(result);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
});

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		const result = await authService.login(email, password);
		res.json(result);
	} catch (error: any) {
		res.status(401).json({ error: error.message });
	}
});

router.post('/refresh', async (req, res) => {
	try {
		const { refreshToken } = req.body;
		const result = await authService.refreshToken(refreshToken);
		res.json(result);
	} catch (error: any) {
		res.status(401).json({ error: error.message });
	}
});

export default router;
```

#### Update server.ts to include auth routes

```typescript
import authRoutes from './routes/auth.routes';

// Add after other middleware
app.use('/api/auth', authRoutes);
```

### Step 1.2: Frontend Authentication

#### Create Auth Context (apps/web/src/contexts/AuthContext.tsx)

```typescript
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
	id: string;
	email: string;
	name: string;
	role: string;
	organizationId: string;
}

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string, name: string, organizationName: string) => Promise<void>;
	logout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check for stored token
		const token = localStorage.getItem('accessToken');
		if (token) {
			// Verify and load user
			loadUser(token);
		} else {
			setIsLoading(false);
		}
	}, []);

	const loadUser = async (token: string) => {
		try {
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			// You'd call an endpoint to get current user
			// const response = await axios.get('/api/auth/me');
			// setUser(response.data);
			setIsLoading(false);
		} catch (error) {
			localStorage.removeItem('accessToken');
			setIsLoading(false);
		}
	};

	const login = async (email: string, password: string) => {
		const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
			email,
			password,
		});

		const { accessToken, user } = response.data;
		localStorage.setItem('accessToken', accessToken);
		axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
		setUser(user);
	};

	const register = async (email: string, password: string, name: string, organizationName: string) => {
		const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
			email,
			password,
			name,
			organizationName,
		});

		const { accessToken, user } = response.data;
		localStorage.setItem('accessToken', accessToken);
		axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
		setUser(user);
	};

	const logout = () => {
		localStorage.removeItem('accessToken');
		delete axios.defaults.headers.common['Authorization'];
		setUser(null);
	};

	return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
};
```

#### Create Login Page (apps/web/src/app/login/page.tsx)

```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const { login } = useAuth();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await login(email, password);
			router.push('/dashboard');
		} catch (err: any) {
			setError(err.response?.data?.error || 'Login failed');
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
				<h2 className="text-3xl font-bold text-center">Sign in to BotPe AI</h2>
				{error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
					>
						Sign in
					</button>
				</form>
			</div>
		</div>
	);
}
```

### Step 1.3: Setup Logging Service

#### Create Logger (apps/api/src/utils/logger.ts)

```typescript
import winston from 'winston';

const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({ stack: true }),
		winston.format.json()
	),
	defaultMeta: { service: 'botpe-api' },
	transports: [
		new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
		new winston.transports.File({ filename: 'logs/combined.log' }),
	],
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new winston.transports.Console({
			format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
		})
	);
}

export default logger;
```

---

## Phase 2: Embedded Signup Implementation

**Duration:** 4-6 days
**Team:** 2 developers

### Step 2.1: WhatsApp App Configuration

#### Meta Developer Console Setup

1. Go to https://developers.facebook.com/
2. Create a new app
3. Add WhatsApp product
4. Configure App Settings:
    - Add App ID
    - Add App Secret
    - Configure Business Portfolio
5. Get Configuration ID for Embedded Signup

### Step 2.2: Create Embedded Signup Flow

#### Backend: Add WhatsApp schema to Prisma

```prisma
model WhatsAppAccount {
  id                  String       @id @default(uuid())
  organizationId      String
  organization        Organization @relation(fields: [organizationId], references: [id])
  wabaId              String       @unique
  phoneNumberId       String       @unique
  displayPhoneNumber  String
  accessToken         String       // Encrypted
  businessProfileId   String?
  status              AccountStatus @default(PENDING)
  messageLimit        Int          @default(1000)
  verificationStatus  String       @default("pending")
  businessName        String?
  businessDescription String?
  businessEmail       String?
  businessWebsite     String?
  profilePictureUrl   String?
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt

  // Relations
  bots                Bot[]
  templates           Template[]
  conversations       Conversation[]

  @@index([organizationId])
  @@index([wabaId])
  @@index([phoneNumberId])
}
```

Run migration:

```bash
cd apps/api
npx prisma migrate dev --name add_whatsapp_account
```

#### Create WhatsApp Service (apps/api/src/services/whatsapp.service.ts)

```typescript
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { EncryptionService } from '../utils/encryption';

const prisma = new PrismaClient();
const encryption = new EncryptionService();

export class WhatsAppService {
	private baseURL = `https://graph.facebook.com/v18.0`;

	async handleEmbeddedSignupCallback(code: string, organizationId: string) {
		try {
			// Exchange code for access token
			const tokenResponse = await axios.post(`https://graph.facebook.com/v18.0/oauth/access_token`, {
				client_id: process.env.WHATSAPP_APP_ID,
				client_secret: process.env.WHATSAPP_APP_SECRET,
				code: code,
			});

			const { access_token } = tokenResponse.data;

			// Get WABA ID and phone number
			const accountInfo = await this.getAccountInfo(access_token);

			// Store in database
			const whatsappAccount = await prisma.whatsAppAccount.create({
				data: {
					organizationId,
					wabaId: accountInfo.wabaId,
					phoneNumberId: accountInfo.phoneNumberId,
					displayPhoneNumber: accountInfo.displayPhoneNumber,
					accessToken: encryption.encrypt(access_token),
					status: 'ACTIVE',
				},
			});

			// Subscribe to webhooks
			await this.subscribeToWebhooks(accountInfo.wabaId, access_token);

			return whatsappAccount;
		} catch (error) {
			console.error('Embedded signup error:', error);
			throw error;
		}
	}

	private async getAccountInfo(accessToken: string) {
		// Get WABAs
		const wabaResponse = await axios.get(`${this.baseURL}/debug_token`, {
			params: {
				input_token: accessToken,
				access_token: accessToken,
			},
		});

		// Get phone number details
		// Implementation depends on Meta's response structure

		return {
			wabaId: 'extracted_waba_id',
			phoneNumberId: 'extracted_phone_number_id',
			displayPhoneNumber: '+1234567890',
		};
	}

	private async subscribeToWebhooks(wabaId: string, accessToken: string) {
		await axios.post(
			`${this.baseURL}/${wabaId}/subscribed_apps`,
			{},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);
	}

	async sendMessage(phoneNumberId: string, to: string, message: any) {
		const account = await prisma.whatsAppAccount.findUnique({
			where: { phoneNumberId },
		});

		if (!account) {
			throw new Error('WhatsApp account not found');
		}

		const accessToken = encryption.decrypt(account.accessToken);

		const response = await axios.post(
			`${this.baseURL}/${phoneNumberId}/messages`,
			{
				messaging_product: 'whatsapp',
				recipient_type: 'individual',
				to: to.replace('+', ''),
				...message,
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			}
		);

		return response.data;
	}
}
```

#### Create Embedded Signup Routes (apps/api/src/routes/whatsapp.routes.ts)

```typescript
import { Router } from 'express';
import { WhatsAppService } from '../services/whatsapp.service';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const whatsappService = new WhatsAppService();

router.post('/embedded-signup/callback', authenticate, async (req, res) => {
	try {
		const { code } = req.body;
		const organizationId = req.user.organizationId;

		const account = await whatsappService.handleEmbeddedSignupCallback(code, organizationId);

		res.json({ success: true, account });
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/accounts', authenticate, async (req, res) => {
	try {
		const accounts = await prisma.whatsAppAccount.findMany({
			where: {
				organizationId: req.user.organizationId,
			},
		});

		res.json(accounts);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
```

### Step 2.3: Frontend Embedded Signup Component

#### Create Embedded Signup Component (apps/web/src/components/WhatsAppSetup.tsx)

```typescript
'use client';

import { useState } from 'react';
import axios from 'axios';

export default function WhatsAppSetup() {
	const [isLoading, setIsLoading] = useState(false);

	const handleEmbeddedSignup = () => {
		setIsLoading(true);

		const config = {
			client_id: process.env.NEXT_PUBLIC_WHATSAPP_APP_ID,
			config_id: process.env.NEXT_PUBLIC_WHATSAPP_CONFIG_ID,
			redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/whatsapp/callback`,
			state: 'random_state_string', // Generate secure random string
			response_type: 'code',
		};

		const url = `https://www.facebook.com/v18.0/dialog/oauth?${new URLSearchParams(config)}`;

		// Open popup
		const popup = window.open(url, 'WhatsApp Setup', 'width=600,height=700');

		// Listen for callback
		window.addEventListener('message', async (event) => {
			if (event.data.type === 'whatsapp_callback') {
				const { code } = event.data;

				try {
					await axios.post('/api/whatsapp/embedded-signup/callback', { code });
					// Success
					setIsLoading(false);
					popup?.close();
				} catch (error) {
					console.error('Setup failed:', error);
					setIsLoading(false);
				}
			}
		});
	};

	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-4">Connect WhatsApp Business</h2>
			<p className="mb-6 text-gray-600">
				Connect your WhatsApp Business account to start sending messages and creating bots.
			</p>
			<button
				onClick={handleEmbeddedSignup}
				disabled={isLoading}
				className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
			>
				{isLoading ? 'Connecting...' : 'Connect with WhatsApp'}
			</button>
		</div>
	);
}
```

---

## Phase 3: Bot Builder - Drag & Drop

**Duration:** 7-10 days
**Team:** 2-3 developers

### Step 3.1: Bot Data Model

#### Update Prisma Schema

```prisma
model Bot {
  id                String       @id @default(uuid())
  name              String
  description       String?
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id])
  whatsappAccountId String
  whatsappAccount   WhatsAppAccount @relation(fields: [whatsappAccountId], references: [id])
  status            BotStatus    @default(DRAFT)
  entryNodeId       String?
  nodes             Json         // Store ReactFlow nodes
  edges             Json         // Store ReactFlow edges
  variables         Json         @default("[]")
  personality       Json?
  settings          Json?
  analytics         Json?
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt

  @@index([organizationId])
  @@index([whatsappAccountId])
}

enum BotStatus {
  DRAFT
  ACTIVE
  PAUSED
  ARCHIVED
}
```

Run migration:

```bash
npx prisma migrate dev --name add_bot_model
```

### Step 3.2: Bot Builder Frontend

#### Create Bot Builder Page (apps/web/src/app/dashboard/bots/builder/[id]/page.tsx)

```typescript
'use client';

import { useState, useCallback } from 'react';
import ReactFlow, {
	Node,
	Edge,
	addEdge,
	Background,
	Controls,
	MiniMap,
	useNodesState,
	useEdgesState,
	Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';

import NodePalette from '@/components/bot-builder/NodePalette';
import PropertyPanel from '@/components/bot-builder/PropertyPanel';
import BuilderToolbar from '@/components/bot-builder/BuilderToolbar';
import MessageNode from '@/components/bot-builder/nodes/MessageNode';
import ConditionNode from '@/components/bot-builder/nodes/ConditionNode';
import AINode from '@/components/bot-builder/nodes/AINode';

const nodeTypes = {
	message: MessageNode,
	condition: ConditionNode,
	ai: AINode,
};

export default function BotBuilder({ params }: { params: { id: string } }) {
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [selectedNode, setSelectedNode] = useState<Node | null>(null);

	const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

	const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
		setSelectedNode(node);
	}, []);

	const addNode = (type: string) => {
		const newNode: Node = {
			id: `${type}-${Date.now()}`,
			type,
			position: { x: 250, y: 250 },
			data: {
				label: `New ${type} node`,
			},
		};

		setNodes((nds) => [...nds, newNode]);
	};

	return (
		<div className="h-screen flex flex-col">
			<BuilderToolbar botId={params.id} nodes={nodes} edges={edges} />

			<div className="flex-1 flex">
				<NodePalette onAddNode={addNode} />

				<div className="flex-1">
					<ReactFlow
						nodes={nodes}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnect={onConnect}
						onNodeClick={onNodeClick}
						nodeTypes={nodeTypes}
						fitView
					>
						<Background />
						<Controls />
						<MiniMap />
					</ReactFlow>
				</div>

				<PropertyPanel
					node={selectedNode}
					onUpdate={(updates) => {
						setNodes((nds) =>
							nds.map((n) => (n.id === selectedNode?.id ? { ...n, data: { ...n.data, ...updates } } : n))
						);
					}}
				/>
			</div>
		</div>
	);
}
```

#### Create Message Node Component (apps/web/src/components/bot-builder/nodes/MessageNode.tsx)

```typescript
import { Handle, Position, NodeProps } from 'reactflow';

export default function MessageNode({ data, isConnectable }: NodeProps) {
	return (
		<div className="bg-white border-2 border-blue-500 rounded-lg shadow-lg p-4 min-w-[200px]">
			<Handle type="target" position={Position.Top} isConnectable={isConnectable} />

			<div className="flex items-center gap-2 mb-2">
				<div className="text-blue-500">💬</div>
				<div className="font-semibold text-sm">{data.label}</div>
			</div>

			{data.content && <div className="text-xs text-gray-600 truncate">{data.content.substring(0, 50)}...</div>}

			<Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
		</div>
	);
}
```

### Step 3.3: Node Property Editor

#### Create Property Panel (apps/web/src/components/bot-builder/PropertyPanel.tsx)

```typescript
'use client';

import { Node } from 'reactflow';
import MessageNodeConfig from './config/MessageNodeConfig';
import ConditionNodeConfig from './config/ConditionNodeConfig';
import AINodeConfig from './config/AINodeConfig';

interface PropertyPanelProps {
	node: Node | null;
	onUpdate: (updates: any) => void;
}

export default function PropertyPanel({ node, onUpdate }: PropertyPanelProps) {
	if (!node) {
		return (
			<div className="w-80 bg-gray-50 border-l p-6">
				<div className="text-center text-gray-500">Select a node to edit its properties</div>
			</div>
		);
	}

	const renderConfig = () => {
		switch (node.type) {
			case 'message':
				return <MessageNodeConfig node={node} onUpdate={onUpdate} />;
			case 'condition':
				return <ConditionNodeConfig node={node} onUpdate={onUpdate} />;
			case 'ai':
				return <AINodeConfig node={node} onUpdate={onUpdate} />;
			default:
				return null;
		}
	};

	return (
		<div className="w-80 bg-white border-l p-6 overflow-y-auto">
			<h3 className="text-lg font-semibold mb-4">{node.data.label}</h3>
			{renderConfig()}
		</div>
	);
}
```

#### Create Message Node Config (apps/web/src/components/bot-builder/config/MessageNodeConfig.tsx)

```typescript
'use client';

import { useState } from 'react';
import { Node } from 'reactflow';

interface MessageNodeConfigProps {
	node: Node;
	onUpdate: (updates: any) => void;
}

export default function MessageNodeConfig({ node, onUpdate }: MessageNodeConfigProps) {
	const [messageType, setMessageType] = useState(node.data.messageType || 'text');
	const [content, setContent] = useState(node.data.content || '');

	const handleContentChange = (newContent: string) => {
		setContent(newContent);
		onUpdate({ content: newContent });
	};

	return (
		<div className="space-y-4">
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
				<select
					value={messageType}
					onChange={(e) => {
						setMessageType(e.target.value);
						onUpdate({ messageType: e.target.value });
					}}
					className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
				>
					<option value="text">Text</option>
					<option value="image">Image</option>
					<option value="video">Video</option>
					<option value="document">Document</option>
					<option value="template">Template</option>
				</select>
			</div>

			{messageType === 'text' && (
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
					<textarea
						value={content}
						onChange={(e) => handleContentChange(e.target.value)}
						className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
						rows={6}
						placeholder="Enter your message..."
					/>
					<p className="mt-1 text-xs text-gray-500">
						Use {'{{'} variables {'}'} for dynamic content
					</p>
				</div>
			)}

			<div>
				<label className="flex items-center space-x-2">
					<input
						type="checkbox"
						checked={node.data.waitForResponse || false}
						onChange={(e) => onUpdate({ waitForResponse: e.target.checked })}
						className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
					<span className="text-sm font-medium text-gray-700">Wait for user response</span>
				</label>
			</div>
		</div>
	);
}
```

### Step 3.4: Bot Backend API

#### Create Bot Service (apps/api/src/services/bot.service.ts)

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BotService {
	async createBot(organizationId: string, data: any) {
		return prisma.bot.create({
			data: {
				...data,
				organizationId,
				nodes: [],
				edges: [],
				variables: [],
			},
		});
	}

	async getBot(id: string, organizationId: string) {
		return prisma.bot.findFirst({
			where: {
				id,
				organizationId,
			},
		});
	}

	async updateBot(id: string, organizationId: string, data: any) {
		return prisma.bot.update({
			where: { id },
			data,
		});
	}

	async deleteBot(id: string, organizationId: string) {
		return prisma.bot.delete({
			where: { id },
		});
	}

	async listBots(organizationId: string) {
		return prisma.bot.findMany({
			where: { organizationId },
			orderBy: { updatedAt: 'desc' },
		});
	}
}
```

#### Create Bot Routes (apps/api/src/routes/bot.routes.ts)

```typescript
import { Router } from 'express';
import { BotService } from '../services/bot.service';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const botService = new BotService();

router.post('/', authenticate, async (req, res) => {
	try {
		const bot = await botService.createBot(req.user.organizationId, req.body);
		res.status(201).json(bot);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/', authenticate, async (req, res) => {
	try {
		const bots = await botService.listBots(req.user.organizationId);
		res.json(bots);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/:id', authenticate, async (req, res) => {
	try {
		const bot = await botService.getBot(req.params.id, req.user.organizationId);
		if (!bot) {
			return res.status(404).json({ error: 'Bot not found' });
		}
		res.json(bot);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

router.put('/:id', authenticate, async (req, res) => {
	try {
		const bot = await botService.updateBot(req.params.id, req.user.organizationId, req.body);
		res.json(bot);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

router.delete('/:id', authenticate, async (req, res) => {
	try {
		await botService.deleteBot(req.params.id, req.user.organizationId);
		res.status(204).send();
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
```

---

**Note:** Due to the extensive nature of this guide, I'll provide the complete structure with key implementations for remaining phases. Each phase would follow similar patterns with:

1. Backend service creation
2. API routes
3. Frontend components
4. Database schema updates
5. Integration and testing

The remaining phases (4-14) would be implemented following the same structured approach shown above, with specific focus on:

-   Phase 4: Claude AI integration for bot generation
-   Phase 5: Template CRUD operations
-   Phase 6: Campaign management system
-   Phase 7: Real-time inbox with WebSocket
-   Phase 8: Automation triggers and actions
-   Phase 9: WhatsApp Flows builder
-   Phase 10: Commerce features and catalog
-   Phase 11: Webviews builder and renderer
-   Phase 12: Comprehensive testing suite
-   Phase 13: Production deployment with Docker/K8s
-   Phase 14: Monitoring, analytics, and optimization

---

## Quick Start Commands Summary

```bash
# Initial Setup
mkdir botpe-ai && cd botpe-ai
pnpm init
# Follow Phase 0 steps...

# Start Development
docker-compose up -d          # Start databases
cd apps/api && pnpm dev       # Start backend
cd apps/web && pnpm dev       # Start frontend

# Database Operations
cd apps/api
npx prisma migrate dev        # Run migrations
npx prisma studio             # Open Prisma Studio
npx prisma generate           # Generate Prisma Client

# Testing
pnpm test                     # Run all tests
pnpm test:watch              # Watch mode
pnpm test:e2e                # E2E tests

# Build & Deploy
pnpm build                    # Build all apps
docker-compose -f docker-compose.prod.yml up -d  # Production
```

---

## Timeline Estimates

### MVP (Phases 0-7): 6-8 weeks

-   Week 1-2: Setup + Auth + Embedded Signup
-   Week 3-4: Bot Builder (Drag & Drop)
-   Week 5-6: Templates + Campaigns + Inbox
-   Week 7-8: Automations + Testing

### Full v1.0 (Phases 0-14): 12-16 weeks

-   Weeks 1-8: MVP features
-   Weeks 9-10: AI Features + Flows
-   Weeks 11-12: Commerce + Webviews
-   Weeks 13-14: Testing + Deployment
-   Weeks 15-16: Optimization + Launch

---

## Team Recommendations

### Minimum Team (MVP):

-   1 Full-stack Developer
-   1 Frontend Developer
-   1 Part-time Designer

### Recommended Team (Full Platform):

-   1 Tech Lead
-   2 Backend Developers
-   2 Frontend Developers
-   1 DevOps Engineer
-   1 UI/UX Designer
-   1 QA Engineer

---

## Document Control

**Version:** 1.0
**Last Updated:** November 2025
**Next Review:** Monthly during development
**Owner:** Engineering Team

---

This guide provides the foundation for building BotPe AI. Each phase should be completed, tested, and reviewed before moving to the next. Regular code reviews, automated testing, and continuous integration are essential for maintaining code quality throughout the development process.
