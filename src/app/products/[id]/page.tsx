// app/products/[id]/page.tsx

import { AddToCartButton } from "@/components/add-to-cart-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function getProduct(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,
  );
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
          )}
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold mb-4">${product.price}</p>
          <AddToCartButton product={product} />
        </CardContent>
      </Card>
    </div>
  );
}
