import { apiRequest } from "./api";

export interface User {
  id: number;
  email: string;
  admin: boolean;
  username: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  register: async (credentials: RegisterCredentials) => {
    return apiRequest<User>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  login: async (credentials: LoginCredentials) => {
    return apiRequest<User>("/auth/signin", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  getCurrentUser: async () => {
    return apiRequest<User>("/auth/whoami");
  },

  logout: async () => {
    return apiRequest("/auth/signout", {
      method: "POST",
    });
  },

  updateUser: async (userId: string, data: Partial<User>) => {
    return apiRequest<User>(`/auth/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};
