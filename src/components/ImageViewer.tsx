import React, { useState, useEffect } from 'react';

interface ImageData {
    doorId: string;
    photoList: string;
}

interface ImageViewerProps {
    doorId: string;
    images: ImageData[];
}

const hexStringToByteArray = (hexString: string) => {
    hexString = hexString.replace(/;/g, '');
    const byteArray = [];
    for (let i = 0; i < hexString.length; i += 6) {
        const pixel = hexString.substr(i, 6);
        byteArray.push(parseInt(pixel.substr(0, 2), 16));
        byteArray.push(parseInt(pixel.substr(2, 2), 16));
        byteArray.push(parseInt(pixel.substr(4, 2), 16));
    }
    return byteArray;
};

const ImageViewer: React.FC<ImageViewerProps> = ({ doorId, images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [doorToOpen, setDoorToOpen] = useState<string>('');

    useEffect(() => {
        if (images.length > 0) {
            const processImage = () => {
                const hexString = images[currentImageIndex].photoList;
                const rows = hexString.split(';');
                const height = rows.length;
                const width = rows[0].length / 6;
                const resizeFactor = 1;
                const newWidth = width * resizeFactor;
                const newHeight = height * resizeFactor;
                const byteArray = hexStringToByteArray(hexString);
                const imgData = new Uint8ClampedArray(newWidth * newHeight * 4);

                for (let i = 0; i < byteArray.length; i += 3) {
                    const row = Math.floor(i / (width * 3));
                    const col = Math.floor((i % (width * 3)) / 3);
                    const idx = (row * newWidth + col) * 4;
                    imgData[idx] = byteArray[i];
                    imgData[idx + 1] = byteArray[i + 1];
                    imgData[idx + 2] = byteArray[i + 2];
                    imgData[idx + 3] = 255;
                }

                const canvas = document.createElement('canvas');
                canvas.width = newWidth;
                canvas.height = newHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error('Could not get canvas context');

                const imageData = new ImageData(imgData, newWidth, newHeight);
                ctx.putImageData(imageData, 0, 0);
                const dataURL = canvas.toDataURL();
                setImageSrc(dataURL);
            };

            processImage();
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, 50);

            return () => clearInterval(interval);
        }
    }, [images, currentImageIndex]);

    const sendOpenSignal = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/openSignal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ open: "true", doorId })
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

    const sendDoorToOpen = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/doors/door-to-open', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ doorId: parseInt(doorToOpen) })
            });

            if (!response.ok) {
                throw new Error('Failed to send door to open');
            }

            const result = await response.json();
            console.log('Door to open sent successfully:', result);
            setDoorToOpen('');
        } catch (error) {
            console.error('Error sending door to open:', error);
        }
    };

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">Door ID: {doorId}</h2>
            {imageSrc ? (
                <img src={imageSrc} alt={`Live feed for Door ${doorId}`} className="max-w-full mb-2" />
            ) : (
                <p>Loading...</p>
            )}
            <div className="flex space-x-4 mb-4">
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
            pr-12"
                >
                    Send Open Signal
                </button>
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        value={doorToOpen}
                        onChange={(e) => setDoorToOpen(e.target.value)}
                        placeholder="Enter door ID"
                        className="p-2 border rounded"
                    />
                    <button
                        onClick={sendDoorToOpen}
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
              p-3"
                    >
                        Open Door
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageViewer;

