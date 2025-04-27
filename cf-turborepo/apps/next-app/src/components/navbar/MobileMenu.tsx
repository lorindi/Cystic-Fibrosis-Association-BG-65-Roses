"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "../logo/Logo";
import { useAuth } from '@/lib/context/AuthContext';
import { usePathname } from 'next/navigation';
import LogoutButton from '../auth/LogoutButton';

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Use the auth hook
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const getLinkClassName = (path: string) => {
    return isActive(path) 
      ? "text-teal-600 font-medium" 
      : "text-gray-700 hover:text-teal-600";
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Logo type="navigation" />

        <div
          className="flex flex-col gap-[4.5px] cursor-pointer z-20"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div
            className={`w-6 h-1 bg-[#0EB9D9] rounded-sm ${
              isOpen ? "rotate-45" : ""
            } origin-left ease-in-out duration-500`}
          />
          <div
            className={`w-6 h-1 bg-[#0EB9D9] rounded-sm ${
              isOpen ? "opacity-0" : ""
            } ease-in-out duration-500`}
          />
          <div
            className={`w-6 h-1 bg-[#0EB9D9] rounded-sm ${
              isOpen ? "-rotate-45" : ""
            } origin-left ease-in-out duration-500`}
          />
        </div>
      </div>

      {isOpen && (
        <ul className="absolute left-0 top-[60px] sm:top-[87px] w-full h-[calc(100vh-70px)] sm:h-[calc(100vh-87px)] bg-white flex flex-col items-center justify-center gap-8 font-medium text-xl z-10">
          <li><Link href='/' className={getLinkClassName('/')}>Home</Link></li>
          <li><Link href='/news' className={getLinkClassName('/news')}>News</Link></li>
          <li><Link href='/events' className={getLinkClassName('/events')}>Events</Link></li>
          <li><Link href='/causes' className={getLinkClassName('/causes')}>History</Link></li>
          <li><Link href='/about' className={getLinkClassName('/about')}>Charities</Link></li>
          {user ? (
            <>
              <li><Link href='/profile' className={getLinkClassName('/profile')}>Profile</Link></li>
              {user.role === 'admin' && (
                <li>
                  <Link 
                    href='/admin' 
                    className={isActive('/admin') 
                      ? "text-red-600 font-semibold" 
                      : "text-red-500 hover:text-red-700 font-medium"}
                  >
                    Admin Panel
                  </Link>
                </li>
              )}
              <li><LogoutButton /></li>
            </>
          ) : (
            <>
              <li><Link href='/sign-in' className={getLinkClassName('/sign-in')}>Sign In</Link></li>
              <li><Link href='/create-account' className={getLinkClassName('/create-account')}>Create Account</Link></li>
            </>
          )}
        </ul>
      )}
    </div>
  );
}

export default MobileMenu;
