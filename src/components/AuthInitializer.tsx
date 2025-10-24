'use client';

import { useEffect } from 'react';
import { AuthStorage } from '@/src/lib/requests/auth.new';

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Clean up invalid auth state on app initialization
    AuthStorage.validateAndCleanAuth();
  }, []);

  return <>{children}</>;
};