import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../ui/button";

export const RegistrationForm = () => {
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      if (value.password !== value.confirmPassword) {
        setFormStatus("error");
        setErrorMessage("Passwords do not match");
        return;
      }

      try {
        setFormStatus("submitting");

        await register({
          email: value.email,
          username: value.username,
          password: value.password,
        });

        setFormStatus("success");

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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-5"
    >
      {formStatus === "error" && (
        <div className="rounded-md bg-red-900/50 p-3 text-red-200">
          {errorMessage}
        </div>
      )}

      {formStatus === "success" && (
        <div className="rounded-md bg-green-900/50 p-3 text-green-200">
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
                className="mb-1 block text-sm font-medium text-neutral-200"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-secondary-500"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={formStatus === "submitting"}
                placeholder="your@email.com"
              />
              {field.state.meta.errors ? (
                <div className="mt-1 text-sm text-red-300">
                  {field.state.meta.errors.join(", ")}
                </div>
              ) : null}
            </>
          )}
        </form.Field>
      </div>
      <div>
        <form.Field
          name="username"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "Username is required";
              if (value.length < 3) {
                return "Username must be at least 3 characters";
              }
              if (value.length > 20) {
                return "Username must be at most 20 characters";
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <>
              <label
                htmlFor="Username"
                className="mb-1 block text-sm font-medium text-neutral-200"
              >
                Username
              </label>
              <input
                id="Username"
                name="Username"
                type="text"
                className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-secondary-500"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={formStatus === "submitting"}
                placeholder="chickenjockey12"
              />
              {field.state.meta.errors ? (
                <div className="mt-1 text-sm text-red-300">
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
                className="mb-1 block text-sm font-medium text-neutral-200"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-secondary-500"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={formStatus === "submitting"}
                placeholder="••••••••"
              />
              {field.state.meta.errors ? (
                <div className="mt-1 text-sm text-red-300">
                  {field.state.meta.errors.join(", ")}
                </div>
              ) : null}
            </>
          )}
        </form.Field>
      </div>

      <div>
        <form.Field
          name="confirmPassword"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "Please confirm your password";
              return undefined;
            },
          }}
        >
          {(field) => (
            <>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-neutral-200"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-secondary-500"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={formStatus === "submitting"}
                placeholder="••••••••"
              />
              {field.state.meta.errors ? (
                <div className="mt-1 text-sm text-red-300">
                  {field.state.meta.errors.join(", ")}
                </div>
              ) : null}
            </>
          )}
        </form.Field>
      </div>

      <div className="mt-6">
        {/* BUTTON TODO */}

        <Button
          type="submit"
          disabled={formStatus === "submitting"}
          className="flex w-full transform items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-purple-600 to-primary-600 px-6 py-4 font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:from-purple-700 hover:to-primary-700 focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {formStatus === "submitting" ? (
            <span className="flex items-center justify-center">
              <svg
                className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
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
              Creating account...
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              Create Account
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default RegistrationForm;
