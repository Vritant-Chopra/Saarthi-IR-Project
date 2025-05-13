import Link from "next/link";
import React from "react";

// icon
import { FaSearch } from "react-icons/fa";
// image
import Image from "next/image";
import bitsp from "../assets/images/BITSP.png";

import * as motion from "framer-motion/client";
import { fadeAnimation } from "../utils/motion";

const navLinks = [
  { href: "/auth/login", label: "Login" },
  { href: "/upload", label: "Upload" },
  { href: "/developer", label: "Developers" },
];

const Navbar = () => {
  return (
    <nav className="w-[7%] flex flex-col bg-violet-800 h-screen overflow-hidden fixed right-0 top-0 z-10">
      {/* search bar */}
      <div className="w-full aspect-square std bg-brokenWhite text-darkGreen border border-pine">
        <FaSearch className="text-darkGreen text-3xl hover:scale-125 duration-500" />
      </div>

      {/* links */}
      <motion.div
        className="flex flex-col items-center justify-around h-[80%] text-brokenWhite font-extralight"
        {...fadeAnimation(0.1)}
      >
        {navLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="rotate-90 relative duration-500 hover:scale-125 hover:text-[#9acd32]"
          >
            {link.label}
          </Link>
        ))}
      </motion.div>

      {/* logo */}
      <div className="w-full std !aspect-square bg-brokenWhite border border-pine">
        <motion.div className="std" {...fadeAnimation(0.2)}>
          <Image
            src={bitsp}
            className="w-3/5 aspect-square drop-shadow-[0_10px_13px_rgba(0,0,0,0.99)] hover:scale-110 duration-500"
          />
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;
