import { Navigate } from "@tanstack/react-router";

// This page is now split into LoginPage and RegistrationPage
// Redirecting to login page for backward compatibility
export default function AuthPage() {
  return <Navigate to="/login" />;
}
