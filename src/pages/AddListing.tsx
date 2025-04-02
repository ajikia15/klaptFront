import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SpinnerSVG } from "@/assets/SpinnerSVG";

export default function AddListing() {
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not authenticated
  const { isLoading: authLoading } = useRequireAuth();

  const form = useForm({
    defaultValues: {
      title: "",
      brand: "",
      model: "",
      price: "",
      description: "",
      shortDesc: "",
      processorBrand: "",
      processorModel: "",
      cores: "",
      threads: "",
      gpuBrand: "",
      gpuModel: "",
      vram: "",
      ram: "",
      ramType: "",
      storageType: "",
      storageCapacity: "",
      screenSize: "",
      screenResolution: "",
      refreshRate: "",
      weight: "",
      stockStatus: "in stock",
      year: new Date().getFullYear().toString(),
    },
    onSubmit: async ({ value }) => {
      try {
        setFormStatus("submitting");

        // Construct laptop object
        const laptopData = {
          ...value,
          price: parseFloat(value.price),
          cores: parseInt(value.cores),
          threads: parseInt(value.threads),
          vram: value.vram ? parseInt(value.vram) : null,
          ram: parseInt(value.ram),
          refreshRate: parseInt(value.refreshRate),
          year: parseInt(value.year),
          images:
            uploadedImages.length > 0
              ? uploadedImages
              : ["https://placehold.co/800x600/111827/444?text=No+Image"],
          userId: user?.id, // Make sure this is available from your auth context
        };

        // Send to API
        const response = await fetch("http://localhost:3000/laptops", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(laptopData),
        });

        if (!response.ok) {
          throw new Error("Failed to add listing");
        }

        setFormStatus("success");

        // Redirect to the newly created listing
        const data = await response.json();
        setTimeout(() => {
          navigate({ to: `/laptop/${data.id}` });
        }, 1500);
      } catch (error) {
        setFormStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to add listing"
        );
      }
    },
  });

  // Image upload handler (mock implementation - would need actual upload logic)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // For demo purposes, just create placeholders
    // In a real app, you would upload these files to your server/cloud storage
    const newImages = Array.from(files).map(
      (_, index) =>
        `https://placehold.co/800x600/111827/444?text=Image+${
          uploadedImages.length + index + 1
        }`
    );

    setUploadedImages([...uploadedImages, ...newImages]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  if (authLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen bg-neutral-900">
        <div className="text-primary-400 text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200 py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Add New Laptop Listing
          </h1>
          <p className="text-neutral-400 mt-2">
            Fill out the details below to create a new laptop listing
          </p>
        </div>

        <div className="bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 rounded-2xl border border-neutral-700/50 p-8 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="relative z-10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              {formStatus === "error" && (
                <div className="p-4 mb-6 bg-red-900/50 text-red-200 rounded-md">
                  {errorMessage}
                </div>
              )}

              {formStatus === "success" && (
                <div className="p-4 mb-6 bg-green-900/50 text-green-200 rounded-md">
                  Listing created successfully! Redirecting...
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information Section */}
                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-neutral-700">
                    Basic Information
                  </h2>
                </div>

                <div>
                  <form.Field
                    name="title"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "Title is required";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          Title
                        </label>
                        <input
                          id="title"
                          placeholder="e.g., ASUS ROG Strix G15 Gaming Laptop"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field
                    name="price"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "Price is required";
                        if (isNaN(Number(value)))
                          return "Price must be a number";
                        if (Number(value) <= 0)
                          return "Price must be greater than zero";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          Price ($)
                        </label>
                        <input
                          id="price"
                          type="number"
                          placeholder="e.g., 1299.99"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field
                    name="brand"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "Brand is required";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="brand"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          Brand
                        </label>
                        <input
                          id="brand"
                          placeholder="e.g., ASUS, Dell, HP"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field
                    name="model"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "Model is required";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="model"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          Model
                        </label>
                        <input
                          id="model"
                          placeholder="e.g., ROG Strix G15, XPS 15"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div className="md:col-span-2">
                  <form.Field
                    name="shortDesc"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "Short description is required";
                        if (value.length > 100)
                          return "Keep it under 100 characters";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="shortDesc"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          Short Description
                        </label>
                        <input
                          id="shortDesc"
                          placeholder="Brief specs summary, e.g., 'i7, 16GB RAM, RTX 3070, 1TB SSD'"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                          maxLength={100}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div className="md:col-span-2">
                  <form.Field
                    name="description"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "Full description is required";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          Full Description
                        </label>
                        <textarea
                          id="description"
                          rows={4}
                          placeholder="Detailed description of the laptop..."
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field
                    name="year"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "Year is required";
                        const year = parseInt(value);
                        if (isNaN(year)) return "Year must be a number";
                        if (year < 2000 || year > new Date().getFullYear() + 1)
                          return `Year must be between 2000 and ${
                            new Date().getFullYear() + 1
                          }`;
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="year"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          Year
                        </label>
                        <input
                          id="year"
                          type="number"
                          placeholder={new Date().getFullYear().toString()}
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                          min={2000}
                          max={new Date().getFullYear() + 1}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field name="stockStatus">
                    {(field) => (
                      <>
                        <label
                          htmlFor="stockStatus"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          Stock Status
                        </label>
                        <select
                          id="stockStatus"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        >
                          <option value="in stock">In Stock</option>
                          <option value="reserved">Reserved</option>
                          <option value="out of stock">Out of Stock</option>
                        </select>
                      </>
                    )}
                  </form.Field>
                </div>

                {/* Performance Section */}
                <div className="md:col-span-2 mt-4">
                  <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-neutral-700">
                    Performance Specifications
                  </h2>
                </div>

                <div>
                  <form.Field
                    name="processorBrand"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "Processor brand is required";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="processorBrand"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          Processor Brand
                        </label>
                        <input
                          id="processorBrand"
                          placeholder="e.g., Intel, AMD"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field
                    name="processorModel"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "Processor model is required";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="processorModel"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          Processor Model
                        </label>
                        <input
                          id="processorModel"
                          placeholder="e.g., Core i7-12700H, Ryzen 7 5800H"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field
                    name="cores"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "Number of cores is required";
                        if (isNaN(Number(value))) return "Must be a number";
                        if (Number(value) <= 0)
                          return "Must be greater than zero";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="cores"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          CPU Cores
                        </label>
                        <input
                          id="cores"
                          type="number"
                          placeholder="e.g., 8"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field
                    name="threads"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "Number of threads is required";
                        if (isNaN(Number(value))) return "Must be a number";
                        if (Number(value) <= 0)
                          return "Must be greater than zero";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="threads"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          CPU Threads
                        </label>
                        <input
                          id="threads"
                          type="number"
                          placeholder="e.g., 16"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field
                    name="gpuBrand"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "GPU brand is required";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="gpuBrand"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          GPU Brand
                        </label>
                        <input
                          id="gpuBrand"
                          placeholder="e.g., NVIDIA, AMD, Intel"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field
                    name="gpuModel"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "GPU model is required";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="gpuModel"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          GPU Model
                        </label>
                        <input
                          id="gpuModel"
                          placeholder="e.g., RTX 3070, Radeon RX 6700M"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field
                    name="vram"
                    validators={{
                      onChange: ({ value }) => {
                        if (value && isNaN(Number(value)))
                          return "VRAM must be a number";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="vram"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          VRAM (GB){" "}
                          <span className="text-neutral-400 text-xs">
                            (optional)
                          </span>
                        </label>
                        <input
                          id="vram"
                          type="number"
                          placeholder="e.g., 8"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field
                    name="ram"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "RAM amount is required";
                        if (isNaN(Number(value))) return "RAM must be a number";
                        if (Number(value) <= 0)
                          return "RAM must be greater than zero";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="ram"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          RAM (GB)
                        </label>
                        <input
                          id="ram"
                          type="number"
                          placeholder="e.g., 16"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field
                    name="ramType"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "RAM type is required";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="ramType"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          RAM Type
                        </label>
                        <input
                          id="ramType"
                          placeholder="e.g., DDR4, DDR5, LPDDR4X"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                {/* Storage & Display Section */}
                <div className="md:col-span-2 mt-4">
                  <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-neutral-700">
                    Storage & Display
                  </h2>
                </div>

                <div>
                  <form.Field
                    name="storageType"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "Storage type is required";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="storageType"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          Storage Type
                        </label>
                        <input
                          id="storageType"
                          placeholder="e.g., SSD, HDD, NVMe"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field
                    name="storageCapacity"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "Storage capacity is required";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="storageCapacity"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          Storage Capacity
                        </label>
                        <input
                          id="storageCapacity"
                          placeholder="e.g., 512GB, 1TB"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field
                    name="screenSize"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "Screen size is required";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="screenSize"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          Screen Size (inches)
                        </label>
                        <input
                          id="screenSize"
                          placeholder="e.g., 15.6"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field
                    name="screenResolution"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "Screen resolution is required";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="screenResolution"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          Screen Resolution
                        </label>
                        <input
                          id="screenResolution"
                          placeholder="e.g., 1920x1080, 2560x1440"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field
                    name="refreshRate"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "Refresh rate is required";
                        if (isNaN(Number(value)))
                          return "Refresh rate must be a number";
                        if (Number(value) <= 0)
                          return "Refresh rate must be greater than zero";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="refreshRate"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          Refresh Rate (Hz)
                        </label>
                        <input
                          id="refreshRate"
                          type="number"
                          placeholder="e.g., 60, 144, 240"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field
                    name="weight"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "Weight is required";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="weight"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          Weight
                        </label>
                        <input
                          id="weight"
                          placeholder="e.g., 2.3kg, 5.1 lbs"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        />
                        {field.state.meta.errors ? (
                          <div className="text-red-300 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </div>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                {/* Images Section */}
                <div className="md:col-span-2 mt-4">
                  <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-neutral-700">
                    Images
                  </h2>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-200 mb-2">
                      Upload Images
                    </label>
                    <div className="flex flex-col space-y-4">
                      <label className="flex justify-center w-full h-32 px-4 transition bg-neutral-700 border-2 border-neutral-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-secondary-500 focus:outline-none">
                        <span className="flex items-center space-x-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-neutral-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <span className="font-medium text-neutral-300">
                            Drop files to Attach, or
                            <span className="text-secondary-500 ml-1">
                              browse
                            </span>
                          </span>
                        </span>
                        <input
                          type="file"
                          name="file_upload"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          disabled={formStatus === "submitting"}
                        />
                      </label>

                      {uploadedImages.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Preview ${index + 1}`}
                                className="h-24 w-full object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove image"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className="py-3 px-8 flex items-center justify-center gap-3 text-white font-semibold rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-[1.02] focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-50 bg-gradient-to-r from-purple-600 to-primary-600 hover:from-purple-700 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus === "submitting" ? (
                    <>
                      <SpinnerSVG className="w-5 h-5" />
                      <span>Creating Listing...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      <span>Create Listing</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
