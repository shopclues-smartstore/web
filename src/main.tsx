import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import "./index.css"
import { SignupPage } from "@/pages/SignupPage"
import { LoginPage } from "@/pages/LoginPage"
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { PlaceholderPage } from "@/pages/PlaceholderPage"
import { AddTeamPage } from "@/pages/AddTeamPage"
import { StoreDetailsPage } from "@/pages/StoreDetailsPage"
import { ConnectMarketplacePage } from "@/pages/ConnectMarketplacePage"
import { ReviewPage } from "@/pages/ReviewPage"
import { SyncingPage } from "@/pages/SyncingPage"
import { AppShell } from "@/components/layout/AppShell"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public auth routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Onboarding routes */}
        <Route path="/onboarding/store-details" element={<StoreDetailsPage />} />
        <Route path="/onboarding/connect-marketplace" element={<ConnectMarketplacePage />} />
        <Route path="/onboarding/add-team" element={<AddTeamPage />} />
        <Route path="/onboarding/review" element={<ReviewPage />} />
        <Route path="/onboarding/syncing" element={<SyncingPage />} />

        {/* App Shell routes (post-login) */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<PlaceholderPage />} />
          <Route path="/inventory" element={<PlaceholderPage />} />
          <Route path="/orders" element={<PlaceholderPage />} />
          <Route path="/pricing" element={<PlaceholderPage />} />
          <Route path="/marketplaces" element={<PlaceholderPage />} />
          <Route path="/reports" element={<PlaceholderPage />} />
          <Route path="/settings" element={<PlaceholderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
