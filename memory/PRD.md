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

## What's Been Implemented

### Auth & Shell (Jan 2026)
- [x] Signup, Login, Forgot Password pages
- [x] App Shell with header, collapsible sidebar, dashboard
- [x] Placeholder pages for Inventory, Pricing, Marketplaces, Reports, Settings

### Onboarding Flow (Jan 2026)
- [x] Choose Plan, Store Details, Connect Marketplace, Add Team, Review & Sync, Syncing Transition

### Products Page (Jan 2026)
- [x] Progressive sync, marketplace filter with logos, status filter, product table

### Orders Section (Feb 2026)
- [x] Marketplace Channel Selector (6 channels with logos)
- [x] Dynamic Status Bar per marketplace (Coupang: "New"; others: "Pending")
- [x] Conditional Filters (Coupang fewer filters)
- [x] Quick Filter Pills
- [x] Dynamic Orders Table (columns change for Packed status)
- [x] SLA Indicators (breached/warning)
- [x] Conditional Action Bar per marketplace and status
- [x] Marketplace-specific Modals (Schedule Pickup, Process Labels)
- [x] Order Selection with count updates
- [x] Marketplace badge in order details column
- [x] **Order Detail Drawer** - slide-in panel from right with:
  - Order ID with copy button + Marketplace logo & name
  - Product details (title, qty, SKU)
  - 5-step Order Timeline (Placed → Confirmed → Packed → Shipped → Delivered)
  - Customer info (name, phone, address)
  - Shipping & Delivery (method, dates, AWB, carrier, SLA alerts)
  - Package Details (weight, dimensions, IDs)
  - Payment info with contextual status
  - Footer: Print Invoice + Process Order buttons
  - Close via X, backdrop click, or Escape key
- [x] **Revamped Marketplace Logos** - improved SVGs for all 7 marketplaces

## Prioritized Backlog

### P1 (Next)
- Build Inventory management page
- Build Pricing rules page
- Build Marketplaces page
- Build Reports page
- Build Settings page

### P2
- Product detail/edit screen
- Order detail screen (full page)
- Marketplace connection flow
- Settings (profile, billing, integrations)

### P3
- Reports & analytics with charts
- Pricing rules engine
- Bulk actions (import/export)
- Dark mode
- Help section

## Key Files
- `/app/src/pages/OrdersPage.tsx` - Orders page with drawer
- `/app/src/components/ui/marketplace-logos.tsx` - All marketplace SVG logos
- `/app/src/pages/ProductsPage.tsx` - Products page
- `/app/src/main.tsx` - App routing
- `/app/src/components/layout/AppShell.tsx` - Main layout
