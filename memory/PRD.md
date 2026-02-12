# SmartStore Seller UI - PRD

## Original Problem Statement
Build the Seller-side application UI for SmartStore - a public, end-user facing product used by sellers. UI ONLY with no backend logic, no API calls, using placeholder/mock data.

## Architecture
- **Stack**: Vite + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui
- **Routing**: React Router DOM v7
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Animations**: Framer Motion + CSS animations
- **Toasts**: Sonner
- **Design System**: shadcn/ui (new-york style) with custom "Fresh Stripe" palette

## User Personas
- **Primary**: E-commerce sellers managing multiple marketplaces (Amazon, Flipkart, eBay, Etsy, Shopify)
- **Goal**: Centralized dashboard for products, inventory, orders, and pricing across channels

## Core Requirements (Static)
- Signup, Login, Forgot Password auth screens
- Seller App Shell with fixed header and collapsible sidebar
- Dashboard with metric cards, recent activity, quick actions
- Modern, trustworthy, Stripe-inspired design
- Fresh blues & teals color palette
- Responsive design (sidebar hidden on mobile)

## What's Been Implemented (Jan 2026)
- [x] Signup page (split layout, branding panel, social auth, trust indicators, form validation)
- [x] Login page (centered card, social auth, remember me, forgot password link)
- [x] Forgot Password page (email form + success state with "Check your inbox")
- [x] App Shell (fixed header with logo, store selector, notifications, help, user avatar dropdown)
- [x] Collapsible sidebar (8 nav items with icons, collapsed on mobile/tablet)
- [x] Dashboard (4 metric cards, 5 recent activity items, 4 quick actions)
- [x] Placeholder pages for Products, Inventory, Orders, Pricing, Marketplaces, Reports, Settings
- [x] Reusable components: Badge, Card, Skeleton, EmptyState
- [x] Custom CSS theme with "Fresh Stripe" palette
- [x] Google Fonts (Inter + Plus Jakarta Sans)
- [x] Responsive design - mobile, tablet, desktop
- [x] All interactive elements have data-testid attributes
- [x] **Add Team Members onboarding step** (`/onboarding/add-team`) — invite form with role selector (Manager/Ops/Viewer), success banner, team members table with change role & remove, skip option, footer navigation (Back / Continue to Review & Start Sync)
- [x] **Onboarding Step 1: Store Details** (`/onboarding/store-details`) — store name, country dropdown with flag emojis (auto-selects currency/timezone), primary marketplace dropdown, collapsible optional section (business type, tax ID)
- [x] **Onboarding Step 2: Connect Marketplace** (`/onboarding/connect-marketplace`) — marketplace cards (Amazon, Flipkart, Meesho, Wish, More coming soon disabled), connection panel with API key/seller ID/region, test/connect buttons, skip warning banner, security reassurance
- [x] **Onboarding Step 3: Review & Start Sync** (`/onboarding/review`) — summary cards for store details, connected marketplaces, sync scope (Products/Inventory/Orders), edit links, info banner, Start Sync CTA
- [x] **Syncing Transition Screen** (`/onboarding/syncing`) — animated progress steps (4 stages completing sequentially over 6s), skeleton loaders, friendly messages, "You're all set!" completion state with Go to Dashboard CTA
- [x] **Shared OnboardingLayout** component with progress indicator
- [x] Testing: 100% pass rate on all onboarding pages (31/31 tests passed)

- [x] **Choose Plan onboarding step** (`/onboarding/choose-plan`) — **Interactive carousel-style layout**: selected plan slides to center with gradient border & elevated shadow, side cards scale down. 4 plans (Free/Silver/Gold/Platinum) with unique gradient colors, plan selector pills, prev/next arrows, "Best Deal" badge on Gold, "+2 months free" highlight, gradient CTA, selected plan confirmation pill, Compare Plans modal with 10-feature table. OnboardingLayout supports `wide` prop for this page.
- [x] **Updated onboarding flow** to 4 steps: Choose Plan → Store Details → Connect Marketplace → Review & Sync. All step counters, progress bars, and navigation updated accordingly
- [x] **Review page plan summary** — shows selected plan badge (Gold) with monthly price ($79/month) and "Change" link back to Choose Plan
- [x] **Consistent onboarding layout** — All 4 steps now use `wide` (max-w-5xl) layout with centered title + icon, matching the Choose Plan page. Form cards wrapped in max-w-2xl for readability.
- [x] **Rich Compare Plans modal** — Gradient header with unique plan icons (Gift/Rocket/Crown/Zap), "BEST VALUE" ribbon on Gold, Gold column highlighted throughout with primary-colored bold values, alternating row stripes, check/cross in rounded circles, bottom CTA area with "Choose a plan" button
- [x] Testing: 95% pass rate on layout + modal redesign (23/24 tests passed, 1 low-priority non-blocking timing note)
- [x] **Products Page with Progressive Sync Availability** (`/products`) — marketplace sync status banner with progress bar, marketplace filter dropdown with inline sync statuses (Synced/Syncing/Pending), product table showing only synced marketplace products, skeleton placeholder states for non-synced marketplaces, toast notifications when sync completes (Meesho at 8s, Wish at 15s), sidebar "Syncing" badge, product actions (View/Edit/Publish toggle), search by name/SKU, "All synced" completion state
- [x] Testing: 100% pass rate on Products page (43/43 tests passed)

## Prioritized Backlog
### P0 (Next)
- Product listing page with table/grid view
- Inventory management page
- Order management page

### P1
- Product detail/edit screen
- Order detail screen
- Marketplace connection flow
- Settings page (profile, billing, integrations)

### P2
- Reports & analytics with charts
- Pricing rules engine UI
- Bulk actions (import/export)
- Search functionality across products/orders
- Dark mode support

## Next Tasks
1. Build Product listing page with mock data table
2. Build Order management page
3. Build Inventory management page
4. Add search bar to header
5. Implement dark mode toggle
