// src/client/App.tsx
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './router';
import { trpc } from './utils/trpc';

const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
console.log("KEY!!!", key)

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3001/trpc',
        }),
      ],
    })
  );

  console.log("KEY!!!", key)

  return (
    <ClerkProvider publishableKey={key}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            toastOptions={{
              // Default options for all toasts
              duration: 4000,
              style: {
                borderRadius: '8px',
                padding: '16px',
              },
            }}
          />
        </QueryClientProvider>
      </trpc.Provider>
    </ClerkProvider>
  );
}