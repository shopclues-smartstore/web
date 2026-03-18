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
