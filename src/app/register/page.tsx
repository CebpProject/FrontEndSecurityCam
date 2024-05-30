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
            const response = await fetch('http://localhost:8080/api/groundTruthPhotos', {
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
        <div>
            <h1>Image Upload</h1>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <input type="text" placeholder="Enter Name" value={name} onChange={handleNameChange} />
            <button onClick={processImage} disabled={!file || !name || processing}>
                {processing ? 'Processing...' : 'Process Image'}
            </button>
            {processedData && (
                <div>
                    <h2>Processed Data</h2>
                    <textarea value={processedData} rows={10} cols={50} readOnly />
                </div>
            )}
        </div>
    );
}
