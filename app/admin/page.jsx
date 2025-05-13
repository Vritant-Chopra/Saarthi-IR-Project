"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useSelector, useDispatch} from 'react-redux';
import React from 'react';
import Image from 'next/image';
import Link from "next/link";
import {Carousel} from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import logo from "../assets/images/logo.png";
import backIcon from "../assets/images/back-icon.png";

import {
    setGroupedImages,
    setModifiedData,
    resetModifiedData,
} from '../../slices/imageSlice';

export default function Admin() {
    const user = useSelector((state) => state.user);
    const groupedImages = useSelector((state) => state.images.groupedImages);
    const modifiedData = useSelector((state) => state.images.modifiedData);
    const dispatch = useDispatch();
    const router = useRouter();

    // Redirect to login if the user is not logged in
    useEffect(() => {
        if (!user.username) {
            console.log("User not logged in. Redirecting to login.");
            alert("Please log in first.");
            router.push("/auth/login");
        } else {
            console.log("User is logged in:", user.username);
        }
    }, [user, router]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                console.log("Fetching images from /api/getImages...");
                const response = await fetch('/api/getImages');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched images data:", data);

                // Dispatch the action to set grouped images
                dispatch(setGroupedImages(data));
                console.log("Grouped images set in Redux store.");
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, [dispatch]);

    // Handle input changes
    const handleInputChange = (imageId, key, value) => {
        console.log(`Input change for imageId: ${imageId}, key: ${key}, value: ${value}`);
        dispatch(setModifiedData({
            ...modifiedData,
            [imageId]: {
                ...(modifiedData[imageId] || {}),
                [key]: value,
            },
        }));
        console.log("Modified data updated:", modifiedData);
    };

    // function to handle verification per date group
    const handleVerifyByDate = async (date) => {
        try {
            console.log(`Verifying data for date: ${date}`);

            // Get all image IDs for the specified date
            const imagesForDate = groupedImages[date];
            const imageIds = imagesForDate.map((image) => image.id);

            // Prepare data to save for the specified date
            const dataToSave = imagesForDate.map((image) => {
                const id = image.id;
                // Merge the original key_value_pairs with the modified data
                const updatedKeyValuePairs = image.key_value_pairs.map((pair) => {
                    const modifiedValue = modifiedData[id]?.[pair.key];
                    return {
                        key: pair.key,
                        value: modifiedValue !== undefined ? modifiedValue : pair.value,
                    };
                });

                // Prepare the data to save
                const dataItem = {
                    imageInfoId: id, // foreign key reference
                    username: image.username,
                    upload_date: image.upload_date,
                    image_name: image.image_name,
                    image_size: image.image_size,
                    image_type: image.image_type,
                    key_value_pairs: updatedKeyValuePairs,
                    image_data: image.image_data,
                };

                console.log(`Data item prepared for saving (ID: ${id}):`, dataItem);

                return dataItem;
            });

            console.log("Data to save:", dataToSave);

            const response = await fetch('/api/saveFinalData', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dataToSave),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Data saved:', result);
            alert(`Data for ${date} has been verified and saved.`);

            const newModifiedData = {...modifiedData};
            imageIds.forEach((id) => {
                delete newModifiedData[id];
            });
            dispatch(setModifiedData(newModifiedData));
            console.log("Modified data after saving:", newModifiedData);
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data. Please try again.');
        }
    };

    const indicatorStyles = {
        background: '#9cd329',
        width: 12,
        height: 12,
        borderRadius: 6,
        display: 'inline-block',
        margin: '0 8px',
    };

    return (
        <div
            className="flex flex-col w-full bg bg-fixed relative backdrop-blur-sm min-h-screen items-center justify-center">
            {/*<Image src={plants2} className="fixed left-0 bottom-0 w-1/5" alt="Plants" />*/}
            <Image src={logo} className="fixed right-8 top-8 w-[3%] z-10" alt="Logo"/>
            <Link
                href="/landing"
                className="w-10 h-10 bg-pine text-darkGreen absolute top-8 left-8 rounded-lg std hover:bg-darkGreen duration-300"
            >
                <Image src={backIcon} className="hover:animate-pulse" alt="Back"/>
            </Link>

            <div className="m-4">
                {user.username ? (
                    <p className="text-brokenWhite font-semibold text-5xl mb-[2%] pt-4 flex items-center justify-center">
                        Welcome, {user.username}!
                    </p>
                ) : (
                    <p className="text-darkGreen font-semibold text-5xl mb-[2%]">
                        Hi!
                    </p>
                )}
            </div>

            {/* Display images grouped by upload date */}
            {groupedImages && Object.keys(groupedImages).length > 0 ? (
                Object.keys(groupedImages).map((date) => {
                    console.log(`Rendering images for date: ${date}`);
                    return (
                        <div key={date}
                             className="my-8 bg-brokenWhite w-3/5 rounded-[2rem] flex items-center justify-center flex-col">
                            <h2 className="text-3xl font-bold m-4 text-darkGreen">{date}</h2>
                            <Carousel
                                showThumbs={false}
                                showArrows={true}
                                autoPlay={true}
                                renderIndicator={(onClickHandler, isSelected, index, label) => {
                                    if (isSelected) {
                                        return (
                                            <li
                                                style={{...indicatorStyles, background: '#093923'}}
                                                aria-label={`Selected: ${label} ${index + 1}`}
                                                title={`Selected: ${label} ${index + 1}`}
                                            />
                                        );
                                    }
                                    return (
                                        <li
                                            style={indicatorStyles}
                                            onClick={onClickHandler}
                                            onKeyDown={onClickHandler}
                                            value={index}
                                            key={index}
                                            role="button"
                                            tabIndex={0}
                                            title={`${label} ${index + 1}`}
                                            aria-label={`${label} ${index + 1}`}
                                        />
                                    );
                                }}
                            >
                                {groupedImages[date].map((image) => {
                                    console.log("Rendering image:", {
                                        id: image.id,
                                        image_name: image.image_name,
                                        image_type: image.image_type,
                                        image_data_length: image.image_data ? image.image_data.length : 'No image_data',
                                    });
                                    const imageSrc = `data:${image.image_type};base64,${image.image_data}`;

                                    return (
                                        <div key={image.id}
                                             className="p-4 flex flex-col items-center justify-center text-darkGreen">
                                            {/* Render Image */}
                                            <div className="w-full h-[30rem] overflow-auto rounded-3xl">
                                                <img
                                                    src={imageSrc}
                                                    alt={image.image_name}
                                                    className="w-full h-auto object-contain rounded-3xl"
                                                    onError={(e) => {
                                                        console.error("Error loading image:", e);
                                                        e.target.src = "/path/to/placeholder.jpg"; // Use a placeholder image if available
                                                    }}
                                                />
                                            </div>
                                            {/* Display Image Details */}
                                            <p>Image Name: {image.image_name}</p>
                                            <p>Image Type: {image.image_type}</p>
                                            {/*<p>Image Size: {image.image_size}</p>*/}
                                            {/*<p>Image Data*/}
                                            {/*    Length: {image.image_data ? image.image_data.length : 'No image_data'}</p>*/}
                                            {/* Editable input fields */}
                                            <div className="m-4">
                                                {image.key_value_pairs.map((pair) => (
                                                    <div key={pair.key}
                                                         className="mb-2 flex gap-4 items-center justify-center">
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            {pair.key}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                modifiedData[image.id]?.[pair.key] !== undefined
                                                                    ? modifiedData[image.id][pair.key]
                                                                    : pair.value
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(image.id, pair.key, e.target.value)
                                                            }
                                                            className="border border-darkGreen text-sm rounded-md block w-full ps-2 p-1 py-1 focus:outline-none text-darkGreen"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </Carousel>
                            {/* Verify Button for this date group */}
                            <div className="m-4 flex justify-center">
                                <button
                                    onClick={() => handleVerifyByDate(date)}
                                    className="px-12 py-3 border-[1px] border-brokenWhite text-brokenWhite bg-darkGreen rounded-lg hover:text-brokenWhite hover:bg-pine duration-300 font-medium"
                                >
                                    Verify for {date}
                                </button>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>No images to display.</p>
            )}
        </div>
    );
}
