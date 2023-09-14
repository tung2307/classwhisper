import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const reviewRouter = createTRPCRouter({
  getReviewsbyUser: privateProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {}),

  getReviewbyID: privateProcedure
    .input(z.object({ reviewId: z.string() }))
    .query(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.findFirst({
        where: { id: input.reviewId },
      });
      return review;
    }),

  create: publicProcedure
    .input(
      z.object({
        profId: z.string(),
        userId: z.string().optional(),
        course: z.string(),
        tags: z.string(),
        difficulty: z.string(),
        describe: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const professor = await ctx.prisma.review.create({
        data: { ...input },
      });
      return professor;
    }),
});
