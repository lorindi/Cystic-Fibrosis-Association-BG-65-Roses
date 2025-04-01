"use client";
import React from "react";
import WebMenu from "./WebMenu";
import MobileMenu from "./MobileMenu";
import { usePathname } from "next/navigation";

function Navbar() {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith("/sign-in") || 
                    pathname.startsWith("/create-account") ||
                    pathname.startsWith("/verify-email");

  if (hideNavbar) {
    return null;
  }

  return (
    <div className="w-full p-4">
      <div className="hidden lg:flex w-full">
        <WebMenu />
      </div>

      <div className="lg:hidden w-full">
        <MobileMenu />
      </div>
    </div>
  );
}

export default Navbar;
