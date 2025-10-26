import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const publicPaths = ["/auth/login", "/auth/register", "/"]
  const isPublicPath = publicPaths.some((path) => pathname === path || pathname.startsWith(path))

  const userSession = request.cookies.get("user_session")
  const hasSession = !!userSession

  if (!hasSession && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (hasSession && pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
