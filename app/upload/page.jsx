"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from 'react-redux';
import React from 'react';
import Logo from '../components/Logo';
import Image from 'next/image';
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
import blurbgphoto from "../assets/images/krishna-arjun.png"
import Link from "next/link";
import backIcon from "../assets/images/back-icon.png";
import darkLogo from "../assets/images/logo-dark.png";
import { SlCalender } from "react-icons/sl";

import {
  fadeAnimation,
  headTextAnimation,
  slideAnimation,
} from "../utils/motion";
import * as motion from "framer-motion/client";

export default function Upload() {

  const user = useSelector((state) => state.user);
  const router = useRouter();
  console.log(user);

  // Redirecting to login if the user is not logged in
  // useEffect(() => {
  //   if (!user.username) {
  //     alert("Please log in first.");
  //     router.push("/auth/login");
  //   }
  // }, [user, router]);

  const [name, setName] = useState(user.username);
  const [query, setQuery] = useState("");
  const [dates, setDates] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Files updated:", files);
  }, [files]);

  // Handle file input change for multiple files
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Client-side validation to ensure only image files are allowed
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const invalidFiles = selectedFiles.filter(file => !validImageTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setError("Only image files (jpeg, png, gif) are allowed.");
      return;
    }

    setFiles(selectedFiles);
    console.log("Selected Files:", selectedFiles);
    setError(null);
  };

  const [keyValuePairs, setKeyValuePairs] = useState([]);
  const [addClicked, setAddClicked] = useState(false);  // Tracking initial add button click

  useEffect(() => {
    setAddClicked(false);  // Reset the state on component mount or page reload
  }, []);

  // Function to add a new key-value pair
  const addKeyValuePair = () => {
    if (addClicked === false) {
      // Add only one key-value pair on the first click
      setKeyValuePairs([...keyValuePairs, { key: "", value: "" }]);
      setAddClicked(true);  // Set flag to true after the first click
    } else {
      setKeyValuePairs([...keyValuePairs, { key: "", value: "" }]);
    }
  };

  const deleteKeyValuePair = (index) => {
    const updatedPairs = [...keyValuePairs];
    updatedPairs.splice(index, 1);  // Remove the pair at the given index
    setKeyValuePairs(updatedPairs);
  };

  const handleKeyValueChange = (index, type, value) => {
    if (keyValuePairs[index]) {
      const updatedPairs = [...keyValuePairs];
      updatedPairs[index][type] = value;
      setKeyValuePairs(updatedPairs);
    }
  };

  const date = new Date();
  const showDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  const formatDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;

  // Function to convert a file to a base64 string
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1]; // Remove data prefix
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setError("Please select at least one image file to upload.");
      return;
    }

    try {
      // Convert all files to base64
      const filesWithBase64 = await Promise.all(files.map(async (file) => {
        const base64 = await convertFileToBase64(file);
        return {
          image_name: file.name,
          image_size: file.size.toString(),
          image_type: file.type,
          image_data: base64,
        };
      }));

      const payload = {
        name: name,
        date: showDate, // Use ISO 8601 format (YYYY-MM-DD)
        keyValuePairs: keyValuePairs,
        images: filesWithBase64,
      };

      console.log("Payload:", payload);

      const response = await fetch("/api/auth/upload", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Upload Response:", data);

      if (data.success) {
        alert("Files uploaded successfully!");
        setFiles([]);
        setKeyValuePairs([]);
      } else {
        setError(data.message || "File upload failed.");
      }
    } catch (error) {
      setError("File upload failed. Please try again.");
      console.error("Upload Error:", error);
    }
  };

  return (
    <div className="flex flex-col w-full bg bg-fixed relative backdrop-blur-sm min-h-screen">
      <Logo />

      <div className="flex flex-row w-3/4 mx-auto items-center gap-4 px-8 py-8 mt-48">
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
          onClick={handleSubmit}
          style={{ backgroundColor: "rgb(61, 54, 92)" }}
          className="px-8 py-3 border-[1px] border-brokenWhite rounded-lg hover:text-brokenWhite hover:bg-violet-800 duration-300 font-medium"
        >
          Search
        </button>
      </div>

      <div className="h-80 flex flex-col items-center">
        <motion.div
          className="flex-grow w-3/4  overflow-y-scroll bg-brokenWhite self-center rounded-t-[2rem] rounded-b-[2rem] relative std flex-col items-center justify-center"
          {...slideAnimation("up", 0, 2)}
        >
          <Image src={posepic} className="absolute left-0 bottom-0 w-1/3" alt="Plants" />

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

          <p className="text-violet-800 font-light text-2xl">
            Your Documents will be displayed here!
          </p>

        </motion.div>
      </div>
    </div>
  )
}
