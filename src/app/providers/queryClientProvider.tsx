'use client';

// app/providers.tsx
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

interface QueryProviderProps {
  children: React.JSX.Element | React.JSX.Element[];
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          duration: 5000, 
          style: { background: '#333', color: '#fff'},
          success: { duration: 3000, style: { background: '#10B981' }},
          error: { duration: 5000, style: { background: '#EF4444' }},
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}