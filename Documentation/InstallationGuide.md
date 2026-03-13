# Installation and Setup Guide

## Overview

This guide provides step-by-step instructions for setting up the Scholarslee MERN stack application. Follow these instructions to configure both development and production environments.

**Technology Stack**:
- **Frontend**: React 18.2, Vite 4.3, TailwindCSS
- **Backend**: Node.js, Express 5.1, MongoDB (Mongoose 8.19)
- **Real-time**: Socket.IO 4.8
- **Payment**: Stripe 20.0
- **Storage**: Cloudinary
- **Authentication**: JWT, Google OAuth 2.0

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Prerequisites](#prerequisites)
3. [Environment Configuration](#environment-configuration)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 2GB free space
- **Internet**: Stable broadband connection

### Software Requirements

| Software | Minimum Version | Recommended Version |
|----------|----------------|---------------------|
| Node.js | 18.x | 20.x LTS |
| npm | 9.x | 10.x |
| MongoDB | 6.0 | 8.0+ |
| Git | 2.30+ | Latest |

---

## Prerequisites

### 1. Install Node.js and npm

**Windows/macOS**:
1. Download from [https://nodejs.org](https://nodejs.org)
2. Run the installer
3. Verify installation:
```bash
node --version
npm --version
```

**Linux (Ubuntu/Debian)**:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install MongoDB

**Option A: MongoDB Atlas (Cloud - Recommended for Production)**
1. Create account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

**Option B: Local MongoDB Installation**

**Windows**:
1. Download from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run installer and follow wizard
3. Start MongoDB service

**macOS (Homebrew)**:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux**:
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### 3. Install Git

**Windows**: Download from [https://git-scm.com/download/win](https://git-scm.com/download/win)

**macOS**:
```bash
brew install git
```

**Linux**:
```bash
sudo apt-get install git
```

### 4. External Service Accounts

You'll need accounts for the following services:

- **Stripe** ([https://stripe.com](https://stripe.com)) - Payment processing
- **Cloudinary** ([https://cloudinary.com](https://cloudinary.com)) - Image/file storage
- **Resend** ([https://resend.com](https://resend.com)) - Email service
- **Google Cloud Console** ([https://console.cloud.google.com](https://console.cloud.google.com)) - OAuth & Calendar API

---

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `Backend` directory:

```bash
cd Backend
touch .env  # Linux/macOS
# or
echo. > .env  # Windows
```

Add the following variables to `Backend/.env`:

```env
# ======================
# SERVER CONFIGURATION
# ======================
NODE_ENV=development
PORT=5000

# ======================
# DATABASE
# ======================
MONGODB_URI=mongodb://localhost:27017/scholarslee
# For MongoDB Atlas use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scholarslee?retryWrites=true&w=majority

# ======================
# JWT AUTHENTICATION
# ======================
JWT_SECRET=(Contact Usairam Saeed for this)
JWT_EXPIRE=7d

# ======================
# FRONTEND URL
# ======================
# Development
FRONTEND_URL=http://localhost:3000
CLIENT_URL=http://localhost:3000

# Production 
# FRONTEND_URL=https://scholarslee.com
# CLIENT_URL=https://scholarslee.com

# ======================
# GOOGLE OAUTH 2.0
# ======================
GOOGLE_CLIENT_ID= (Contact Usairam Saeed)
GOOGLE_CLIENT_SECRET=(Contact Usairam Saeed)
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# For production:
# GOOGLE_CALLBACK_URL=https://api.scholarslee.com/api/auth/google/callback

# ======================
# GOOGLE MEET / CALENDAR
# ======================
GOOGLE_REDIRECT_URI=http://localhost:3000/mentor/google-meet/callback
GOOGLE_JAVASCRIPT_ORIGINS=http://localhost:3000,http://localhost:5000
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_SCOPE=https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events

# Optional: If you have pre-generated tokens
# GOOGLE_ACCESS_TOKEN=
# GOOGLE_REFRESH_TOKEN=
# GOOGLE_TOKEN_EXPIRY=

# ======================
# STRIPE PAYMENT
# ======================
STRIPE_SECRET_KEY=(Contact Usman Awan)
STRIPE_WEBHOOK_SECRET=(Contact Usairam Saeed)

# Success/Cancel URLs
STRIPE_SUCCESS_URL=http://localhost:3000/payment/success
STRIPE_CANCEL_URL=http://localhost:3000/payment/cancel

# For production:
# STRIPE_SECRET_KEY=sk_live_your_production_key
# STRIPE_SUCCESS_URL=https://scholarslee.com/payment/success
# STRIPE_CANCEL_URL=https://scholarslee.com/payment/cancel

# ======================
# CLOUDINARY (File Storage)
# ======================
CLOUDINARY_CLOUD_NAME=(Contact Usairam Saeed)
CLOUDINARY_API_KEY=(Contact Usairam Saeed)
CLOUDINARY_API_SECRET=(Contact Usairam Saeed)

# ======================
# EMAIL SERVICE (Resend)
# ======================
RESEND_API_KEY=(Contact Usairam Saeed)
EMAIL_FROM=Scholarslee <noreply@scholarslee.com>
```

### Frontend Environment Variables

Create a `.env` file in the `Frontend` directory:

```bash
cd Frontend
touch .env  # Linux/macOS
# or
echo. > .env  # Windows
```

Add the following to `Frontend/.env`:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# For production:
# VITE_API_URL=https://api.scholarslee.com/api

# Stripe Publishable Key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# For production:
# VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_production_publishable_key
```

### Environment Variable Descriptions

**Critical Variables** (Required):

| Variable | Description | How to Get |
|----------|-------------|------------|
| `MONGODB_URI` | MongoDB connection string | MongoDB Atlas dashboard or local: `mongodb://localhost:27017/scholarslee` |
| `JWT_SECRET` | Secret key for JWT tokens | Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `STRIPE_SECRET_KEY` | Stripe API secret key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `CLOUDINARY_*` | Cloudinary credentials | [Cloudinary Dashboard](https://cloudinary.com/console) |
| `RESEND_API_KEY` | Email API key | [Resend Dashboard](https://resend.com/api-keys) |
| `GOOGLE_CLIENT_ID` | OAuth client ID | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret | Google Cloud Console |

**Optional Variables**:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `JWT_EXPIRE` | Token expiration time | 7d |
| `EMAIL_FROM` | Email sender address | Scholarslee <onboarding@resend.dev> |

---

## Backend Setup

### Local Development Setup

1. **Clone the repository**:
```bash
git clone <repository-url>
cd Scholarslee
```

2. **Navigate to Backend directory**:
```bash
cd Backend
```

3. **Install dependencies**:
```bash
npm install
```

This will install all required packages including:
- express, mongoose, bcryptjs, jsonwebtoken
- stripe, cloudinary, socket.io
- nodemailer, passport, helmet, cors

4. **Configure environment variables**:
- Create `.env` file as described in [Environment Configuration](#backend-environment-variables)
- Ensure all required variables are set

5. **Seed admin user** (Optional but recommended):
```bash
npm run seed:admin
```

Default admin credentials:
- Email: `admin@scholarslee.com`
- Password: `admin123`

**⚠️ IMPORTANT**: Change admin password immediately after first login!

6. **Start development server**:
```bash
npm run dev
```

The server will start with **nodemon** (auto-restart on file changes) on `http://localhost:5000`

**Verify backend is running**:
- Open browser: `http://localhost:5000/health`
- Expected response: `{"status":"OK","message":"Server is running"}`

### Backend Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm run seed:admin` | Create default admin user |

### Production Setup (Render.com)

The backend is deployed on **Render.com**. Follow these steps:

1. **Create Render account**: Sign up at [https://render.com](https://render.com)

2. **Create new Web Service**:
   - Click "New" → "Web Service"
   - Connect your Git repository
   - Configure settings:
     - **Name**: `scholarslee-backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free or Starter (recommended)

3. **Set environment variables**:
   - Go to "Environment" tab
   - Add all variables from your `.env` file
   - Critical updates for production:
     ```env
     NODE_ENV=production
     FRONTEND_URL=https://scholarslee.com
     CLIENT_URL=https://scholarslee.com
     GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/google/callback
     STRIPE_SUCCESS_URL=https://scholarslee.com/payment/success
     STRIPE_CANCEL_URL=https://scholarslee.com/payment/cancel
     ```

4. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - Monitor deployment logs for errors

5. **Custom Domain** (Optional):
   - Go to "Settings" → "Custom Domain"
   - Add your domain (e.g., `api.scholarslee.com`)
   - Update DNS records as instructed

6. **Health Check**:
   - Verify: `https://your-backend.onrender.com/health`
   - Contact Usairam Saeed for this

---

## Frontend Setup

### Local Development Setup

1. **Navigate to Frontend directory**:
```bash
cd Frontend
```

2. **Install dependencies**:
```bash
npm install
```

This will install:
- react, react-dom, react-router-dom
- axios, socket.io-client
- tailwindcss, lucide-react, recharts

3. **Configure environment variables**:
- Create `.env` file as described in [Environment Configuration](#frontend-environment-variables)

4. **Start development server**:
```bash
npm run dev
```

The app will start on `http://localhost:3000`

**Vite features**:
- ⚡ Lightning-fast HMR (Hot Module Replacement)
- 🔥 Instant server start
- 📦 Optimized build

5. **Open in browser**:
```
http://localhost:3000
```

### Frontend Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code quality checks |

### Production Setup (Hostinger)

The frontend is deployed on **Hostinger** using static file hosting.

#### Build for Production

1. **Build the production bundle**:
```bash
cd Frontend
npm run build
```

This creates an optimized production build in the `dist/` directory.

**Build output**:
- Minified JavaScript bundles
- Optimized CSS
- Compressed assets
- Source maps (optional)

2. **Verify build locally**:
```bash
npm run preview
```

Preview at `http://localhost:4173`

#### Deploy to Hostinger

**Method 1: FTP Upload (Manual)**

1. **Connect to Hostinger via FTP**:
   - Use FileZilla or any FTP client
   - **Host**: Your Hostinger FTP hostname
   - **Username**: Your FTP username
   - **Password**: Your FTP password
   - **Port**: 21 (or 22 for SFTP)

2. **Upload build files**:
   - Navigate to `public_html` directory (or your domain's root)
   - Upload all contents from `Frontend/dist/` directory
   - Ensure `.htaccess` file is uploaded (for React Router support)

3. **Configure `.htaccess`** (if not present):

Create `Frontend/dist/.htaccess` before uploading:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Enable browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

**Method 2: Git Deployment (Automated)**

1. **Enable Git in Hostinger**:
   - Log in to Hostinger control panel
   - Go to "Advanced" → "Git"
   - Set up Git repository

2. **Configure build script**:
   - Add post-receive hook to build automatically
   - Or build locally and push `dist` folder

3. **Automated deployment workflow**:
```bash
# Build locally
npm run build

# Commit dist folder (if using Git for dist)
git add dist
git commit -m "Production build"
git push hostinger main
```

#### Post-Deployment Checklist

- [ ] Verify site loads at your domain
- [ ] Test all routes (React Router should work)
- [ ] Check API connectivity (backend communication)
- [ ] Test authentication flow
- [ ] Verify payment integration
- [ ] Test file uploads (Cloudinary)
- [ ] Check responsive design on mobile
- [ ] Verify SSL certificate is active

---

## Production Deployment

### Complete Production Checklist

#### Backend (Render)

- [ ] Set `NODE_ENV=production`
- [ ] Use production MongoDB URI (Atlas)
- [ ] Generate strong `JWT_SECRET` (64+ characters)
- [ ] Use Stripe live API keys
- [ ] Configure production `FRONTEND_URL`
- [ ] Set up SSL/HTTPS (automatic on Render)
- [ ] Enable Render auto-deploy from Git
- [ ] Set up health check monitoring
- [ ] Configure custom domain with DNS
- [ ] Seed admin user in production database

#### Frontend (Hostinger)

- [ ] Update `VITE_API_URL` to production backend URL
- [ ] Use Stripe live publishable key
- [ ] Build optimized production bundle
- [ ] Upload `.htaccess` for React Router
- [ ] Configure custom domain
- [ ] Enable SSL certificate (Let's Encrypt)
- [ ] Test all routes after deployment
- [ ] Clear browser cache after deploy

#### Security Best Practices

1. **Environment Variables**:
   - Never commit `.env` files to Git
   - Use different secrets for dev/prod
   - Rotate secrets regularly

2. **Database**:
   - Use MongoDB Atlas for production
   - Configure IP whitelist
   - Enable database backups
   - Use strong passwords

3. **API Keys**:
   - Use Stripe test keys in development
   - Use Stripe live keys in production only
   - Restrict API key permissions

4. **CORS Configuration**:
   - Whitelist only your frontend domain
   - Avoid using `*` wildcard in production

---

## Troubleshooting

### Common Issues

#### Backend Issues

**Problem**: `MONGODB_URI is not defined`

**Solution**:
```bash
# Verify .env file exists in Backend directory
ls -la Backend/.env

# Check environment variables are loaded
cd Backend
node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"
```

---

**Problem**: `Cannot connect to MongoDB`

**Solution**:
- Verify MongoDB service is running: `mongod --version`
- Check connection string format
- For Atlas: Verify IP whitelist includes your IP
- Check network access in MongoDB Atlas

---

**Problem**: `Port 5000 already in use`

**Solution**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
PORT=5001
```

---

**Problem**: `JWT malformed` or authentication errors

**Solution**:
- Clear browser localStorage
- Verify `JWT_SECRET` is set
- Check token format in Authorization header
- Ensure JWT_SECRET is same across restarts

---

**Problem**: Stripe webhook not working

**Solution**:
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:5000/api/webhooks/stripe`
- Verify `STRIPE_WEBHOOK_SECRET` matches
- Check webhook endpoint is POST-only

---

#### Frontend Issues

**Problem**: `VITE_API_URL is undefined`

**Solution**:
- Verify `.env` file exists in Frontend directory
- Restart Vite dev server after changing `.env`
- Check variable starts with `VITE_` prefix

---

**Problem**: API requests failing (CORS errors)

**Solution**:
- Verify backend CORS configuration includes frontend URL
- Check `FRONTEND_URL` and `CLIENT_URL` in backend `.env`
- Clear browser cache
- Test in incognito mode

---

**Problem**: 404 on page refresh (React Router)

**Solution**:
- Ensure `.htaccess` is uploaded (Hostinger)
- Configure web server to serve `index.html` for all routes
- For development: Use Hash Router as fallback

---

**Problem**: Build fails with memory errors

**Solution**:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

#### Database Issues

**Problem**: Slow query performance

**Solution**:
- Add missing indexes (check Database Design documentation)
- Use MongoDB Compass to analyze queries
- Enable query profiling in MongoDB

---

**Problem**: Connection pool exhausted

**Solution**:
- Increase connection pool size in database config
- Check for unclosed connections
- Implement connection retry logic

---

### Getting Help

If you encounter issues not covered here:

1. **Check logs**:
   - Backend: Console output or server logs
   - Frontend: Browser DevTools Console
   - Render: Deployment logs in dashboard

2. **Documentation**:
   - Review [API Documentation](./APIDocumentation.md)
   - Check [Database Design](./DatabaseDesign.md)
   - See [User Roles and Permissions](./UserRolesAndPermissions.md)

3. **Contact**:
   - Email: support@scholarslee.com
   - Development Team: [team contact info]

---

## Quick Start Summary

### For Absolute Beginners

**Complete setup in 5 steps**:

1. **Install prerequisites**:
```bash
# Install Node.js from nodejs.org
# Install MongoDB from mongodb.com or use Atlas
# Install Git from git-scm.com
```

2. **Clone and setup backend**:
```bash
git clone <repo-url>
cd Scholarslee/Backend
npm install
cp .env.example .env  # Create .env and fill in values
npm run seed:admin
npm run dev
```

3. **Setup frontend** (in new terminal):
```bash
cd Scholarslee/Frontend
npm install
cp .env.example .env  # Create .env and fill in values
npm run dev
```

4. **Access application**:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`
   - Health check: `http://localhost:5000/health`

5. **Login as admin**:
   - Email: `admin@scholarslee.com`
   - Password: `admin123`

---

**Document Version**: 1.0  
**Last Updated**: January 30, 2026  
**Prepared By**: Scholarslee Development Team  
**Next Review Date**: March 30, 2026
