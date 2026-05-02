import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Authenticate from "./features/auth/pages/Authenticate";
import AllChatsMain from "./features/chats/layout/desktop/AllChatsMain";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route: Only unauthenticated users can access /auth */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Authenticate />
            </PublicRoute>
          }
        />

        {/* Protected Routes: Only authenticated users can access the app */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AllChatsMain />
            </ProtectedRoute>
          }
        />
        {/* Later you can add nested routes like path="/chats/:avatarId" inside here */}

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
