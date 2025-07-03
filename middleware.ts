import { NextRequest, NextResponse } from "next/server";
import { getWalletAndAccountFromCookie } from "@/app/actions/cookies";

// Define protected routes - add more routes as needed
const PROTECTED_ROUTES = ["/communities", "/u/", "/thread/", "/api/communities", "/api/threads", "/api/replies"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and assets
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".js") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".gif") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".ico")
  ) {
    return NextResponse.next();
  }

  // Only protect routes in PROTECTED_ROUTES
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get wallet address from auth cookie
  const { walletAddress, lensAccountAddress } = (await getWalletAndAccountFromCookie()) || {};

  if (!walletAddress || !lensAccountAddress) {
    // Redirect to home page with error message
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("error", "wallet-required");
    return NextResponse.redirect(url);
  }

  try {
    // Verify NFT ownership
    const hasNFT = false;

    if (!hasNFT) {
      // Redirect to home page with error message
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("error", "nft-required");
      return NextResponse.redirect(url);
    }

    // User has NFT, allow access
    return NextResponse.next();
  } catch (error) {
    console.error("Error verifying NFT ownership:", error);

    // In case of error, redirect to home with generic error
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("error", "verification-failed");
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
