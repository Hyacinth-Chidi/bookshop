# 📚 ESUT Bookshop

A modern book availability and management system for Enugu State University of Technology (ESUT) Bookshop.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Express](https://img.shields.io/badge/Express-4.x-green?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

## 🚀 Features

- **Book Catalog** - Browse and search books by faculty, department, level, and semester
- **Admin Dashboard** - Manage books, sub-admins, and system settings
- **Real-time Stock** - Track book availability and quantities
- **Image Uploads** - Cloudinary integration for book covers
- **Secure Auth** - JWT-based authentication with HttpOnly cookies
- **Responsive Design** - Works on all devices

## 📁 Project Structure

```
esut-bookshop/
├── backend/          # Express.js API (Node.js)
│   ├── src/
│   ├── prisma/
│   └── Dockerfile
├── frontend/         # Next.js 16 App
│   ├── app/
│   ├── components/
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

## 🛠️ Tech Stack

| Layer    | Technology                               |
| -------- | ---------------------------------------- |
| Frontend | Next.js 16, TanStack Query, Tailwind CSS |
| Backend  | Express.js, Prisma ORM, Zod              |
| Database | PostgreSQL 15                            |
| Auth     | JWT, HttpOnly Cookies                    |
| Images   | Cloudinary                               |
| Email    | Resend                                   |
| Deploy   | Docker, Nginx                            |

## ⚡ Quick Start (Docker)

### Prerequisites

- Docker Desktop installed

### Run Locally

```bash
# Clone the repo
git clone https://github.com/Hyacinth-Chidi/bookshop.git
cd bookshop

# Copy environment file
cp .env.example .env
# Edit .env with your values

# Start all services
docker compose up --build

# Access the app
# Frontend: http://localhost:3000
# Backend:  http://localhost:5001
# Adminer:  http://localhost:8080
```

### Seed Database

```bash
docker exec esut_backend npx prisma db push
docker exec esut_backend node src/seed/seedAdmin.js
docker exec esut_backend node src/seed/seedFaculties.js
docker exec esut_backend node src/seed/seedDepartments.js
```

## 🔧 Environment Variables

See `.env.example` for all required variables:

| Variable            | Description              |
| ------------------- | ------------------------ |
| `DB_USER`           | PostgreSQL username      |
| `DB_PASSWORD`       | PostgreSQL password      |
| `DB_NAME`           | Database name            |
| `JWT_ACCESS_SECRET` | JWT signing secret       |
| `CLOUDINARY_*`      | Image upload credentials |
| `RESEND_API_KEY`    | Email service key        |

## 📦 Deployment

See the [Deployment Guide](./docs/deployment.md) for VPS setup instructions.

**Quick Deploy:**

1. SSH into your VPS
2. Clone this repo to `/var/www/esut-bookshop`
3. Create production `.env`
4. Run `docker compose up -d --build`
5. Configure Nginx reverse proxy
6. Get SSL certificate with Certbot

## 🔐 Default Admin

After seeding, login with:

- **Username:** `admin`
- **Password:** Set in `ADMIN_PASSWORD` env var

## 📄 License

MIT © ESUT Bookshop
