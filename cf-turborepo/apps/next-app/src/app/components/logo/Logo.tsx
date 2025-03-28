import Image from "next/image";
import React from "react";
import logo from "../../../../public/images/logo.jpg";
import Link from "next/link";
type LogoProps = {
  type: "navigation" | "home" | "footer";
};

function Logo({ type }: LogoProps) {
  const getClassName = () => {
    switch (type) {
      case "navigation":
        return "w-10 h-[38.83px] sm:w-14 sm:h-[54.36px]";
      case "home":
        return "w-[34px] h-[33px] sm:w-[79.32px] sm:h-[77px]";
      case "footer":
        return "w-14 h-[57.73px]";
      default:
        return "w-14 h-[57.73px]";
    }
  };
  const titleClassName = () => {
    if (type === "navigation" || type === "footer") return "text-[#03657f] text-xs font-bold font-['Comfortaa'] leading-3 sm:text-lg";
    return "";
  };

  const paragraphClassName = () => {
    if (type === "navigation") return "text-[#0483a3] text-[8px] font-normal font-['Comfortaa'] tracking-wider sm:text-[13px]";
    return "";
  };

  if (type === "navigation" || type === "footer") {
    return (
      <Link href={"/"} className="flex gap-[10px] items-center justify-start">
        <Image
          src={logo}
          alt="Logo"
          width={300}
          height={300}
          className={getClassName()}
        />
        {type === "navigation" && (
          <div className="">
            <h1 className={titleClassName()}>
              Cystic fibrosis
            </h1>
            <p className={paragraphClassName()}>
             stronger together
            </p>
          </div>
        )}
      </Link>
    );
  }
  return (
    <Image
      src={logo}
      alt="Logo"
      width={300}
      height={300}
      className={getClassName()}
    />
  );
}

export default Logo;
