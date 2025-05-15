"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from 'react-redux';
import React from 'react';
import Logo from '../components/Logo';
import Image from 'next/image';
import { NextResponse } from 'next/server';
import PrimaryInput from '../components/PrimaryInput';
import PrimaryButton from "../components/PrimaryButton.jsx";
import profileIcon from "../assets/images/profile-icon.png";
import nameIcon from "../assets/images/nameIcon.png";
import dateIcon from "../assets/images/dateIcon.png";
import fileIcon from "../assets/images/fileIcon.png";
import textIcon from "../assets/images/textIcon.png";
import commentIcon from "../assets/images/commentIcon.png";
import plants2 from "../assets/images/plants2.png";
import posepic from "../assets/images/medipic.gif";
import blurbgphoto from "../assets/images/krishna-arjun.png";
import Link from "next/link";
import backIcon from "../assets/images/back-icon.png";
import darkLogo from "../assets/images/logo-dark.png";
import { SlCalender } from "react-icons/sl";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import {
  fadeAnimation,
  headTextAnimation,
  slideAnimation,
} from "../utils/motion";
import * as motion from "framer-motion/client";

export default function Upload() {
  const user = useSelector((state) => state.user);
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const invalidFiles = selectedFiles.filter(file => !validImageTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setError("Only image files (jpeg, png, gif) are allowed.");
      return;
    }

    setFiles(selectedFiles);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("➡️ Query to Flask:", query);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      console.log("Flask response:", data);

      console.log("Filenames sent to Prisma API:", data.results);

      if (data.status === "success") {
        const filenames = data.results;

        const prismaRes = await fetch("/api/getDocs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filenames }),
        });

        const prismaData = await prismaRes.json();
        console.log("Prisma response:", prismaData);

        if (prismaData.status === "success") {
          setResults(prismaData.results);
        } else {
          console.error("Prisma API error:", prismaData.message);
        }
      } else {
        console.error("Flask error:", data.message);
      }

    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <div className="flex flex-col w-full bg bg-fixed relative backdrop-blur-sm min-h-screen">
      <Logo />

      <form onSubmit={handleSubmit} className="flex flex-row w-3/4 mx-auto items-center gap-4">
        <div className="flex flex-row w-3/4 mx-auto items-center gap-4 px-8 py-8 mt-40">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 start-0 flex items-center px-4 py-4 pointer-events-none">
              <Image src={profileIcon} className="w-8 h-8" alt="" />
            </div>
            <input
              type="text"
              id="input-group-1"
              style={{ backgroundColor: "rgb(124, 69, 133)" }}
              className="w-full ps-16 p-3.5 text-sm border border-brokenWhite rounded-lg focus:outline-none placeholder:text-brokenWhite placeholder:opacity-35"
              placeholder="Enter your Query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <button
            type="submit"
            style={{ backgroundColor: "rgb(61, 54, 92)" }}
            className="px-8 py-3 border-[1px] border-brokenWhite rounded-lg hover:text-brokenWhite hover:bg-violet-800 duration-300 font-medium"
          >
            Search
          </button>
        </div>
      </form>

      <div className="h-screen flex flex-col items-center">
        <motion.div
          className="h-auto w-3/4 p-10 overflow-y-scroll bg-brokenWhite self-center rounded-t-[2rem] rounded-b-[2rem] relative std flex-col items-start justify-start"
          {...slideAnimation("up", 0, 2)}
        >


          <Link
            href="/landing"
            className="w-10 h-10 bg-violet-900 absolute top-8 left-8 rounded-lg std hover:bg-violet-800 duration-300"
          >
            <Image src={backIcon} className="hover:animate-pulse" alt="Back" />
          </Link>

          {user.username ? (
            <p className="text-violet-900 font-semibold text-5xl mb-[2%]">
              Welcome, {user.username}!
            </p>
          ) : (
            <p className="mt-8 text-violet-900 font-semibold text-5xl mb-[2%]">
              Hi
            </p>
          )}

          {results.length === 0 ? (
            <p className="text-violet-800 font-light text-2xl">
              Your Documents will be displayed here!
            </p>
          ) : (
            <div className="">
              <p className="text-violet-900 text-2xl font-medium mt-4 text-center">Matching Documents:</p>
              <div className="p-4 grid grid-flow-row grid-cols-5">

                {results.map((doc, index) => (
                  <Link
                    href={doc.doc_link}
                    className="text-violet-800 text-lg text-center hover:bg-gray-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div key={index} className="my-2">
                      <Image src={fileIcon} className="w-[10vw] items-center p-10"></Image>
                    </div>
                    {doc.title || `Document ${index + 1}`}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
