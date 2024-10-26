// src/client/layouts/UnauthedLayout.tsx
import { SignedOut, useAuth } from '@clerk/clerk-react';
import { Outlet, Navigate } from 'react-router-dom';

export const UnauthedLayout = () => {

    const { isSignedIn } = useAuth();

    if (isSignedIn) {
        return <Navigate to="/" replace />;
    }

    return (
        <SignedOut>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full">
                    <Outlet />
                </div>
            </div>
        </SignedOut>
    );
};