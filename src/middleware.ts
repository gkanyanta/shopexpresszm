import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/shop",
  "/categories",
  "/about",
  "/contact",
  "/faq",
  "/buy-for-me",
  "/sell-with-us",
  "/shipping",
  "/delivery-info",
  "/payment-info",
  "/track-order",
  "/blog",
  "/terms",
  "/privacy",
  "/returns",
  "/delivery-policy",
  "/vendor-terms",
  "/restricted-items",
  "/deals",
  "/auth/signin",
  "/auth/signup",
];

function isPublicRoute(pathname: string): boolean {
  if (publicRoutes.includes(pathname)) return true;
  if (pathname.startsWith("/product/")) return true;
  if (pathname.startsWith("/vendor/store/")) return true;
  if (pathname.startsWith("/shop")) return true;
  if (pathname.startsWith("/api/")) return true;
  return false;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  // Allow public routes
  if (isPublicRoute(pathname)) return NextResponse.next();

  // Redirect unauthenticated users to signin
  if (!isLoggedIn) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Admin-only routes
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Vendor-only routes
  if (pathname.startsWith("/vendor") && role !== "VENDOR" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|static|favicon.ico|.*\\..*).*)"],
};
