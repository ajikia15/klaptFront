import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LaptopT } from "@/interfaces/laptopT";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function useAddListing() {
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const addListing = async (value: Record<string, any>) => {
    try {
      setFormStatus("submitting");
      // Allowed values for union types
      const processorBrands = ["Intel", "AMD", "Apple"];
      const ramTypes = ["DDR3", "DDR4", "DDR5"];
      const storageTypes = ["HDD", "SSD", "HDD + SSD"];
      const stockStatuses = ["reserved", "sold", "in stock"];
      const graphicsTypes = ["Dedicated", "Integrated"];
      const conditionTypes = ["new", "like-new", "used", "damaged"];
      const backlightTypes = ["RGB", "Single-color", "None"];

      // Helper to cast or undefined
      const castOrUndef = (val: string, allowed: string[]) =>
        allowed.includes(val) ? (val as any) : undefined;

      const graphicsType = castOrUndef(value.graphicsType, graphicsTypes);
      const processorBrand = castOrUndef(value.processorBrand, processorBrands);
      const ramType = castOrUndef(value.ramType, ramTypes);
      const storageType = castOrUndef(value.storageType, storageTypes);
      const stockStatus = castOrUndef(value.stockStatus, stockStatuses);
      const condition = castOrUndef(value.condition, conditionTypes);
      const backlightType = castOrUndef(value.backlightType, backlightTypes);

      const laptopData: Partial<LaptopT> = {
        ...value,
        processorBrand: processorBrand,
        price: parseFloat(value.price),
        cores: parseInt(value.cores),
        threads: parseInt(value.threads),
        graphicsType,
        vram:
          graphicsType === "Dedicated" && value.vram
            ? parseInt(value.vram)
            : undefined,
        gpuBrand:
          graphicsType === "Dedicated" && value.gpuBrand
            ? value.gpuBrand
            : undefined,
        gpuModel:
          graphicsType === "Dedicated" && value.gpuModel
            ? value.gpuModel
            : undefined,
        ram: parseInt(value.ram),
        ramType,
        storageType,
        refreshRate: parseInt(value.refreshRate),
        year: parseInt(value.year),
        images:
          value.images && value.images.length > 0
            ? value.images
            : ["https://placehold.co/800x600/111827/444?text=No+Image"],
        tag: value.tag && value.tag.length > 0 ? value.tag : undefined,
        stockStatus,
        condition,
        backlightType,
      };
      // Remove any keys with value undefined (optional, but keeps payload clean)
      Object.keys(laptopData).forEach(
        (k) =>
          laptopData[k as keyof typeof laptopData] === undefined &&
          delete laptopData[k as keyof typeof laptopData]
      );
      const response = await fetch(`${import.meta.env.VITE_API_URL}/laptops`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(laptopData),
      });
      if (!response.ok) throw new Error("Failed to add listing");
      setFormStatus("success");
      const data = await response.json();
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
