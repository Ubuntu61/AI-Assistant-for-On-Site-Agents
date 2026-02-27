# 🚀 AI-Powered Product Showcase & Atomic CRM

[![Stack](https://img.shields.io/badge/Stack-Next.js%20|%20Supabase%20|%20Dify%20|%20Tailwind-blue)](https://github.com/Ubuntu61/AI-Assistant-for-On-Site-Agents)

An integrated solution for modern businesses, combining a high-performance **Product Showcase Website** with a powerful **Atomic CRM** and an **AI Sales Copilot**.

---

## ✨ Features

### 🌐 Industrial-Grade Product Showcase
- **Modern UI/UX**: Built with Next.js 14, Tailwind CSS, and shadcn/ui.
- **Interactive Data Visualization**: Real-time dashboards for energy, production, and data trends.
- **Seamless Lead Capture**: Integrated forms that sync directly with the CRM.

### 🤖 Intelligent Sales Copilot
- **AI-Driven Interactions**: Powered by Dify & Qwen (Tongyi Qianwen) for natural language reasoning.
- **Context-Aware Assistance**: Helps customers find products and answers technical queries in real-time.

### 📊 Atomic CRM Backend
- **Lead & Contact Management**: Robust tracking of customer interactions and sales pipelines.
- **Supabase Integration**: Real-time database updates and secure authentication.
- **Extensible Architecture**: Easy to customize for various industrial or commercial needs.

---

## 🛠 Directory Structure

- `/web`: Next.js frontend application.
- `/crm`: React-based CRM admin panel & Supabase migrations.
- `docker-compose.yml`: AI engine infrastructure (Dify).

---

## 🚀 Deployment Guide (Another Server)

Follow these steps to deploy this entire stack on any Linux server (e.g., Ubuntu).

### 1. Environment Setup
Install the necessary tools if you haven't already:
```bash
# Install Node.js & Docker
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs docker-ce docker-compose-plugin
sudo npm install -g pm2
```

### 2. Clone and Install
```bash
git clone https://github.com/Ubuntu61/AI-Assistant-for-On-Site-Agents.git
cd AI-Assistant-for-On-Site-Agents
```

### 3. Database Services (Docker)
We use Supabase CLI for the easiest local DB setup:
```bash
cd crm
npm install
npx supabase start  # Spins up Postgres, Auth, and applies migrations
```

### 4. AI Infrastructure (Docker)
Start the Dify AI engine from the root directory:
```bash
cd ..
docker compose up -d
```

### 5. Launch the Applications
**Start the Website (Production Mode):**
```bash
cd web
npm install
npm run build
pm2 start npm --name "web-app" -- start
```

**Start the CRM:**
```bash
cd ../crm
# For production, you may want to build and serve static files
npm run build
# You can serve the 'dist' folder using a web server or 'serve' package
```

---

## 🔐 Environment Variables
Make sure to copy `.env.example` to `.env.local` in both `web/` and `crm/` folders and fill in your Supabase and Dify credentials for the production environment.

## 📄 License
This project is licensed under the MIT License.
