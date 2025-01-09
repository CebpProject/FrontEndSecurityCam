import React, { useState, useEffect } from 'react';

interface CustomImageData {
    doorId: string;
    photoList: string;
}

interface ImageViewerProps {
    doorId: string;
    imageData: CustomImageData;
}

const hexStringToByteArray = (hexString: string): number[] => {
    const cleanHexString = hexString.replace(/;/g, '');
    const byteArray: number[] = [];
    for (let i = 0; i < cleanHexString.length; i += 6) {
        const pixel = cleanHexString.substr(i, 6);
        byteArray.push(parseInt(pixel.substr(0, 2), 16));
        byteArray.push(parseInt(pixel.substr(2, 2), 16));
        byteArray.push(parseInt(pixel.substr(4, 2), 16));
    }
    return byteArray;
};

const ImageViewer: React.FC<ImageViewerProps> = ({ doorId, imageData }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [doorToOpen, setDoorToOpen] = useState<string>('');

    useEffect(() => {
        const processImage = () => {
            const hexString: string = imageData.photoList;
            const rows: string[] = hexString.split(';');
            const height: number = rows.length;
            const width: number = rows[0].length / 6;
            const resizeFactor: number = 1;
            const newWidth: number = width * resizeFactor;
            const newHeight: number = height * resizeFactor;

            const byteArray: number[] = hexStringToByteArray(hexString);
            const imgData: Uint8ClampedArray = new Uint8ClampedArray(newWidth * newHeight * 4);

            for (let i = 0; i < byteArray.length; i += 3) {
                const row: number = Math.floor(i / (width * 3));
                const col: number = Math.floor((i % (width * 3)) / 3);
                const idx: number = (row * newWidth + col) * 4;
                imgData[idx] = byteArray[i];
                imgData[idx + 1] = byteArray[i + 1];
                imgData[idx + 2] = byteArray[i + 2];
                imgData[idx + 3] = 255;
            }

            const canvas: HTMLCanvasElement = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            const canvasImageData: ImageData = new ImageData(imgData, newWidth, newHeight);
            ctx.putImageData(canvasImageData, 0, 0);
            const dataURL: string = canvas.toDataURL();
            setImageSrc(dataURL);
        };

        processImage();
    }, [imageData]);

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
                <button onClick={sendOpenSignal} className="relative bg-accent-dark rounded-md outline-none shadow-[0_3px_0px_0px_rgba(255,255,255)] font-extrabold hover:bg-accent hover:shadow-[0_2px_0px_0px_rgba(255,255,255)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition duration-[100] ease-in-out text-center justify-center p-3 pl-12 pr-12">
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
                    <button onClick={sendDoorToOpen} className="relative bg-accent-dark rounded-md outline-none shadow-[0_3px_0px_0px_rgba(255,255,255)] font-extrabold hover:bg-accent hover:shadow-[0_2px_0px_0px_rgba(255,255,255)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition duration-[100] ease-in-out text-center justify-center p-3">
                        Open Door
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageViewer;

