
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt, { JwtPayload } from "jsonwebtoken"
import { jwtutils } from './utils/jwt';
import { getNewAccessToken } from './service/refreshToken';
import { getSubscriptionStatus } from './app/(publicGroup)/_actions/getSubscriptionStatus';

const AUTH_ROUTES = ['/login', '/register'];

const PUBLIC_ROUTES = ['/', '/news']
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {

  const pathname = request.nextUrl.pathname;

  const cookieStore = await cookies()
  // const accessToken = cookieStore.get("accessToken")

  let accessToken = request.cookies.get("accessToken")?.value;

  const refreshToken = request.cookies.get("refreshToken")?.value;

  let decodedAccessToken = accessToken ? jwtutils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null;

  const decodedRefreshToken = refreshToken ? jwtutils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) : null;

  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    // access token has expired but refresh token is valid, refresh the access token
    const result = await getNewAccessToken();

    if (result.success) {
      // set the new access token in the cookies
      const newAccessToken = result.data.accessToken;
      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: "lax",
      });

      accessToken = newAccessToken;
      decodedAccessToken = jwtutils.verifyToken(accessToken!, process.env.JWT_ACCESS_SECRET as string)
    }

  }
  let userRole = null;

  if (!decodedAccessToken?.success) {
    //token has expired or invalid, clear the cookies 
    cookieStore.delete("accessToken");
    // return NextResponse.redirect(new URL('/login', request.url))  // redirect to login page to many times ase
  }

  if (decodedAccessToken && decodedAccessToken.data) {
    userRole = (decodedAccessToken.data as JwtPayload).role;
  }

  // user is logged in and trying to access auth routes, redirect to dashboard or root home page based on role
  if (accessToken && AUTH_ROUTES.includes(pathname)) {
    if (userRole === "USER") {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL('/admin-dashboard', request.url))
    } else if (userRole === "AUTHOR") {
      return NextResponse.redirect(new URL('/author-dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));

  // Authentication pages Protection: Authorization is not handled yet.
  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Authorization: Role based access control

  if (pathname.startsWith("/dashboard") && userRole !== "USER") {
    return NextResponse.redirect(new URL('/not-found', request.url))
  } else if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL('/not-found', request.url))
  } else if (pathname.startsWith("/author-dashboard") && userRole !== "AUTHOR") {
    return NextResponse.redirect(new URL('/not-found', request.url))
  }

  // Premium Content Protection


  if (pathname === "/premium") {
    const subscriptionStatus = await getSubscriptionStatus();
    const isActive = Boolean(
      subscriptionStatus?.success && subscriptionStatus.data?.isSubscribed,
    );
    if (!isActive) {
      return NextResponse.redirect(new URL('/payment', request.url))
    }
  }

  // Premium user trying to access payment page, redirect to premium page
  // if (pathname === "/payment") {
  //   const subscriptionStatus = await getSubscriptionStatus();
  //   const isActive = Boolean(
  //     subscriptionStatus?.success && subscriptionStatus.data?.isSubscribed,
  //   );
  //   if (isActive) {
  //     return NextResponse.redirect(new URL('/premium', request.url))
  //   }
  // }
  // console.log(request, "\nRequest");
  // console.log(request.nextUrl, "\nNext URL");
  // console.log("\nproxy");

  // return NextResponse.redirect(new URL('/', request.url))
  return NextResponse.next()
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: [
    // '/dashboard/:path*',
    // "/admin-dashboard/:path*",

    // Exclude API routes, static files, image optimizations, and .png files
    '/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)',
  ]
}