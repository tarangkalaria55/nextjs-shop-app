import { updateTag } from "next/cache";
import { Suspense } from "react";
import PaginationStateManager from "@/components/pagination-state-manager";
import ProductsFilter from "@/components/products-filter";
import ProductsList from "@/components/products-list";
import ProductsListLoading from "@/components/products-list-loading";
import ProductsPagination from "@/components/products-pagination";
import type { NuqsPageProps } from "@/types/nuqs";
import { loadSearchParams } from "../search-params";

async function Content({ searchParams }: NuqsPageProps<"/products">) {
  const { search, pageSize, page } = await loadSearchParams(searchParams);

  async function refetchProducts() {
    "use server";
    updateTag("products");
  }

  const { totalCount } = await import("@/server/get-products").then((mod) =>
    mod.getProducts(search, pageSize, page),
  );

  return (
    <>
      {/* Filter with refetch callback */}
      <ProductsFilter refetchProducts={refetchProducts} />

      {/* Manage pagination totalPage state */}
      <PaginationStateManager totalCount={totalCount} pageSize={pageSize} />

      {/* Suspense streams product list with loading fallback */}
      <Suspense fallback={<ProductsListLoading />}>
        <ProductsList search={search} pageSize={pageSize} page={page} />
      </Suspense>

      {/* Pagination controls with refetch callback */}
      <ProductsPagination refetchProducts={refetchProducts} />
    </>
  );
}

export default async function Home(props: NuqsPageProps<"/">) {
  return (
    <main className="container mx-auto flex flex-col gap-4 p-6">
      <h1 className="font-bold text-2xl">Product Listing</h1>

      <Suspense fallback={<ProductsListLoading />}>
        <Content {...props} />
      </Suspense>
    </main>
  );
}
