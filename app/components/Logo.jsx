import React from "react";

import Image from "next/image";
import logo from "../assets/images/logo.png";
import { fadeAnimation } from "../utils/motion";

import * as motion from "framer-motion/client";

const Logo = () => {
  return (
    <motion.div {...fadeAnimation(0.1)}>
      <Image
        src={logo}
        alt="BITS Pilani"
        className="fixed top-20 left-20 max-w-20 z-10"
      />
    </motion.div>
  );
};

export default Logo;
