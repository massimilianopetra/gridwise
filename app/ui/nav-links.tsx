'use client';

import HomeIcon from '@mui/icons-material/Home';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';


import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.


export default function NavLinks() {
    const pathname = usePathname();
    var links = undefined;

    
    links = [{ name: 'Home', href: '/', icon: HomeIcon },
             { name: 'Liquidity', href: '/liquidity', icon: WaterDropIcon},
             { name: 'Grid Calculator', href: '/gridcalculator', icon: ViewHeadlineIcon},];

    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            'flex h-[48px] grow items-center justify-center gap-2 rounded-lg bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 lg:flex-none lg:justify-start lg:p-2 lg:px-3',
                            {
                                'bg-sky-100 text-blue-600': pathname === link.href,
                            },
                        )}
                    >
                        <LinkIcon className="w-6" />
                        <p className="hidden lg:block">{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}