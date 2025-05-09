import { useState } from "react";

export function useImageManagement() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageLink, setImageLink] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploadingImages(true);
    const files = Array.from(e.target.files);

    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("key", import.meta.env.VITE_IMGBB_API_KEY);

        const response = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          uploadedUrls.push(data.data.url);
        } else {
          throw new Error(data.error?.message || "ImgBB upload failed");
        }
      }
      setUploadedImages((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploadingImages(false);
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
