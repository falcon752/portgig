import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthStorage } from '@/src/lib/requests/auth.new';
import { UserProfile } from '@/types/user';

interface AuthState {
  isAuthenticated: boolean;
  userType: "creator" | "recruiter" | "admin" | null;
  userId: string | null;
  userEmail: string | null;
  userData: UserProfile | null;
  user: UserProfile | null; 
  isLoading: boolean;
  loading: boolean; 
  error: string | null;
}

export const useAuth = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userType: null,
    userId: null,
    userEmail: null,
    userData: null,
    user: null,
    isLoading: true,
    loading: true,
    error: null,
  });

  const checkAuthState = () => {
    try {
      const isValid = AuthStorage.validateAndCleanAuth();
      
      if (isValid) {
        const userData = AuthStorage.getUserData<UserProfile>();
        const newState = {
          isAuthenticated: AuthStorage.isAuthenticated(),
          userType: AuthStorage.getUserType(),
          userId: AuthStorage.getUserId(),
          userEmail: AuthStorage.getUserEmail(),
          userData: userData,
          user: userData, 
          isLoading: false,
          loading: false,
          error: null,
        };
        setAuthState(newState);
      } else {
        // Clear state if auth is invalid
        setAuthState({
          isAuthenticated: false,
          userType: null,
          userId: null,
          userEmail: null,
          userData: null,
          user: null,
          isLoading: false,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      // Clear auth on error
      AuthStorage.clearAuth();
      setAuthState({
        isAuthenticated: false,
        userType: null,
        userId: null,
        userEmail: null,
        userData: null,
        user: null,
        isLoading: false,
        loading: false,
        error: 'Failed to load user data',
      });
    }
  };

  useEffect(() => {
    checkAuthState();

    const interval = setInterval(checkAuthState, 60000); 

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userData' || e.key === 'access_token' || e.key === 'userType') {
        checkAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = () => {
    AuthStorage.clearAuth();
    setAuthState({
      isAuthenticated: false,
      userType: null,
      userId: null,
      userEmail: null,
      userData: null,
      user: null,
      isLoading: false,
      loading: false,
      error: null,
    });
  };

  const refreshAuthState = () => {
    checkAuthState();
  };

  const redirectToHomepage = () => {
    const user_type = AuthStorage.getUserType();
    if (!authState.user) return;

    if (user_type === 'admin') {
      router.push('/dashboard');
    } else if (user_type === 'creator') {
      router.push('/creative-homepage');
    } else if (user_type === 'recruiter') {
      router.push('/recruiter-homepage');
    } else {
      router.push('/');
    }
  };

  const isAuthenticated = () => {
    return AuthStorage.isAuthenticated();
  };

  return {
    ...authState,
    logout,
    refreshAuthState,
    isAdmin: authState.userType === 'admin',
    isCreator: authState.userType === 'creator',
    isRecruiter: authState.userType === 'recruiter' || authState.userType === 'admin',
    
    redirectToHomepage,
    isAuthenticated,
  };
};