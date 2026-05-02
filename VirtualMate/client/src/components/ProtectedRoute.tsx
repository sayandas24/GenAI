import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthUser } from "../features/auth/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useAuthUser();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        {/* Replace with your app's loading spinner if you have one */}
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
