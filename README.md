# StockFlow

Modern full-stack inventory management SaaS for local stores and small businesses.

## Stack

- **Client:** React (v19), Vite, Tailwind CSS, Framer Motion, React Router, Axios, React Icons, Chart.js, React Hot Toast
- **Server:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Multer, Cloudinary, SheetJS (xlsx)
- **Deployment Targets:** Full-stack on **Vercel** (via Serverless functions) or separated deployment (**Vercel** for Client + **Render / Railway** for Server) with **MongoDB Atlas** for data.

## Project Structure

```
stockFLOW/
├── api/             # Vercel serverless function entry (api/index.js)
├── client/          # React frontend (Vite, Tailwind, React Router)
├── server/          # Express backend (controllers, models, routes, middleware)
├── package.json     # Root orchestration (concurrently running dev servers)
├── vercel.json      # Vercel rewrite rules & build routing
└── README.md
```

## Local Setup

### 1. Install Dependencies

```bash
npm install
npm run install:all
```

### 2. Configure Environment Variables

Copy the example environment file and configure your local settings:

```bash
cp server/.env.example server/.env
```

> **Note:** Cloudinary is optional for local development. If not configured, product image URLs still work seamlessly.

### 3. Run Locally

Make sure MongoDB is running locally (`mongod`), then run:

```bash
npm run dev
```

- **Client:** `http://localhost:5173`
- **Server:** `http://localhost:5001/api/health`

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register new owner account and store
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/profile` — Fetch authenticated user profile

### Products & Inventory
- `GET /api/products` — List products (supports filtering, searching, and pagination)
- `POST /api/products` — Create new product (supports image upload / URL)
- `PUT /api/products/:id` — Update product details or stock count
- `DELETE /api/products/:id` — Remove a product
- `POST /api/products/import` — Bulk import products from Excel/CSV sheet

### Dashboard & Analytics
- `GET /api/dashboard/stats` — Metrics for total inventory, value, low stock count, and categories

### Notifications
- `GET /api/notifications` — Fetch user stock alerts and notifications
- `PATCH /api/notifications/:id/read` — Mark notification as read
- `PATCH /api/notifications/read-all` — Mark all notifications as read

### System
- `GET /api/health` — API health check

## Deployment Options

### Option A: All-in-One on Vercel (Recommended)
This repository includes `vercel.json` and `api/index.js` to run the React client and serverless Express backend in a single deployment:
1. Import repository to Vercel.
2. In Vercel **Project Settings → Environment Variables**, add:
   - `MONGO_URI`: Your MongoDB Atlas connection string (`mongodb+srv://...`)
   - `JWT_SECRET`: A long secure random string
   - `NODE_ENV`: `production`
   - *(Optional)* Cloudinary credentials (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)

### Option B: Separated Hosting (Client on Vercel, Server on Render/Railway)
1. Deploy `server/` to Render or Railway. Set environment variables (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`).
2. Deploy `client/` to Vercel with Root Directory set to `client`.
3. Set `VITE_API_URL` in Vercel to `https://your-backend.onrender.com/api`.

