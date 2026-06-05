# Hssabna Admin Backoffice - Resume

## 1. Overview

The Hssabna Admin Backoffice is a separate React admin dashboard used to operate and monitor the Hssabna shared-expense product. It lives entirely inside `admin-backoffice` and is independent from the end-user application in `user-app`.

This admin app is designed for internal operations, support, security, finance, and product teams. Its UI and sample data are clearly tailored to Moroccan shared-expense workflows, with `MAD` as the default currency, Morocco-specific cities, receipt-scanning flows, settlement follow-up, and reminder tone management across local languages.

At the moment, the backoffice is a standalone frontend prototype with mock authentication, mocked admin data, and protected routes. It already demonstrates the intended operational surface for reviewing users, groups, expenses, receipts, settlements, support issues, security signals, analytics, configuration, and audit activity.

## 2. Technology Stack

Detected from `admin-backoffice/package.json`:

- React
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- TanStack Query
- TanStack Table
- Zustand
- Recharts
- Lucide React
- Zod
- React Hook Form
- Axios
- Sonner
- Radix UI Dialog
- class-variance-authority
- clsx
- tailwind-merge

## 3. Main Purpose

The main purpose of the admin dashboard is to give internal teams a dedicated operational cockpit for the Hssabna product without mixing admin concerns into the user-facing app.

Implemented or clearly represented in the current code:

- Manage users and inspect user profiles
- Manage groups and review group health
- Manage shared expenses and inspect expense details
- Review receipt scans and OCR confidence
- Monitor settlements and manual reversals
- Manage reminders and tone templates
- Handle support tickets
- Review security and fraud-adjacent signals
- Control remote configuration and feature flags
- View analytics and audit logs

## 4. Folder Structure

```text
src/
  components/
  features/
  lib/
  store/
  types/
  styles/
```

- `src/components/`
  Reusable UI building blocks, including layout shell pieces, common admin controls, charts, the generic data table, and Hssabna-specific widgets such as receipt previews, tone templates, remote config editing, settlement graphs, and trust/health cards.
- `src/features/`
  Route-level pages grouped by admin domain: auth, dashboard, users, groups, expenses, receipts, settlements, reminders, support, security, analytics, config, and audit.
- `src/lib/`
  Frontend support logic, including the mock API wrapper, mock datasets, formatting helpers, utility helpers, mock auth definitions, and role/permission mappings.
- `src/store/`
  Zustand state stores for authentication and UI preferences such as theme and text direction.
- `src/types/`
  Domain types for admins, users, groups, expenses, settlements, and support tickets.
- `src/styles/`
  Shared global styling, theme variables, and Tailwind-powered design primitives.

## 5. Routes / Pages

Routes detected from `src/router.tsx`:

- `/`
  Redirects to `/admin`.
- `/login`
  Mock admin login page for the isolated backoffice app.
- `/admin`
  Protected overview dashboard with metrics, charts, and Hssabna-specific trust/health widgets.
- `/admin/users`
  User management table with search, status/risk indicators, and sensitive admin actions.
- `/admin/users/:id`
  User detail page showing profile, risk/status, paid/owed totals, notes, related groups, and placeholder admin actions.
- `/admin/groups`
  Group management table with group type, member count, MAD volume, unsettled amount, health score, and status.
- `/admin/groups/:id`
  Group detail page with summary cards, members, settlement graph, and group-sensitive actions such as freezing the group.
- `/admin/expenses`
  Expense management table with category, source, amount, OCR confidence, and status.
- `/admin/expenses/:id`
  Expense detail page with receipt preview, OCR notes, and placeholder remediation actions.
- `/admin/receipts`
  Receipt review center focused on receipt-scan expenses and OCR confidence preview cards.
- `/admin/settlements`
  Settlement monitoring table with sender, receiver, group, method, amount, status, and time to settle.
- `/admin/reminders`
  Reminder operations page with campaign ideas and a tone-template studio.
- `/admin/support`
  Support inbox page with ticket list and a money-tension detection rule summary.
- `/admin/security`
  Security monitoring page with high-level suspicious activity counters and protected actions.
- `/admin/analytics`
  Analytics page with user growth, expense volume, category breakdown, and insight placeholders.
- `/admin/config`
  Remote configuration page for flags, rollout values, and maintenance-related controls.
- `/admin/audit`
  Audit log page with actor, action, target, reason, severity, and timestamp.

All `/admin/*` routes are protected by `ProtectedLayout`, which redirects unauthenticated users to `/login`.

