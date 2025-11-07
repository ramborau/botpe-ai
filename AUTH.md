# 🔐 BotPe AI - Authentication System

**Implementation**: Better-Auth with Prisma
**Status**: ✅ Backend Complete
**Frontend**: 🔜 Pending Next.js setup

---

## Overview

BotPe AI uses **Better-Auth** for authentication, providing a secure, production-ready authentication system with:

- ✅ Email/Password authentication
- ✅ Session management with cookies
- ✅ Multi-tenant organization support
- ✅ Role-based access control (RBAC)
- ✅ JWT-compatible sessions
- 🔜 OAuth providers (Google, GitHub)
- 🔜 Two-factor authentication (2FA)
- 🔜 Email verification

---

## Architecture

### Database Models

Better-Auth integrates with our existing Prisma schema:

```prisma
model User {
  id             String       @id @default(uuid())
  email          String       @unique
  emailVerified  Boolean      @default(false)
  name           String
  image          String?
  role           Role         @default(AGENT)
  organizationId String
  organization   Organization @relation(...)
  sessions       Session[]
  accounts       Account[]
}

model Session {
  id        String   @id @default(uuid())
  userId    String
  expiresAt DateTime
  token     String   @unique
  ipAddress String?
  userAgent String?
}

model Account {
  id           String    @id @default(uuid())
  userId       String
  accountId    String
  providerId   String    // "credential", "google", "github"
  password     String?   // For email/password
  accessToken  String?   // For OAuth
}

model Verification {
  id         String   @id @default(uuid())
  identifier String   // email or phone
  value      String   // verification code
  expiresAt  DateTime
}
```

### Multi-Tenant Security

- Every user belongs to an `Organization`
- `organizationId` is **required** on user creation
- All API endpoints filter by `organizationId`
- Cross-organization access is **blocked** at middleware level

---

## API Endpoints

### Auth Endpoints (Better-Auth)

All Better-Auth endpoints are mounted at `/api/auth/*`:

#### **POST /api/auth/sign-up**
Register a new user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "organizationId": "uuid-of-organization"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": false,
    "organizationId": "uuid-of-organization",
    "role": "AGENT"
  },
  "session": {
    "token": "session-token",
    "expiresAt": "2025-11-14T..."
  }
}
```

#### **POST /api/auth/sign-in/email**
Login with email/password

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "user": { ... },
  "session": { ... }
}
```

#### **POST /api/auth/sign-out**
Logout current session

**Headers:** Requires session token cookie

**Response:**
```json
{
  "success": true
}
```

#### **GET /api/auth/session**
Get current session

**Headers:** Requires session token cookie

**Response:**
```json
{
  "user": { ... },
  "session": { ... }
}
```

---

### User Endpoints (Custom)

#### **GET /api/users/me**
Get current user profile

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "AGENT",
    "emailVerified": false,
    "image": null,
    "organization": {
      "id": "uuid",
      "name": "Acme Corp",
      "slug": "acme-corp",
      "plan": "FREE"
    },
    "createdAt": "2025-11-07T...",
    "updatedAt": "2025-11-07T..."
  }
}
```

#### **PATCH /api/users/me**
Update current user profile

**Headers:** Requires authentication

**Request:**
```json
{
  "name": "John Smith",
  "image": "https://example.com/avatar.jpg"
}
```

#### **GET /api/users/organization**
Get all users in organization (Admin only)

**Headers:** Requires authentication + ADMIN role

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user1@example.com",
      "name": "User One",
      "role": "ADMIN",
      "emailVerified": true,
      "createdAt": "2025-11-01T..."
    },
    {
      "id": "uuid",
      "email": "user2@example.com",
      "name": "User Two",
      "role": "AGENT",
      "emailVerified": false,
      "createdAt": "2025-11-02T..."
    }
  ],
  "count": 2
}
```

#### **PATCH /api/users/:userId/role**
Update user role (Admin only)

**Headers:** Requires authentication + ADMIN role

**Request:**
```json
{
  "role": "VIEWER"
}
```

---

## Middleware

### `requireAuth`
Requires valid session, attaches `req.user` and `req.session`

```typescript
import { requireAuth } from './middleware/auth';

router.get('/protected', requireAuth, (req, res) => {
  console.log(req.user); // User object
  console.log(req.session); // Session object
});
```

### `requireRole(...roles)`
Requires specific role(s)

```typescript
import { requireAuth, requireRole } from './middleware/auth';

router.delete('/admin-only', 
  requireAuth, 
  requireRole('ADMIN'), 
  handler
);

router.post('/admin-or-agent', 
  requireAuth, 
  requireRole('ADMIN', 'AGENT'), 
  handler
);
```

### `requireOrganization`
Ensures user has organization assigned

```typescript
import { requireAuth, requireOrganization } from './middleware/auth';

router.get('/org-data', 
  requireAuth, 
  requireOrganization, 
  handler
);
```

### `optionalAuth`
Attaches user if session exists, but doesn't block request

```typescript
import { optionalAuth } from './middleware/auth';

router.get('/public-or-private', optionalAuth, (req, res) => {
  if (req.user) {
    // Authenticated user
  } else {
    // Anonymous user
  }
});
```

