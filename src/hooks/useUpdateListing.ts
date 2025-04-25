import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LaptopT } from "@/interfaces/laptopT";

export function useUpdateListing(laptopId: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch the existing laptop data using TanStack Query
  const {
    data: laptopData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["laptop", laptopId],
    queryFn: async () => {
      if (!laptopId) throw new Error("Laptop ID is missing");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/laptops/${laptopId}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch laptop data");
      }

      return response.json();
    },
    enabled: Boolean(laptopId),
  });

  // Update mutation using TanStack Query
  const updateMutation = useMutation({
    mutationFn: async (formData: Record<string, any>) => {
      if (!laptopId) throw new Error("Laptop ID is missing");

      const updatedLaptopData: Partial<LaptopT> = {
        ...formData,
        price: parseFloat(formData.price),
        cores: parseInt(formData.cores),
        threads: parseInt(formData.threads),
        year: parseInt(formData.year),
        gpuBrand: formData.gpuBrand,
        gpuModel: formData.gpuModel,
        vram: formData.vram,
        images:
          formData.images && formData.images.length > 0
            ? formData.images
            : ["https://placehold.co/800x600/111827/444?text=No+Image"],
        tag: formData.tag && formData.tag.length > 0 ? formData.tag : undefined,
      };

      // Remove undefined properties
      Object.keys(updatedLaptopData).forEach((key) => {
        if (
          updatedLaptopData[key as keyof typeof updatedLaptopData] === undefined
        ) {
          delete updatedLaptopData[key as keyof typeof updatedLaptopData];
        }
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/laptops/${laptopId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedLaptopData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update listing");
      }

      return response.json();
    },
    onSuccess: async (data) => {
      // Keep cache invalidation in the hook
      await queryClient.invalidateQueries({ queryKey: ["laptop", laptopId] });
      await queryClient.invalidateQueries({ queryKey: ["laptops"] });

      // Force a refetch to ensure fresh data is available
      await queryClient.refetchQueries({
        queryKey: ["laptop", laptopId],
        exact: true,
      });

      // Keep navigation logic here since it's consistent across all usages
      setTimeout(() => {
        navigate({ to: `/laptop/${data.id}` });
      }, 1500);
    },
  });

  return {
    laptopData,
    isLoading,
    isError: !!error,
    errorMessage: error instanceof Error ? error.message : "An error occurred",
    updateListing: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    isUpdateSuccess: updateMutation.isSuccess,
    updateError:
      updateMutation.error instanceof Error
        ? updateMutation.error.message
        : updateMutation.error
        ? "Failed to update listing"
        : null,
  };
}
