import { apiRequest } from "./api";

// Types
export interface User {
  id: number;
  email: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Auth API services
export const authService = {
  // Register a new user
  register: async (credentials: RegisterCredentials) => {
    return apiRequest<User>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  // Login a user
  login: async (credentials: LoginCredentials) => {
    return apiRequest<User>("/auth/signin", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  // Check if user is authenticated
  getCurrentUser: async () => {
    return apiRequest<User>("/auth/whoami");
  },

  // Logout a user
  logout: async () => {
    return apiRequest("/auth/signout", {
      method: "POST",
    });
  },
};
