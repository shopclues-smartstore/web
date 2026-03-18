# SmartStore Seller UI - PRD

## Original Problem Statement
Build the Seller-side application UI for SmartStore - a public, end-user facing product used by sellers. UI ONLY with no backend logic, no API calls, using placeholder/mock data.

## Architecture
- **Stack**: Vite + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Toasts**: Sonner
- **Design System**: shadcn/ui (new-york style) with custom "Fresh Stripe" palette

## What's Been Implemented

### Auth & Shell (Jan 2026)
- [x] Signup, Login, Forgot Password pages
- [x] App Shell with header, collapsible sidebar, dashboard

### Onboarding Flow (Jan 2026)
- [x] Choose Plan, Store Details, Connect Marketplace, Add Team, Review & Sync

### Products Page (Jan 2026)
- [x] Progressive sync, marketplace filter, status filter, product table
- [x] Fixed-width columns, text truncation, inline editing for Inventory & Price

### Orders Section (Jan-Mar 2026)
- [x] "All channels" unified view in channel selector
- [x] Dynamic Status Bar per marketplace
- [x] **Customer details masking** - Phone/address masked for Pending, Accepted, Packed tabs
- [x] **Order Status column** - Added to order details table with Paid/COD badges
- [x] **Shipping method filter fix** - Removed duplicate "Self ship", shows "All methods" default
- [x] **Date filter** - Added options: Today, Yesterday, Last 7/30 days, Select specific date (with date picker)
- [x] **SKU filter** - Populated with actual SKU data from orders
- [x] **Import button removed** - Removed from footer on all statuses
- [x] **Status-aware footer**:
  - Accepted: Export, Cancel order, Schedule pickup (primary), Assign courier (primary)
  - Packed: Print labels (primary), Create manifest (primary)
  - Pending: Export, Cancel order, Schedule pickup, Assign courier
- [x] **Schedule Pickup modal** - Package details, pickup slot, shipping fee for easy ship
- [x] **Assign Courier modal** - Pickup date, courier dropdown, courier service dropdown
- [x] **Print Invoice & Shipping Label modal** - Selected orders list with Print labels CTA
- [x] **Ready to Ship tab** - Card layout with fulfillment method groups (Self ship/Easy ship), package counts, courier info, "Print & close manifest" and "View packages" buttons, no footer
- [x] Order Detail Drawer with timeline, customer, shipping, payment info
- [x] Marketplace-specific modals (Flipkart: Process labels, Amazon: Schedule pickup)

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
- `/app/src/pages/OrdersPage.tsx` - Orders page (~1500 lines)
- `/app/src/components/ui/marketplace-logos.tsx` - Marketplace SVG logos
- `/app/src/pages/ProductsPage.tsx` - Products page
- `/app/src/main.tsx` - App routing
- `/app/src/components/layout/AppShell.tsx` - Main layout
