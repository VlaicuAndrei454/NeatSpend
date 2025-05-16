// src/App.jsx

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import UserProvider from "./context/UserContext";

import LoginForm from "./pages/Auth/LoginForm";
import SignUpForm from "./pages/Auth/SignUpForm";
import ForgotPasswordForm from "./pages/Auth/ForgotPasswordForm";
import ResetPasswordForm from "./pages/Auth/ResetPasswordForm";

import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import CryptoDashboard from "./pages/Dashboard/Crypto";
import Subscriptions from "./pages/Dashboard/Subscriptions";
import StocksDashboard from "./pages/Dashboard/Stocks";

// Redirect helper
const Root = () => {
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Root />} />

          {/* Auth routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signUp" element={<SignUpForm />} />

          {/* Password reset */}
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordForm />}
          />

          {/* Dashboard and sub‐pages */}
          <Route path="/dashboard" element={<Home />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/stocks" element={<StocksDashboard />} />
          <Route path="/crypto" element={<CryptoDashboard />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
        </Routes>
      </Router>

      <Toaster
        toastOptions={{
          style: { fontSize: "13px" },
        }}
      />
    </UserProvider>
  );
};

export default App;
