import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FavoriteT } from "@/interfaces/favoriteT";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/services/api";

export function useFavoriteStatus(laptopId: number) {
  return useQuery<FavoriteT | null>({
    queryKey: ["favorites", laptopId],
    queryFn: async () => {
      const response = await apiRequest(`/favorites/${encodeURIComponent(laptopId)}`);
      if (response.error) {
        if (response.statusCode === 404) {
          return null;
        }
        throw new Error("Failed to fetch favorites: " + response.error);
      }
      return response.data as FavoriteT | null;
    },
  });
}

export function useListFavorites() {
  const { isAuthenticated } = useAuth();

  return useQuery<FavoriteT[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const response = await apiRequest(`/favorites`);
      if (response.error) {
        throw new Error("Failed to fetch favorites: " + response.error);
      }
      return response.data as FavoriteT[];
    },
    enabled: isAuthenticated,
  });
}

export function useAddToFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (laptopId: number) => {
      const response = await apiRequest(`/favorites`, {
        method: "POST",
        body: JSON.stringify({ laptopId }),
      });
      if (response.error) {
        throw new Error("Failed to add to favorites: " + response.error);
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
      const response = await apiRequest(`/favorites/${encodeURIComponent(laptopId)}`, {
        method: "DELETE",
      });
      if (response.error) {
        throw new Error("Failed to remove from favorites: " + response.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });
}
