import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { SpinnerSVG } from "@/assets/SpinnerSVG";

// Add predefined options for select fields
const LAPTOP_BRANDS = [
  "ASUS",
  "Dell",
  "HP",
  "Lenovo",
  "Apple",
  "Acer",
  "MSI",
  "Razer",
  "Alienware",
  "Microsoft",
  "Samsung",
  "Gigabyte",
  "Other",
];
const PROCESSOR_BRANDS = ["Intel", "AMD", "Apple"];
const GPU_BRANDS = ["NVIDIA", "AMD", "Intel", "Apple"];
const RAM_TYPES = ["DDR3", "DDR4", "DDR5"];
const STORAGE_TYPES = ["SSD", "HDD", "HDD + SSD"];
const STOCK_STATUSES = ["in stock", "out of stock", "reserved", "pre-order"];
const GRAPHICS_TYPES = ["Dedicated", "Integrated"];
const CONDITION_TYPES = ["new", "like-new", "used", "damaged"];
const TAG_OPTIONS = [
  "gaming",
  "business",
  "productivity",
  "budget",
  "creative",
  "ultrabook",
];

const vramOptions = [
  "2GB",
  "3GB",
  "4GB",
  "6GB",
  "8GB",
  "10GB",
  "12GB",
  "16GB",
  "24GB",
  "48GB",
];

const backlightTypeOptions = ["RGB", "Single-color", "None"];

const ramOptions = [
  "4GB",
  "8GB",
  "12GB",
  "16GB",
  "24GB",
  "32GB",
  "64GB",
  "96GB",
  "128GB",
];

