import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SpinnerSVG } from "@/assets/SpinnerSVG";
import { LaptopT } from "@/interfaces/laptopT";

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
const vramOptions = ["2", "3", "4", "6", "8", "10", "12", "16", "24", "48"];
const backlightTypeOptions = ["RGB", "Single-color", "None"];
const ramOptions = ["4", "8", "12", "16", "24", "32", "64", "96", "128"];

export default function AddListingPage() {
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [graphicsType, setGraphicsType] = useState<string>("");
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
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
      images: [] as string[],
      tag: [] as string[],
      condition: "",
      stockStatus: "in stock",
    },
    onSubmit: async ({ value }) => {
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
        const processorBrand = castOrUndef(
          value.processorBrand,
          processorBrands
        );
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
            uploadedImages.length > 0
              ? uploadedImages
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
        const response = await fetch("http://localhost:3000/laptops", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(laptopData),
        });
        if (!response.ok) throw new Error("Failed to add listing");
        setFormStatus("success");
        const data = await response.json();
        setTimeout(() => navigate({ to: `/laptop/${data.id}` }), 1500);
      } catch (error) {
        setFormStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to add listing"
        );
      }
    },
  });
  function handleFillTestData() {
    const testData = {
      title: "Lenovo Legion 5",
      price: "1100",
      brand: "Lenovo",
      model: "Legion 5",
      shortDesc: "Short description",
      description: "Full description",
      year: "2021",
      stockStatus: "in stock",
      condition: "used",
      processorBrand: "AMD",
      processorModel: "Ryzen 7 4800H",
      cores: "8",
      threads: "16",
      graphicsType: "Dedicated",
      gpuBrand: "NVIDIA",
      gpuModel: "RTX 4060Ti",
      vram: "6",
      ram: "16",
      ramType: "DDR4",
      storageType: "SSD",
      storageCapacity: "512",
      screenSize: "15.6",
      screenResolution: "1920x1080",
      refreshRate: "144",
      weight: "2.3",
      backlightType: "RGB",
      tag: ["gaming", "productivity"],
      images: ["https://placehold.co/800x600/111827/eee?text=Test+Image"],
    };

    // We assume form.state.values has the same keys as defaultValues.
    type FormValues = typeof form.state.values;
    const newValues: FormValues = { ...form.state.values };

    for (const [key, value] of Object.entries(testData)) {
      const k = key as keyof FormValues;
      const currentVal = newValues[k];

      if (Array.isArray(currentVal)) {
        if (currentVal.length === 0) {
          newValues[k] = Array.isArray(value) ? value : ([value] as any);
        }
      } else {
        if (!currentVal) {
          newValues[k] = Array.isArray(value)
            ? value.join(",")
            : (value as any);
        }
      }
    }

    form.reset(newValues);
  }

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

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Add New Laptop Listing
        </h1>
        <p className="text-neutral-400 mb-8">
          Fields marked <span className="text-red-400">*</span> are required.
        </p>
        <div className="bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 rounded-2xl border border-neutral-700/50 p-8 mb-6 relative overflow-hidden">
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="title"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
                    />
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Price ($) <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="price"
                      type="number"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
                    />
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Brand <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="brand"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
                    >
                      <option value="">Select Brand</option>
                      {LAPTOP_BRANDS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Model <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="model"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
                    />
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Short Description <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="shortDesc"
                      maxLength={100}
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
                    />
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>
              {/* Description (required) */}
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Full Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
                    />
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Year <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="year"
                      type="number"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
                    />
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>
              {/* Stock Status (required) */}
              <form.Field name="stockStatus">
                {(field) => (
                  <div>
                    <label
                      htmlFor="stockStatus"
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Stock Status <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="stockStatus"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Condition <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="condition"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
                    >
                      <option value="">Select Condition</option>
                      {CONDITION_TYPES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Laptop Tags{" "}
                      <span className="text-neutral-400 text-xs ml-2">
                        (optional)
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
                            disabled={formStatus === "submitting"}
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Processor Brand <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="processorBrand"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
                    >
                      <option value="">Select Processor Brand</option>
                      {PROCESSOR_BRANDS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Processor Model <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="processorModel"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
                    />
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Cores <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="cores"
                      type="number"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
                    />
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Threads <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="threads"
                      type="number"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
                    />
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Graphics Type <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="graphicsType"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        setGraphicsType(e.target.value);
                      }}
                      disabled={formStatus === "submitting"}
                    >
                      <option value="">Select Graphics Type</option>
                      {GRAPHICS_TYPES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>
              {/* GPU Brand/Model/VRAM (required if Dedicated) */}
              <form.Field
                name="gpuBrand"
                validators={{
                  onChange: ({ value }) =>
                    graphicsType === "Dedicated" && !value
                      ? "Required for Dedicated"
                      : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="gpuBrand"
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      GPU Brand{" "}
                      {graphicsType === "Dedicated" && (
                        <span className="text-red-400">*</span>
                      )}
                    </label>
                    <select
                      id="gpuBrand"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={
                        formStatus === "submitting" ||
                        graphicsType !== "Dedicated"
                      }
                    >
                      <option value="">Select GPU Brand</option>
                      {GPU_BRANDS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Field
                name="gpuModel"
                validators={{
                  onChange: ({ value }) =>
                    graphicsType === "Dedicated" && !value
                      ? "Required for Dedicated"
                      : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="gpuModel"
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      GPU Model{" "}
                      {graphicsType === "Dedicated" && (
                        <span className="text-red-400">*</span>
                      )}
                    </label>
                    <input
                      id="gpuModel"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={
                        formStatus === "submitting" ||
                        graphicsType !== "Dedicated"
                      }
                    />
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Field
                name="vram"
                validators={{
                  onChange: ({ value }) =>
                    graphicsType === "Dedicated" && !value
                      ? "Required for Dedicated"
                      : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="vram"
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      VRAM{" "}
                      {graphicsType === "Dedicated" && (
                        <span className="text-red-400">*</span>
                      )}
                    </label>
                    <select
                      id="vram"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={
                        formStatus === "submitting" ||
                        graphicsType !== "Dedicated"
                      }
                    >
                      <option value="">Select VRAM</option>
                      {vramOptions.map((v) => (
                        <option key={v} value={v}>
                          {v} GB
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      RAM <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="ram"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
                    >
                      <option value="">Select RAM</option>
                      {ramOptions.map((r) => (
                        <option key={r} value={r}>
                          {r} GB
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      RAM Type <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="ramType"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
                    >
                      <option value="">Select RAM Type</option>
                      {RAM_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Storage Type <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="storageType"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
                    >
                      <option value="">Select Storage Type</option>
                      {STORAGE_TYPES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Storage Capacity <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="storageCapacity"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
                    />
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Screen Size (inches){" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="screenSize"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
                    />
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Screen Resolution <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="screenResolution"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
                    />
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
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
                      htmlFor="refreshRate"
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Refresh Rate (Hz) <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="refreshRate"
                      type="number"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
                    />
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Weight{" "}
                      <span className="text-neutral-400 text-xs ml-2">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="weight"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
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
                      className="block text-sm font-medium text-neutral-200 mb-1"
                    >
                      Keyboard Backlight Type{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="backlightType"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 text-white rounded-md"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={formStatus === "submitting"}
                    >
                      <option value="">Select Backlight Type</option>
                      {backlightTypeOptions.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors && (
                      <div className="text-red-300 text-sm mt-1">
                        {field.state.meta.errors.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </form.Field>
            </div>
            {/* Images Section (preserved) */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-neutral-700">
                Images
              </h2>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                Upload Images{" "}
                <span className="text-neutral-400 text-xs ml-2">
                  (Multiple files supported)
                </span>
              </label>
              <div className="flex flex-col space-y-4">
                <div
                  className="flex justify-center w-full h-32 px-4 transition bg-neutral-700 border-2 border-neutral-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-secondary-500 focus:outline-none"
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
                      formStatus !== "submitting"
                    ) {
                      const fileList = e.dataTransfer.files;
                      const event = {
                        target: { files: fileList },
                      } as React.ChangeEvent<HTMLInputElement>;
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
                    disabled={formStatus === "submitting" || uploadingImages}
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
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={formStatus === "submitting"}
                className="py-3 px-8 flex items-center justify-center gap-3 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-r from-purple-600 to-primary-600 hover:from-purple-700 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <button
                type="button"
                onClick={handleFillTestData}
                className="px-4 py-2 bg-blue-600 text-white rounded-md ml-4"
              >
                Fill with Test Data
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
