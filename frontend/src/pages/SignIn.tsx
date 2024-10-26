// src/client/pages/SignIn.tsx
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';

export const SignIn = () => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
            <ClerkSignIn signUpUrl="/sign-up" />
        </div>
    );
};