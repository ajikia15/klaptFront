import { useQuery } from "@tanstack/react-query";
import { LaptopT } from "../interfaces/laptopT";

// Hook for searching laptops with optional filters
export const useSearchLaptops = (query: string = "", userId?: number) => {
  let url = "http://localhost:3000/laptops";

  // Add query parameters if provided
  const params = new URLSearchParams();
  if (query) params.append("search", query);
  if (userId) params.append("userId", userId.toString());

  const queryString = params.toString();
  if (queryString) url += `?${queryString}`;

  return useQuery<LaptopT[]>({
    queryKey: ["laptops", query, userId],
    queryFn: async () => {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch laptops");
      }

      return response.json();
    },
    enabled: userId !== undefined, // Only fetch when userId is provided
  });
};

// Hook for getting laptops by the current user
export const useUserLaptops = (userId?: number) => {
  return useSearchLaptops("", userId);
};
