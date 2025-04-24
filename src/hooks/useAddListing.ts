import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LaptopT } from "@/interfaces/laptopT";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function useAddListing() {
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const addListing = async (formData: Record<string, any>) => {
    try {
      setFormStatus("submitting");

      // Create a clean data object from form values
      const laptopData: Partial<LaptopT> = {
        ...formData,
        price: parseFloat(formData.price),
        cores: parseInt(formData.cores),
        threads: parseInt(formData.threads),
        year: parseInt(formData.year),

        // Direct assignments without conditionals
        gpuBrand: formData.gpuBrand,
        gpuModel: formData.gpuModel,
        vram: formData.vram,

        // Default image if none provided
        images:
          formData.images && formData.images.length > 0
            ? formData.images
            : ["https://placehold.co/800x600/111827/444?text=No+Image"],

        // Optional tags
        tag: formData.tag && formData.tag.length > 0 ? formData.tag : undefined,
      };

      // Remove undefined properties for a clean API payload
      Object.keys(laptopData).forEach((key) => {
        if (laptopData[key as keyof typeof laptopData] === undefined) {
          delete laptopData[key as keyof typeof laptopData];
        }
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/laptops`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(laptopData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add listing");
      }

      setFormStatus("success");
      const data = await response.json();

      // Redirect to the new laptop page after successful creation
      setTimeout(() => navigate({ to: `/laptop/${data.id}` }), 1500);
      return data;
    } catch (error) {
      setFormStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to add listing"
      );
      throw error;
    }
  };

  return { formStatus, errorMessage, addListing };
}
