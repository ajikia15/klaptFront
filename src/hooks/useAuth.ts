import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LoginCredentials,
  RegisterCredentials,
  User,
  authService,
} from "../services/authService";

// Key for user data in query cache
export const USER_QUERY_KEY = "currentUser";

// Hook for user registration
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authService.register(credentials),
    onSuccess: (response) => {
      if (response.data) {
        // After successful registration, update the user cache
        queryClient.setQueryData([USER_QUERY_KEY], response.data);
      }
    },
  });
};

// Hook for user login
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (response) => {
      if (response.data) {
        // After successful login, update the user cache
        queryClient.setQueryData([USER_QUERY_KEY], response.data);
      }
    },
  });
};

// Hook for getting the current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: async () => {
      const response = await authService.getCurrentUser();
      if (response.error) {
        // If there's an error (like 403 Forbidden), return null
        return null;
      }
      return response.data as User;
    },
    // Don't refetch on window focus for auth state
    refetchOnWindowFocus: false,
    // Don't throw error for 403 (not authenticated)
    retry: (failureCount, error: any) => {
      // Don't retry if we got a 403 error (user not authenticated)
      if (error?.statusCode === 403) return false;
      return failureCount < 3;
    },
  });
};

// Hook for user logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // After logout, clear the user from cache
      queryClient.setQueryData([USER_QUERY_KEY], null);
    },
  });
};
