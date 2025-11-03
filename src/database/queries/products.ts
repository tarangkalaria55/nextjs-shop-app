import prisma from "@/database/prisma";
import type { Prisma } from "@/generated/prisma";

export namespace DbProducts {
  type GuestCartGroupBy = {
    productId: string;
    _sum: {
      quantity: number | null;
    };
  };

  type CartGroupBy = {
    productId: string;
    _sum: {
      quantity: number | null;
    };
  };

  export const getPaginatedProducts = async (
    search: string,
    pageSize: number,
    page: number,
  ) => {
    const offset = (page - 1) * pageSize;

    const filter: Prisma.ProductWhereInput = !search.trim()
      ? {}
      : {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        };

    const products = await prisma.product.findMany({
      skip: offset,
      take: pageSize,
      where: filter,
    });

    const productIds = products.map((p) => p.id);

    const guestCartSums = (await prisma.guestCartItem.groupBy({
      by: ["productId"],
      where: {
        productId: { in: productIds },
      },
      _sum: {
        quantity: true,
      },
    })) as GuestCartGroupBy[];

    const cartSums = (await prisma.cartItem.groupBy({
      by: ["productId"],
      where: {
        productId: { in: productIds },
      },
      _sum: {
        quantity: true,
      },
    })) as CartGroupBy[];

    const guestCartMap = new Map<string, number>(
      guestCartSums.map((item) => [item.productId, item._sum.quantity ?? 0]),
    );

    const cartMap = new Map<string, number>(
      cartSums.map((item) => [item.productId, item._sum.quantity ?? 0]),
    );

    const totalCount = await prisma.product.count({ where: filter });

    const productsData = products.map((product) => {
      const guestQty = guestCartMap.get(product.id) ?? 0;
      const cartQty = cartMap.get(product.id) ?? 0;
      const itemsInCart = guestQty + cartQty;
      const stockAvailable = product.stock - itemsInCart;

      return {
        ...product,
        itemsInCart,
        stockAvailable,
      };
    });

    return { products: productsData, totalCount };
  };

  export const getProductById = async (productId: string) => {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return null;
    }

    const guestCartSums = (await prisma.guestCartItem.groupBy({
      by: ["productId"],
      where: {
        productId: product.id,
      },
      _sum: {
        quantity: true,
      },
    })) as GuestCartGroupBy[];

    const cartSums = (await prisma.cartItem.groupBy({
      by: ["productId"],
      where: {
        productId: product.id,
      },
      _sum: {
        quantity: true,
      },
    })) as CartGroupBy[];

    const guestCartMap = new Map<string, number>(
      guestCartSums.map((item) => [item.productId, item._sum.quantity ?? 0]),
    );

    const cartMap = new Map<string, number>(
      cartSums.map((item) => [item.productId, item._sum.quantity ?? 0]),
    );

    const guestQty = guestCartMap.get(product.id) ?? 0;
    const cartQty = cartMap.get(product.id) ?? 0;
    const itemsInCart = guestQty + cartQty;
    const stockAvailable = product.stock - itemsInCart;

    return {
      ...product,
      itemsInCart,
      stockAvailable,
    };
  };

  export type PaginatedProductType = Awaited<
    ReturnType<typeof getPaginatedProducts>
  >["products"][0];
}
