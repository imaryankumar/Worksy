import { NextResponse } from "next/server";

const PUBLIC_PAGES = ["/", "/login", "/company-register"];

export function middleware(req) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  const token = req.cookies.get("token")?.value;

  // logged-in users should not see public pages
  if (token && PUBLIC_PAGES.includes(pathname)) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // logged-out users should not see private pages
  if (!token && !PUBLIC_PAGES.includes(pathname)) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
