import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const cookieRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        cookieId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input.cookieId);
      const cookie = await ctx.prisma.cookieConsent.create({
        data: { cookieId: input.cookieId, accepted: true },
      });
      return cookie;
    }),
});
