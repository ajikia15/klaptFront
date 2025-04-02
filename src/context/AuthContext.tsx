import { ReactNode, createContext, useContext } from "react";
import {
  useCurrentUser,
  useLogin,
  useLogout,
  useRegister,
} from "../hooks/useAuth";
import {
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../services/authService";

// Define the shape of our auth context
interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (credentials: RegisterCredentials) => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Use our custom hooks
  const { data: user, isLoading } = useCurrentUser();
  const registerMutation = useRegister();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  // Derived state
  const isAuthenticated = !!user;

  // Handler functions
  const register = async (credentials: RegisterCredentials) => {
    const result = await registerMutation.mutateAsync(credentials);
    if (result.error) {
      throw new Error(result.error);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    const result = await loginMutation.mutateAsync(credentials);
    if (result.error) {
      throw new Error(result.error);
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  // Context value
  const value = {
    user,
    isLoading,
    isAuthenticated,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