## 6. Key Features

### Dashboard

Implemented:

- Metric cards for total users, active users today, total groups, total expenses, tracked MAD volume, pending settlements, open support tickets, and suspicious activity
- Recharts visualizations for expense volume, user growth, and category breakdown
- Hssabna-specific widgets for `Friendship Health Score` and `Awkwardness Risk`
- Spending-moment ranking cards
- Split-expense signal summaries for settlement velocity, receipt scan confidence, and reminder conversion rate

### Users

Implemented:

- User table powered by TanStack Table
- Global search input inside the shared `DataTable`
- Display of city, platform, app version, status, risk score, and last active time
- User detail page with totals paid and owed in MAD
- Internal notes section
- Related-groups section
- Protected admin action buttons such as block, anonymize, force logout, reset verification, mark trusted, and export user data
- Reason-required dialog for sensitive user actions

Planned / TODO:

- The filter chips shown above the table are currently visual only
- The action buttons do not persist real changes yet
- The audit timeline on the detail page is static placeholder content

### Groups

Implemented:

- Group list with type, member count, total volume, unsettled amount, health score, and status
- Group detail page with members and financial summary cards
- `Who Owes Whom` settlement graph widget
- Sensitive group action flow using the reason-required dialog for freezing a group

Planned / TODO:

- Group actions such as disabling invite links, recalculating balances, and exporting ledgers are UI-only for now
- Group health is represented as a score/status but there is no live calculation engine in the frontend

### Expenses

Implemented:

- Expense list with amount, category, source, status, and OCR confidence
- Distinction between `manual`, `receipt_scan`, and `payment_confirmation` sources
- Expense detail page with merchant receipt preview and OCR extraction notes
- Split metadata via the `splitBetween` domain field in mock data

Planned / TODO:

- The filter chips are presentational only
- The detail-page action buttons such as re-run OCR and re-run split calculation are not connected to a backend workflow

### Receipt Center

Implemented:

- A dedicated receipt-review page
- OCR queue behavior based on filtering expenses with `source === "receipt_scan"`
- Receipt preview cards
- Confidence score display
- Warning cards for receipt weirdness, duplicate receipts, blurry images, and impossible totals

Planned / TODO:

- No actual manual correction editor exists yet
- The weirdness and duplicate warnings are informational UI cards, not computed detectors in the current code

### Settlements

Implemented:

- Settlement table with sender, receiver, group, method, amount, status, and time-to-settle hours
- Summary cards for calculation runs, transfer reduction, failed calculations, and recalculation messaging
- Manual reversal flow with reason capture

Planned / TODO:

- The minimized transfer engine is implied by the "Average transfer reduction" card but not implemented in code here
- Buttons such as mark resolved, open dispute, and add proof are UI-only today

### Reminders

Implemented:

- Reminder campaign list with multiple tone/channel scenarios
- `Tone Studio` component that renders reminder templates from data
- Darija, French, and English examples in the mock template set

Planned / TODO:

- Channels such as WhatsApp are referenced as future testing, not as active integrations
- Reminder status tracking is not implemented as a real dataset or queue

### Support

Implemented:

- Support ticket list with subject, user, priority, status, assigned admin, and linked entity
- Status badge rendering
- "Money Tension Detector" rule description with bilingual/shared-expense wording cues like "receipt wrong," "he didn't pay," and "ana khalest"

Planned / TODO:

- There is no dedicated ticket detail page yet
- The detector is described in the UI but not implemented as a processing engine in this frontend

### Security

Implemented:

- High-level suspicious activity counters
- Security dashboard cards for duplicate accounts, high-frequency invite links, unusual expense amounts, and repeated failed OCR scans
- Permission-gated actions for blocking users, requiring re-verification, freezing groups, and disabling settlement

Planned / TODO:

- No investigation timeline or case-management workflow exists yet
- Fraud indicators are currently mock counters, not live computed signals

### Analytics

Implemented:

- User growth chart
- Expense volume chart
- Category breakdown chart
- Analytics idea cards for city comparisons, unsettled balance heatmap, reminder timing, and app version adoption

Planned / TODO:

- City/platform/app-version insights are represented as placeholder panels, not computed dashboards

### Configuration

Implemented:

- Remote config editing form driven by current config values
- Feature flags such as receipt scanning, smart reminders, spending insights, Darija reminders, group invite links, one-tap pay, payment proof upload, and offline expense draft
- Maintenance-related values including `maintenanceMode`, `minimumAppVersion`, `forceUpdateMessage`, cooldowns, rollout rules, group-size limits, and invite-link expiration
- Reason-required flow before proposing a config change

