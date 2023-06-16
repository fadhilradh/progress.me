import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/api", "/post-signin", "/post-signup"],
  afterAuth(auth, req, evt) {
    console.log("🚀 ~ file: middleware.ts:6 ~ afterAuth ~ evt:", evt);
    console.log("🚀 ~ file: middleware.ts:6 ~ afterAuth ~ req:", req);
    console.log("🚀 ~ file: middleware.ts:6 ~ afterAuth ~ auth:", auth);
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
