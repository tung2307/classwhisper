import { authMiddleware } from "@clerk/nextjs";
export default authMiddleware({
  // "/" will be accessible to all users
  publicRoutes: [
    "/",
    "/api/trpc/professor.getAll",
    "/search/:professor/:school",
    "/add/professor",
    "/api/trpc/professor.create",
    "/api/trpc/professor.getAll,professor.getAll",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
