import { useState } from "react";

export function useImageManagement() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageLink, setImageLink] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    try {
      const tempPreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setUploadedImages((prev) => [...prev, ...tempPreviews]);
      const uploadPromises = Array.from(files).map(async (file, fileIndex) => {
        const formData = new FormData();
        formData.append("image", file);
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMGBB_API_KEY
          }`,
          { method: "POST", body: formData }
        );
        if (!response.ok)
          throw new Error(`Failed to upload image: ${response.statusText}`);
        const data = await response.json();
        setUploadedImages((prev) => {
          const tempIndex = prev.indexOf(tempPreviews[fileIndex]);
          if (tempIndex !== -1) {
            const newUrls = [...prev];
            newUrls[tempIndex] = data.data.url;
            return newUrls;
          }
          return prev;
        });
        URL.revokeObjectURL(tempPreviews[fileIndex]);
        return data.data.url;
      });
      await Promise.all(uploadPromises);
    } catch (error) {
      alert("Failed to upload one or more images. Please try again.");
      setUploadedImages((prev) =>
        prev.filter((url) => !url.startsWith("blob:"))
      );
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    const imageUrl = uploadedImages[index];
    if (imageUrl.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleImageLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!imageLink) return;

    try {
      new URL(imageLink);
      // Add the new image to the existing images array
      setUploadedImages((prev) => {
        // Check if image is already in the array
        if (prev.includes(imageLink)) {
          alert("This image URL has already been added");
          return prev;
        }
        return [...prev, imageLink];
      });
      setImageLink("");
    } catch (err) {
      alert("Please enter a valid image URL");
    }
  };

  const clearImages = () => {
    // Revoke object URLs to prevent memory leaks
    uploadedImages
      .filter((url) => url.startsWith("blob:"))
      .forEach((url) => URL.revokeObjectURL(url));
    setUploadedImages([]);
  };

  return {
    uploadedImages,
    uploadingImages,
    imageLink,
    setImageLink,
    handleImageUpload,
    removeImage,
    handleImageLinkSubmit,
    clearImages,
  };
}
