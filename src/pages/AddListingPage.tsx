import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SpinnerSVG } from "@/assets/SpinnerSVG";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

  // Define constants for select options
  const CPU_BRANDS = ["Intel", "AMD", "Apple", "Qualcomm", "Other"];
  const GPU_BRANDS = ["NVIDIA", "AMD", "Intel", "Apple", "Other"];
  const RAM_TYPES = ["DDR4", "DDR5", "LPDDR4", "LPDDR4X", "LPDDR5", "Other"];
  const STORAGE_TYPES = ["SSD", "NVMe SSD", "HDD", "eMMC", "Other"];
  const STOCK_STATUSES = ["in stock", "low stock", "out of stock", "reserved"];

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

  // Function to inject random laptop data
  const injectRandomLaptop = () => {
    // Array of sample laptops
    const sampleLaptops = [
      {
        title: "ASUS ROG Strix G15 Gaming Laptop",
        brand: "ASUS",
        model: "ROG Strix G15",
        price: "1499.99",
        description:
          "Powerful gaming laptop with RGB lighting and excellent thermal performance. Features high refresh rate display ideal for competitive gaming and content creation.",
        shortDesc: "i7, RTX 3070, 16GB RAM, 1TB SSD",
        processorBrand: "Intel",
        processorModel: "Core i7-12700H",
        cores: "14",
        threads: "20",
        gpuBrand: "NVIDIA",
        gpuModel: "GeForce RTX 3070",
        vram: "8",
        ram: "16",
        ramType: "DDR5",
        storageType: "NVMe SSD",
        storageCapacity: "1TB",
        screenSize: "15.6",
        screenResolution: "2560x1440",
        refreshRate: "165",
        weight: "2.3kg",
        stockStatus: "in stock",
        year: "2022",
      },
      {
        title: "Dell XPS 15 Ultrabook",
        brand: "Dell",
        model: "XPS 15",
        price: "1899.99",
        description:
          "Premium ultrabook with gorgeous 4K OLED display and excellent build quality. Perfect for professionals and content creators requiring color accuracy and performance.",
        shortDesc: "i9, RTX 3050 Ti, 32GB RAM, 1TB SSD",
        processorBrand: "Intel",
        processorModel: "Core i9-12900HK",
        cores: "14",
        threads: "20",
        gpuBrand: "NVIDIA",
        gpuModel: "GeForce RTX 3050 Ti",
        vram: "4",
        ram: "32",
        ramType: "DDR5",
        storageType: "NVMe SSD",
        storageCapacity: "1TB",
        screenSize: "15.6",
        screenResolution: "3840x2160",
        refreshRate: "60",
        weight: "1.8kg",
        stockStatus: "in stock",
        year: "2022",
      },
      {
        title: "MacBook Pro 16 with M2 Max",
        brand: "Apple",
        model: "MacBook Pro 16",
        price: "3299.99",
        description:
          "Apple's flagship laptop with incredible performance and battery life. Features the best display on any laptop and an excellent keyboard and trackpad experience.",
        shortDesc: "M2 Max, 32GB RAM, 1TB SSD",
        processorBrand: "Apple",
        processorModel: "M2 Max",
        cores: "12",
        threads: "12",
        gpuBrand: "Apple",
        gpuModel: "M2 Max 38-core GPU",
        vram: "",
        ram: "32",
        ramType: "LPDDR5",
        storageType: "SSD",
        storageCapacity: "1TB",
        screenSize: "16.2",
        screenResolution: "3456x2234",
        refreshRate: "120",
        weight: "2.2kg",
        stockStatus: "low stock",
        year: "2023",
      },
      {
        title: "Lenovo Legion Pro 7i Gaming Laptop",
        brand: "Lenovo",
        model: "Legion Pro 7i",
        price: "2199.99",
        description:
          "Powerful gaming machine with exceptional cooling and performance. Features customizable RGB lighting and a full-sized keyboard with numpad.",
        shortDesc: "i9, RTX 4080, 32GB RAM, 2TB SSD",
        processorBrand: "Intel",
        processorModel: "Core i9-13900HX",
        cores: "24",
        threads: "32",
        gpuBrand: "NVIDIA",
        gpuModel: "GeForce RTX 4080",
        vram: "12",
        ram: "32",
        ramType: "DDR5",
        storageType: "NVMe SSD",
        storageCapacity: "2TB",
        screenSize: "16",
        screenResolution: "2560x1600",
        refreshRate: "240",
        weight: "2.5kg",
        stockStatus: "in stock",
        year: "2023",
      },
    ];

    // Select a random laptop from the sample data
    const randomLaptop =
      sampleLaptops[Math.floor(Math.random() * sampleLaptops.length)];

    // Update all form fields with the random laptop data
    Object.entries(randomLaptop).forEach(([key, value]) => {
      form.setFieldValue(key as never, value as never);
    });
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Add New Laptop Listing
            </h1>
            <p className="text-neutral-400 mt-2">
              Fill out the details below to create a new laptop listing
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={injectRandomLaptop}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            Inject Random Laptop
          </Button>
        </div>

        <Card className="bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 border-neutral-700/50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <CardContent className="relative z-10 p-8">
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
                      <FormItem>
                        <FormLabel htmlFor="title">Title</FormLabel>
                        <FormControl>
                          <Input
                            id="title"
                            placeholder="e.g., ASUS ROG Strix G15 Gaming Laptop"
                            className="bg-neutral-700 border-neutral-600 text-white"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={formStatus === "submitting"}
                          />
                        </FormControl>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
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
                      <FormItem>
                        <FormLabel htmlFor="price">Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            id="price"
                            type="number"
                            placeholder="e.g., 1299.99"
                            className="bg-neutral-700 border-neutral-600 text-white"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={formStatus === "submitting"}
                          />
                        </FormControl>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
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
                      <FormItem>
                        <FormLabel htmlFor="brand">Brand</FormLabel>
                        <FormControl>
                          <Input
                            id="brand"
                            placeholder="e.g., ASUS, Dell, HP"
                            className="bg-neutral-700 border-neutral-600 text-white"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={formStatus === "submitting"}
                          />
                        </FormControl>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
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
                      <FormItem>
                        <FormLabel htmlFor="model">Model</FormLabel>
                        <FormControl>
                          <Input
                            id="model"
                            placeholder="e.g., ROG Strix G15, XPS 15"
                            className="bg-neutral-700 border-neutral-600 text-white"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={formStatus === "submitting"}
                          />
                        </FormControl>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
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
                      <FormItem>
                        <FormLabel htmlFor="shortDesc">
                          Short Description
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="shortDesc"
                            placeholder="Brief specs summary, e.g., 'i7, 16GB RAM, RTX 3070, 1TB SSD'"
                            className="bg-neutral-700 border-neutral-600 text-white"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={formStatus === "submitting"}
                            maxLength={100}
                          />
                        </FormControl>
                        <FormDescription className="text-neutral-400">
                          A brief summary of key specs (max 100 characters)
                        </FormDescription>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
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
                      <FormItem>
                        <FormLabel htmlFor="description">
                          Full Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            id="description"
                            rows={4}
                            placeholder="Detailed description of the laptop..."
                            className="bg-neutral-700 border-neutral-600 text-white"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={formStatus === "submitting"}
                          />
                        </FormControl>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
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
                      <FormItem>
                        <FormLabel htmlFor="year">Year</FormLabel>
                        <FormControl>
                          <Input
                            id="year"
                            type="number"
                            placeholder={new Date().getFullYear().toString()}
                            className="bg-neutral-700 border-neutral-600 text-white"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={formStatus === "submitting"}
                            min={2000}
                            max={new Date().getFullYear() + 1}
                          />
                        </FormControl>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  </form.Field>
                </div>

                <div>
                  <form.Field name="stockStatus">
                    {(field) => (
                      <FormItem>
                        <FormLabel htmlFor="stockStatus">
                          Stock Status
                        </FormLabel>
                        <Select
                          value={field.state.value}
                          onValueChange={field.handleChange}
                          disabled={formStatus === "submitting"}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                              <SelectValue placeholder="Select stock status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-neutral-800 border-neutral-600 text-white">
                            {STOCK_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  </form.Field>
                </div>

                {/* Performance Section */}
                <div className="md:col-span-2 mt-4">
                  <Separator className="my-4" />
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
                      <FormItem>
                        <FormLabel htmlFor="processorBrand">
                          Processor Brand
                        </FormLabel>
                        <Select
                          value={field.state.value}
                          onValueChange={field.handleChange}
                          disabled={formStatus === "submitting"}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                              <SelectValue placeholder="Select CPU brand" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-neutral-800 border-neutral-600 text-white">
                            {CPU_BRANDS.map((brand) => (
                              <SelectItem key={brand} value={brand}>
                                {brand}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
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
                      <FormItem>
                        <FormLabel htmlFor="processorModel">
                          Processor Model
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="processorModel"
                            placeholder="e.g., Core i7-12700H, Ryzen 7 5800H"
                            className="bg-neutral-700 border-neutral-600 text-white"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={formStatus === "submitting"}
                          />
                        </FormControl>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
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
                      <FormItem>
                        <FormLabel htmlFor="cores">CPU Cores</FormLabel>
                        <FormControl>
                          <Input
                            id="cores"
                            type="number"
                            placeholder="e.g., 8"
                            className="bg-neutral-700 border-neutral-600 text-white"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={formStatus === "submitting"}
                          />
                        </FormControl>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
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
                      <FormItem>
                        <FormLabel htmlFor="threads">CPU Threads</FormLabel>
                        <FormControl>
                          <Input
                            id="threads"
                            type="number"
                            placeholder="e.g., 16"
                            className="bg-neutral-700 border-neutral-600 text-white"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={formStatus === "submitting"}
                          />
                        </FormControl>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
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
                      <FormItem>
                        <FormLabel htmlFor="gpuBrand">GPU Brand</FormLabel>
                        <Select
                          value={field.state.value}
                          onValueChange={field.handleChange}
                          disabled={formStatus === "submitting"}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                              <SelectValue placeholder="Select GPU brand" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-neutral-800 border-neutral-600 text-white">
                            {GPU_BRANDS.map((brand) => (
                              <SelectItem key={brand} value={brand}>
                                {brand}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
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
                      <FormItem>
                        <FormLabel htmlFor="gpuModel">GPU Model</FormLabel>
                        <FormControl>
                          <Input
                            id="gpuModel"
                            placeholder="e.g., RTX 3070, Radeon RX 6700M"
                            className="bg-neutral-700 border-neutral-600 text-white"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={formStatus === "submitting"}
                          />
                        </FormControl>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
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
                      <FormItem>
                        <FormLabel htmlFor="vram">
                          VRAM (GB){" "}
                          <Badge variant="outline" className="ml-2 text-xs">
                            Optional
                          </Badge>
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="vram"
                            type="number"
                            placeholder="e.g., 8"
                            className="bg-neutral-700 border-neutral-600 text-white"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={formStatus === "submitting"}
                          />
                        </FormControl>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
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
                      <FormItem>
                        <FormLabel htmlFor="ram">RAM (GB)</FormLabel>
                        <FormControl>
                          <Input
                            id="ram"
                            type="number"
                            placeholder="e.g., 16"
                            className="bg-neutral-700 border-neutral-600 text-white"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={formStatus === "submitting"}
                          />
                        </FormControl>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
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
                      <FormItem>
                        <FormLabel htmlFor="ramType">RAM Type</FormLabel>
                        <Select
                          value={field.state.value}
                          onValueChange={field.handleChange}
                          disabled={formStatus === "submitting"}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                              <SelectValue placeholder="Select RAM type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-neutral-800 border-neutral-600 text-white">
                            {RAM_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  </form.Field>
                </div>

                {/* Storage & Display Section */}
                <div className="md:col-span-2 mt-4">
                  <Separator className="my-4" />
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
                      <FormItem>
                        <FormLabel htmlFor="storageType">
                          Storage Type
                        </FormLabel>
                        <Select
                          value={field.state.value}
                          onValueChange={field.handleChange}
                          disabled={formStatus === "submitting"}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                              <SelectValue placeholder="Select storage type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-neutral-800 border-neutral-600 text-white">
                            {STORAGE_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
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
                      <FormItem>
                        <FormLabel htmlFor="storageCapacity">
                          Storage Capacity
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="storageCapacity"
                            placeholder="e.g., 512GB, 1TB"
                            className="bg-neutral-700 border-neutral-600 text-white"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={formStatus === "submitting"}
                          />
                        </FormControl>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
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
                      <FormItem>
                        <FormLabel htmlFor="screenSize">
                          Screen Size (inches)
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="screenSize"
                            placeholder="e.g., 15.6"
                            className="bg-neutral-700 border-neutral-600 text-white"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={formStatus === "submitting"}
                          />
                        </FormControl>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
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
                      <FormItem>
                        <FormLabel htmlFor="screenResolution">
                          Screen Resolution
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="screenResolution"
                            placeholder="e.g., 1920x1080, 2560x1440"
                            className="bg-neutral-700 border-neutral-600 text-white"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={formStatus === "submitting"}
                          />
                        </FormControl>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
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
                      <FormItem>
                        <FormLabel htmlFor="refreshRate">
                          Refresh Rate (Hz)
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="refreshRate"
                            type="number"
                            placeholder="e.g., 60, 144, 240"
                            className="bg-neutral-700 border-neutral-600 text-white"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={formStatus === "submitting"}
                          />
                        </FormControl>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
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
                      <FormItem>
                        <FormLabel htmlFor="weight">Weight</FormLabel>
                        <FormControl>
                          <Input
                            id="weight"
                            placeholder="e.g., 2.3kg, 5.1 lbs"
                            className="bg-neutral-700 border-neutral-600 text-white"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={formStatus === "submitting"}
                          />
                        </FormControl>
                        {field.state.meta.errors && (
                          <FormMessage>
                            {field.state.meta.errors.join(", ")}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  </form.Field>
                </div>

                {/* Images Section */}
                <div className="md:col-span-2 mt-4">
                  <Separator className="my-4" />
                  <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-neutral-700">
                    Images
                  </h2>
                  <div className="mb-6">
                    <Label className="block text-sm font-medium text-neutral-200 mb-2">
                      Upload Images
                    </Label>
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
                        <ScrollArea className="h-48 w-full rounded-md">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4">
                            {uploadedImages.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={image}
                                  alt={`Preview ${index + 1}`}
                                  className="h-24 w-full object-cover rounded-md"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
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
                                </Button>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button
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
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
