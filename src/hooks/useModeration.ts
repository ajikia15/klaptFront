import { useMutation, useQueryClient } from "@tanstack/react-query";

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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/laptops/${laptopId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to change laptop status to ${status}`);
      }

      // Return the response data
      return await response.json();
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/laptops/${laptopId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to delete laptop with id ${laptopId}`);
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to delete user with id ${userId}`);
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}/role`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ admin }),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to change user role with id ${userId}`);
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
