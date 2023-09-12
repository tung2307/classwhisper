import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const reviewRouter = createTRPCRouter({
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
