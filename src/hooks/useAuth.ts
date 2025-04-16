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

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await fetch(`http://localhost:3000/auth`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data as User[];
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.statusCode === 403) return false;
      return failureCount < 3;
    },
  });
};
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) =>
      authService.updateUser(id, data),
    onMutate: async ({ id, ...newData }) => {
      await queryClient.cancelQueries({ queryKey: [USER_QUERY_KEY] });

      const previousUser = queryClient.getQueryData([USER_QUERY_KEY]);

      queryClient.setQueryData([USER_QUERY_KEY], (old: any) => ({
        ...old,
        ...newData,
      }));

      return { previousUser };
    },
    onError: (err, newData, context: any) => {
      queryClient.setQueryData([USER_QUERY_KEY], context.previousUser);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });
};
