import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const authRoutes = [
  "/login",
  "/sign-up",
  "/sign-in",
  "/recruiter-sign-in",
  "/recruiter-sign-up",
  "/welcome-onboarding",
  "/why-onboarding",
  "/onboarding",
];

const publicRoutes = [
  "/", 
  "/about-us", 
  "/contact", 
  "/portfolio/view",
  "/portfolio-1",
  "/portfolio-2", 
  "/portfolio-3",
  "/portfolio-4",
  "/portfolio-5",
  "/portfolio-6",
  "/portfolio-7",
];

// Portfolio template routes that should be publicly accessible
const portfolioTemplateRoutes = [
  "/videographer-portfolio",
  "/writer-portfolio",
  "/developer-portfolio",
  "/photographer-portfolio",
  "/social-media-portfolio",
  "/designer-portfolio",
];

const creatorRoutes = [
  "/creative-homepage",
  "/creative-dashboard",
  "/creatives-hub",
  "/job-hub",
    "/profile-card",
  "creator-notifications",
];

const recruiterRoutes = [
  "/recruiter-homepage",
  "/recruiter-job-hub",
  "/recruiter-creatives-hub",
    "recruiter-dashboard",
  "recruiter-notifications",
];

// Helper function to validate JWT token
function isValidJWT(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

// Helper function to clear invalid cookies
function clearInvalidCookies(response: NextResponse) {
  const cookieOptions = {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 0, 
  };
  
  response.cookies.set("access_token", "", cookieOptions);
  response.cookies.set("refresh_token", "", cookieOptions);
  response.cookies.set("userType", "", cookieOptions);
  response.cookies.set("userData", "", cookieOptions);
  response.cookies.set("storedProfile", "", cookieOptions);
  response.cookies.set("userEmail", "", cookieOptions);
  response.cookies.set("userId", "", cookieOptions);
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for static assets, API routes, public routes, and portfolio templates
  if (
    path.startsWith("/_next") ||
    path.startsWith("/assets/") ||
    path === "/favicon.ico" ||
    path.startsWith("/api/") ||
    publicRoutes.includes(path) ||
    publicRoutes.some((route) => path.startsWith(route + "/")) ||
    portfolioTemplateRoutes.some((route) => path.startsWith(route))
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;
  const userType = request.cookies.get("userType")?.value;
  
  const isTokenValid = accessToken ? isValidJWT(accessToken) : false;
  const isAuthenticated = accessToken && isTokenValid;

  // Log for debugging in production
  console.log(
    `[Middleware] Path: ${path}, Has Token: ${!!accessToken}, Token Valid: ${isTokenValid}, User Type: ${userType}`
  );

  // If token exists but is invalid, clear cookies and treat as unauthenticated
  if (accessToken && !isTokenValid) {
    console.log("[Middleware] Invalid token detected, clearing cookies");
    const response = NextResponse.redirect(new URL("/login", request.url));
    clearInvalidCookies(response);
    return response;
  }

  // Handle auth routes: Redirect authenticated users to their dashboard
  if (authRoutes.includes(path) || path.startsWith("/auth/")) {
    if (isAuthenticated && userType) {
      const dashboardUrl =
        userType === "creator" ? "/creative-homepage" : "/recruiter-homepage";
      if (path !== dashboardUrl) {
        console.log(
          `[Middleware] Redirecting authenticated user to ${dashboardUrl}`
        );
        return NextResponse.redirect(new URL(dashboardUrl, request.url));
      }
    }
    return NextResponse.next();
  }

  // Handle protected routes
  const isCreatorRoute =
    creatorRoutes.includes(path) ||
    creatorRoutes.some((route) => path.startsWith(route + "/"));
  const isRecruiterRoute =
    recruiterRoutes.includes(path) ||
    recruiterRoutes.some((route) => path.startsWith(route + "/"));

  if (isCreatorRoute || isRecruiterRoute) {
    if (!isAuthenticated) {
      console.log(
        `[Middleware] Redirecting to /login from ${path} due to missing/invalid access_token`
      );
      const response = NextResponse.redirect(new URL("/login", request.url));
      // Clear any invalid cookies
      if (accessToken && !isTokenValid) {
        clearInvalidCookies(response);
      }
      return response;
    }

    if (!userType) {
      // Infer userType if missing
      const inferredType = isCreatorRoute ? "creator" : "recruiter";
      console.log(
        `[Middleware] Setting userType to ${inferredType} for ${path}`
      );
      const response = NextResponse.next();
      response.cookies.set("userType", inferredType, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, 
      });
      return response;
    }

    // Redirect if userType doesn't match the route
    if (
      (isCreatorRoute && userType === "recruiter") ||
      (isRecruiterRoute && userType === "creator")
    ) {
      const redirectUrl =
        userType === "creator" ? "/creative-homepage" : "/recruiter-homepage";
      console.log(
        `[Middleware] Redirecting to ${redirectUrl} due to userType mismatch`
      );
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected routes
    "/(creative-homepage|creative-dashboard|job-hub|profile-card)/:path*",
    "/(recruiter-homepage|recruiter-job-hub)/:path*",
    // Auth routes
    "/(login|sign-up|sign-in|recruiter-sign-in|recruiter-sign-up|welcome-onboarding|why-onboarding|onboarding)",
    "/(creative-email|recruiter-email)",
    "/auth/:path*",
    // Catch-all for non-static, non-public routes (excluding portfolio templates)
    "/((?!_next|assets|api|favicon.ico|about-us|contact|portfolio|videographer-portfolio|writer-portfolio|developer-portfolio|photographer-portfolio|social-media-portfolio|designer-portfolio).*)",
  ],
};