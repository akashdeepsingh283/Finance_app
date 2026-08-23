# Finance App (MERN)

A full-stack MERN finance/budget application with a separate **frontend** (React + Vite) and **backend** (Express + MongoDB).

## Project Structure

```
Finance_app/
├── frontend/          # React + Vite client (port 5173)
│   ├── src/
│   │   ├── api/       # API client & service functions
│   │   ├── components/ # Reusable UI components
│   │   ├── context/   # Auth context & route guards
│   │   ├── features/  # Feature-specific components
│   │   ├── layouts/   # Layout components
│   │   └── pages/     # Page-level components
│   ├── public/        # Static assets
│   └── package.json
│
├── backend/           # Express + MongoDB API (port 5001)
│   └── src/
│       ├── config/    # Database configuration
│       ├── controllers/ # Route controllers
│       ├── middleware/  # Auth & error handling
│       ├── models/      # Mongoose models
│       ├── routes/      # Express routers
│       └── utils/       # Helpers & validators
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Getting Started

### 1. Install dependencies

```bash
# Install dependencies for all workspaces (frontend + backend)
npm install
```

### 2. Configure environment variables

**Backend** — copy `backend/.env.example` to `backend/.env` and fill in:

```
PORT=5001
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/finance_app   # or your Atlas URI
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=7d
```

**Frontend** — copy `frontend/.env.example` to `frontend/.env`:

```
VITE_API_URL=http://localhost:5001/api
```

### 3. Run the development servers

```bash
# Runs both client (5173) and server (5001) concurrently
npm run dev

# Or run them individually
npm run dev:client
npm run dev:server
```

The frontend runs at `http://localhost:5173` and the API at `http://localhost:5001`. The Vite dev server proxies `/api` requests to the backend.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run frontend + backend concurrently |
| `npm run dev:client` | Run only the React client |
| `npm run dev:server` | Run only the Express server |
| `npm run build` | Build the frontend for production |
| `npm run start` | Start the backend for production |

## Tech Stack

- **M**ongoDB + Mongoose
- **E**xpress.js
- **R**eact 19 + Vite
- **N**ode.js
- Tailwind CSS + shadcn/ui components
- JWT authentication with bcryptjs

## API Endpoints

```
POST /api/auth/register     # Register a new user
POST /api/auth/login        # Login and get a JWT token
GET  /api/auth/me           # Get current user (protected)
GET  /api/dashboard         # Dashboard summary (protected)
GET/POST /api/budgets       # List/create budgets
GET/PATCH/DELETE /api/budgets/:id
GET/POST /api/budgets/:budgetId/expenses
GET/POST /api/expenses      # List/create expenses
GET/PATCH/DELETE /api/expenses/:id
```

See `backend/README.md` for full API details.