// src/client/pages/SignUp.tsx
import { SignUp as ClerkSignUp } from '@clerk/clerk-react';

export const SignUp = () => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
            <ClerkSignUp signInUrl="/sign-in" />
        </div>
    );
};