export default function AddListing() {
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);
  const [graphicsType, setGraphicsType] = useState<string>("");
  const navigate = useNavigate();

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
      graphicsType: "",
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
      backlightType: "",
      condition: "",
      tags: [] as string[],
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
          graphicsType: value.graphicsType,
          // Handle GPU fields based on graphics type
          gpuBrand: value.graphicsType === "Dedicated" ? value.gpuBrand : null,
          gpuModel: value.graphicsType === "Dedicated" ? value.gpuModel : null,
          vram:
            value.graphicsType === "Dedicated" && value.vram
              ? parseInt(value.vram)
              : null,
          ram: parseInt(value.ram),
          refreshRate: parseInt(value.refreshRate),
          year: parseInt(value.year),
          // Include condition field
          condition: value.condition || "new",
          // Include tags field, or empty array if none selected
          tag: value.tags || [],
          images:
            uploadedImages.length > 0
              ? uploadedImages
              : ["https://placehold.co/800x600/111827/444?text=No+Image"],
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

  const fillWithTestData = () => {
    form.update({
      defaultValues: {
        title: "ASUS ROG Strix G15 Gaming Laptop",
        brand: "ASUS",
        model: "ROG Strix G15",
        price: "1599.99",
        description:
          "The ROG Strix G15 gaming laptop delivers powerful performance for gaming and content creation. Featuring an advanced cooling system, immersive audio, and a high refresh rate display for competitive gaming. The laptop's sleek design includes customizable RGB lighting that extends from the keyboard to the light bar.",
        shortDesc: "AMD Ryzen 9, 16 RAM, RTX 3070, 1TB SSD",
        processorBrand: "AMD",
        processorModel: "Ryzen 9 5900HX",
        cores: "8",
        threads: "16",
        graphicsType: "Dedicated",
        gpuBrand: "NVIDIA",
        gpuModel: "GeForce RTX 3070",
        vram: "8",
        ram: "16",
        ramType: "DDR4",
        storageType: "SSD",
        storageCapacity: "1TB",
        screenSize: "15.6",
        screenResolution: "2560x1440",
        refreshRate: "165",
        weight: "2.3kg",
        stockStatus: "in stock",
        year: "2023",
        backlightType: "RGB",
        condition: "new",
        tags: ["gaming", "creative"],
      },
    });
  };

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Show loading state
    setUploadingImages(true);

    try {
      // Create temporary object URLs for immediate display
      const tempPreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setUploadedImages((prev) => [...prev, ...tempPreviews]);

      // Upload each file to imgBB
      const uploadPromises = Array.from(files).map(async (file, fileIndex) => {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMGBB_API_KEY
          }`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to upload image: ${response.statusText}`);
        }

        const data = await response.json();

        // Replace this specific temporary preview with the actual URL
        setUploadedImages((prev) => {
          const tempIndex = prev.indexOf(tempPreviews[fileIndex]);
          if (tempIndex !== -1) {
            const newUrls = [...prev];
            newUrls[tempIndex] = data.data.url;
            return newUrls;
          }
          return prev;
        });

        // Revoke the corresponding object URL
        URL.revokeObjectURL(tempPreviews[fileIndex]);

        return data.data.url;
      });

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload one or more images. Please try again.");

      // Remove any remaining blob URLs
      setUploadedImages((prev) =>
        prev.filter((url) => !url.startsWith("blob:"))
      );
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    const imageUrl = uploadedImages[index];

    // Revoke object URL if it's a temporary preview
    if (imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrl);
    }

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
                        <select
                          id="brand"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        >
                          <option value="">Select Brand</option>
                          {LAPTOP_BRANDS.map((brand) => (
                            <option key={brand} value={brand}>
                              {brand}
                            </option>
                          ))}
                        </select>
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
                          placeholder="Brief specs summary, e.g., 'i7, 16 RAM, RTX 3070, 1TB SSD'"
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
                          {STOCK_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </form.Field>
                </div>

                {/* Processor Section */}
                <div className="md:col-span-2 mt-4">
                  <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-neutral-700">
                    Processor
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Processor Brand field */}
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
                            <select
                              id="processorBrand"
                              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                              value={field.state.value || ""}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              disabled={formStatus === "submitting"}
                            >
                              <option value="" disabled>
                                Select Processor Brand
                              </option>
                              {PROCESSOR_BRANDS.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            {field.state.meta.errors ? (
                              <div className="text-red-300 text-sm mt-1">
                                {field.state.meta.errors.join(", ")}
                              </div>
                            ) : null}
                          </>
                        )}
                      </form.Field>
                    </div>

                    {/* Processor Model field */}
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
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
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
                  </div>
                </div>

                {/* Graphics & Memory Section */}
                <div className="md:col-span-2 mt-4">
                  <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-neutral-700">
                    Graphics & Memory
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Graphics Type field */}
                    <div>
                      <form.Field
                        name="graphicsType"
                        validators={{
                          onChange: ({ value }) => {
                            if (!value) return "Graphics type is required";
                            return undefined;
                          },
                        }}
                      >
                        {(field) => (
                          <>
                            <label
                              htmlFor="graphicsType"
                              className="block text-sm font-medium text-neutral-200 mb-1"
                            >
                              Graphics Type
                            </label>
                            <select
                              id="graphicsType"
                              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                              value={field.state.value}
                              onChange={(e) => {
                                field.handleChange(e.target.value);
                                setGraphicsType(e.target.value);
                              }}
                              disabled={formStatus === "submitting"}
                            >
                              <option value="">Select Graphics Type</option>
                              {GRAPHICS_TYPES.map((type) => (
                                <option key={type} value={type}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                              ))}
                            </select>
                            {field.state.meta.errors ? (
                              <div className="text-red-300 text-sm mt-1">
                                {field.state.meta.errors.join(", ")}
                              </div>
                            ) : null}
                          </>
                        )}
                      </form.Field>
                    </div>

                    {/* GPU brand field */}
                    <div>
                      <form.Field
                        name="gpuBrand"
                        validators={{
                          onChange: ({ value }) => {
                            const graphicsType =
                              form.getFieldValue("graphicsType");
                            if (graphicsType === "Dedicated" && !value)
                              return "GPU brand is required";
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
                            <select
                              id="gpuBrand"
                              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              disabled={
                                formStatus === "submitting" ||
                                graphicsType !== "Dedicated"
                              }
                            >
                              <option value="">Select GPU Brand</option>
                              {GPU_BRANDS.map((brand) => (
                                <option key={brand} value={brand}>
                                  {brand}
                                </option>
                              ))}
                            </select>
                            {field.state.meta.errors ? (
                              <div className="text-red-300 text-sm mt-1">
                                {field.state.meta.errors.join(", ")}
                              </div>
                            ) : null}
                          </>
                        )}
                      </form.Field>
                    </div>

                    {/* GPU Model field */}
                    <div>
                      <form.Field
                        name="gpuModel"
                        validators={{
                          onChange: ({ value }) => {
                            const graphicsType =
                              form.getFieldValue("graphicsType");
                            if (graphicsType === "Dedicated" && !value)
                              return "GPU model is required";
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
                              placeholder="e.g., GeForce RTX 3070, Radeon RX 6800M"
                              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              disabled={
                                formStatus === "submitting" ||
                                graphicsType !== "Dedicated"
                              }
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

                    {/* VRAM field */}
                    <div>
                      <form.Field
                        name="vram"
                        validators={{
                          onChange: ({ value }) => {
                            const graphicsType =
                              form.getFieldValue("graphicsType");
                            if (graphicsType === "Dedicated" && !value)
                              return "VRAM is required";
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
                              VRAM
                            </label>
                            <select
                              id="vram"
                              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                              value={field.state.value || ""}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              disabled={
                                formStatus === "submitting" ||
                                graphicsType !== "Dedicated"
                              }
                            >
                              <option value="" disabled>
                                Select VRAM
                              </option>
                              {vramOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            {field.state.meta.errors ? (
                              <div className="text-red-300 text-sm mt-1">
                                {field.state.meta.errors.join(", ")}
                              </div>
                            ) : null}
                          </>
                        )}
                      </form.Field>
                    </div>

                    {/* RAM field */}
                    <div>
                      <form.Field
                        name="ram"
                        validators={{
                          onChange: ({ value }) => {
                            if (!value) return "RAM is required";
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
                              RAM
                            </label>
                            <select
                              id="ram"
                              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                              value={field.state.value || ""}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              disabled={formStatus === "submitting"}
                            >
                              <option value="" disabled>
                                Select RAM
                              </option>
                              {ramOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            {field.state.meta.errors ? (
                              <div className="text-red-300 text-sm mt-1">
                                {field.state.meta.errors.join(", ")}
                              </div>
                            ) : null}
                          </>
                        )}
                      </form.Field>
                    </div>

                    {/* RAM Type field */}
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
                            <select
                              id="ramType"
                              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                              value={field.state.value || ""}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              disabled={formStatus === "submitting"}
                            >
                              <option value="" disabled>
                                Select RAM Type
                              </option>
                              {RAM_TYPES.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                            {field.state.meta.errors ? (
                              <div className="text-red-300 text-sm mt-1">
                                {field.state.meta.errors.join(", ")}
                              </div>
                            ) : null}
                          </>
                        )}
                      </form.Field>
                    </div>
                  </div>
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
                        <select
                          id="storageType"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        >
                          <option value="">Select Storage Type</option>
                          {STORAGE_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
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
                          placeholder="e.g., 512, 1TB"
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

                <div>
                  <form.Field
                    name="backlightType"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "Backlight type is required";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="backlightType"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          Keyboard Backlight Type
                        </label>
                        <select
                          id="backlightType"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        >
                          <option value="" disabled>
                            Select Backlight Type
                          </option>
                          {backlightTypeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
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
                      <span className="text-neutral-400 text-xs ml-2">
                        (Multiple files supported)
                      </span>
                    </label>
                    <div className="flex flex-col space-y-4">
                      <div
                        className="flex justify-center w-full h-32 px-4 transition bg-neutral-700 border-2 border-neutral-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-secondary-500 focus:outline-none"
                        onClick={() => {
                          // Find the file input and trigger a click on it
                          const fileInput = document.querySelector(
                            'input[name="file_upload"]'
                          );
                          if (fileInput) {
                            (fileInput as HTMLInputElement).click();
                          }
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.classList.add("border-secondary-500");
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.classList.remove(
                            "border-secondary-500"
                          );
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.classList.remove(
                            "border-secondary-500"
                          );

                          if (
                            e.dataTransfer.files &&
                            e.dataTransfer.files.length > 0 &&
                            formStatus !== "submitting"
                          ) {
                            // Create a synthetic event object with the dropped files
                            const fileList = e.dataTransfer.files;
                            const event = {
                              target: {
                                files: fileList,
                              },
                            } as React.ChangeEvent<HTMLInputElement>;

                            // Call the upload handler with our synthetic event
                            handleImageUpload(event);
                          }
                        }}
                      >
                        <span className="flex flex-col items-center justify-center h-full">
                          {uploadingImages ? (
                            <>
                              <SpinnerSVG className="w-6 h-6 text-neutral-300 mb-2" />
                              <span className="font-medium text-neutral-300">
                                Uploading...
                              </span>
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-neutral-300 mb-2"
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
                                Drop files to attach, or{" "}
                                <span className="text-secondary-500">
                                  browse
                                </span>
                              </span>
                            </>
                          )}
                        </span>
                        <input
                          type="file"
                          name="file_upload"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          disabled={
                            formStatus === "submitting" || uploadingImages
                          }
                        />
                      </div>

                      {uploadedImages.length > 0 && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm text-neutral-400">
                              {uploadedImages.length} image
                              {uploadedImages.length !== 1 ? "s" : ""} uploaded
                            </p>
                            <button
                              type="button"
                              onClick={() => setUploadedImages([])}
                              className="text-sm text-red-400 hover:text-red-300"
                            >
                              Clear all
                            </button>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {uploadedImages.map((image, index) => (
                              <div
                                key={index}
                                className="relative group border border-neutral-700 rounded-md overflow-hidden"
                              >
                                <img
                                  src={image}
                                  alt={`Preview ${index + 1}`}
                                  className="h-24 w-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-700 text-white p-1 rounded-full shadow-md opacity-80 hover:opacity-100 transition-opacity"
                                  aria-label="Remove image"
                                  title="Remove image"
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
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 mt-4">
                  <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-neutral-700">
                    Additional Information
                  </h2>
                </div>

                <div>
                  <form.Field
                    name="condition"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return "Condition is required";
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="condition"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          Condition
                        </label>
                        <select
                          id="condition"
                          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={formStatus === "submitting"}
                        >
                          <option value="" disabled>
                            Select Condition
                          </option>
                          {CONDITION_TYPES.map((condition) => (
                            <option key={condition} value={condition}>
                              {condition.charAt(0).toUpperCase() +
                                condition.slice(1)}
                            </option>
                          ))}
                        </select>
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
                    name="tags"
                    validators={{
                      onChange: () => {
                        // Tags are optional, so no validation needed
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <label
                          htmlFor="tags"
                          className="block text-sm font-medium text-neutral-200 mb-1"
                        >
                          Laptop Tags
                          <span className="text-neutral-400 text-xs ml-2">
                            (Select all that apply)
                          </span>
                        </label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {TAG_OPTIONS.map((tag) => (
                            <label
                              key={tag}
                              className="flex items-center space-x-2 cursor-pointer rounded-md px-3 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 transition-colors"
                            >
                              <input
                                type="checkbox"
                                value={tag}
                                checked={(field.state.value || []).includes(
                                  tag
                                )}
                                onChange={(e) => {
                                  const currentTags = field.state.value || [];
                                  if (e.target.checked) {
                                    field.handleChange([...currentTags, tag]);
                                  } else {
                                    field.handleChange(
                                      currentTags.filter((t) => t !== tag)
                                    );
                                  }
                                }}
                                disabled={formStatus === "submitting"}
                                className="rounded text-secondary-600 focus:ring-secondary-500"
                              />
                              <span className="text-neutral-200">
                                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                              </span>
                            </label>
                          ))}
                        </div>
                      </>
                    )}
                  </form.Field>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                {/* Test Data Button */}
                <button
                  type="button"
                  onClick={fillWithTestData}
                  disabled={formStatus === "submitting"}
                  className="py-3 px-8 flex items-center justify-center gap-3 text-white font-semibold rounded-lg shadow-lg transition-transform duration-300 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  <span>Fill with Test Data</span>
                </button>

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
