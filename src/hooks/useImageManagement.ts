import { useState } from "react";
import { apiRequest } from "@/services/api";

export function useImageManagement() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageLink, setImageLink] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploadingImages(true);
    const files = Array.from(e.target.files);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("image", file);
    });

    try {
      // Use apiRequest for protected upload
      const result = await apiRequest("/upload", {
        method: "POST",
        body: formData,
      });
      if (result.error) throw new Error("Upload failed: " + result.error);
      setUploadedImages((prev) => [
        ...prev,
        ...(result.data as { urls: string[] }).urls,
      ]);
    } catch (error) {
      console.error("Error uploading images:", error);
      // Could add error state management here
    } finally {
      setUploadingImages(false);
      // Clear file input
      if (e.target) e.target.value = "";
    }
  };

  const handleImageLinkSubmit = () => {
    if (!imageLink.trim()) return;
    setUploadedImages((prev) => [...prev, imageLink]);
    setImageLink("");
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    setUploadedImages([]);
  };

  return {
    uploadedImages,
    setUploadedImages, // Expose the setter function for EditListingPage
    uploadingImages,
    imageLink,
    setImageLink,
    handleImageUpload,
    removeImage,
    handleImageLinkSubmit,
    clearImages,
  };
}
