import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FavoriteT } from "@/interfaces/favoriteT";
import { useAuth } from "@/context/AuthContext";

export function useFavoriteStatus(laptopId: number) {
  return useQuery<FavoriteT | null>({
    queryKey: ["favorites", laptopId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3000/favorites/${encodeURIComponent(laptopId)}`,
        { credentials: "include" }
      );
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch favorites");
      }

      const text = await response.text();
      if (!text) {
        return null;
      }

      return JSON.parse(text);
    },
  });
}

export function useListFavorites() {
  const { isAuthenticated } = useAuth();

  return useQuery<FavoriteT[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/favorites`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch favorites");
      }
      return response.json();
    },
    enabled: isAuthenticated,
  });
}

export function useAddToFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (laptopId: number) => {
      const response = await fetch(`http://localhost:3000/favorites`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ laptopId }),
      });
      if (!response.ok) {
        throw new Error("Failed to add to favorites");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });
}

export function useRemoveFromFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (laptopId: number) => {
      const response = await fetch(
        `http://localhost:3000/favorites/${encodeURIComponent(laptopId)}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to remove from favorites");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });
}
