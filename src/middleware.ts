import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "slideshelf-default-secret-fallback-minimum-32-chars-long",
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("slideshelf_session")?.value;

  let sessionUser: { id: string; role: "STUDENT" | "COURSE_REP" } | null = null;
  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, JWT_SECRET);
      sessionUser = {
        id: payload.id as string,
        role: payload.role as "STUDENT" | "COURSE_REP",
      };
    } catch {
      sessionUser = null;
    }
  }

  // If user is on /login and already logged in as Course Rep, redirect to /rep
  if (pathname === "/login" && sessionUser?.role === "COURSE_REP") {
    return NextResponse.redirect(new URL("/rep", request.url));
  }

  // Course Rep Desk Protection (Admin only)
  if (pathname.startsWith("/rep")) {
    if (!sessionUser || sessionUser.role !== "COURSE_REP") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/rep/:path*"],
};

