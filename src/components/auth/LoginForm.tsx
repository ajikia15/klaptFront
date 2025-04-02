import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "@tanstack/react-router";

export const LoginForm = () => {
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setFormStatus("submitting");

        // Use our custom login hook from AuthContext
        await login({
          email: value.email,
          password: value.password,
        });

        setFormStatus("success");

        // Redirect to home page after successful login
        // Short delay to allow user to see success message
        setTimeout(() => {
          navigate({ to: "/" });
        }, 1000);
      } catch (error) {
        setFormStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Login failed"
        );
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-5"
    >
      {formStatus === "error" && (
        <div className="p-3 bg-red-900/50 text-red-200 rounded-md">
          {errorMessage}
        </div>
      )}

      {formStatus === "success" && (
        <div className="p-3 bg-green-900/50 text-green-200 rounded-md">
          Login successful! Redirecting...
        </div>
      )}

      <div>
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "Email is required";
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return "Please enter a valid email address";
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-200 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={formStatus === "submitting"}
                placeholder="your@email.com"
              />
              {field.state.meta.errors ? (
                <div className="text-red-300 text-sm mt-1">
                  {field.state.meta.errors.join(", ")}
                </div>
              ) : null}
            </>
          )}
        </form.Field>
      </div>

      <div>
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "Password is required";
              if (value.length < 8) {
                return "Password must be at least 8 characters";
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-200"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-secondary-400 hover:text-secondary-300 focus:outline-none transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={formStatus === "submitting"}
                placeholder="••••••••"
              />
              {field.state.meta.errors ? (
                <div className="text-red-300 text-sm mt-1">
                  {field.state.meta.errors.join(", ")}
                </div>
              ) : null}
            </>
          )}
        </form.Field>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={formStatus === "submitting"}
          className="w-full py-4 px-6 flex items-center justify-center gap-3 text-white font-semibold rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-[1.02] focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-50 bg-gradient-to-r from-purple-600 to-primary-600 hover:from-purple-700 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {formStatus === "submitting" ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Logging in...
            </span>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              Sign In
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
