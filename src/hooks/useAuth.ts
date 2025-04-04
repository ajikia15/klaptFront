import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LoginCredentials,
  RegisterCredentials,
  User,
  authService,
} from "../services/authService";

export const USER_QUERY_KEY = "currentUser";

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authService.register(credentials),
    onSuccess: (response) => {
      if (response.data) {
        queryClient.setQueryData([USER_QUERY_KEY], response.data);
      }
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (response) => {
      if (response.data) {
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
        return null;
      }
      return response.data as User;
    },
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.statusCode === 403) return false;
      return failureCount < 3;
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData([USER_QUERY_KEY], null);
    },
  });
};
