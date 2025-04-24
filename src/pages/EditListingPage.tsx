import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { SpinnerSVG } from "@/assets/SpinnerSVG";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useImageManagement } from "@/hooks/useImageManagement";
import { useQuery, useMutation } from "@tanstack/react-query";
import { LaptopT } from "@/interfaces/laptopT";
import { LaptopDetailSkeleton } from "./LaptopDetailSkeleton";

// Constants remain unchanged
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
const STOCK_STATUSES = ["in stock", "reserved", "sold"];
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
const VRAM_OPTIONS = [
  "2GB",
  "3GB",
  "4GB",
  "6GB",
  "8GB",
  "10GB",
  "12GB",
  "16GB",
  "24GB",
  "32GB",
];
const BACKLIGHT_OPTIONS = ["RGB", "Single-color", "None"];
const RAM_OPTIONS = [
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
const REFRESH_RATE_OPTIONS = [
  "60Hz",
  "90Hz",
  "120Hz",
  "144Hz",
  "165Hz",
  "240Hz",
  "250Hz",
  "300Hz",
  "360Hz",
];
const SCREEN_SIZE_OPTIONS = [
  '13.3"',
  '14.0"',
  '15.0"',
  '15.6"',
  '16.0"',
  '17.0"',
  '17.3"',
  '18.0"',
];

export default function EditListingPage() {
  const { laptopId } = useParams({ from: "/edit-listing/$laptopId" });
  const navigate = useNavigate();

  const {
    uploadedImages,
    uploadingImages,
    imageLink,
    setImageLink,
    handleImageUpload,
    removeImage,
    handleImageLinkSubmit,
    clearImages,
    setUploadedImages,
  } = useImageManagement();

  // Fetch laptop data using TanStack Query
  const {
    data: laptop,
    isLoading,
    error,
  } = useQuery<LaptopT>({
    queryKey: ["laptop", laptopId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/laptops/${laptopId}`,
        { credentials: "include" }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch laptop details");
      }
      return response.json();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      try {
        // Create a clean copy of data for modification
        const formattedData: Record<string, any> = { ...updatedData };

        // Convert numeric fields
        if (formattedData.price)
          formattedData.price = parseFloat(formattedData.price);
        if (formattedData.cores)
          formattedData.cores = parseInt(formattedData.cores);
        if (formattedData.threads)
          formattedData.threads = parseInt(formattedData.threads);
        if (formattedData.year)
          formattedData.year = parseInt(formattedData.year);

        // Handle status fields - ensure they are strings
        formattedData.stockStatus = String(
          formattedData.stockStatus || "in stock"
        );

        // Set status field explicitly to match stockStatus (this is key)
        formattedData.status = String(formattedData.stockStatus || "in stock");

        // Handle images
        formattedData.images =
          uploadedImages.length > 0
            ? uploadedImages
            : ["https://placehold.co/800x600/111827/444?text=No+Image"];

        // Cleanup: Remove undefined and null fields
        Object.keys(formattedData).forEach((key) => {
          if (formattedData[key] === undefined || formattedData[key] === null) {
            delete formattedData[key];
          }
        });

        console.log("Sending update data:", formattedData);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/laptops/${laptopId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(formattedData),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = "Failed to update listing";

          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.error("Error parsing error response:", errorText);
          }

          throw new Error(errorMessage);
        }

        return response.json();
      } catch (error) {
        console.error("Update error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Redirect after successful update
      setTimeout(() => navigate({ to: `/laptop/${data.id}` }), 1500);
    },
  });

  // Initialize form only after data is loaded
  const form = useForm({
    defaultValues: laptop
      ? {
          title: laptop.title || "",
          price: laptop.price?.toString() || "",
          brand: laptop.brand || "",
          model: laptop.model || "",
          shortDesc: laptop.shortDesc || "",
          gpuBrand: laptop.gpuBrand || "",
          gpuModel: laptop.gpuModel || "",
          graphicsType: laptop.graphicsType || "",
          vram: laptop.vram || "",
          backlightType: laptop.backlightType || "",
          processorBrand: laptop.processorBrand || "",
          processorModel: laptop.processorModel || "",
          cores: laptop.cores?.toString() || "",
          threads: laptop.threads?.toString() || "",
          ram: laptop.ram || "",
          ramType: laptop.ramType || "",
          storageType: laptop.storageType || "",
          storageCapacity: laptop.storageCapacity || "",
          screenSize: laptop.screenSize || "",
          screenResolution: laptop.screenResolution || "",
          refreshRate: laptop.refreshRate || "",
          weight: laptop.weight || "",
          year: laptop.year?.toString() || new Date().getFullYear().toString(),
          description: laptop.description || "",
          tag: laptop.tag || [],
          condition: laptop.condition || "",
          stockStatus: laptop.stockStatus || "in stock",
        }
      : {
          // Default empty values
          title: "",
          price: "",
          brand: "",
          model: "",
          shortDesc: "",
          gpuBrand: "",
          gpuModel: "",
          graphicsType: "",
          vram: "",
          backlightType: "",
          processorBrand: "",
          processorModel: "",
          cores: "",
          threads: "",
          ram: "",
          ramType: "",
          storageType: "",
          storageCapacity: "",
          screenSize: "",
          screenResolution: "",
          refreshRate: "",
          weight: "",
          year: new Date().getFullYear().toString(),
          description: "",
          tag: [] as string[],
          condition: "",
          stockStatus: "in stock",
        },
    onSubmit: async ({ value }) => {
      try {
        // Simply pass the form values - all processing happens in the mutation
        updateMutation.mutate(value);
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
  });

  // Set uploaded images when data is loaded
  useEffect(() => {
    if (laptop?.images && laptop.images.length > 0) {
      setUploadedImages(laptop.images);
    }
  }, [laptop, setUploadedImages]);

  // Show loading skeleton while fetching data
  if (isLoading) {
    return <LaptopDetailSkeleton />;
  }

  // Show error message if fetch failed
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-900">
        <div className="max-w-md rounded-lg bg-red-900/50 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Error</h1>
          <p className="mt-2 text-red-200">
            {error instanceof Error
              ? error.message
              : "Failed to load laptop data"}
          </p>
          <Button
            onClick={() => window.history.back()}
            className="mt-4 bg-white/10 px-4 py-2 hover:bg-white/20"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Main form rendering
  return (
    <div className="min-h-screen bg-neutral-900 py-10 text-neutral-200">
      <div className="container mx-auto px-4">
        <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
          Edit Laptop Listing
        </h1>
        <p className="mb-8 text-neutral-400">
          Fields marked <span className="text-red-400">*</span> are required.
        </p>
        <div className="border-neutral-700/50 from-neutral-800/70 to-neutral-900/90 relative mb-6 overflow-hidden rounded-2xl border bg-gradient-to-br p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            {updateMutation.isError && (
              <div className="mb-6 rounded-md bg-red-900/50 p-4 text-red-200">
                {updateMutation.error instanceof Error
                  ? updateMutation.error.message
                  : "Failed to update listing"}
              </div>
            )}
            {updateMutation.isSuccess && (
              <div className="mb-6 rounded-md bg-green-900/50 p-4 text-green-200">
                Listing updated successfully! Redirecting...
              </div>
            )}

            {/* Form fields remain the same - title, price, etc. */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Title (required) */}
              <form.Field
                name="title"
                validators={{
                  onChange: ({ value }) => (!value ? "Required" : undefined),
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="title"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="title"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    />
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Price (required) */}
              <form.Field
                name="price"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "Required"
                      : isNaN(Number(value))
                      ? "Must be a number"
                      : Number(value) <= 0
                      ? "Must be > 0"
                      : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="price"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Price ($) <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="price"
                      type="number"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    />
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Brand (required) */}
              <form.Field
                name="brand"
                validators={{
                  onChange: ({ value }) => (!value ? "Required" : undefined),
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="brand"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Brand <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="brand"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    >
                      <option value="">Select Brand</option>
                      {LAPTOP_BRANDS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Model (required) */}
              <form.Field
                name="model"
                validators={{
                  onChange: ({ value }) => (!value ? "Required" : undefined),
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="model"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Model <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="model"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    />
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Short Description (required) */}
              <form.Field
                name="shortDesc"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "Required"
                      : value.length > 100
                      ? "Max 100 chars"
                      : undefined,
                }}
              >
                {(field) => (
                  <div className="md:col-span-2">
                    <label
                      htmlFor="shortDesc"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Short Description <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="shortDesc"
                      maxLength={100}
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    />
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Full Description (required) */}
              <form.Field
                name="description"
                validators={{
                  onChange: ({ value }) => (!value ? "Required" : undefined),
                }}
              >
                {(field) => (
                  <div className="md:col-span-2">
                    <label
                      htmlFor="description"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Full Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    />
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Year (required) */}
              <form.Field
                name="year"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "Required"
                      : isNaN(Number(value))
                      ? "Must be a number"
                      : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="year"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Year <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="year"
                      type="number"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    />
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Stock Status */}
              <form.Field name="stockStatus">
                {(field) => (
                  <div>
                    <label
                      htmlFor="stockStatus"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Stock Status <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="stockStatus"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    >
                      {STOCK_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </form.Field>

              {/* Condition (required) */}
              <form.Field
                name="condition"
                validators={{
                  onChange: ({ value }) => (!value ? "Required" : undefined),
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="condition"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Condition <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="condition"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    >
                      <option value="">Select Condition</option>
                      {CONDITION_TYPES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Tags (optional) */}
              <form.Field name="tag">
                {(field) => (
                  <div>
                    <label
                      htmlFor="tag"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Laptop Tags{" "}
                      <span className="ml-2 text-xs text-neutral-400">
                        (optional)
                      </span>
                    </label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {TAG_OPTIONS.map((tag) => (
                        <label
                          key={tag}
                          className="flex cursor-pointer items-center space-x-2 rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2 transition-colors hover:bg-neutral-700"
                        >
                          <input
                            type="checkbox"
                            value={tag}
                            checked={(field.state.value || []).includes(tag)}
                            onChange={(e) => {
                              const currentTags = field.state.value || [];
                              if (e.target.checked)
                                field.handleChange([...currentTags, tag]);
                              else
                                field.handleChange(
                                  currentTags.filter((t) => t !== tag)
                                );
                            }}
                            disabled={updateMutation.isPending}
                            className="rounded text-secondary-600 focus:ring-secondary-500"
                          />
                          <span className="text-neutral-200">
                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </form.Field>

              {/* Processor Brand (required) */}
              <form.Field
                name="processorBrand"
                validators={{
                  onChange: ({ value }) => (!value ? "Required" : undefined),
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="processorBrand"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Processor Brand <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="processorBrand"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    >
                      <option value="">Select Processor Brand</option>
                      {PROCESSOR_BRANDS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Processor Model (required) */}
              <form.Field
                name="processorModel"
                validators={{
                  onChange: ({ value }) => (!value ? "Required" : undefined),
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="processorModel"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Processor Model <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="processorModel"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    />
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Cores (required) */}
              <form.Field
                name="cores"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "Required"
                      : isNaN(Number(value))
                      ? "Must be a number"
                      : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="cores"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Cores <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="cores"
                      type="number"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    />
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Threads (required) */}
              <form.Field
                name="threads"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "Required"
                      : isNaN(Number(value))
                      ? "Must be a number"
                      : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="threads"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Threads <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="threads"
                      type="number"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    />
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Graphics Type (required) */}
              <form.Field
                name="graphicsType"
                validators={{
                  onChange: ({ value }) => (!value ? "Required" : undefined),
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="graphicsType"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Graphics Type <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="graphicsType"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      disabled={updateMutation.isPending}
                    >
                      <option value="">Select Graphics Type</option>
                      {GRAPHICS_TYPES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* GPU Brand */}
              <form.Field
                name="gpuBrand"
                validators={{
                  onChange: ({ value }) => (!value ? "Required" : undefined),
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="gpuBrand"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      GPU Brand <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="gpuBrand"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    >
                      <option value="">Select GPU Brand</option>
                      {GPU_BRANDS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* GPU Model */}
              <form.Field
                name="gpuModel"
                validators={{
                  onChange: ({ value }) => (!value ? "Required" : undefined),
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="gpuModel"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      GPU Model <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="gpuModel"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    />
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* VRAM */}
              <form.Field
                name="vram"
                validators={{
                  onChange: ({ value }) => (!value ? "Required" : undefined),
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="vram"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      VRAM <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="vram"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    >
                      <option value="">Select VRAM</option>
                      {VRAM_OPTIONS.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* RAM (required) */}
              <form.Field
                name="ram"
                validators={{
                  onChange: ({ value }) => (!value ? "Required" : undefined),
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="ram"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      RAM <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="ram"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    >
                      <option value="">Select RAM</option>
                      {RAM_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* RAM Type (required) */}
              <form.Field
                name="ramType"
                validators={{
                  onChange: ({ value }) => (!value ? "Required" : undefined),
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="ramType"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      RAM Type <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="ramType"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    >
                      <option value="">Select RAM Type</option>
                      {RAM_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Storage Type (required) */}
              <form.Field
                name="storageType"
                validators={{
                  onChange: ({ value }) => (!value ? "Required" : undefined),
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="storageType"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Storage Type <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="storageType"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    >
                      <option value="">Select Storage Type</option>
                      {STORAGE_TYPES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Storage Capacity (required) */}
              <form.Field
                name="storageCapacity"
                validators={{
                  onChange: ({ value }) => (!value ? "Required" : undefined),
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="storageCapacity"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Storage Capacity <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="storageCapacity"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    />
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Screen Size (required) */}
              <form.Field
                name="screenSize"
                validators={{
                  onChange: ({ value }) => (!value ? "Required" : undefined),
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="screenSize"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Screen Size <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="screenSize"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    >
                      <option value="">Select Screen Size</option>
                      {SCREEN_SIZE_OPTIONS.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Screen Resolution (required) */}
              <form.Field
                name="screenResolution"
                validators={{
                  onChange: ({ value }) => (!value ? "Required" : undefined),
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="screenResolution"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Screen Resolution <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="screenResolution"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    />
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Refresh Rate (required) */}
              <form.Field
                name="refreshRate"
                validators={{
                  onChange: ({ value }) => (!value ? "Required" : undefined),
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="refreshRate"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Refresh Rate <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="refreshRate"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    >
                      <option value="">Select Refresh Rate</option>
                      {REFRESH_RATE_OPTIONS.map((rate) => (
                        <option key={rate} value={rate}>
                          {rate}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Weight (optional) */}
              <form.Field name="weight">
                {(field) => (
                  <div>
                    <label
                      htmlFor="weight"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Weight{" "}
                      <span className="ml-2 text-xs text-neutral-400">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="weight"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    />
                  </div>
                )}
              </form.Field>

              {/* Backlight Type (required) */}
              <form.Field
                name="backlightType"
                validators={{
                  onChange: ({ value }) => (!value ? "Required" : undefined),
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="backlightType"
                      className="mb-1 block text-sm font-medium text-neutral-200"
                    >
                      Keyboard Backlight Type{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="backlightType"
                      className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={updateMutation.isPending}
                    >
                      <option value="">Select Backlight Type</option>
                      {BACKLIGHT_OPTIONS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="mt-1 text-sm text-red-300">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            {/* Images Section */}
            <div className="mt-8">
              <h2 className="mb-4 border-b border-neutral-700 pb-2 text-lg font-semibold text-white">
                Images
              </h2>

              {/* Add Image Link Form */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-neutral-200">
                  Add Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageLink}
                    onChange={(e) => setImageLink(e.target.value)}
                    placeholder="Enter image URL"
                    className="flex-1 rounded-md border border-neutral-600 bg-neutral-700 px-4 py-3 text-white"
                  />
                  <Button
                    onClick={handleImageLinkSubmit}
                    className="rounded-md bg-secondary-600 px-4 py-2 text-white hover:bg-secondary-700"
                  >
                    Add Link
                  </Button>
                </div>
              </div>

              {/* Image upload section */}
              <label className="mb-2 block text-sm font-medium text-neutral-200">
                Upload Images
                <span className="ml-2 text-xs text-neutral-400">
                  (Multiple files supported)
                </span>
              </label>
              <div className="flex flex-col space-y-4">
                {/* Image drop zone */}
                <div
                  className="flex h-32 w-full cursor-pointer appearance-none justify-center rounded-md border-2 border-dashed border-neutral-600 bg-neutral-700 px-4 transition hover:border-secondary-500 focus:outline-none"
                  onClick={() => {
                    const fileInput = document.querySelector(
                      'input[name="file_upload2"]'
                    );
                    if (fileInput) (fileInput as HTMLInputElement).click();
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.add("border-secondary-500");
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.remove("border-secondary-500");
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.remove("border-secondary-500");
                    if (
                      e.dataTransfer.files &&
                      e.dataTransfer.files.length > 0 &&
                      updateMutation.isPending
                    ) {
                      const fileList = e.dataTransfer.files;
                      const event = {
                        target: { files: fileList },
                      } as React.ChangeEvent<HTMLInputElement>;
                      handleImageUpload(event);
                    }
                  }}
                >
                  <span className="flex h-full flex-col items-center justify-center">
                    {uploadingImages ? (
                      <>
                        <SpinnerSVG className="mb-2 h-6 w-6 text-neutral-300" />
                        <span className="font-medium text-neutral-300">
                          Uploading...
                        </span>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mb-2 h-6 w-6 text-neutral-300"
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
                          <span className="text-secondary-500">browse</span>
                        </span>
                      </>
                    )}
                  </span>
                  <input
                    type="file"
                    name="file_upload2"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={updateMutation.isPending || uploadingImages}
                  />
                </div>

                {/* Uploaded images preview */}
                {uploadedImages.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm text-neutral-400">
                        {uploadedImages.length} image
                        {uploadedImages.length !== 1 ? "s" : ""} uploaded
                      </p>
                      <Button
                        type="button"
                        onClick={clearImages}
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Clear all
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {uploadedImages.map((image, index) => (
                        <div
                          key={index}
                          className="group relative overflow-hidden rounded-md border border-neutral-700"
                        >
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-full object-cover"
                          />
                          <Button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute right-1 top-1 rounded-full bg-red-600/90 p-1 text-white opacity-80 shadow-md transition-opacity hover:bg-red-700 hover:opacity-100"
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
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form submission buttons */}
            <div className="mt-8 flex justify-end">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-purple-600 to-primary-600 px-8 py-3 font-semibold text-white shadow-lg hover:from-purple-700 hover:to-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <>
                    <SpinnerSVG className="h-5 w-5" />
                    <span>Updating Listing...</span>
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
                      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    <span>Update Listing</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
