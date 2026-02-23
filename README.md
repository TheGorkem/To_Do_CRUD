# TodoFlow

A production-grade TODO application built with React 18, TypeScript, Vite, and Tailwind CSS. It follows clean architecture principles with a scalable folder structure, reusable UI components, and optimized rendering for real-world usage.

## Tech Stack

- React 18+
- TypeScript
- Vite
- Tailwind CSS
- ESLint + Prettier
- Netlify (deployment)

## Features

- Create, read, update, delete tasks
- Toggle completion status
- Filter by Tümü / Aktif / Tamamlandı
- LocalStorage persistence
- Edit mode via modal
- Empty, loading, and error UI states
- Dark/Light theme toggle with persisted preference
- Undo after delete (5 seconds)
- Performance optimizations (memoization, stable handlers)

## Project Structure

```
src/
 ├── components/    # Reusable UI building blocks (Button, Input, Card, Modal, etc.)
 ├── pages/         # Route-level pages (Home)
 ├── interfaces/    # Data models and shared types
 ├── hooks/         # Custom hooks (useTodos)
 ├── services/      # External integrations (LocalStorage)
 ├── utils/         # Helpers (ids, date formatting, classnames)
 ├── constants/     # Static configuration and constants
 └── App.tsx        # App entry
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Environment variables

Copy the example file and adjust as needed:

```bash
cp .env.example .env
```

### 3) Run locally

```bash
npm run dev
```

### 4) Production build

```bash
npm run build
```

### 5) Preview production build

```bash
npm run preview
```

## Linting & Formatting

```bash
npm run lint
npm run format
```

## Testing

```bash
npm run test
npm run test:coverage
```

Covered areas:
- `useTodos` CRUD/filter reducer flows
- `storage` error handling for invalid JSON and write failures
- `Home` page critical UI flows (add/filter/theme)

## Deployment to Netlify

### Option A: Netlify UI

1. Push this repository to GitHub.
2. In Netlify, click **Add new site** → **Import an existing project**.
3. Choose GitHub and select the repo.
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variables (from `.env`) if needed.
7. Deploy.

### Option B: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## Production Build Verification

Run:

```bash
npm run build
```

Ensure the `dist/` folder is generated without errors.

## CI Quality Gate

GitHub Actions workflow at `.github/workflows/ci.yml` enforces:
- `npm run lint`
- `npm run build`
- `npm run test`

This keeps PR acceptance aligned with lint + build + test policy.

## Observability Prep (Optional)

Recommended insertion points for error reporting tools (e.g. Sentry):
- `src/main.tsx`: initialize SDK once at app bootstrap.
- `src/services/storage.ts`: capture storage read/write failures.
- `src/hooks/useTodos.ts`: capture reducer-side unexpected state transitions.
