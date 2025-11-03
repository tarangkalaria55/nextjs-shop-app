"use server";

// import { cacheLife, cacheTag } from "next/cache";
import { DbProducts } from "@/database/queries/products";

export async function getProductById(productId: string) {
  // "use cache";

  // cacheTag(`product-${productId}`);
  // cacheLife("max");

  return await DbProducts.getProductById(productId);
}
