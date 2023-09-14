import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const reportouter = createTRPCRouter({
  getAllReport: privateProcedure.query(async ({ ctx }) => {
    const user = useUser();
    const email = user.user?.emailAddresses[0]?.emailAddress;
    if (email == "tung.nguyen23797@gmail.com") {
      const reports = await ctx.prisma.report.findMany({
        orderBy: {
          createdAt: "asc", // or use 'updatedAt' or other timestamp field if 'createdAt' doesn't exist
        },
      });
      return reports;
    } else {
      throw new Error("Not authenticated");
    }
  }),

  create: privateProcedure
    .input(
      z.object({
        reviewId: z.string(),
        reason: z.string(),
        detail: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.review.update({
        where: { id: input.reviewId },
        data: { isReport: true },
      });
      const report = await ctx.prisma.report.create({
        data: { ...input, userId: ctx.userId },
      });
      return report;
    }),
});
