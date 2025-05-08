// Navigation and authentication path constants

export const PUBLIC_PATHS = [
  '/sign-in',
  '/create-account',
  '/verify-email',
  '/forgotten-password',
  '/',
  '/about',
  '/contact',
  '/faq',
  '/news',
  '/events',
  '/causes',
  '/donate',
  '/campaigns'
];

export const AUTH_PROTECTED_PATHS = [
  '/profile',
  '/admin',
  '/dashboard',
  '/settings',
  '/user'
];

export const HIDE_NAVBAR_PATHS = [
  "/sign-in",
  "/create-account",
  "/verify-email",
  "/forgotten-password",
  "/admin"
];

// Navigation helper functions
export const isPublicPath = (pathname: string | null): boolean => {
  if (!pathname) return false;
  return PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path));
};

export const isProtectedPath = (pathname: string | null): boolean => {
  if (!pathname) return false;
  return AUTH_PROTECTED_PATHS.some(path => pathname.startsWith(path));
};

export const shouldHideNavbar = (pathname: string | null): boolean => {
  if (!pathname) return false;
  return HIDE_NAVBAR_PATHS.some(path => pathname.startsWith(path));
}; 