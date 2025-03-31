"use client"
import React from "react";
import Logo from "../logo/Logo";
import { usePathname } from 'next/navigation';

function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <div
      className={`flex-col lg:flex-row h-full w-full max-w-[1536px] 2xl:rounded-[10px] bg-[#034D61] 
    py-8 px-4 gap-8
    sm:justify-center sm:items-center
    lg:justify-start lg:items-start lg:py-23 lg:px-16
    xl:m-8 xl:pl-56 xl:pr-16 xl:py-24 xl:max-h-[418px] ${isAdmin ? 'hidden' : 'flex'}`}
    >
      <div className="flex-1 flex flex-col justify-center sm:justify-start items-center sm:items-start gap-4 w-full sm:pl-[20%] lg:pl-0">
        <div className="flex items-center justify-center sm:items-start bg-[#fafafa] px-6 py-2 rounded-full ">
          <Logo type="navigation" />
        </div>
        <p
          className="w-full max-w-96 text-white font-normal 
        leading-tight text-xs text-center
        sm:leading-normal sm:text-base sm:text-start
        xl:text-start
        "
        >
          Information about cystic fibrosis and support for patients and their
          loved ones.
        </p>
      </div>
      <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start justify-center gap-4 w-full">
        <div className="flex-1 flex flex-col items-center justify-center lg:items-start gap-4 w-full">
          <div className="flex flex-col gap-4 items-center sm:items-start justify-center">
            <h4 className="text-white text-base font-normal leading-normal">
              Quick Links
            </h4>
            <ul className="flex flex-col justify-center sm:items-start sm:justify-start items-center xl:items-start gap-2">
              <li className="text-white text-xs md:text-base font-normal leading-normal">
                Home
              </li>
              <li className="text-white text-xs md:text-base font-normal leading-normal">
                News
              </li>
              <li className="text-white text-xs md:text-base font-normal leading-normal">
                Events
              </li>
              <li className="text-white text-xs md:text-base font-normal leading-normal">
                History
              </li>
              <li className="text-white text-xs md:text-base font-normal leading-normal">
                Charities
              </li>
              <li className="text-white text-xs md:text-base font-normal leading-normal">
                Profile
              </li>
            </ul>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center lg:items-start gap-4 w-full">
          <div className="flex flex-col gap-4 items-center sm:items-start justify-center">
            <h4 className="text-white text-base font-normal leading-normal">
              Contact Us
            </h4>
            <ul className="flex flex-col justify-center sm:items-start sm:justify-start items-center xl:items-start gap-2">
              <li className="text-white text-xs md:text-base font-normal leading-normal">
                Email
              </li>
              <li className="text-white text-xs md:text-base font-normal leading-normal">
                Phone
              </li>
              <li className="text-white text-xs md:text-base font-normal leading-normal">
                Address
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
