"use server";

import { updateTag } from "next/cache";

export const refetchCachedProducts = async () => {
  updateTag("products");
};
