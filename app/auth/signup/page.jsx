"use client";

import { useState } from "react";
import PrimaryInput from "../../components/PrimaryInput";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "../../components/Logo";
import Navbar from "../../components/Navbar";
import profileIcon from "../../assets/images/profile-icon.png";
import backIcon from "../../assets/images/back-icon.png";
import PrimaryButton from "../../components/PrimaryButton";
import passwordIcon from "../../assets/images/eye-icon.png";
import darkLogo from "../../assets/images/logo-dark.png";
import plants2 from "../../assets/images/plants2.png";
import posepic from "../../assets/images/medipic.gif";
import { motion } from "framer-motion";
import { slideAnimation } from "../../utils/motion";
import Image from "next/image";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Simple email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    // Password length validation
    if (password.length < 6) {
      setError("Password cannot contain less than 6 characters.");
      return;
    }
  
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username, mode }),
      });
  
      // Check if the response is OK and has content
      if (!response.ok) {
        throw new Error("Failed to sign up. Please try again.");
      }
  
      // Check if there's any content to parse
      const text = await response.text();
      const data = text ? JSON.parse(text) : {}; // Parse JSON if it's not empty
  
      if (data.error) {
        setError(data.error); // Display error message from server
      } else {
        console.log("Sign-up successful");
        router.push("/auth/login"); // Redirect to the sign-in page
      }
    } catch (error) {
      setError(error.message || "An error occurred during sign-up."); // Handle any other errors
    }
  };
  

  return (
    <div className="flex flex-row w-full bg bg-fixed relative backdrop-blur-sm min-h-screen">
      <Logo />
      <div className="std w-full h-screen backdrop-blur-[1px]">
        <motion.div
          className="w-1/2 min-h-[75%] bg-brokenWhite self-end rounded-t-[2rem] relative std flex-col"
          {...slideAnimation("up", 0, 2)}
        >
          <Image src={posepic} className="absolute left-0 bottom-0 w-1/3" />

          <Link
            href="/landing"
            className="w-10 h-10 bg-violet-800 absolute top-8 left-8 rounded-lg std hover:bg-violet-600 duration-300"
          >
            <Image src={backIcon} className=" hover:animate-pulse" />
          </Link>

          <p className="text-violet-900 font-semibold text-5xl mb-[2%] mt-[6%]">
            Hi!
          </p>
          <p className="text-violet-800 font-light text-2xl">
          Register yourself with us
          </p>  

          
          <div className="w-3/5">
            <form onSubmit={handleSubmit} className="p-4">
              {error && <p className="text-red-500">{error}</p>}
              <PrimaryInput
                  placeholder="Username"
                  color="darkGreen"
                  bgColor="rgb(124, 69, 133)"
                  type="text"
                  profileIcon={profileIcon}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
              />
              <PrimaryInput
                placeholder="Email"
                color="darkGreen"
                bgColor="rgb(124, 69, 133)"
                type="Email"
                profileIcon={profileIcon}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PrimaryInput
                placeholder="Password"
                color="darkGreen"
                bgColor="rgb(124, 69, 133)"
                type="Password"
                profileIcon={passwordIcon}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PrimaryButton
                title="Sign Up"
                color="darkGreen"
                bgColor="rgb(61, 54, 92)"
                onClick={handleSubmit}
              />

              <p className="text-zinc-800 mt-2">
                Already have an account?
                <Link
                  href="./login"
                  className="underline text-violet-800 font-semibold ml-2 duration-500 hover:text-violet-600"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
