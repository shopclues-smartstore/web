# SmartStore Seller UI - PRD

## Original Problem Statement
Build the Seller-side application UI for SmartStore - a public, end-user facing product used by sellers. UI ONLY with no backend logic, no API calls, using placeholder/mock data.

## Architecture
- **Stack**: Vite + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Toasts**: Sonner
- **Design System**: shadcn/ui (new-york style) with custom palette

## What's Been Implemented

### Auth & Shell
- [x] Signup, Login, Forgot Password pages
- [x] App Shell with header, collapsible sidebar, dashboard

### Onboarding Flow
- [x] Choose Plan, Store Details, Connect Marketplace, Add Team, Review & Sync

<<<<<<< HEAD
### Products Page
- [x] Progressive sync, marketplace filter, status filter, product table
- [x] Fixed-width columns, text truncation, inline editing for Inventory & Price

### Orders Section (Fully Built)
- [x] **Channel Selector**: "All channels" unified view + individual marketplace views
- [x] **Dynamic Status Counts**: Computed from actual data (synced with tables)
- [x] **Customer details masking**: Phone/address masked for Pending, Accepted, Packed
- [x] **Status column**: Shows actual order status badge
- [x] **Horizontal scroll**: All tables support horizontal scroll with min-width
- [x] **Filters**: Shipping (no duplicate), Date (with specific date picker), SKU (actual data), Payment
- [x] **Status-specific table layouts**: Pending/Accepted, Packed, In-transit, Completed, Cancelled
- [x] **Status-specific footers**:
  - Pending: Export, Split orders (disabled), Mark OOS, Cancel order, Confirm order
  - Accepted: Export, Cancel order, Schedule pickup, Assign courier
  - Packed: Print labels, Create manifest
  - In-transit: Export, Print invoice, Mark as delivered
  - Completed: Export, Print invoice
  - Cancelled: Export, Print credit note
  - Ready to Ship: No footer (card view)
- [x] **Ready to Ship**: Card layout + "View packages" sub-view
- [x] **Schedule Pickup modal**, **Assign Courier modal** (with date picker), **Print Invoice modal**, **Cancel Order modal** (with 5 reasons + Other)
- [x] **Order Detail Drawer**: Timeline, customer, shipping, payment info
=======
- [x] **Choose Plan onboarding step** (`/onboarding/choose-plan`) — **Interactive carousel-style layout**: selected plan slides to center with gradient border & elevated shadow, side cards scale down. 4 plans (Free/Silver/Gold/Platinum) with unique gradient colors, plan selector pills, prev/next arrows, "Best Deal" badge on Gold, "+2 months free" highlight, gradient CTA, selected plan confirmation pill, Compare Plans modal with 10-feature table. OnboardingLayout supports `wide` prop for this page.
- [x] **Updated onboarding flow** to 4 steps: Choose Plan → Store Details → Connect Marketplace → Review & Sync. All step counters, progress bars, and navigation updated accordingly
- [x] **Review page plan summary** — shows selected plan badge (Gold) with monthly price ($79/month) and "Change" link back to Choose Plan
- [x] **Consistent onboarding layout** — All 4 steps now use `wide` (max-w-5xl) layout with centered title + icon, matching the Choose Plan page. Form cards wrapped in max-w-2xl for readability.
- [x] **Rich Compare Plans modal** — Gradient header with unique plan icons (Gift/Rocket/Crown/Zap), "BEST VALUE" ribbon on Gold, Gold column highlighted throughout with primary-colored bold values, alternating row stripes, check/cross in rounded circles, bottom CTA area with "Choose a plan" button
- [x] Testing: 95% pass rate on layout + modal redesign (23/24 tests passed, 1 low-priority non-blocking timing note)
- [x] **Products Page with Progressive Sync Availability** (`/products`) — marketplace sync status banner with progress bar, marketplace filter dropdown with inline sync statuses (Synced/Syncing/Pending), product table showing only synced marketplace products, skeleton placeholder states for non-synced marketplaces, toast notifications when sync completes (Meesho at 8s, Wish at 15s), sidebar "Syncing" badge, product actions (View/Edit/Publish toggle), search by name/SKU, "All synced" completion state
- [x] Testing: 100% pass rate on Products page (43/43 tests passed)
>>>>>>> 6afc099d1fa46b80e8cfa173e7cc6e945de15b00

## Prioritized Backlog

### P1 (Next)
- Build Inventory management page
- Build Pricing rules page
- Build Marketplaces page
- Build Reports page
- Build Settings page

### P2
- Product detail/edit screen
- Marketplace connection flow
- Dark mode

### P3
- Reports & analytics with charts
- Pricing rules engine
- Help section

## Key Files
- `/app/src/pages/OrdersPage.tsx` - Complete Orders module (~1980 lines)
- `/app/src/components/ui/marketplace-logos.tsx` - Marketplace SVG logos
- `/app/src/pages/ProductsPage.tsx` - Products page
- `/app/src/main.tsx` - App routing
- `/app/src/components/layout/AppShell.tsx` - Main layout
