
// src/client/router.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthedLayout } from './layouts/AuthedLayout';
import { UnauthedLayout } from './layouts/UnauthedLayout';
import { Feed } from './pages/Feed';
import { Profile } from './pages/Profile';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';

export const router = createBrowserRouter([
    {
        element: <UnauthedLayout />,
        children: [
            {
                path: 'sign-in',
                element: <SignIn />,
            },
            {
                path: 'sign-up',
                element: <SignUp />,
            },
        ],
    },
    {
        element: <AuthedLayout />,
        children: [
            {
                path: '/',
                element: <Feed />,
            },
            {
                path: '/profile',
                element: <Profile />,
            },
            {
                path: '*',
                element: <Navigate to="/" replace />,
            },
        ],
    },
]);