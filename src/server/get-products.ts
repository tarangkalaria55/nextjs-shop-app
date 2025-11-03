import { cacheLife, cacheTag } from "next/cache";
import { DbProducts } from "@/database/queries/products";

export const getProducts = async (
  search: string,
  pageSize: number,
  page: number,
) => {
  "use cache";

  cacheTag("products");
  cacheLife("max");

  return await DbProducts.getPaginatedProducts(search, pageSize, page);
};
