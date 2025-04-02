import { Link } from "@tanstack/react-router";
import RegistrationForm from "../components/auth/RegistrationForm";
import { useRedirectIfAuthenticated } from "../hooks/useRequireAuth";

export default function RegistrationPage() {
  const { isLoading } = useRedirectIfAuthenticated("/");

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen bg-neutral-900">
        <div className="text-primary-400 text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Create Account
            </h1>
            <p className="text-neutral-400">
              Join Kaido to find your perfect laptop
            </p>
          </div>

          <div className="bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 rounded-2xl border border-neutral-700/50 p-8 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="relative z-10">
              <RegistrationForm />
            </div>
          </div>

          <div className="text-center">
            <p className="text-neutral-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-secondary-400 hover:text-secondary-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
