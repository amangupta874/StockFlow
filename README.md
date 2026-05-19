# StockFlow

Modern full-stack inventory management SaaS for local stores and small businesses.

## Stack

- Client: React, Vite, Tailwind CSS, Framer Motion, React Router, Axios, React Icons, Chart.js, React Hot Toast
- Server: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Multer, Cloudinary
- Deployment targets: Vercel for `client`, Render/Railway for `server`, MongoDB Atlas for data

## Local Setup

```bash
npm install
npm run install:all
cp server/.env.example server/.env
```

Update `server/.env`:

```bash
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/stockflow
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

Cloudinary is optional for local testing. If configured, uploaded product images are stored in Cloudinary; otherwise image URLs still work.

## Run

```bash
npm run dev
```

Client: `http://localhost:5173`

Server: `http://localhost:5001/api/health`

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/dashboard/stats`

## Production Notes

- Set `VITE_API_URL` on Vercel to the deployed backend URL plus `/api`.
- Set `CLIENT_URL` on the backend to the deployed frontend URL.
- Use MongoDB Atlas for `MONGO_URI`.
- Use a long random `JWT_SECRET`.
- Configure Cloudinary variables for real product image uploads.
