import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LaptopT } from "@/interfaces/laptopT";

type FormStatus = "idle" | "loading" | "submitting" | "success" | "error";

export function useUpdateListing(laptopId: string) {
  const [formStatus, setFormStatus] = useState<FormStatus>("loading"); // Start with loading state
  const [errorMessage, setErrorMessage] = useState("");
  const [laptopData, setLaptopData] = useState<LaptopT | null>(null);
  const navigate = useNavigate();

  // Fetch the existing laptop data
  useEffect(() => {
    async function fetchLaptopData() {
      if (!laptopId) return;

      try {
        setFormStatus("loading");
        console.log("Fetching laptop data for ID:", laptopId);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/laptops/${laptopId}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch laptop data");
        }

        const data = await response.json();
        console.log("Laptop data fetched:", data);
        setLaptopData(data);
        setFormStatus("idle");
      } catch (error) {
        console.error("Error fetching laptop:", error);
        setFormStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to fetch laptop data"
        );
      }
    }

    fetchLaptopData();
  }, [laptopId]);

  const updateListing = async (formData: Record<string, any>) => {
    if (!laptopId) {
      setErrorMessage("Laptop ID is missing");
      setFormStatus("error");
      return;
    }

    try {
      setFormStatus("submitting");

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

      // Remove undefined properties for a clean API payload
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

      setFormStatus("success");
      const data = await response.json();

      // Redirect to the laptop page after successful update
      setTimeout(() => navigate({ to: `/laptop/${data.id}` }), 1500);
      return data;
    } catch (error) {
      setFormStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update listing"
      );
      throw error;
    }
  };

  return { formStatus, errorMessage, laptopData, updateListing };
}
