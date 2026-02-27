# My Product Site & Atomic CRM

This repository contains the full stack for the product website and its associated CRM.

## Directory Structure

- `web/`: The main website built with Next.js.
- `crm/`: The CRM admin panel and Supabase database configuration.
- `docker-compose.yml`: Configuration for running the Dify AI engine.

## Quick Start (New Server with Docker)

### 1. Prerequisites
- Node.js v18+
- Docker & Docker Compose

### 2. Database Setup
Inside the `crm` directory:
```bash
npx supabase start
```
This will start the local Supabase instance and apply all migrations automatically.

### 3. AI Engine Setup (Dify)
In the root directory:
```bash
docker compose up -d
```

### 4. Running the Apps
**Website:**
```bash
cd web
npm install
npm run build
npm run start
```

**CRM:**
```bash
cd crm
npm install
npm run dev
```

## Deployment without Docker
If you prefer not to use Docker for production, please refer to [Supabase Cloud](https://supabase.com) and update your `.env.local` files accordingly.
