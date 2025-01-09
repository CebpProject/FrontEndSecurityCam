'use client'

import { useAuth0 } from '@auth0/auth0-react';
import HomePage from '../components/HomePage';
import { useEffect } from 'react';

export default function Home() {
    const { user, isLoading, isAuthenticated } = useAuth0();

    useEffect(() => {
        if (isAuthenticated) {
            console.log('User is authenticated:', user);
        }
    }, [isAuthenticated, user]);

    if (isLoading) return <div>Loading...</div>;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-alt">
                <h1 className="text-4xl text-center text-white p-8 bg-primary rounded-lg shadow-lg">
                    Please log in to access SecurityCam.
                </h1>
            </div>
        );
    }

    return <HomePage />;
}

