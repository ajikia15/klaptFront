import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

// Create a hook for toast functions that need navigation
export const useToasts = () => {
  const navigate = useNavigate();

  const commonClassNames = {
    toast: "!bg-neutral-800 !rounded-lg !border !border-neutral-700 !shadow-md",
    title: "!text-white !font-medium !text-base",
    description: "!text-neutral-300 !text-sm",
    actionButton:
      "!bg-secondary-500 !text-white !px-5 !pb-4.5 pt-4 !text-sm !font-bold !rounded-md !hover:bg-secondary-600 !transition-colors",
    cancelButton:
      "!text-neutral-400 !px-3 !py-1.5 !text-xs !font-medium !hover:text-white !transition-colors",
    closeButton: "!text-neutral-400 !hover:text-white !transition-colors",
  };

  return {
    // Authentication toasts
    unauthorizedToast: () => {
      toast("You must be logged in for this action.", {
        action: {
          label: "Login",
          onClick: () => navigate({ to: "/auth" }),
        },
        position: "top-right",
        classNames: commonClassNames,
      });
    },

    // Success toasts
    loginSuccessToast: () => {
      toast.success("Login successful", {
        description: "Welcome back to KLaptop.",
        position: "top-right",
        classNames: commonClassNames,
      });
    },

    registerSuccessToast: () => {
      toast.success("Account created successfully!", {
        description: "Welcome to KLaptop.",
        position: "top-right",
        classNames: commonClassNames,
      });
    },

    // Action toasts
    copyToClipboardToast: (text: string) => {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!", {
        position: "top-right",
        classNames: commonClassNames,
      });
    },

    actionCompletedToast: (message: string) => {
      toast.success(message, {
        position: "top-right",
        classNames: commonClassNames,
      });
    },

    // Error toasts
    errorToast: (message: string) => {
      toast.error("Error", {
        description: message,
        position: "top-right",
        classNames: commonClassNames,
      });
    },
  };
};

// For toasts that don't need navigation or other hooks
export const staticToasts = {
  networkErrorToast: () => {
    toast.error("Network Error", {
      description: "Please check your internet connection and try again.",
      position: "top-right",
      classNames: {
        toast:
          "!bg-neutral-800 !rounded-lg !border !border-neutral-700 !shadow-md",
        title: "!text-white !font-semibold !text-base",
        description: "!text-neutral-300 !text-sm",
        closeButton: "!text-neutral-400 !hover:text-white !transition-colors",
      },
    });
  },

  formErrorToast: (message: string) => {
    toast.error("Form Error", {
      description: message,
      position: "top-right",
      classNames: {
        toast:
          "!bg-neutral-800 !rounded-lg !border !border-neutral-700 !shadow-md",
        title: "!text-white !font-semibold !text-base",
        description: "!text-neutral-300 !text-sm",
        closeButton: "!text-neutral-400 !hover:text-white !transition-colors",
      },
    });
  },
};
