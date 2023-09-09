import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const profRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ name: z.string(), school: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      let whereClause: { OR: any[]; school?: string } = {
        OR: [
          { fname: { contains: input.name } },
          { lname: { contains: input.name } },
        ],
      };

      if (input.school) {
        whereClause.school = input.school;
      }

      const result = await ctx.prisma.professor.findMany({
        where: whereClause,
      });

      return result;
    }),

  create: publicProcedure
    .input(
      z.object({
        lname: z.string(),
        fname: z.string(),
        school: z.string(),
        department: z.string(),
        level: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const professor = await ctx.prisma.professor.create({
        data: { ...input },
      });
      return professor;
    }),
});
