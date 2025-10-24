import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth'; 

interface AuthGuardProps {
  children: React.ReactNode;
  requiredUserType?: "creator" | "recruiter" | "admin";
  redirectTo?: string;
  allowedUserTypes?: ("creator" | "recruiter" | "admin")[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredUserType,
  redirectTo = '/login',
  allowedUserTypes,
}) => {
  const { isAuthenticated, userType, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // If specific user type is required
      if (requiredUserType && userType !== requiredUserType) {
        // Redirect based on actual user type
        const dashboardUrl = userType === 'creator' ? '/creative-homepage' : '/recruiter-homepage';
        router.push(dashboardUrl);
        return;
      }

      // If allowed user types are specified
      if (allowedUserTypes && userType && !allowedUserTypes.includes(userType)) {
        const dashboardUrl = userType === 'creator' ? '/creative-homepage' : '/recruiter-homepage';
        router.push(dashboardUrl);
        return;
      }
    }
  }, [isAuthenticated, userType, isLoading, requiredUserType, allowedUserTypes, router, redirectTo]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Only render children if authenticated and authorized
  if (isAuthenticated() && (!requiredUserType || userType === requiredUserType) && 
      (!allowedUserTypes || (userType && allowedUserTypes.includes(userType)))) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
};