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

## What's Been Implemented

### Auth & Shell (Jan 2026)
- [x] Signup page (split layout, branding panel, social auth, trust indicators, form validation)
- [x] Login page (centered card, social auth, remember me, forgot password link)
- [x] Forgot Password page (email form + success state with "Check your inbox")
- [x] App Shell (fixed header with logo, store selector, notifications, help, user avatar dropdown)
- [x] Collapsible sidebar (8 nav items with icons, collapsed on mobile/tablet)
- [x] Dashboard (4 metric cards, 5 recent activity items, 4 quick actions)
- [x] Placeholder pages for Inventory, Pricing, Marketplaces, Reports, Settings
- [x] Reusable components: Badge, Card, Skeleton, EmptyState
- [x] Custom CSS theme with "Fresh Stripe" palette
- [x] Google Fonts (Inter + Plus Jakarta Sans)
- [x] Responsive design - mobile, tablet, desktop
- [x] All interactive elements have data-testid attributes

### Onboarding Flow (Jan 2026)
- [x] Choose Plan: Interactive carousel-style layout, 4 plans, Compare Plans modal
- [x] Store Details: Store name, country, currency/timezone, marketplace, optional fields
- [x] Connect Marketplace: Marketplace cards, API key/seller ID, test/connect buttons
- [x] Add Team Members: Invite form, role selector, team table, skip option
- [x] Review & Sync: Summary cards, edit links, Start Sync CTA
- [x] Syncing Transition: Animated progress, skeleton loaders, completion state
- [x] Testing: 100% pass rate (31/31 onboarding tests, 23/24 layout tests)

### Products Page (Jan 2026)
- [x] Progressive sync availability with marketplace-specific sync status
- [x] Marketplace filter with SVG logos (Amazon, Flipkart, Meesho, Wish)
- [x] Status filter (Ready/Under review/Action required)
- [x] Product table with search, actions, skeleton states
- [x] Testing: 100% pass rate (43/43 tests)

### Orders Section (Feb 2026)
- [x] **Marketplace Channel Selector**: Dropdown with 6 channels (Amazon, Flipkart, Coupang, Snapdeal, Meesho, Myntra) with SVG logos and order counts
- [x] **Dynamic Status Bar**: Clickable status cards that change per marketplace (Coupang: "New"; others: "Pending")
- [x] **Conditional Filters**: Amazon/Flipkart show all 4 filters; Coupang shows only Date + SKU
- [x] **Quick Filter Pills**: Ship by today, Ship together orders, Verge of cancellation, Verge of late shipment, Verge of SLA breach
- [x] **Dynamic Orders Table**: Columns change for Packed status (Handover date, AWB number, Label status)
- [x] **SLA Indicators**: "SLA breached" (red), "SLA breaching in X hrs" (amber)
- [x] **Bottom Action Bar**: Conditional CTAs per marketplace and status
  - Amazon/Flipkart Pending: Export, Import, Split orders, Mark OOS, Cancel order, Confirm order
  - Coupang: Cancel order, Confirm order only
  - Packed status: Print labels, Create manifest
- [x] **Marketplace-specific Modals**: Schedule Pickup (Amazon), Process Labels (Flipkart)
- [x] **Order Selection**: Individual and select-all checkboxes with count updates
- [x] **Search**: Order search with type selector (Order ID/Product/Customer)
- [x] Testing: 100% pass rate (17/17 tests)

## Prioritized Backlog

### P1 (Next)
- Build Inventory management page
- Build Pricing rules page
- Build Marketplaces page
- Build Reports page
- Build Settings page

### P2
- Product detail/edit screen
- Order detail screen
- Marketplace connection flow
- Settings page (profile, billing, integrations)

### P3
- Reports & analytics with charts
- Pricing rules engine UI
- Bulk actions (import/export)
- Search functionality across products/orders
- Dark mode support
- Help section
- Profile page from avatar dropdown

## Next Tasks
1. Build Inventory management page with stock tracking
2. Build Reports page with chart visualizations
3. Build Settings page (profile, billing, integrations)
4. Add search bar to header
5. Implement dark mode toggle
