import { profRouter } from "~/server/api/routers/professor";
import { createTRPCRouter } from "~/server/api/trpc";
import { cookieRouter } from "./routers/cookie";
import { reviewRouter } from "./routers/review";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  professor: profRouter,
  review: reviewRouter,
  cookie: cookieRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
