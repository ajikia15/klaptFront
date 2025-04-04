import { ReactNode, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";
import { useToasts } from "@/assets/Toasts";

export function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const { unauthorizedToast } = useToasts();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        unauthorizedToast();
        navigate({ to: "/login" });
      } else if (!user?.admin) {
        // User is authenticated but not an admin
        navigate({ to: "/" });
      }
    }
  }, [isAuthenticated, isLoading, navigate, user, unauthorizedToast]);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen bg-neutral-900">
        <div className="text-primary-400 text-2xl">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
