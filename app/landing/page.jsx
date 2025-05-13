import React from "react";
import Navbar from "../components/Navbar";
import Logo from "../components/Logo";
import GlassButton from "../components/GlassButton";
import Image from "next/image";
import object from "../assets/images/object.png";
import plant from "../assets/images/plants.gif";
import mainSidePic from "../assets/images/pose.gif";
import Link from "next/link";

import {
  fadeAnimation,
  headTextAnimation,
  slideAnimation,
} from "../utils/motion";
import * as motion from "framer-motion/client";

const Landing = () => {
  return (
    <div className="flex flex-row w-full bg bg-fixed relative backdrop-blur-sm min-h-screen">
      <Logo />

      <div className="flex flex-col justify-center items-start w-[60%] p-16 backdrop-blur-[1px]">
        <motion.h1
          {...slideAnimation("left", 0)}
          className="font-bold text-brokenWhite text-[6rem] leading-[6rem]"
        >
          Saarthi <br />
        </motion.h1>
        <motion.h3
          className="text-brokenWhite font-extralight text-[1.5rem] leading-8 pt-8"
          {...slideAnimation("left", 0.1)}
        >
          Spiritual Answers, Just a Click Away!
        </motion.h3>
        <motion.div
          className="flex items-center justify-start py-10"
          {...slideAnimation("left", 0.2)}
        >
          <GlassButton title="Start Now" to="./upload" />
        </motion.div>
      </div>

      <motion.div
        className="std flex-col w-[33%] bg-brokenWhite text-brokenWhite overflow-scroll"
        {...slideAnimation("right", 0)}
      >
        <motion.div
          className="h-[40%] w-full flex justify-center items-end"
          {...slideAnimation("up", 0.3)}
        >
          <Image src={mainSidePic} className="w-3/4" />
        </motion.div>
        <motion.div className="h-[60%] w-full bg-violet-600 flex flex-col items-center font-light">
          <Image src={plant} className="w-2/3" />
          <motion.h3 {...fadeAnimation(0.5)}>
            Login to accesss all features
          </motion.h3>
          <motion.div className="py-8" {...fadeAnimation(0.5)}>
            <Link
              href="./auth/login"
              className={`px-12 py-2 backdrop-blur-sm border-[1px] border-brokenWhite bg-brokenWhite text-darkGreen rounded-lg hover:text-brokenWhite hover:bg-violet-400 hover:border-parrot duration-300 font-medium`}
            >
              Log In
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
      <Navbar />
    </div>
  );
};

export default Landing;
