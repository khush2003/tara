import React, { useState } from 'react';
import axios from 'axios';
import { client } from '@/store/authStore';


const UploadImage: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl , setImageUrl] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file first');
            return;
        }

        setIsLoading(true);
        try {
            const reader = new FileReader();
            reader.readAsArrayBuffer(selectedFile);

            reader.onload = async () => {
                const arrayBuffer = reader.result;
                
                try {
                    const response = await axios.post<{ url: string }>('/api/v1/image/upload', arrayBuffer, {
                        headers: {
                            'Content-Type': 'application/octet-stream',
                        },
                    });
                    const data = response.data;
                    setImageUrl(data.url);
                } catch (error) {
                    console.error('Upload failed:', error);
                    alert('Upload failed');
                }
            };
        } catch (error) {
            console.error('Error reading file:', error);
            alert('Error reading file');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Image Upload</h1>
            <div className="flex flex-col gap-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border p-2"
                />
                <button
                    onClick={handleUpload}
                    disabled={!selectedFile || isLoading}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                    {isLoading ? 'Uploading...' : 'Upload Image'}
                </button>
                {imageUrl && (
                    <div>
                        <h2>Uploaded Image</h2>
                        <p>{imageUrl}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadImage;