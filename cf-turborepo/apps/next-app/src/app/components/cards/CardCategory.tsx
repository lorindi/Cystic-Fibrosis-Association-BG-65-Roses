import Link from "next/link";
import React from "react";

function CardCategory({
  icon,
  title,
  description,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}) {
  const IconWrapper = ({ children, className }: { children: React.ReactNode, className: string }) => (
    <span style={{ color: "#06b6d4" }} className={className}>
      {children}
    </span>
  );
  return (
    <Link
      href={link}
      className="flex flex-col xl:flex-row items-center justify-center shadow-lg rounded-[10px] bg-white 
      w-60 px-2 py-8 gap-2
      sm:w-96 
      md:w-[520px]
      lg:w-[240px] h-[142px] lg:gap-[10px]
      xl:w-[400px] xl:h-[205px] xl:px-[24px] xl:py-16 xl:gap-4
    "
    >
        <IconWrapper className="xl:flex hidden">{icon}</IconWrapper>

      <div
        className="flex flex-col w-full items-center justify-center
        gap-2
        xl:gap-0
      "
      >
        <div className="flex flex-row w-full justify-center xl:justify-start items-center gap-[12px]">
          <IconWrapper className="xl:hidden lg:flex flex">{icon}</IconWrapper>

          <h4
            className="text-color-heading font-['Montserrat'] 
            text-xl leading-loose
            xl:text-3xl xl:font-semibold xl:leading-10 
        "
          >
            {title}
          </h4>
        </div>
        <p
          className="flex justify-center items-center w-full text-[#262626] font-normal font-['Montserrat']
          max-w-56 text-xs leading-tight text-center
          xl:max-w-72 xl:text-base xl:leading-normal xl:text-start
      "
        >
          {description}
        </p>
      </div>
    </Link>
  );
}

export default CardCategory;
