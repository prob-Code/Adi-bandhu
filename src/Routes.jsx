import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
const InteractiveWebGISMap = lazy(() => import('./pages/interactive-web-gis-map'));
const MultiRoleDashboard = lazy(() => import('./pages/multi-role-dashboard'));
const PublicMapViewer = lazy(() => import('./pages/public-map-viewer'));
const ClaimVerification = lazy(() => import('./pages/claim-verification'));
const ClaimUploadInterface = lazy(() => import('./pages/claim-upload-interface'));
const CommitteeReview = lazy(() => import('./pages/committee-review'));
const DecisionSupport = lazy(() => import('./pages/decision-support'));
import Seo from './components/Seo';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import RoleRedirect from './pages/auth/RoleRedirect';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <Seo />
      <Suspense fallback={null}>
        <RouterRoutes>
          {/* Auth (public-only) */}
          <Route element={<PublicRoute />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
          </Route>

          {/* Public */}
          <Route path="/public-map-viewer" element={<PublicMapViewer />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<RoleRedirect />} />
            <Route path="/interactive-web-gis-map" element={<InteractiveWebGISMap />} />
            <Route path="/multi-role-dashboard" element={<MultiRoleDashboard />} />
            <Route path="/claim-verification" element={<ClaimVerification />} />
            <Route path="/claim-upload-interface" element={<ClaimUploadInterface />} />
            <Route path="/committee-review" element={<CommitteeReview />} />
            <Route path="/decision-support" element={<DecisionSupport />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
