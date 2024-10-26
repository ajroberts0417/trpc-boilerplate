// src/client/layouts/AuthedLayout.tsx
import { SignedIn, UserButton } from '@clerk/clerk-react';
import { Link, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

export const AuthedLayout = () => {

    const { isSignedIn } = useAuth();

    if (!isSignedIn) {
        return <Navigate to="/sign-in" replace />;
    }
    return (
        <SignedIn>
            <div className="min-h-screen bg-gray-50">
                <nav className="bg-white shadow-sm">
                    <div className="max-w-6xl mx-auto px-4 py-3">
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-4">
                                <Link to="/" className="font-bold text-xl">
                                    TweetClone
                                </Link>
                                <Link to="/" className="hover:text-blue-500">
                                    Feed
                                </Link>
                                <Link to="/profile" className="hover:text-blue-500">
                                    Profile
                                </Link>
                            </div>
                            <UserButton afterSignOutUrl="/sign-in" />
                        </div>
                    </div>
                </nav>

                <main className="max-w-6xl mx-auto px-4 py-6">
                    <Outlet />
                </main>
            </div>
        </SignedIn>
    );
};