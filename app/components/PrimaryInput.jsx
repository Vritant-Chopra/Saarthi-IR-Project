import Image from "next/image";
import React from "react";

const PrimaryInput = ({
  placeholder,
  color,
  bgColor,
  profileIcon,
  onChange,
  type,
  accept,
  value,
  multiple = false,
  readOnly = false
}) => {
  const textColorClass =
    color === "brokenWhite" ? "text-pine" : "text-brokenWhite";

  return (
    <div className="relative mt-4 w-full">
      <div className="absolute inset-y-0 start-0 flex items-center px-4 py-4 pointer-events-none">
        <Image src={profileIcon} className="w-8 h-8" alt="" />
      </div>
      <input
        type={type}
        id="input-group-1"
        style={{backgroundColor: bgColor || undefined,}}
        className={`${
          !bgColor ? `bg-${color}` : ""
        } ${textColorClass} border border-brokenWhite text-sm rounded-lg block w-full ps-16 p-2.5 py-3.5 focus:outline-none placeholder:text-brokenWhite placeholder:opacity-35`}
        placeholder={placeholder}
        onChange={onChange}
        multiple={multiple}
        accept={accept}
        readOnly={readOnly}
        value={value}
      />
    </div>
  );
};

export default PrimaryInput;
