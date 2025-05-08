"use client";
import React, { useState } from 'react';
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Logo from "../logo/Logo";
import { useAuth } from '@/lib/context/AuthContext';
import { usePathname } from 'next/navigation';
import LogoutButton from '../auth/LogoutButton';

// Функция за проверка дали потребителят има достъп до админ панела
const hasAdminAccess = (user: any) => {
  // Ако потребителят е админ
  if (user?.role === 'admin') return true;
  
  // Ако потребителят има групи и поне една от тях е специфична група
  if (user?.groups && user.groups.length > 0) {
    const adminAccessGroups = ['campaigns', 'initiatives', 'conferences', 'events', 'news', 'blog', 'recipes'];
    return user.groups.some((group: string) => adminAccessGroups.includes(group));
  }
  
  return false;
};

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Use the auth hook
  const { user } = useAuth();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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
    <div className="relative flex justify-center items-center h-full">
      <button
        onClick={toggleMenu}
        className="text-gray-700 hover:text-teal-600 focus:outline-none focus:text-teal-600"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

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
              {hasAdminAccess(user) && (
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
