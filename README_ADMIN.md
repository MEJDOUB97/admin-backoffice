# Hssabna Admin Back Office

This admin app is independent from the user app.
It is located at `/admin-backoffice`.
The user app is located at `/user-app`.

Run from repository root:

```bash
npm run admin:dev
```

Or run directly:

```bash
cd admin-backoffice
npm run dev
```

## Mock login

- Email: `admin@hssabna.site`
- Password: `admin123`

This uses mocked Zustand/localStorage auth inside `admin-backoffice` only.

## Stack

- React 18
- Vite
- TypeScript
- React Router
- Tailwind CSS
- TanStack Query
- TanStack Table
- React Hook Form
- Zod
- Recharts
- Lucide React
- Zustand
- Radix Dialog

## Folder structure

```text
admin-backoffice/
  package.json
  README_ADMIN.md
  src/
    components/
    features/
    lib/
    store/
    styles/
    types/
```

## Connect real APIs later

1. Replace mocked methods in `src/lib/api.ts` with real HTTP calls.
2. Move sample data out of `src/lib/mock-data.ts`.
3. Replace `src/lib/auth.ts` and `src/store/authStore.ts` with backend auth tokens or session cookies.
4. Populate permissions from backend claims instead of static role maps.

## Permission system

- Roles are defined in `src/types/admin.ts`
- Permission mappings live in `src/lib/permissions.ts`
- UI access checks use `src/components/common/PermissionGate.tsx`
- Sensitive actions use `ReasonRequiredDialog` and are intended to create audit entries

## Suggested backend endpoints

- `POST /admin/auth/login`
- `POST /admin/auth/logout`
- `GET /admin/dashboard`
- `GET /admin/users`
- `GET /admin/users/:id`
- `PATCH /admin/users/:id`
- `GET /admin/groups`
- `GET /admin/groups/:id`
- `GET /admin/expenses`
- `GET /admin/expenses/:id`
- `GET /admin/receipts`
- `GET /admin/settlements`
- `PATCH /admin/settlements/:id`
- `GET /admin/support/tickets`
- `GET /admin/security`
- `GET /admin/analytics`
- `GET /admin/config`
- `PATCH /admin/config`
- `GET /admin/audit`

## Deployment suggestion

- Build `admin-backoffice` as a standalone static SPA
- Serve it from a dedicated admin domain or subpath
- Keep admin auth, API base URL, and access controls isolated from the user app
