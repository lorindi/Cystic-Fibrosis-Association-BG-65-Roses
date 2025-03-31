"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "../logo/Logo";

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);



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
            <li><Link href='/'>Home</Link></li>
            <li><Link href='/news'>News</Link></li>
            <li><Link href='/events'>Events</Link></li>
            <li><Link href='/causes'>History</Link></li>
            <li><Link href='/about'>Charities</Link></li>
            <li><Link href='/profile'>Profile</Link></li>
        </ul>
      )}
    </div>
  );
}

export default MobileMenu;
