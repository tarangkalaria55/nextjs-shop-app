import { getProducts } from "@/server/get-products";
import ProductCard from "./product-card";

export default async function ProductsList({
  search,
  pageSize,
  page,
}: {
  search: string;
  pageSize: number;
  page: number;
}) {
  const { products } = await getProducts(search, pageSize, page);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showViewDetailsBtn={true}
        />
      ))}
    </div>
  );
}
