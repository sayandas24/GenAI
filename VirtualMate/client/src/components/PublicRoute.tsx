import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthUser } from "../features/auth/hooks/useAuth";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useAuthUser();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // If user is already authenticated, redirect them to the main app
  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
