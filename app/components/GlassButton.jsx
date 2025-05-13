import Link from "next/link";
import React from "react";

const GlassButton = ({ title, to }) => {
  return (
    <Link
      href={to}
      className="px-12 py-2 backdrop-blur-sm border-[1px] border-brokenWhite text-brokenWhite bg-brokenWhite bg-opacity-15 rounded-lg hover:bg-opacity-30 duration-300"
    >
      {title}
    </Link>
  );
};

export default GlassButton;
