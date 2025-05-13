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
      <div className="flex flex-row w-full bg bg-fixed relative backdrop-blur-sm min-h-screen">
        <Logo />

        <div className='std w-full mt-16 backdrop-blur-[1px]'>
          <motion.div
              className="w-1/2 min-h-[75%] overflow-y-scroll bg-brokenWhite self-end rounded-t-[2rem] relative std flex-col"
              {...slideAnimation("up", 0, 2)}
          >
            <Image src={plants2} className="absolute left-0 bottom-0 w-1/3" alt="Plants" />

            <Link
                href="/landing"
                className="w-10 h-10 bg-darkGreen absolute top-8 left-8 rounded-lg std hover:bg-pine duration-300"
            >
              <Image src={backIcon} className="hover:animate-pulse" alt="Back" />
            </Link>

            <Image src={darkLogo} className="my-4 w-12" alt="Logo" />


            {user.username ? (
                <p className="text-darkGreen font-semibold text-5xl mb-[2%]">
                  Welcome, {user.username}!
                </p>
            ) : (
                <p className="text-darkGreen font-semibold text-5xl mb-[2%]">
                  Hi!
                </p>
            )}

            <p className="text-darkGreen font-light text-2xl">
              Upload your Images Here
            </p>

            <div className="w-3/5 mb-8">
              <form onSubmit={handleSubmit} className="p-4 py-0">

                {error && <p className="text-red-500">{error}</p>}
                <PrimaryInput
                    placeholder="User Name"
                    color="darkGreen"
                    type="text"
                    profileIcon={profileIcon}
                    value={user.username}
                    readOnly
                />
                <PrimaryInput
                    placeholder="Date"
                    color="darkGreen"
                    type="text"
                    profileIcon={dateIcon}
                    value={showDate}
                    readOnly={true}
                />
                <PrimaryInput
                    placeholder="No Files Chosen"
                    color="darkGreen"
                    type="file"
                    multiple={true}
                    accept="image/*"
                    profileIcon={fileIcon}
                    onChange={handleFileChange}
                />

                {/* Button to add key-value pair */}
                <div className="flex flex-row space-x-10 items-center justify-center">
                  <button
                      type="button"
                      className="my-4 bg-darkGreen text-white py-2 px-4 rounded z-20 relative"
                      onClick={addKeyValuePair}
                  >
                    Add
                  </button>
                  <button
                      type="button"
                      className="my-4 bg-darkGreen text-white py-2 px-4 rounded"
                      onClick={() => {
                        if (keyValuePairs.length > 0) {
                          deleteKeyValuePair(keyValuePairs.length - 1);
                        }
                      }}
                  >
                    Delete
                  </button>
                </div>

                {/* Dynamically added key-value pairs */}
                {keyValuePairs.map((pair, index) => (
                    <div key={index} className="flex space-x-4 mb-4">
                      <PrimaryInput
                          placeholder="Key"
                          color="darkGreen"
                          type="text"
                          profileIcon={textIcon}
                          value={pair.key}
                          onChange={(e) => handleKeyValueChange(index, "key", e.target.value)}
                      />
                      <PrimaryInput
                          placeholder="Value"
                          color="darkGreen"
                          type="text"
                          profileIcon={textIcon}
                          value={pair.value}
                          onChange={(e) => handleKeyValueChange(index, "value", e.target.value)}
                      />
                    </div>
                ))}
                <PrimaryButton
                    title="Upload"
                    color="darkGreen"
                    type="submit"
                />
              </form>
            </div>

          </motion.div>
        </div>

      </div>
  )
}
