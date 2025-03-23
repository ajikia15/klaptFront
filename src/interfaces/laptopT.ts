export type LaptopT = {
  id: number;
  title: string;
  price: number;
  brand: string;
  model: string;
  shortDesc: string;
  gpuBrand: string;
  gpuModel: string;
  vram: string;
  backlightType: "none" | "rgb" | "white";
  processorBrand: "Intel" | "AMD";
  processorModel: string;
  cores: number;
  threads: number;
  ram: string;
  ramType: "DDR3" | "DDR4" | "DDR5";
  storageType: "HDD" | "SSD" | "Hybrid";
  storageCapacity: string;
  screenSize: string;
  screenResolution: string;
  refreshRate: number;
  weight?: string;
  year: number;
  description: string;
  images: string[];
  stockStatus: "reserved" | "sold" | "in stock";
  status: "approved" | "pending" | "rejected" | "archived";
};
