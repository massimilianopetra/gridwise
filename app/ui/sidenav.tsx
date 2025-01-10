import Link from 'next/link';
import NavLinks from '@/app/ui/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SettingsIcon from '@mui/icons-material/Settings';
import { signOut } from '@/auth';


export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-3 lg:px-2 sm:px-2 bg-gray-300">
      <Link
        className="mb-2 flex h-16 items-end justify-start rounded-sm bg-blue-700 p-4 lg:h-32"
        href="/"
      >
        <div className="w-32 text-white lg:w-64">
          <AcmeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2 ">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-sm lg:block"></div>
        {/* Bottone Settings */}
        <Link
          href="/home/settings"
          className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-sm bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 lg:flex-none lg:justify-start lg:p-2 lg:px-3"
        >
          <SettingsIcon className="w-6" />
          <div className="hidden lg:block">Settings</div>
        </Link>
 
     
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-sm bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 lg:flex-none lg:justify-start lg:p-2 lg:px-3">
          <PowerSettingsNewIcon className="w-6" />
          <div className="hidden lg:block">Sign Out</div>
        </button>
      </form>
    </div>
    </div >
  );
}