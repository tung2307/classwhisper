import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const reportouter = createTRPCRouter({
  getAllReport: privateProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = useUser();
      const email = user.user?.emailAddresses[0]?.emailAddress;
      if (input.userId == email) {
        const reports = await ctx.prisma.report.findMany({
          orderBy: {
            createdAt: "asc", // or use 'updatedAt' or other timestamp field if 'createdAt' doesn't exist
          },
        });
        return reports;
      } else {
        const reports = await ctx.prisma.report.findMany({
          where: { userId: input.userId },
          orderBy: {
            createdAt: "desc", // or use 'updatedAt' or other timestamp field if 'createdAt' doesn't exist
          },
        });
        return reports;
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
