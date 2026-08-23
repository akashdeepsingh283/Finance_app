# Finance API

Standalone Express and MongoDB API for the finance app. It uses JWT bearer tokens and scopes every budget and expense query to the signed-in user.

## Run locally

1. Copy `.env.example` to `.env` and supply a MongoDB connection string and a long `JWT_SECRET`.
2. From this directory, run `npm install`.
3. Run `npm run dev`.

The API runs at `http://localhost:5001` by default. `GET /api/health` is public.

## Authentication

`POST /api/auth/register` accepts `{ "name", "email", "password" }` and `POST /api/auth/login` accepts `{ "email", "password" }`. Both return a `token`.

For protected routes, send:

```
Authorization: Bearer <token>
```

`GET /api/auth/me` returns the currently signed-in user.

## Budget and expense routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/dashboard` | Fetch the dashboard's `overview`, budget summaries, and expense list in one request. |
| GET, POST | `/api/budgets` | List or create the current user's budgets. |
| GET, PATCH, DELETE | `/api/budgets/:id` | Read, update, or delete one owned budget. Deleting a budget also deletes its expenses. |
| GET, POST | `/api/budgets/:budgetId/expenses` | List or create expenses for an owned budget. |
| GET, POST | `/api/expenses` | List all owned expenses or create one with `budgetId` in the JSON body. `GET` accepts `?budgetId=`. |
| GET, PATCH, DELETE | `/api/expenses/:id` | Read, update, or delete one owned expense. |

Budget payloads use `{ name, amount, icon }`. Expense payloads use `{ name, amount, budgetId, date? }`. Budget list/detail responses include `totalSpend`, `totalItem`, and `remainingAmount` to retain the dashboard calculations from the original app.