---

## Roles & Permissions

### Role Hierarchy

1. **ADMIN** - Full organization access
   - Manage all bots, conversations, users
   - Configure WhatsApp accounts
   - View billing and analytics
   - Invite/remove users
   - Change user roles

2. **AGENT** - Standard user access
   - Create and manage bots
   - Access conversations inbox
   - Send messages
   - View contacts
   - Read templates and campaigns

3. **VIEWER** - Read-only access
   - View bots (cannot edit)
   - View conversations (cannot reply)
   - View contacts
   - View templates
   - View campaign results

### Permission Checks in Code

```typescript
// In route handler
if (!req.user) {
  return res.status(401).json({ error: 'Unauthorized' });
}

// Check role
if (req.user.role !== 'ADMIN') {
  return res.status(403).json({ error: 'Forbidden' });
}

// Check organization access
if (resource.organizationId !== req.user.organizationId) {
  return res.status(403).json({ error: 'Access denied' });
}
```

---

## Security Best Practices

### Password Requirements
- Minimum length: 8 characters
- Maximum length: 128 characters
- Hashed with bcrypt (via Better-Auth)
- No password strength requirements (yet)

### Session Management
- Sessions expire after 7 days
- Stored in database (Session table)
- HttpOnly cookies prevent XSS
- SameSite=Lax prevents CSRF
- Session token rotates on update

### Organization Isolation
```typescript
// ALWAYS filter by organizationId
const bots = await prisma.bot.findMany({
  where: {
    organizationId: req.user.organizationId, // Required!
  },
});

// NEVER expose cross-organization data
const bot = await prisma.bot.findUnique({
  where: { id: botId },
});

// Verify organization before returning
if (bot.organizationId !== req.user.organizationId) {
  throw new Error('Access denied');
}
```

### CORS Configuration
```typescript
// Only allow requests from frontend
cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies
})
```

---

## Frontend Integration (Next.js)

### Install Better-Auth Client

```bash
cd apps/web
pnpm add better-auth
```

### Create Auth Client

```typescript
// apps/web/lib/auth.ts
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});
```

### Sign Up

```typescript
import { authClient } from '@/lib/auth';

async function handleSignUp(data: {
  email: string;
  password: string;
  name: string;
  organizationId: string;
}) {
  const result = await authClient.signUp.email({
    email: data.email,
    password: data.password,
    name: data.name,
    organizationId: data.organizationId,
  });

  if (result.error) {
    console.error(result.error);
  } else {
    // User created and logged in
    console.log(result.data);
  }
}
```

### Sign In

```typescript
async function handleSignIn(email: string, password: string) {
  const result = await authClient.signIn.email({
    email,
    password,
  });

  if (result.error) {
    console.error(result.error);
  } else {
    // Redirect to dashboard
    router.push('/dashboard');
  }
}
```

### Sign Out

```typescript
async function handleSignOut() {
  await authClient.signOut();
  router.push('/login');
}
```

### Get Session

```typescript
'use client';
import { useSession } from 'better-auth/react';

export function Profile() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Not logged in</div>;

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>{session.user.email}</p>
      <p>Role: {session.user.role}</p>
    </div>
  );
}
```

### Protected Route (Next.js Middleware)

```typescript
// apps/web/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('better-auth.session_token');

  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

---

## Testing

### Manual Testing

```bash
# 1. Start backend
cd apps/api
pnpm dev

# 2. Sign up
curl -X POST http://localhost:3001/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User",
    "organizationId": "create-org-first"
  }'

# 3. Sign in
curl -X POST http://localhost:3001/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

# 4. Get profile (using cookies)
curl http://localhost:3001/api/users/me \
  -b cookies.txt
```

### Test with Postman

1. Import collection: [link when created]
2. Set environment variable `API_URL` to `http://localhost:3001`
3. Run "Sign Up" → "Sign In" → "Get Profile" sequence
4. Session cookies are automatically handled

---

## Troubleshooting

### "Unauthorized - No valid session"
- Check if session cookie is sent with request
- Verify session hasn't expired
- Ensure CORS credentials are enabled

### "Forbidden - Insufficient permissions"
- Check user role in database
- Verify route requires correct role
- Check if user has organizationId

### "Database connection error"
- Ensure PostgreSQL is running
- Run `pnpm prisma:push` to sync schema
- Check DATABASE_URL in .env

### "CORS error"
- Set FRONTEND_URL in .env
- Ensure credentials: true in both frontend and backend
- Check browser console for specific CORS error

---

## Next Steps

1. ✅ Backend auth complete
2. 🔜 Initialize Next.js frontend
3. 🔜 Create login/register pages
4. 🔜 Add OAuth providers (Google, GitHub)
5. 🔜 Implement email verification
6. 🔜 Add 2FA support
7. 🔜 Create password reset flow
8. 🔜 Add rate limiting

---

**Authentication Status**: ✅ Production Ready (Backend)

All endpoints documented in apps/api/src/routes/user.routes.ts:80
