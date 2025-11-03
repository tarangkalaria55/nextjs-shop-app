"use server";

import { updateTag } from "next/cache";

export const refetchCachedCart = async () => {
  updateTag("get-cart");
};
