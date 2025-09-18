// middleware.js
import { NextResponse } from "next/server";

const PUBLIC_PAGES = ["/", "/login", "/company-register"];
const AUTH_PAGES = ["/login", "/company-register"];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("userToken")?.value;

  const isPublicPage = PUBLIC_PAGES.includes(pathname);
  const isAuthPage = AUTH_PAGES.includes(pathname);
  const isLoggedIn = !!token;

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/overview", req.url));
  }

  // Redirect non-logged-in users to login for private pages
  if (!isLoggedIn && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)", "/"],
};
