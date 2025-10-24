"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { setProfile } from "@/src/redux/features/user/userSlice";
import { UserProfile } from "@/types/user";
import { setRecruiterProfile } from "@/src/redux/features/user/recruiterSlice";
import { RecruiterProfile } from "@/types/recruiter";
import { AuthStorage, determineUserType } from "@/src/lib/requests/auth.new";

const AuthCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      const tempToken = searchParams.get("token");
      const error = searchParams.get("error");
      const loginStatus = searchParams.get("login");
      const userRole = searchParams.get("role") || "Creator";

      if (error || loginStatus === "failed") {
        setStatus("error");
        setMessage(decodeURIComponent(error || "Authentication failed. Please try again."));
        setTimeout(() => {
          setIsRedirecting(true);
          window.location.href = "/onboarding";
        }, 3000);
        return;
      }

      if (!tempToken || loginStatus !== "success") {
        setStatus("error");
        setMessage("Invalid authentication response. Please try signing in again.");
        setTimeout(() => {
          setIsRedirecting(true);
          window.location.href = "/login?error=invalid_response";
        }, 3000);
        return;
      }

      try {
        const baseUrl = process.env.NODE_ENV === "production"
          ? "https://api.portgig.com/api/v1"
          : "https://api.portgig.com/api/v1";

        const response = await fetch(`${baseUrl}/user/me?token=${tempToken}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userResult = await response.json();

        const accessToken = userResult.access_token;
        const refreshToken = userResult.refresh_token || "";
        const profile = userResult.profile || userResult.data;
        
        console.log('Backend response:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasProfile: !!profile,
          role: userResult.role
        });
        
        if (!accessToken || !profile) {
          throw new Error("Access token or profile data not found in response");
        }

        const email = profile.auth?.email || profile.email || "";

        const userType = determineUserType(
          email, 
          userRole.toLowerCase() as "creator" | "recruiter"
        );

        const success = AuthStorage.setAuth(
          accessToken,  
          refreshToken,
          userType,
          profile,
          email
        );

        console.log("Auth check after Google login:", {
          isAuthenticated: AuthStorage.isAuthenticated(),
          hasAccessToken: !!AuthStorage.getAccessToken(),
          userType: AuthStorage.getUserType(),
          userId: AuthStorage.getUserId(),
          allCookies: document.cookie,
        });

        if (!success) {
          throw new Error("Failed to set authentication credentials");
        }

        if (userRole.toLowerCase() === "creator") {
          dispatch(setProfile(profile as UserProfile));
        } else if (userRole.toLowerCase() === "recruiter") {
          dispatch(setRecruiterProfile(profile as RecruiterProfile));
        }

        setStatus("success");
        setMessage("Welcome! Redirecting to your dashboard...");
        
        setTimeout(() => {
          setIsRedirecting(true);
          
          const redirectUrl = userRole.toLowerCase() === "creator" 
              ? "/creative-dashboard/edit-profile" 
              : "/recruiter-dashboard/edit-profile";
          
          window.location.href = redirectUrl;
        }, 2000);
      } catch (error) {
        console.error("Google auth callback error:", error);
        setStatus("error");
        setMessage(`Something went wrong: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`);
        
        // Clear any partially set auth state
        AuthStorage.clearAuth();
        
        setTimeout(() => {
          setIsRedirecting(true);
          window.location.href = "/login?error=setup_failed";
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [searchParams, router, dispatch]);

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle2 className="h-8 w-8 text-green-500" />;
      case "error":
        return <AlertCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-white shadow-lg mb-4">
          {getStatusIcon()}
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          {status === "loading" && "Processing Authentication..."}
          {status === "success" && "Authentication Successful!"}
          {status === "error" && "Authentication Failed"}
        </h2>
        <div className="mt-4 space-y-3">
          <p className={`text-sm ${getStatusColor()}`}>{message}</p>
          {isRedirecting && (
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Redirecting...</span>
            </div>
          )}
          {status === "error" && !isRedirecting && (
            <button
              onClick={() => window.location.href = "/login"}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Login
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400">PortGig Authentication System</p>
      </div>
    </div>
  );
};

const GoogleAuthCallback = () => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-white shadow-lg mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Loading authentication...</h2>
          <p className="mt-2 text-sm text-gray-600">Please wait while we process your request</p>
        </div>
      </div>
    }
  >
    <AuthCallbackContent />
  </Suspense>
);

export default GoogleAuthCallback;