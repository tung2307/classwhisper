import { profRouter } from "~/server/api/routers/professor";
import { createTRPCRouter } from "~/server/api/trpc";
import { cookieRouter } from "./routers/cookie";
import { reportouter } from "./routers/report";
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
  report: reportouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
