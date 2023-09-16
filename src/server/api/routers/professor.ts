import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
interface ProfessorNameCondition {
  fname?: {
    contains: string;
  };
  lname?: {
    contains: string;
  };
}

interface WhereClause {
  OR: ProfessorNameCondition[];
  school?: string;
}
export const profRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ name: z.string(), school: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const nameParts = input.name
        .split(" ")
        .filter((part) => part.trim().length > 0);

      const whereClause: WhereClause = {
        OR: [
          ...nameParts.map((part) => ({ fname: { contains: part } })),
          ...nameParts.map((part) => ({ lname: { contains: part } })),
        ],
      };

      if (input.school) {
        whereClause.school = input.school;
      }

      const result = await ctx.prisma.professor.findMany({
        where: whereClause,
        include: {
          reviews: {
            select: {
              difficulty: true,
            },
          },
        },
      });

      return result;
    }),

  getProfessor: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.professor.findFirst({
        where: { id: input.id },
        include: {
          reviews: true, // Adjust 'reviews' to your actual relation name
        },
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
