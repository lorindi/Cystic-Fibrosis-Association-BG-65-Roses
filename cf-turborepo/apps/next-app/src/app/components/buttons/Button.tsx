"use client";
import Link from "next/link";
import React from "react";

type ButtonProps = {
  type:
    | "primary"
    | "outlined"
    | "text-icon"
    | "filled-icon"
    | "filled-text-icon"
    | "outlined-icon"
    | "disabled"
    | "filled-text"
    | "outlined-text";
  text?: string;
  icon?: React.ReactElement;
  onClick?: () => void;
  disabled?: boolean;
  iconColor?: string;
  link?: string; 
};

const Button: React.FC<ButtonProps> = ({
  type,
  text,
  icon,
  onClick,
  disabled,
  iconColor = "currentColor",
  link,
}) => {
  const getClassName = () => {
    switch (type) {
      case "primary":
        return "w-full max-w-[278px] text-white text-base font-bold bg-gradient-to-r from-[#29B8A4] to-[#06B8E6] hover:text-[#222222] hover:bg-gradient-to-r hover:from-[#8FD6CD] hover:to-[#7FD6EA]";
      case "outlined":
        return "w-full max-w-[278px] border-2 border-[#29b8a4] text-[#222222] text-base font-bold bg-gradient-to-r from-[#fafafa] to-[#fafafa] hover:bg-gradient-to-r hover:from-[#8FD6CD] hover:to-[#7FD6EA] hover:border-[#03657f]/10";
      case "filled-text":
        return "w-full max-w-[278px] text-white bg-[#03657f] hover:bg-[#03657f]/60 text-center";
      case "outlined-text":
        return "w-full max-w-[278px] border-2 border-[#29b8a4] hover:bg-[#03657f]/60 hover:border-[#03657f]/10";
      case "text-icon":
        return "w-full max-w-[140px]  text-center text-[#03657f] text-base font-bold hover:text-[#03657f]/60";
      case "filled-icon":
        return "w-full min-w-15 md:min-w-20 max-w-[278px] text-white bg-[#03657f] hover:bg-[#03657f]/60 text-center";
      case "filled-text-icon":
        return "w-full max-w-[278px] text-white text-base font-bold bg-gradient-to-r from-[#29B8A4] to-[#06B8E6] hover:bg-gradient-to-r hover:from-[#8FD6CD] hover:to-[#7FD6EA] hover:text-[#222222]";
      case "outlined-icon":
        return "w-full max-w-20 border-2 border-[#29b8a4] hover:bg-gradient-to-r hover:from-[#8FD6CD] hover:to-[#7FD6EA] hover:border-[#03657f]/10";
      case "disabled":
        return "w-full max-w-[278px] text-base font-bold bg-gray-300 text-gray-700 rounded cursor-not-allowed";
      default:
        return "";
    }
  };

  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <span style={{ color: iconColor }}>{children}</span>
  );

  const content = type === "filled-icon" ? (
    <span className="flex items-center justify-center -rotate-45 text-center">
      <IconWrapper>{icon}</IconWrapper>
    </span>
  ) : type === "text-icon" ? (
    <div className="flex items-center justify-center gap-[10px]">
      {text && <span>{text}</span>}
      {icon && <IconWrapper>{icon}</IconWrapper>}
    </div>
  ) : type === "filled-text-icon" ? (
    <div className="flex items-center justify-center gap-[10px]">
      {text && <span>{text}</span>}
      {icon && <IconWrapper>{icon}</IconWrapper>}
    </div>
  ) : type === "outlined-icon" ? (
    <div className="flex items-center justify-center">
      {icon && <IconWrapper>{icon}</IconWrapper>}
    </div>
  ) : (
    text
  );

  if (link) {
    return (
      <Link 
        href={link}
        className={getClassName()} 
        aria-disabled={disabled || type === "disabled"}
        tabIndex={disabled || type === "disabled" ? -1 : 0}
        role="button"
        onClick={disabled || type === "disabled" ? undefined : onClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={`${getClassName()} px-[5px] py-[3px] rounded-[8px] text-xs sm:text-sm md:rounded-[10px] md:p-2 md:text-base lg:text-xl`}
      onClick={onClick}
      disabled={disabled || type === "disabled"}
    >
      {content}
    </button>
  );
};

export default Button;
