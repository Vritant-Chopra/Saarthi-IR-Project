"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "../../../slices/userSlice";
import React from "react";
import Logo from "../../components/Logo";
import Navbar from "../../components/Navbar";
import PrimaryInput from "../../components/PrimaryInput";
import profileIcon from "../../assets/images/profile-icon.png";
import passwordIcon from "../../assets/images/eye-icon.png";
import darkLogo from "../../assets/images/logo-dark.png";
import backIcon from "../../assets/images/back-icon.png";
import plants2 from "../../assets/images/plants2.png";
import posepic from "../../assets/images/medipic.gif";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { slideAnimation } from "../../utils/motion";
import PrimaryButton from "../../components/PrimaryButton";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Sign in using credentials
    const result = await signIn("credentials", {
      redirect: false, // Prevent auto-redirect
      email,
      password,
    });
  
    console.log("Sign-in result:", result);
  
    if (result.error) {
      setError(result.error); // Display error message
      console.log("Sign-in error:", result.error); // Log error for debugging
    } else {
      // Fetch user data, including mode, from your database/API
      const userResponse = await fetch("/api/auth/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!userResponse.ok) {
        const errorMessage = await userResponse.text();
        console.error("API Error:", errorMessage);
        throw new Error("Unable to fetch user details. Try again!");
      }
      
      const userData = await userResponse.json();
  
      if (userResponse.ok) {
        const { username, mode } = userData;
  
        // Dispatch user details to Redux
        dispatch(setUser({ username, email, mode }));
  
        console.log("Sign-in successful. Mode:", mode);
  
        // Redirect based on mode
        if (mode === "super") {
          router.push("/admin"); // Admin page for super users
        } else {
          router.push("/upload"); // Upload page for normal users
        }
      } else {
        setError("Unable to fetch user details. Try again!");
        console.error("Error fetching user data:", userData.error);
      }
    }
  };
  

  return (
    <div className="flex flex-row w-full bg bg-fixed relative backdrop-blur-sm min-h-screen">
      <Logo />
      <div className="std w-full h-screen backdrop-blur-[1px]">
        <motion.div
          className="w-1/2 min-h-[75%] bg-brokenWhite self-end rounded-t-[2rem] relative flex flex-col items-center pt-12"
          {...slideAnimation("up", 0, 2)}
        >
          <Image src={posepic} className="absolute left-0 bottom-0 w-1/3" />
          <Link
            href="/landing"
            className="w-10 h-10 bg-violet-800 absolute top-8 left-8 rounded-lg std hover:bg-violet-600 duration-300"
          >
            <Image src={backIcon} className=" hover:animate-pulse" />
          </Link>

          

          <p className="text-violet-900 font-semibold text-5xl mb-[2%] mt-[8%]">
            Welcome Back!
          </p>
          <p className="text-violet-800 font-light text-2xl mb-[4%]">
            We’re so excited to see you again
          </p>

          <div className="w-3/5">
            <form onSubmit={handleSubmit} className="flex flex-col">
              {error && (
                <p className="text-red-500 font-semibold">Try Again!! </p>
              )}
              <PrimaryInput
                  type="text"
                  placeholder="username"
                  color="darkGreen"
                  bgColor="rgb(124, 69, 133)"
                  profileIcon={profileIcon}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
              />
              <PrimaryInput
                type="email"
                placeholder="Email"
                color="darkGreen"
                bgColor="rgb(124, 69, 133)"
                profileIcon={profileIcon}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PrimaryInput
                type="password"
                placeholder="Password"
                color="darkGreen"
                bgColor="rgb(124, 69, 133)"
                profileIcon={passwordIcon}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PrimaryButton
                title="Login"
                color="darkGreen"
                bgColor="rgb(61, 54, 92)"
                onClick={handleSubmit}
              />

              <p className="text-zinc-800 mt-2">
                Dont have an account?{" "}
                <Link
                  href="./signup"
                  className="underline text-violet-800 font-semibold ml-2 duration-500 hover:text-violet-600"
                >
                  Register
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
