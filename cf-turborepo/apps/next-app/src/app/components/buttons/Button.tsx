"use client";
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
};

const Button: React.FC<ButtonProps> = ({
  type,
  text,
  icon,
  onClick,
  disabled,
  iconColor = "currentColor",
}) => {
  const getClassName = () => {
    switch (type) {
      case "primary":
        return "p-2 w-full max-w-[278px] h-[52px] text-white text-base font-bold rounded-[10px] bg-gradient-to-r from-[#29B8A4] to-[#06B8E6] hover:text-[#222222] hover:bg-gradient-to-r hover:from-[#8FD6CD] hover:to-[#7FD6EA]";
      case "outlined":
        return "p-2 w-full max-w-[278px] h-[52px] rounded-[10px] border-2 border-[#29b8a4] text-[#222222] text-base font-bold bg-gradient-to-r from-[#fafafa] to-[#fafafa] hover:bg-gradient-to-r hover:from-[#8FD6CD] hover:to-[#7FD6EA] hover:border-[#03657f]/10";
      case "filled-text":
        return "p-2 w-full max-w-[278px] h-[52px] text-white bg-[#03657f] rounded-[10px] hover:bg-[#03657f]/60 text-center";
      case "outlined-text":
        return "p-2 w-full max-w-[278px] h-[52px] rounded-[10px] border-2 border-[#29b8a4] hover:bg-[#03657f]/60 hover:border-[#03657f]/10";
      case "text-icon":
        return "p-2 w-full max-w-[140px]  h-[52px] rounded-[10px] text-center text-[#03657f] text-base font-bold hover:text-[#03657f]/60";
      case "filled-icon":
        return "p-2 w-full min-w-15 h-[30px] md:min-w-20 md:h-[52px] max-w-[278px] text-white bg-[#03657f] rounded-[10px] hover:bg-[#03657f]/60 text-center";
      case "filled-text-icon":
        return "p-2 w-full max-w-[278px] h-[52px] text-white text-base font-bold rounded-[10px] bg-gradient-to-r from-[#29B8A4] to-[#06B8E6] hover:bg-gradient-to-r hover:from-[#8FD6CD] hover:to-[#7FD6EA] hover:text-[#222222]";
      case "outlined-icon":
        return "p-2 w-full max-w-20 h-[52px] rounded-[10px] border-2 border-[#29b8a4] hover:bg-gradient-to-r hover:from-[#8FD6CD] hover:to-[#7FD6EA] hover:border-[#03657f]/10";
      case "disabled":
        return "p-2 w-full max-w-[278px] h-[52px] text-base font-bold rounded-[10px] bg-gray-300 text-gray-700 rounded cursor-not-allowed";
      default:
        return "";
    }
  };
  console.log(iconColor);
  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <span style={{ color: iconColor }}>{children}</span>
  );

  return (
    <button
      className={getClassName()}
      onClick={onClick}
      disabled={disabled || type === "disabled"}
    >
      {type === "filled-icon" ? (
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
      )}
    </button>
  );
};

export default Button;
