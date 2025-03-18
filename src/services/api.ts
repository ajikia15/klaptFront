// Base API configuration and helper functions
const API_URL = "http://localhost:3000";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  statusCode?: number;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_URL}${endpoint}`;

  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // This will send cookies with requests
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "Something went wrong",
        statusCode: response.status,
      };
    }

    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}
