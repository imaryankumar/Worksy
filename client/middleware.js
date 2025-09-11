// middleware.js
import { NextResponse } from "next/server";

const PUBLIC_PAGES = ["/", "/login", "/company-register"];

export function middleware(req) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname.replace(/\/$/, "");

  const token = req.cookies.get("userToken")?.value;

  // Logged-in user visiting public page → redirect to /overview
  if (token && PUBLIC_PAGES.includes(pathname)) {
    url.pathname = "/overview";
    return NextResponse.redirect(url);
  }

  // Not logged-in user visiting private page → redirect to /login
  if (!token && !PUBLIC_PAGES.includes(pathname)) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
