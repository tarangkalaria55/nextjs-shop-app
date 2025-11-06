import prisma from "../prisma";

export const getStripeCustomerIdForUser = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: {
      stripeCustomerId: true,
    },
  });
  return user?.stripeCustomerId;
};
