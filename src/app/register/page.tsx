"use client"
import { useState } from 'react';

export default function ImageUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState<string>('');
    const [processing, setProcessing] = useState<boolean>(false);
    const [processedData, setProcessedData] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setProcessedData('');
        }
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const processImage = async () => {
        if (!file || !name) return;

        setProcessing(true);

        try {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                    // Accessing the RGB values
                    const rgbData = [];
                    for (let i = 0; i < imageData.height; i++) {
                        const row = [];
                        for (let j = 0; j < imageData.width; j++) {
                            const index = (i * imageData.width + j) * 4;
                            const red = imageData.data[index];
                            const green = imageData.data[index + 1];
                            const blue = imageData.data[index + 2];
                            row.push(red.toString(16).padStart(2, '0') + green.toString(16).padStart(2, '0') + blue.toString(16).padStart(2, '0'));
                        }
                        rgbData.push(row.join(''));
                    }

                    // Convert RGB data to hex string with ";" between rows
                    const hexString = rgbData.join(';');

                    setProcessedData(hexString);
                    setProcessing(false);

                    // Send data to API
                    sendDataToAPI(hexString);
                }
            };
        } catch (error) {
            console.error('Error processing image:', error);
            setProcessing(false);
        }
    };

    const sendDataToAPI = async (data: string) => {
        try {
            const response = await fetch('https://50.17.118.62:8080/api/groundTruthPhotos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: 0,
                    photoList: data,
                    name: name,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send data to API');
            }

            console.log('Data sent to API successfully');
        } catch (error) {
            console.error('Error sending data to API:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background-alt">
            <h1 className="text-3xl font-bold mb-6">Image Upload</h1>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block text-center
                    border-2
                    border-white
                    border-solid
                    bg-background-alt
                    font-bold
                    rounded-md
                    hover:border-primary
                    focus:border-primary
                    transition duration-[100] ease-in-out
                    mb-4"
            />
            <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={handleNameChange}
                className="block text-center
                    border-2
                    border-white
                    border-solid
                    bg-background-alt
                    font-bold
                    rounded-md
                    hover:border-primary
                    focus:border-primary
                    transition duration-[100] ease-in-out
                    mb-4"
            />
            <button
                onClick={processImage}
                disabled={!file || !name || processing}
                className={`bg-background-alt
                    rounded-md
                    outline-none
                    shadow-[0_3px_0px_0px_rgba(255,255,255)]
                    font-extra bold
                    hover:bg-primary
                    hover:shadow-[0_2px_0px_0px_rgba(255,255,255)]
                    hover:translate-y-[2px]
                    active:shadow-none
                    active:translate-y-[4px]
                    transition duration-[100] ease-in-out
                    text-center
                    justify-center
                    p-3
                    ${processing ? 'bg-gray-400' : 'bg-primary-dark hover:bg-blue-600'}`}
            >
                {processing ? 'Processing...' : 'Process Image'}
            </button>
            {processedData && (
                <div className="w-full max-w-xs">
                    <h2 className="text-xl font-bold mb-2">Processed Data</h2>
                    <textarea
                        value={processedData}
                        rows={10}
                        cols={50}
                        readOnly
                        className="w-full p-2 border border-gray-300 bg-background rounded"
                    />
                </div>
            )}
        </div>
    );
}
