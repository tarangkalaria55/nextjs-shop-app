// app/products/page.tsx

import { AddToCartButton } from "@/components/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Fetch products server-side
async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    cache: "no-store", // Or 'force-cache' for static
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <CardTitle className="flex justify-between items-center">
                {product.name}
                <Badge variant="secondary">${product.price}</Badge>
              </CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Stock:{" "}
                {product.stock > 0
                  ? `${product.stock} available`
                  : "Out of stock"}
              </p>
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-center text-muted-foreground">
          No products available.
        </p>
      )}
    </div>
  );
}
