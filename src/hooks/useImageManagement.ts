import { useState } from "react";

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setUploadedImages((prev) => [...prev, ...data.urls]);
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
