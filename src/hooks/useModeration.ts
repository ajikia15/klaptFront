import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/services/api";

export function useChangeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      laptopId,
      status,
    }: {
      laptopId: number;
      status: "approved" | "pending" | "rejected" | "archived";
    }) => {
      const result = await apiRequest(`/laptops/${laptopId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (result.error) {
        throw new Error(
          `Failed to change laptop status to ${status}: ${result.error}`
        );
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["laptopSearch"],
      });
    },
  });
}

export function useDeleteLaptop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (laptopId: number) => {
      const result = await apiRequest(`/laptops/${laptopId}`, {
        method: "DELETE",
      });
      if (result.error) {
        throw new Error(
          `Failed to delete laptop with id ${laptopId}: ${result.error}`
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["laptopSearch"],
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      const result = await apiRequest(`/users/${userId}`, {
        method: "DELETE",
      });
      if (result.error) {
        throw new Error(
          `Failed to delete user with id ${userId}: ${result.error}`
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}

export function useUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      admin,
    }: {
      userId: number;
      admin: boolean;
    }) => {
      const result = await apiRequest(`/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ admin }),
      });
      if (result.error) {
        throw new Error(
          `Failed to change user role with id ${userId}: ${result.error}`
        );
      }
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}
