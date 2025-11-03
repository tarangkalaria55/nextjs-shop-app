import { faker } from "@faker-js/faker";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import type { Prisma } from "@/generated/prisma";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/seed/products/[id]">,
) {
  const { id } = await ctx.params;

  const productsToCreate = parseInt(id, 10) || 10;
  const productData: Prisma.ProductCreateManyInput[] = [];

  for (let i = 0; i < productsToCreate; i++) {
    productData.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 1, max: 2000 })),
      stock: faker.number.int({ min: 0, max: 10 }),
      category: faker.commerce.department(),
      image: faker.image.urlPicsumPhotos({ width: 300, height: 300 }),
    });
  }

  await prisma.product.createMany({ data: productData });

  return NextResponse.json({ success: true }, { status: 200 });
}
