import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const productSearchParamsParser = {
  search: parseAsString.withDefault(""),
  pageSize: parseAsInteger.withDefault(10),
  page: parseAsInteger.withDefault(1),
  totalPage: parseAsInteger.withDefault(1),
};

export const loadSearchParams = createLoader(productSearchParamsParser);
