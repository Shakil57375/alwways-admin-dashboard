import { useEffect, useState } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";

import Loader from "./common/Loader";
import PageTitle from "./components/PageTitle";
import DefaultLayout from "./layout/DefaultLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Dashboard/Profile";
import TermsAndCondition from "./pages/Dashboard/TermsAndCondition";
import PrivacyAndPolicy from "./pages/Dashboard/PrivacyAndPolicy";
import SignIn from "./pages/Authentication/SignIn";
import PrivateRoute from "./Private/PrivateRoutes";
import OrderManagement from "./pages/Dashboard/OrderManagement";
import AddQuestionnaire from "./pages/Dashboard/AddQuestionnaire";
import MakeAdmin from "./pages/Dashboard/MakeAdmin";
import Subscription from "./pages/Subscription/Subscription";
import ForgotPassword from "./pages/Authentication/ForgotPasswordForm";
import VerificationCode from "./pages/Authentication/OTPVerificationForm";
import ResetPasswordForm from "./pages/Authentication/ResetPasswordForm";
import Congratulations from "./pages/Authentication/Congratulations";
import PreviewQuestion from "./components/Dashboard/Questionnarie/PreviewQuestion";
import CouponCode from "./pages/Subscription/CouponCode";
import AdminProfile from "./pages/Dashboard/Profile";
import UserManagement from "./pages/Dashboard/UserManagement";

function Routers() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer); // Cleanup the timeout on unmount
  }, []);

  if (loading) return <Loader />;

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/forgetPassword" element={<ForgotPassword />} />
      <Route path="/auth/verifyOTP" element={<VerificationCode />} />
      <Route path="/auth/reset-password" element={<ResetPasswordForm />} />
      <Route path="auth/congratulations" element={<Congratulations />} />

      {/* Private Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DefaultLayout />
          </PrivateRoute>
        }
      >
        <Route
          index
          element={
            <>
              <PageTitle title={"alwways | Dashboard"} />
              <Dashboard />
            </>
          }
        />
        <Route
          path="userManagement"
          element={
            <>
              <PageTitle title="alwways | User Management" />
              <UserManagement />
            </>
          }
        />
        <Route
          path="orderManagement"
          element={
            <>
              <PageTitle title="alwways | Order Management" />
              <OrderManagement />
            </>
          }
        />
        <Route
          path="profile"
          element={
            <>
              <PageTitle title="alwways | Profile" />
              <AdminProfile />
            </>
          }
        />
        <Route
          path="addQuestionnaire"
          element={
            <>
              <PageTitle title="alwways | Add Questionnaire" />
              <AddQuestionnaire />
            </>
          }
        />
        <Route
          path="/addQuestionnaire/previewQuestion/:sectionId"
          element={
            <>
              <PageTitle title="alwways | Preview Questions" />
              <PreviewQuestion />
            </>
          }
        />
        <Route
          path="makeAdmin"
          element={
            <>
              <PageTitle title="alwways | Make Admin" />
              <MakeAdmin />
            </>
          }
        />
        <Route
          path="subscription/subscription"
          element={
            <>
              <PageTitle title="alwways | Subscription" />
              <Subscription />
            </>
          }
        />
        <Route
          path="subscription/couponCode"
          element={
            <>
              <PageTitle title="alwways | Coupon Code" />
              <CouponCode />
            </>
          }
        />
        <Route
          path="settings/termsAndConditions"
          element={
            <>
              <PageTitle title="alwways | Terms and Conditions" />
              <TermsAndCondition />
            </>
          }
        />
        <Route
          path="settings/privacyAndPolicy"
          element={
            <>
              <PageTitle title="alwways | Privacy And Policy" />
              <PrivacyAndPolicy />
            </>
          }
        />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/auth/signin" />} />
    </Routes>
  );
}

export default Routers;
