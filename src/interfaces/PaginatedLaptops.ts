import { LaptopT } from "./laptopT";
export type PaginatedLaptops = {
  data: LaptopT[];
  total: number;
  page: number;
  limit: number;
  pageCount: number;
};
