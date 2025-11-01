import { ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Product } from "./shared/types/product";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface ProductCardProps {
  product: Product;
}

export const DEFAULT_PRODUCT_IMAGE_FALLBACK = "/images/placeholder.png";

export default function ProductCard({ product }: ProductCardProps) {
  return (
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
        {product.stock > 0 ? (
          <Button asChild>
            <Link
              href={`/products/${product.id}`}
              className="flex items-center gap-2"
            >
              <ShoppingCartIcon className="size-4" />
              Add to Cart
            </Link>
          </Button>
        ) : (
          <Button className="flex items-center gap-2" disabled>
            <ShoppingCartIcon className="size-4" />
            Add to Cart
          </Button>
        )}

        <Button asChild>
          <Link
            href={`/products/${product.id}`}
            className="flex items-center gap-2"
          >
            <ShoppingCartIcon className="size-4" />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
