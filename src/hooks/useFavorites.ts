import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FavoriteT } from "@/interfaces/favoriteT";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/services/api";

export function useFavoriteStatus(laptopId: number) {
  return useQuery<FavoriteT | null>({
    queryKey: ["favorites", laptopId],
    queryFn: async () => {
      const response = await apiRequest(
        `/favorites/${encodeURIComponent(laptopId)}`
      );
      if (response.error) {
        if (response.statusCode === 404) {
          return null;
        }
        throw new Error("Failed to fetch favorites: " + response.error);
      }
      return response.data as FavoriteT | null;
    },
    staleTime: 1000 * 60,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
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
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (laptopId: number) => {
      const response = await apiRequest(`/favorites`, {
        method: "POST",
        body: JSON.stringify({ laptopId }),
      });
      if (response.error) {
        throw new Error("Failed to add to favorites: " + response.error);
      }
      return response.data as FavoriteT; // Assuming API returns the created/updated favorite
    },
    onMutate: async (laptopId: number) => {
      // Optimistically update the UI
      const optimisticFavorite: FavoriteT = {
        laptopId,
        id: Date.now(), // Temporary client-generated ID for optimistic update
        userId: user?.id || -1, // Use actual user ID or a placeholder
      };

      // Update the specific favorite status optimistically
      queryClient.setQueryData(["favorites", laptopId], optimisticFavorite);

      // Update the list of all favorites optimistically
      const previousFavoritesList = queryClient.getQueryData<FavoriteT[]>([
        "favorites",
      ]);
      if (previousFavoritesList) {
        queryClient.setQueryData(
          ["favorites"],
          [...previousFavoritesList, optimisticFavorite]
        );
      } else {
        queryClient.setQueryData(["favorites"], [optimisticFavorite]);
      }
      // No need to return context for this simple version
    },
    onSuccess: (data, laptopId) => {
      // The mutation was successful. `data` is the actual favorite object from the server.
      // Update the cache for the specific item with the server-confirmed data.
      queryClient.setQueryData(["favorites", laptopId], data);

      // Invalidate both the specific item and the list to ensure consistency.
      // This will refetch and ensure the list contains the server-confirmed item.
      queryClient.invalidateQueries({ queryKey: ["favorites", laptopId] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (_error, laptopId) => {
      // An error occurred. Invalidate queries to refetch from the server.
      // This will revert any optimistic changes by fetching the true server state.
      queryClient.invalidateQueries({ queryKey: ["favorites", laptopId] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useRemoveFromFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (laptopId: number) => {
      const response = await apiRequest(
        `/favorites/${encodeURIComponent(laptopId)}`,
        {
          method: "DELETE",
        }
      );
      if (response.error) {
        throw new Error("Failed to remove from favorites: " + response.error);
      }
      // DELETE might not return content
    },
    onMutate: async (laptopId: number) => {
      // Optimistically update the specific favorite status to null
      queryClient.setQueryData(["favorites", laptopId], null);

      // Optimistically update the list of all favorites
      const previousFavoritesList = queryClient.getQueryData<FavoriteT[]>([
        "favorites",
      ]);
      if (previousFavoritesList) {
        queryClient.setQueryData(
          ["favorites"],
          previousFavoritesList.filter((fav) => fav.laptopId !== laptopId)
        );
      }
      // No need to return context for this simple version
    },
    onSuccess: (_data, laptopId) => {
      // The mutation was successful. Invalidate queries to ensure consistency.
      queryClient.invalidateQueries({ queryKey: ["favorites", laptopId] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (_error, laptopId) => {
      // An error occurred. Invalidate queries to refetch from the server.
      queryClient.invalidateQueries({ queryKey: ["favorites", laptopId] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
