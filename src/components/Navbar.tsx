'use client'

import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

const Navbar = () => {
    const { user, isLoading, loginWithRedirect, logout, isAuthenticated } = useAuth0();

    useEffect(() => {
        if (isAuthenticated) {
            console.log('User is authenticated:', user);
        }
    }, [isAuthenticated, user]);

    return (
        <div className="bg-background h-20 w-full border-b-2 flex items-center justify-between p-2">
            <ul className="flex items-center justify-center">
                <li className="p-2 cursor-pointer">
                    <Link href="/" className="font-extrabold text-white text-4xl ease-linear duration-150 hover:border cursor-pointer flex items-center hover:bg-secondary rounded-md p-2">
                        SecurityCam
                    </Link>
                </li>
            </ul>
            <div className="flex items-center space-x-4">
                <Link href="/about" className='bg-background-alt rounded-md outline-none shadow-[0_3px_0px_0px_rgba(255,255,255)] font-bold hover:bg-secondary hover:shadow-[0_2px_0px_0px_rgba(255,255,255)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition duration-[100] ease-in-out p-2'>
                    About Our Team
                </Link>
                {!isLoading && (
                    isAuthenticated ? (
                        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                                className='bg-accent-dark rounded-md outline-none shadow-[0_3px_0px_0px_rgba(255,255,255)] font-bold hover:bg-accent hover:shadow-[0_2px_0px_0px_rgba(255,255,255)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition duration-[100] ease-in-out p-2'>
                            Logout
                        </button>
                    ) : (
                        <button onClick={() => loginWithRedirect()}
                                className='bg-accent-dark rounded-md outline-none shadow-[0_3px_0px_0px_rgba(255,255,255)] font-bold hover:bg-accent hover:shadow-[0_2px_0px_0px_rgba(255,255,255)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition duration-[100] ease-in-out p-2'>
                            Login
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default Navbar;

