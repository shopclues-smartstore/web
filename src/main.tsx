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
import { ViewerBootstrapLoader } from '@/features/auth/components/ViewerBootstrapLoader';
import { AuthCallbackPage } from '@/features/auth/callback/AuthCallbackPage';
import { GraphQLProvider } from '@/lib/graphql/provider';
import { DashboardPage } from '@/pages/DashboardPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { LoginPage } from '@/pages/LoginPage';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import { ProductsPage } from '@/pages/ProductsPage';
import { SignupPage } from '@/pages/SignupPage';
import { SyncingPage } from '@/pages/SyncingPage';
import { GuestOnly } from '@/routes/GuestOnly';
import { RequireAuth } from '@/routes/RequireAuth';
import { RequireCompletedOnboarding } from '@/routes/RequireCompletedOnboarding';

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
            {/* Onboarding: step is loaded by ViewerBootstrapLoader from workspace.onboarding.currentStep */}
            <Route path="/onboarding/syncing" element={<SyncingPage />} />
            <Route path="/onboarding/*" element={<ViewerBootstrapLoader />} />

            {/* Main app routes: require onboarding completed */}
            <Route element={<RequireCompletedOnboarding />}>
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
          </Route>
        </Routes>
      </BrowserRouter>
    </GraphQLProvider>
  </StrictMode>,
);
