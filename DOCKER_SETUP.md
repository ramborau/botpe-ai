# 🐳 Docker Installation & Setup Guide

## Step 1: Install Docker Desktop for Mac

### Download & Install
1. Visit: https://www.docker.com/products/docker-desktop
2. Click "Download for Mac"
3. Choose your Mac chip:
   - **Apple Silicon (M1/M2/M3)**: Download "Mac with Apple chip"
   - **Intel Mac**: Download "Mac with Intel chip"
4. Open the downloaded `.dmg` file
5. Drag Docker.app to Applications folder
6. Open Docker from Applications

### First Launch
1. Open Docker Desktop
2. Accept the license agreement
3. Choose "Use recommended settings"
4. Docker will start (look for whale icon in menu bar)
5. Wait for "Docker Desktop is running" message

### Verify Installation
Open Terminal and run:
```bash
docker --version
# Should show: Docker version 24.x.x or higher

docker compose version
# Should show: Docker Compose version v2.x.x or higher
```

---

## Step 2: Start BotPe AI Databases

### Quick Start
```bash
# Navigate to project
cd /Users/rahul/BULID/BotPeAI

# Start databases (PostgreSQL + Redis)
docker compose up -d

# Verify they're running
docker ps
```

You should see two containers:
- `botpe-postgres` (Port 5432)
- `botpe-redis` (Port 6379)

### Test Database Connection
```bash
# Test PostgreSQL
psql -h localhost -U botpe -d botpe_dev
# Password: dev_password_123
# Type \q to exit

# Test Redis
redis-cli ping
# Should return: PONG
```

---

## Step 3: Initialize Database Schema

```bash
# Navigate to API directory
cd apps/api

# Generate Prisma Client
pnpm prisma:generate

# Push schema to database
pnpm prisma:push

# (Optional) Seed development data
pnpm prisma:seed
```

---

## Step 4: Start Development Servers

### Terminal 1 - Backend API
```bash
cd apps/api
pnpm dev
```
✅ Backend running on http://localhost:3001

### Terminal 2 - Frontend (when ready)
```bash
cd apps/web
pnpm dev
```
✅ Frontend running on http://localhost:3000

---

## Useful Docker Commands

### Check Status
```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# View container logs
docker logs botpe-postgres
docker logs botpe-redis

# Follow logs in real-time
docker logs -f botpe-postgres
```

### Stop & Start
```bash
# Stop databases
docker compose stop

# Start databases
docker compose start

# Restart databases
docker compose restart

# Stop and remove containers
docker compose down

# Stop and remove containers + volumes (⚠️ deletes data)
docker compose down -v
```

### Database Management
```bash
# Open Prisma Studio (database GUI)
cd apps/api
pnpm prisma:studio
# Opens on http://localhost:5555

# Access PostgreSQL shell
docker exec -it botpe-postgres psql -U botpe -d botpe_dev

# Access Redis CLI
docker exec -it botpe-redis redis-cli
```

### Troubleshooting
```bash
# If ports are already in use:
docker compose down
lsof -i :5432  # Check what's using PostgreSQL port
lsof -i :6379  # Check what's using Redis port

# Reset everything (⚠️ deletes all data)
docker compose down -v
docker compose up -d
cd apps/api
pnpm prisma:push
```

---

## Common Issues & Solutions

### Issue: "Docker daemon is not running"
**Solution**: Open Docker Desktop app, wait for it to fully start

### Issue: "Port 5432 already in use"
**Solution**: 
```bash
# Stop local PostgreSQL if installed
brew services stop postgresql
# OR change port in docker-compose.yml
```

### Issue: "Port 6379 already in use"
**Solution**:
```bash
# Stop local Redis if installed
brew services stop redis
# OR change port in docker-compose.yml
```

### Issue: "Permission denied"
**Solution**:
```bash
# On Mac, ensure Docker has full disk access:
# System Preferences > Security & Privacy > Privacy > Full Disk Access
# Add Docker.app
```

---

## Alternative: Cloud Databases (Skip Docker)

If you prefer not to install Docker, use cloud databases:

### Option 1: Neon (PostgreSQL)
1. Visit: https://neon.tech
2. Create free account
3. Create new project
4. Copy connection string
5. Update `apps/api/.env`:
   ```
   DATABASE_URL="postgresql://user:password@endpoint.neon.tech/dbname"
   ```

### Option 2: Upstash (Redis)
1. Visit: https://upstash.com
2. Create free account
3. Create Redis database
4. Copy connection string
5. Update `apps/api/.env`:
   ```
   REDIS_URL="redis://default:password@endpoint.upstash.io:6379"
   ```

---

## Next Steps After Docker Setup

1. ✅ Databases running
2. ✅ Schema pushed
3. 🔜 Start backend: `cd apps/api && pnpm dev`
4. 🔜 Build authentication system
5. 🔜 Initialize frontend
6. 🔜 Test WhatsApp integration

---

## Quick Reference

```bash
# Start everything
docker compose up -d && cd apps/api && pnpm dev

# Stop everything
docker compose stop

# Reset database
docker compose down -v && docker compose up -d && cd apps/api && pnpm prisma:push

# View database
cd apps/api && pnpm prisma:studio
```

---

**Status**: Ready to install Docker and continue development! 🚀
