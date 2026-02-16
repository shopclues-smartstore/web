import './index.css';

import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { Toaster } from 'sonner';

import { AppShell } from '@/components/layout/AppShell';
import { AuthCallbackPage } from '@/features/auth/callback/AuthCallbackPage';
import { GraphQLProvider } from '@/lib/graphql/provider';
import { AddTeamPage } from '@/pages/AddTeamPage';
import { ChoosePlanPage } from '@/pages/ChoosePlanPage';
import { ConnectMarketplacePage } from '@/pages/ConnectMarketplacePage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { LoginPage } from '@/pages/LoginPage';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ReviewPage } from '@/pages/ReviewPage';
import { SignupPage } from '@/pages/SignupPage';
import { StoreDetailsPage } from '@/pages/StoreDetailsPage';
import { SyncingPage } from '@/pages/SyncingPage';
import { GuestOnly } from '@/routes/GuestOnly';
import { RequireAuth } from '@/routes/RequireAuth';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GraphQLProvider>
      <BrowserRouter>
        <Toaster richColors position="bottom-right" />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Guest-only: redirect to /dashboard if already logged in */}
          <Route element={<GuestOnly />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* Authenticated only: redirect to /login if not logged in */}
          <Route element={<RequireAuth />}>
            {/* Onboarding routes */}
            <Route path="/onboarding/choose-plan" element={<ChoosePlanPage />} />
            <Route path="/onboarding/store-details" element={<StoreDetailsPage />} />
            <Route path="/onboarding/connect-marketplace" element={<ConnectMarketplacePage />} />
            <Route path="/onboarding/add-team" element={<AddTeamPage />} />
            <Route path="/onboarding/review" element={<ReviewPage />} />
            <Route path="/onboarding/syncing" element={<SyncingPage />} />

            {/* Main app routes */}
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/inventory" element={<PlaceholderPage />} />
              <Route path="/orders" element={<PlaceholderPage />} />
              <Route path="/pricing" element={<PlaceholderPage />} />
              <Route path="/marketplaces" element={<PlaceholderPage />} />
              <Route path="/reports" element={<PlaceholderPage />} />
              <Route path="/settings" element={<PlaceholderPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </GraphQLProvider>
  </StrictMode>,
);
