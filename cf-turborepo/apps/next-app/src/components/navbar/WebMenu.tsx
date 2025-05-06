'use client';

import React from 'react'
import Logo from '../logo/Logo'
import Link from 'next/link'
import Button from '../buttons/Button'
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { isPublicPath } from '@/lib/constants';
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

function WebMenu() {
  const pathname = usePathname();
  
  // Use the auth hook
  const { user, loading } = useAuth();

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

  // Показваме loading индикатор само за непублични страници
  // За публични показваме нормално менюто, но с индикация за loading
  if (loading && !isPublicPath(pathname)) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex items-center justify-between w-full px-10'>
      <Logo type='navigation'/>
      <div className='flex items-center justify-end gap-15 '>
        <ul className='flex items-center justify-end gap-4 w-full max-w-[754px]'>
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
        <div className='flex items-center justify-end w-full max-w-[240px]'>
          <Link href="/donate">
            <Button type='outlined' text='Make Donate'/>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default WebMenu