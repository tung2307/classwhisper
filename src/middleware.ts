import { authMiddleware } from "@clerk/nextjs";
export default authMiddleware({
  // "/" will be accessible to all users
  publicRoutes: [
    "/",
    "/api/trpc/professor.getAll",
    "/search/:professor/:school",
    "/sign-in/:url",
    "/add/professor",
    "/api/trpc/professor.create",
    "/api/trpc/professor.getAll,professor.getAll",
    "/giangvien/:id",
    "/search/:url",
    "/api/trpc/professor.getProfessor",
    "/add/review/:id",
    "/api/trpc/review.create",
    "/api/trpc/cookie.create",
    "/chinh-sach-bao-mat",
    "/dieu-khoan-dich-vu",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