Planned / TODO:

- Config changes are proposed through UI and toast feedback only
- There is no persisted backend rollout system yet

### Audit Logs

Implemented:

- Audit log table with actor, action, target, reason, severity, and timestamp
- Example sensitive actions such as blocking a user, freezing a group, reversing a settlement, changing remote config, and changing permissions

Planned / TODO:

- Sensitive actions in the UI currently collect reasons, but they do not append real persisted audit entries yet

## 7. Mock Authentication

The current login system is development-only mock authentication.

Implemented behavior:

- Credentials are defined in `src/lib/auth.ts`
- Login validation uses `validateMockCredentials`
- Successful login loads a mock admin user with the `super_admin` role
- Session state is stored locally using Zustand `persist`
- The persistence key is `hssabna-admin-auth`
- Protected admin routes redirect to `/login` when `isAuthenticated` is false

Current mock credentials:

Email:
`admin@hssabna.site`

Password:
`admin123`

This is for development only and must be replaced with real backend authentication before production.

## 8. Permissions and Roles

The permissions model exists in a lightweight but real form.

Available roles from `src/types/admin.ts` and `src/lib/permissions.ts`:

- `super_admin`
- `operations_admin`
- `support_agent`
- `finance_reviewer`
- `security_analyst`
- `content_manager`
- `read_only_analyst`

Available permissions:

- `users.read`
- `users.write`
- `users.block`
- `groups.read`
- `groups.write`
- `expenses.read`
- `expenses.write`
- `settlements.read`
- `settlements.write`
- `support.read`
- `support.write`
- `config.read`
- `config.write`
- `analytics.read`
- `security.read`
- `security.write`
- `audit.read`
- `admins.manage`

How it works:

- `rolePermissions` maps each admin role to its allowed permission list
- `mockAdmin` is currently assigned the `super_admin` permission set
- `PermissionGate` reads the current admin permissions from `useAuthStore`
- `PermissionGate` conditionally renders sensitive controls only when the required permission is present

Protected actions currently visible in the UI include:

- Blocking or anonymizing users
- Force logout and other user-modification actions
- Security actions such as require re-verification or disable settlement
- Group freezing

What is not fully implemented yet:

- There is no backend-issued permission claim system
- Route-level authorization beyond login is not implemented; protection is mainly UI-level rendering
- Role switching and admin management screens do not exist yet

## 9. Data Source

The app currently uses mock data and a local mock API wrapper.

Current structure:

- Mock datasets live in `src/lib/mock-data.ts`
- The API facade lives in `src/lib/api.ts`
- `api.ts` exposes async functions like `getUsers`, `getGroups`, `getExpenses`, and `getRemoteConfig`
- These functions return delayed mock results through a `delay(...)` helper to simulate network behavior
- An Axios instance exists with `baseURL` from `VITE_API_BASE_URL` or `/api/admin`, but it is not used for live requests yet

This means the app is not currently connected to a real backend API.

To replace the mock layer later:

1. Swap the `delay(...)` returns in `src/lib/api.ts` for real `axios` calls.
2. Move domain seed data out of `src/lib/mock-data.ts`.
3. Replace mock auth in `src/lib/auth.ts` and `src/store/authStore.ts` with backend sessions or token-based auth.
4. Load permissions from backend claims instead of static role maps.

## 10. Moroccan / Hssabna-Specific Details

The admin app is strongly localized to the Hssabna product context.

Detected product-specific details include:

- `MAD` currency formatting via `Intl.NumberFormat("fr-MA", { currency: "MAD" })`
- Moroccan cities in sample users, including Casablanca, Rabat, Marrakech, Tangier, Agadir, and Fes
- Moroccan sample names and localized support/admin wording
- Shared-expense group types such as trip, roommates, dinner, rent, and taxi
- Receipt-scan and OCR workflows
- Darija reminder examples such as `Tfkira sghira: baqi khassk tsafi l7ssab.`
- French reminder copy and Morocco-local rollout language
- Settlement optimization language around reducing transfers
- Fraud/support workflows centered on money tension, payment disputes, proof mismatches, and shared-device suspicion
- Product metrics like friendship health, awkwardness risk, reminder conversion, and receipt scan confidence

## 11. How To Run

```bash
cd admin-backoffice
npm install
npm run dev
```

The app is a standalone Vite SPA and can also be built separately from the user app.
