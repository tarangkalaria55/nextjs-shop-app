import Image from "next/image";
import AddToCartButton from "@/components/add-to-cart-button";
import { DEFAULT_PRODUCT_IMAGE_FALLBACK } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProductById } from "@/server/get-product-by-id";

export default async function ProductDetailPage(
  props: PageProps<"/products/[id]">,
) {
  const { id } = await props.params;

  const product = await getProductById(id);

  if (!product) {
    return (
      <main className="container mx-auto flex flex-col items-center-safe justify-center-safe gap-4 p-6">
        <h1 className="font-normal text-2xl text-center text-red-600">
          Product not found.
        </h1>
      </main>
    );
  }

  return (
    <main className="container mx-auto flex flex-col items-center-safe justify-center-safe gap-4 p-6">
      <h1 className="font-bold text-2xl">Product Detail</h1>

      <Card key={product.id} className="p-0 flex flex-col justify-between">
        <CardHeader className="p-0 relative">
          <Image
            src={product.image ?? DEFAULT_PRODUCT_IMAGE_FALLBACK}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-full object-cover rounded-t-lg"
          />

          <Badge className="absolute top-2 left-2 shadow-2xl">
            {product.category}
          </Badge>

          {product.stock <= 0 && (
            <Badge className="absolute top-2 right-2" variant="destructive">
              Out of stock
            </Badge>
          )}

          <div className="p-6">
            <CardTitle>{product.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p className="text-xl font-bold">${product.price}</p>
          <CardDescription>
            {product.description?.slice(0, 80)}...
          </CardDescription>
        </CardContent>
        <CardFooter className="flex flex-row-reverse justify-between pb-2">
          <AddToCartButton product={product} />
        </CardFooter>
      </Card>
    </main>
  );
}
