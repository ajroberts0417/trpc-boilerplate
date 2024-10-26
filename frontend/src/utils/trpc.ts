// src/client/utils/trpc.ts
import { createTRPCReact, TRPCClientError } from '@trpc/react-query';
import type { AppRouter } from '../../../backend';
import { toast as defaultToast } from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';

export const trpc = createTRPCReact<AppRouter>();


export const toast = {
    error: (message: string) => defaultToast.error(message, {
        duration: 4000,
        style: {
            background: '#FEE2E2',
            color: '#DC2626',
            padding: '16px',
        },
    }),
    success: (message: string) => defaultToast.success(message, {
        duration: 4000,
        style: {
            background: '#DCFCE7',
            color: '#16A34A',
            padding: '16px',
        },
    }),
};

// Helper hook to check if user can edit/delete a message
export const useCanModifyMessage = (authorId: string) => {
    const { userId } = useAuth();
    return userId === authorId;
};

// Custom error handler
export const handleTRPCError = (error: unknown) => {
    if (error instanceof TRPCClientError) {
        toast.error(error.message);
    } else {
        toast.error('An unexpected error occurred');
    }
};