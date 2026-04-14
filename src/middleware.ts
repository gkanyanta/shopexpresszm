import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

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

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (isPublicRoute(pathname)) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // Redirect unauthenticated users to signin
  if (!token) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  const role = token.role as string;

  // Admin-only routes
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Vendor-only routes
  if (pathname.startsWith("/vendor") && role !== "VENDOR" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico|.*\\..*).*)"],
};
