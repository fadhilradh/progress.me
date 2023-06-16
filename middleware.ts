import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/api", "/post-signin", "/post-signup"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
