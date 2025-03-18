import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "@tanstack/react-router";

interface RegistrationFormProps {
  onLoginClick: () => void;
}

export const RegistrationForm = ({ onLoginClick }: RegistrationFormProps) => {
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setFormStatus("submitting");

        // Use our custom register hook from AuthContext
        await register({
          email: value.email,
          password: value.password,
        });

        setFormStatus("success");

        // Redirect to home page after successful registration
        // Short delay to allow user to see success message
        setTimeout(() => {
          navigate({ to: "/" });
        }, 1000);
      } catch (error) {
        setFormStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Registration failed"
        );
      }
    },
  });

  return (
    <div className="max-w-lg mx-auto p-8 bg-neutral-800 rounded-lg shadow-md text-white w-full">
      <h2 className="text-3xl font-bold mb-8 text-center text-white">
        Create Account
      </h2>

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
            Registration successful! Redirecting...
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
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-200 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {formStatus === "submitting"
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </div>

        <div className="mt-8 text-center border-t border-neutral-700 pt-6">
          <p className="text-neutral-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onLoginClick}
              className="text-primary-400 hover:text-primary-300 font-medium underline focus:outline-none transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
