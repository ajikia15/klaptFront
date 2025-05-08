import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  LoginCredentials,
  RegisterCredentials,
  User,
  getToken,
  setToken,
  removeToken,
  authService,
} from "../services/authService";

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (credentials: RegisterCredentials) => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check for token and fetch user if present
  useEffect(() => {
    const token = getToken();
    if (token) {
      authService
        .getCurrentUser()
        .then((data) => {
          setUser(data);
          setIsLoading(false);
        })
        .catch(() => {
          setUser(null);
          setIsLoading(false);
          removeToken();
        });
    } else {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = !!user;

  const register = async (credentials: RegisterCredentials) => {
    const data = await authService.register(credentials);
    if (data.user && data.token) {
      setUser(data.user);
      setToken(data.token);
    } else {
      throw new Error(data.error || "Registration failed");
    }
  };

  const login = async (credentials: LoginCredentials) => {
    const data = await authService.login(credentials);
    if (data.user && data.token) {
      setUser(data.user);
      setToken(data.token);
    } else {
      throw new Error(data.error || "Login failed");
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    removeToken();
  };

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
