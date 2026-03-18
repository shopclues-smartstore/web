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
- [x] **Dynamic Status Counts**: Computed from actual data (84 total, 12 per status, 14 per marketplace)
- [x] **Customer details masking**: Phone/address masked for Pending, Accepted, Packed tabs
- [x] **Status column**: Shows actual order status badge (Pending, Accepted, etc.)
- [x] **Filters**: Shipping method (no duplicate), Date filter with specific date picker, SKU filter with actual data, Payment type
- [x] **Status-specific table layouts**:
  - Pending/Accepted: Order date, Order details, Product details, Customer details, Delivery details, Payment, Status
  - Packed: Order date, Product details, Customer details, Handover date, AWB number, Label status
  - In-transit: Order details, Product details, Shipping method, Shipped on, Payment, AWB no., Status
  - Completed: Order details, Product details, Shipping method, Delivered on, Payment, AWB no., Status
  - Cancelled: Order details, Product details, Shipping method, Cancelled on, Payment, Reason, Status
- [x] **Status-specific footers**:
  - Pending/Accepted: Export, Cancel order, Schedule pickup, Assign courier (no Import)
  - Packed: Print labels, Create manifest
  - In-transit: Export, Print invoice, Mark as delivered
  - Completed: Export, Print invoice
  - Cancelled: Export, Print credit note
  - Ready to Ship: No footer (card view)
- [x] **Ready to Ship**: Card layout with fulfillment groups + "View packages" sub-view (back button, summary card, packages table, Re-print labels footer)
- [x] **Schedule Pickup modal**: Package details, pickup slot, shipping fee
- [x] **Assign Courier modal**: Date calendar picker, courier dropdown, courier service dropdown
- [x] **Print Invoice & Shipping Label modal**: Selected orders list, Print labels CTA
- [x] **Cancel Order modal**: Product info, 5 radio reasons, textarea for "Other", Cancel order CTA
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
- `/app/src/pages/OrdersPage.tsx` - Complete Orders module (~1970 lines)
- `/app/src/components/ui/marketplace-logos.tsx` - Marketplace SVG logos
- `/app/src/pages/ProductsPage.tsx` - Products page
- `/app/src/main.tsx` - App routing
- `/app/src/components/layout/AppShell.tsx` - Main layout
