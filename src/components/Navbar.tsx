// components/Navbar.tsx
import Link from 'next/link';

const Navbar = () => {

    return (
        <div className="bg-background h-20 w-full border-b-2 flex items-center justify-between p-2">
            <ul className="flex items-center justify-center">
                <li className="p-2 cursor-pointer">
                    <Link href="/">
                        <h1 className="font-extrabold text-white text-4xl ease-linear duration-150 hover:border cursor-pointer flex items-center hover:bg-secondary rounded-md p-2">SecurityCam</h1>
                    </Link>
                </li>
            </ul>
            <button
                value={"Enter"}
                // onClick={}
                className='bg-background-alt
                    rounded-md
                    outline-none
                    shadow-[0_3px_0px_0px_rgba(255,255,255)]
                    font-bold
                    hover:bg-secondary
                    hover:shadow-[0_2px_0px_0px_rgba(255,255,255)]
                    hover:translate-y-[2px]
                    active:shadow-none
                    active:translate-y-[4px]
                    transition duration-[100] ease-in-out
                    p-2
                    '
            >
                About Our Team
            </button>

        </div>
    );
};

export default Navbar;
