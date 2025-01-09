'use client'

import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { Roboto } from 'next/font/google'

const roboto = Roboto({
    weight: '700',
    subsets: ['latin'],
})

export default function LoginPage() {
    const { loginWithRedirect } = useAuth0();

    useEffect(() => {
        loginWithRedirect();
    }, [loginWithRedirect]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-alt">
            <h1 className={`${roboto.className} text-4xl text-center text-white p-8 bg-primary rounded-lg shadow-lg`}>
                Redirecting to login...
            </h1>
        </div>
    )
}

