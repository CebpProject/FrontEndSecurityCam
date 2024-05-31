// pages/feed.tsx

"use client";

import { useEffect, useState } from 'react';
import cv from '@techstark/opencv-js';

const hexStringToByteArray = (hexString: string) => {
    // Remove semicolons from the hex string
    hexString = hexString.replace(/;/g, '');

    const byteArray = [];
    for (let i = 0; i < hexString.length; i += 6) {
        const pixel = hexString.substr(i, 6); // Each pixel is represented by 6 characters
        byteArray.push(parseInt(pixel.substr(0, 2), 16));
        byteArray.push(parseInt(pixel.substr(2, 2), 16));
        byteArray.push(parseInt(pixel.substr(4, 2), 16));
    }
    return byteArray;
};

const ImageViewer = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://50.17.118.62:8080/api/unprocesedImageInput');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                const hexString = data.photoList;

                // Split the hex string into rows
                const rows = hexString.split(';');
                const height = rows.length;

                // Calculate width based on the number of characters in the first row
                const width = rows[0].length / 6; // 2 characters for each R, G, B pair

                // Resize factors
                const resizeFactor = 1; // Change this value to resize the image

                // Calculate new dimensions
                const newWidth = width * resizeFactor;
                const newHeight = height * resizeFactor;

                // Convert hex string to byte array
                const byteArray = hexStringToByteArray(hexString);

                // Convert the byte array into a Uint8ClampedArray for OpenCV
                const imgData = new Uint8ClampedArray(newWidth * newHeight * 4);
                for (let i = 0; i < byteArray.length; i += 3) {
                    const row = Math.floor(i / (width * 3));
                    const col = Math.floor((i % (width * 3)) / 3);
                    const idx = (row * newWidth + col) * 4;
                    imgData[idx] = byteArray[i];
                    imgData[idx + 1] = byteArray[i + 1];
                    imgData[idx + 2] = byteArray[i + 2];
                    imgData[idx + 3] = 255; // Alpha channel
                }

                // Create a canvas and put the image data into it
                const canvas = document.createElement('canvas');
                canvas.width = newWidth;
                canvas.height = newHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error('Could not get canvas context');

                const imageData = new ImageData(imgData, newWidth, newHeight);
                ctx.putImageData(imageData, 0, 0);

                // Convert canvas to a data URL and set it as the image source
                const dataURL = canvas.toDataURL();
                setImageSrc(dataURL);

            } catch (error) {
                console.error('Error processing image:', error);
            }
        };

        const interval = setInterval(fetchData, 50); // Fetch data every second
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    const sendOpenSignal = async () => {
        try {
            const response = await fetch('http://50.17.118.62:8080/api/openSignal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ open: "true" })
            });

            if (!response.ok) {
                throw new Error('Failed to send open signal');
            }

            const result = await response.json();
            console.log('Open signal sent successfully:', result);
        } catch (error) {
            console.error('Error sending open signal:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Live Image Viewer</h1>
            {imageSrc ? (
                <img src={imageSrc} alt="Live" className="max-w-full" />
            ) : (
                <p>Loading...</p>
            )}
            <button
                onClick={sendOpenSignal}
                className="relative bg-accent-dark
                    rounded-md
                    outline-none
                    shadow-[0_3px_0px_0px_rgba(255,255,255)]
                    font-extrabold
                    hover:bg-accent
                    hover:shadow-[0_2px_0px_0px_rgba(255,255,255)]
                    hover:translate-y-[2px]
                    active:shadow-none
                    active:translate-y-[4px]
                    transition duration-[100] ease-in-out
                    text-center
                    justify-center
                    p-3
                    pl-12
                    pr-12
                    mt-4"
            >
                Send Open Signal
            </button>
        </div>
    );
};

export default ImageViewer;
