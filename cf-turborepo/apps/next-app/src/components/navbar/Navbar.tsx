"use client";
import React from "react";
import WebMenu from "./WebMenu";
import MobileMenu from "./MobileMenu";
import { usePathname } from "next/navigation";

function Navbar() {
  const pathname = usePathname();
  const isAdmin =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/create-account");
  return (
    <div className={`${isAdmin ? "hidden" : ""} w-full p-4`}>
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
