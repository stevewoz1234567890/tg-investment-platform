# tg-investment-platform

Full-stack monorepo for the TG investment product: React client, Express API, MongoDB, Socket.IO, and payment integrations (Stripe, PayPal, CoinPayments).

## Repository layout

```
tg-investment-platform/
├── README.md           # This file
├── package.json        # Root scripts (install all, build, start helpers)
├── frontend/           # Create React App (UI)
├── backend/            # Express server, routes, models
│   ├── .env.example
│   └── scripts/        # e.g. model smoke tests
└── .gitignore
```

## Prerequisites

- **Node.js** 18+ (20+ recommended for some frontend dependencies)
- **MongoDB** (local, Docker, or Atlas)

## Setup

1. **Environment**

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

   Edit `backend/.env` (database, `JWT_SECRET`, payment keys) and `frontend/.env` (`REACT_APP_SERVER_URL`, `REACT_APP_WS_SERVER_URL`, publishable keys).

   For Create React App development overrides, you can add `frontend/.env.development` (same variable names; CRA loads it automatically in dev).

2. **Install dependencies**

   ```bash
   npm run install:all
   ```

   Or run `npm install` inside `frontend/` and `backend/` separately.

## Development

Use two terminals:

```bash
npm run start:backend    # API — default http://localhost:5000
npm run start:frontend   # CRA dev server — port from `frontend/.env` (e.g. 3030)
```

Ensure the frontend env points `REACT_APP_SERVER_URL` and `REACT_APP_WS_SERVER_URL` at the running API.

More detail on the React app: see [frontend/README.md](frontend/README.md).

## Production

Build the SPA, then run the Node server (it serves `../frontend/build` when that folder exists):

```bash
npm run build
cd backend && npm start
```

Configure production `backend/.env` (`JWT_SECRET`, MongoDB, Stripe/PayPal/CoinPayments, and optionally `PUBLIC_API_URL` / `COINPAYMENTS_IPN_URL` for webhooks).

## Backend tests

Requires a running MongoDB instance. Example:

```bash
# Optional: default in scripts/check-stats-models.js is mongodb://127.0.0.1:27018/
export MONGO_URI=mongodb://127.0.0.1:27017/your_test_db
cd backend && npm test
```

## Clean generated files

From the repository root:

```bash
npm run clean          # removes frontend/build only
npm run clean:all      # removes frontend/build and both node_modules trees (re-run install:all after)
```

## Security

- Do **not** commit `.env` files or private keys.
- If secrets were ever pushed to git, **rotate** them in each provider’s dashboard and consider cleaning history (e.g. `git filter-repo`).

## License

See the repository owner for licensing.
