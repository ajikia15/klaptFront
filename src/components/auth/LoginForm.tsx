import { useForm } from "@tanstack/react-form";
import { useState } from "react";

interface LoginFormProps {
  onRegisterClick: () => void;
}

export const LoginForm = ({ onRegisterClick }: LoginFormProps) => {
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setFormStatus("submitting");

        // Here you would typically make an API call to login the user
        console.log("Login form submitted with values:", value);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setFormStatus("success");
      } catch (error) {
        setFormStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Login failed"
        );
      }
    },
  });

  return (
    <div className="max-w-lg mx-auto p-8 bg-neutral-800 rounded-lg shadow-md text-white w-full">
      <h2 className="text-3xl font-bold mb-8 text-center text-white">Login</h2>

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
            Login successful!
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
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-primary-400 hover:text-primary-300 focus:outline-none transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
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
            {formStatus === "submitting" ? "Logging in..." : "Login"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-neutral-400 mb-4">Or log in with</p>
          <div className="flex justify-center">
            <button
              type="button"
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-label="Log in with Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="fill-current text-white"
              >
                <path d="M20.3,4.2H3.7c-0.9,0-1.7,0.8-1.7,1.7v12.3c0,0.9,0.8,1.7,1.7,1.7h16.6c0.9,0,1.7-0.8,1.7-1.7V5.9 C22,5,21.2,4.2,20.3,4.2z M19.5,10.5h-1.6c-1.3,0-1.7,0.7-1.7,1.9v1.9h3l-0.4,3h-2.6V22h-3.1v-4.7h-2.4v-3h2.4v-2 c0-2.4,1.4-3.7,3.6-3.7c1,0,1.9,0.1,2.1,0.1V10.5z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center border-t border-neutral-700 pt-6">
          <p className="text-neutral-400">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onRegisterClick}
              className="text-primary-400 hover:text-primary-300 font-medium underline focus:outline-none transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
