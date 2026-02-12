# SmartStore Web

A modern seller dashboard for managing multiple e-commerce marketplaces from a single unified interface. SmartStore helps sellers sync products, track inventory, manage orders, and optimize pricing across channels like Amazon, Flipkart, eBay, Shopify, and more.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Development](#development)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
  - [Routing](#routing)
  - [Authentication](#authentication)
  - [GraphQL Integration](#graphql-integration)
- [Testing](#testing)
- [Build & Deployment](#build--deployment)
- [Design System](#design-system)
- [Contributing](#contributing)

## Features

- **Multi-Marketplace Management** - Connect and manage Amazon, Flipkart, Meesho, eBay, Shopify, WooCommerce, and more
- **Product Synchronization** - Sync product catalogs across all connected marketplaces
- **Inventory Tracking** - Real-time inventory monitoring with low-stock alerts
- **Order Management** - Unified order view across all channels
- **Pricing Optimization** - Smart pricing tools to stay competitive
- **Team Collaboration** - Role-based access control (Manager, Ops, Viewer)
- **Guided Onboarding** - Step-by-step setup wizard for new sellers
- **Real-time Sync Status** - Live progress tracking during catalog synchronization

## Tech Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI Framework |
| TypeScript | 5.6 | Type Safety |
| Vite | 6 | Build Tool & Dev Server |
| React Router | 7 | Client-side Routing |

### UI & Styling
| Technology | Purpose |
|------------|---------|
| Tailwind CSS 4 | Utility-first CSS |
| shadcn/ui | Component Library |
| Lucide React | Icon System |
| Framer Motion | Animations |
| Sonner | Toast Notifications |

### State & Data
| Technology | Purpose |
|------------|---------|
| Apollo Client | GraphQL Client |
| GraphQL Code Generator | Type-safe GraphQL Operations |
| React Hook Form | Form Handling |
| Zod | Schema Validation |

### Testing
| Technology | Purpose |
|------------|---------|
| Vitest | Unit & Integration Tests |
| Playwright | End-to-End Tests |
| Testing Library | Component Testing |

## Project Structure

```
smartstore-web/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── layout/              # AppShell, Header, Sidebar
│   │   ├── onboarding/          # Onboarding flow components
│   │   └── ui/                  # shadcn/ui primitives
│   │
│   ├── features/                # Feature-based modules
│   │   └── auth/                # Authentication feature
│   │       ├── api/             # API client & schemas
│   │       ├── callback/        # OAuth callback handler
│   │       ├── signup/          # Signup page component
│   │       └── lib/             # Auth storage utilities
│   │
│   ├── lib/                     # Shared utilities
│   │   ├── config.ts            # App configuration
│   │   ├── graphql/             # GraphQL client setup
│   │   │   ├── client.ts        # Apollo Client config
│   │   │   ├── provider.tsx     # GraphQL Provider
│   │   │   ├── error-handler.ts # Error handling
│   │   │   └── generated/       # Generated types (gitignored)
│   │   └── utils.ts             # Utility functions
│   │
│   ├── pages/                   # Page components
│   │   ├── DashboardPage.tsx    # Main dashboard
│   │   ├── ProductsPage.tsx     # Product management
│   │   ├── LoginPage.tsx        # User login
│   │   └── ...                  # Other pages
│   │
│   ├── routes/                  # Route guards
│   │   ├── RequireAuth.tsx      # Protected route wrapper
│   │   └── GuestOnly.tsx        # Guest-only route wrapper
│   │
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles & Tailwind
│
├── public/                      # Static assets
│   └── brands/                  # Marketplace logos (SVG)
│
├── e2e/                         # End-to-end tests
├── memory/                      # Project documentation
│
├── package.json                 # Dependencies & scripts
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── codegen.ts                   # GraphQL codegen config
├── playwright.config.ts         # Playwright config
└── vitest.config.ts             # Vitest config
```

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9+ or **yarn** v1.22+
- A running backend API (GraphQL endpoint)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd smartstore-web

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Backend API URL (required for GraphQL)
VITE_API_URL=http://localhost:3000
```

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` | No |

> **Note**: All environment variables must be prefixed with `VITE_` to be accessible in the browser (Vite requirement).

### Development

```bash
# Start development server (http://localhost:5173)
npm run dev

# Start with network access (0.0.0.0:3000)
npm start
```

The development server includes hot module replacement (HMR) for instant updates.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm start` | Start dev server with network access |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run e2e` | Run E2E tests |
| `npm run e2e:ui` | Run E2E tests with UI |
| `npm run codegen` | Generate GraphQL types |
| `npm run codegen:watch` | Generate types in watch mode |

## Architecture

### Routing

The application uses React Router v7 with the following route structure:

#### Public Routes
| Route | Page | Description |
|-------|------|-------------|
| `/login` | LoginPage | User authentication |
| `/signup` | SignupPage | Account registration |
| `/forgot-password` | ForgotPasswordPage | Password reset |
| `/auth/callback` | AuthCallback | OAuth redirect handler |

#### Onboarding Flow (Protected)
| Route | Page | Description |
|-------|------|-------------|
| `/onboarding/store-details` | StoreDetailsPage | Store configuration |
| `/onboarding/connect-marketplace` | ConnectMarketplacePage | Marketplace connection |
| `/onboarding/add-team` | AddTeamPage | Team member invitations |
| `/onboarding/review` | ReviewPage | Setup review |
| `/onboarding/syncing` | SyncingPage | Initial sync progress |

#### Main Application (Protected)
| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | DashboardPage | Overview & metrics |
| `/products` | ProductsPage | Product management |
| `/inventory` | InventoryPage | Inventory tracking |
| `/orders` | OrdersPage | Order management |
| `/pricing` | PricingPage | Pricing tools |
| `/marketplaces` | MarketplacesPage | Connected marketplaces |
| `/reports` | ReportsPage | Analytics & reports |
| `/settings` | SettingsPage | Account settings |

### Authentication

Authentication is handled via a combination of:

- **Email/Password** - Traditional login with JWT tokens
- **OAuth 2.0** - Google and Meta (Facebook) social login
- **Token Storage** - Tokens stored in `localStorage` via `authStorage` utility

Protected routes are wrapped with `RequireAuth` component, while guest-only routes use `GuestOnly`.

```typescript
// Token storage keys
smartstore_access_token  // JWT access token
smartstore_user_id       // Current user ID
```

### GraphQL Integration

The application uses Apollo Client for GraphQL operations:

```typescript
// GraphQL endpoint
${VITE_API_URL}/graphql

// Features
- Automatic Bearer token attachment
- Request correlation IDs
- Error handling with user-friendly messages
- Auto-logout on UNAUTHORIZED/FORBIDDEN errors
```

#### Code Generation

Generate TypeScript types from your GraphQL schema:

```bash
# One-time generation
npm run codegen

# Watch mode
npm run codegen:watch
```

> **Note**: Requires a running GraphQL server for schema introspection.

## Testing

### Unit & Integration Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm test -- --coverage
```

### End-to-End Tests

```bash
# Run E2E tests (headless)
npm run e2e

# Run with Playwright UI
npm run e2e:ui

# Run with visible browser
npm run e2e:headed

# Run against real API
E2E_USE_REAL_API=1 npm run e2e:real
```

#### E2E Configuration

| Mode | Description |
|------|-------------|
| Default | Runs against preview build (`localhost:4173`) |
| `E2E_USE_REAL_API=1` | Starts backend and runs against real API |
| `E2E_API_URL` | Custom API URL for testing |

## Build & Deployment

### Production Build

```bash
# Build the application
npm run build

# Preview the build locally
npm run preview
```

The build outputs to the `dist/` directory.

### Deployment Checklist

1. **Environment Variables**
   - Set `VITE_API_URL` to production backend URL

2. **Server Configuration**
   - Configure server to serve `index.html` for all routes (SPA)
   - Enable gzip/brotli compression
   - Set appropriate cache headers for static assets

3. **CORS**
   - Ensure backend allows requests from production domain

4. **HTTPS**
   - Use HTTPS in production for secure cookie handling

### Build Output

```
dist/
├── index.html          # Entry HTML
├── assets/
│   ├── index-[hash].js    # Main bundle
│   ├── index-[hash].css   # Compiled styles
│   └── ...                # Code-split chunks
└── brands/             # Static marketplace logos
```

## Design System

### Theme

SmartStore uses a custom "Fresh Stripe" color palette:

- **Primary**: Blues & teals for trust and professionalism
- **Accent**: Vibrant highlights for CTAs and success states
- **Neutral**: Clean grays for backgrounds and text

### Typography

| Usage | Font | Weight |
|-------|------|--------|
| Body text | Inter | 400, 500 |
| Headings | Plus Jakarta Sans | 600, 700 |

### Components

Built on [shadcn/ui](https://ui.shadcn.com/) with the "New York" style variant:

- Pre-styled, accessible components
- Tailwind CSS customization
- Consistent design language

### Responsive Design

- **Mobile-first** approach
- Sidebar collapses below 1024px viewport
- Touch-friendly interactions on mobile

## Contributing

### Code Style

- **ESLint** - Run `npm run lint` before committing
- **TypeScript** - Strict mode enabled
- **Prettier** - Consistent formatting (via ESLint)

### Git Workflow

1. Create a feature branch from `main`
2. Make changes and add tests
3. Run `npm run lint` and `npm test`
4. Submit a pull request

### Adding New Features

1. Create components in `src/components/` or feature modules in `src/features/`
2. Add pages in `src/pages/`
3. Update routes in `src/main.tsx`
4. Write tests for new functionality

---

## License

[Add your license here]

## Support

For questions or issues, please [open an issue](link-to-issues) or contact the team.
