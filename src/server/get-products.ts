import { cacheLife, cacheTag } from "next/cache";
import { getPaginatedProducts } from "@/database/queries/get-paginated-products";

export const getProducts = async (
  search: string,
  pageSize: number,
  page: number,
) => {
  "use cache";

  cacheTag("products");
  cacheLife("max");

  return await getPaginatedProducts(search, pageSize, page);
};
