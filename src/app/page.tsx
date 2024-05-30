"use client";
import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const HomePage = () => {
    const [tooltip, setTooltip] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        if (tooltip) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // Duration should match the fade-out animation
            return () => clearTimeout(timer);
        }
    }, [tooltip]);

    return (
        <div className="bg-background-alt min-h-screen flex flex-col justify-center">
            <Head>
                <title>Home Page</title>
                <meta name="description" content="Welcome to the homepage" />
            </Head>
            <style jsx>{`
                .fade-in {
                    @apply opacity-0;
                    animation: fadeIn 0.3s ease-in-out forwards;
                }
                .fade-out {
                    @apply opacity-100;
                    animation: fadeOut 0.3s ease-in-out forwards;
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
                @media (max-width: 640px) {
                    h1 {
                        font-size: 2rem;
                        padding: 2rem;
                    }
                    .button {
                        font-size: 1rem;
                        padding: 1rem 2rem;
                        margin: 1rem;
                    }
                    .tooltip {
                        font-size: 1.25rem;
                        padding: 0.5rem;
                    }
                }
            `}</style>
            <main className="container mx-auto p-4 bg-background-alt flex-grow">
                <div className="relative text-center mb-8">
                    <h1 className="text-4xl min-h-40 font-bold justify-center text-center bg-cover bg-no-repeat text-white p-8 rounded-md flex items-center"
                        style={{ backgroundImage: 'url("/sec3.png")', backgroundSize: '100% auto', backgroundPosition: 'center' }}>
                        Welcome to Security Cam
                    </h1>
                </div>

                <div className="text-center relative mb-2">
                    <div className="mb-8 mr-8 mt-8">
                        <Link legacyBehavior={true} href="/register">
                            <a
                                className='button relative bg-accent-dark mb-8
                            rounded-md
                            outline-none
                            shadow-[0_3px_0px_0px_rgba(255,255,255)]
                            font-extrabold
                            hover:bg-accent
                            hover:shadow-[0_2px_0px_0px_rgba(255,255,255)]
                            hover:translate-y-[2px]
                            active:shadow-none
                            active:translate-y-[4px]
                            transition duration-[100] ease-in-out
                            text-center
                            justify-center
                            p-3
                            pl-12
                            pr-12
                            m-4'
                                onMouseEnter={() => setTooltip('Add a new person\'s photo in the system so they can open the door or remove one so they lose that ability')}
                                onMouseLeave={() => setTooltip(null)}
                            >
                                Access Center
                            </a>
                        </Link>
                    </div>
                    <div className="mb-8 mt-8 mr-8">
                        <Link legacyBehavior={true} href="/feed">
                            <a
                                className='button relative bg-accent-dark mb-8
                            rounded-md
                            outline-none
                            shadow-[0_3px_0px_0px_rgba(255,255,255)]
                            font-extrabold
                            hover:bg-accent
                            hover:shadow-[0_2px_0px_0px_rgba(255,255,255)]
                            hover:translate-y-[2px]
                            active:shadow-none
                            active:translate-y-[4px]
                            transition duration-[100] ease-in-out
                            text-center
                            justify-center
                            p-3
                            pl-12
                            pr-12
                            m-4'
                                onMouseEnter={() => setTooltip('View the live feed from the security camera of the door')}
                                onMouseLeave={() => setTooltip(null)}
                            >
                                See Live Feed
                            </a>
                        </Link>
                    </div>

                    {isVisible && (
                        <div className={`tooltip text-2xl absolute top-28 left-1/2 transform -translate-x-1/2 bg-primary text-gray-100 rounded-md p-2 ${tooltip ? 'fade-in' : 'fade-out'}`}>
                            {tooltip}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default HomePage;
