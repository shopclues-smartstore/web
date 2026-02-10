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
- [x] Testing: 100% pass rate on Add Team page (24/24 tests passed)

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
