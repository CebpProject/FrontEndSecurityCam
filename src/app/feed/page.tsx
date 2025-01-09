"use client";

import { useEffect, useState } from 'react';
import ImageViewer from '../../components/ImageViewer';

interface CustomImageData {
    doorId: string;
    photoList: string;
}

const FeedPage = () => {
    const [feeds, setFeeds] = useState<{ [key: string]: CustomImageData }>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/unprocesedImageInput');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data: CustomImageData = await response.json();
                setFeeds(prevFeeds => ({
                    ...prevFeeds,
                    [data.doorId]: data
                }));
            } catch (error) {
                console.error('Error fetching image data:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 50); // Fetch every 50ms
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Live Image Viewer</h1>
            {Object.entries(feeds).map(([doorId, imageData]) => (
                <ImageViewer key={doorId} doorId={doorId} imageData={imageData} />
            ))}
        </div>
    );
};

export default FeedPage;

