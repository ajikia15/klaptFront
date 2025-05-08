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

// Token management helpers
const TOKEN_KEY = "jwt_token";

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Wrapper for fetch with Authorization header
export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {}
) {
  const token = getToken();
  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(input, { ...init, headers });
}

export const authService = {
  register: async (credentials: RegisterCredentials) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (data.token) setToken(data.token);
    return data;
  },

  login: async (credentials: LoginCredentials) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (data.token) setToken(data.token);
    return data;
  },

  getCurrentUser: async () => {
    const res = await fetchWithAuth(
      `${import.meta.env.VITE_API_URL}/auth/whoami`
    );
    return await res.json();
  },

  logout: async () => {
    removeToken();
    // Optionally notify backend
    await fetchWithAuth(`${import.meta.env.VITE_API_URL}/auth/signout`, {
      method: "POST",
    });
  },

  updateUser: async (userId: string, data: Partial<User>) => {
    const res = await fetchWithAuth(
      `${import.meta.env.VITE_API_URL}/auth/${userId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    return await res.json();
  },
};
