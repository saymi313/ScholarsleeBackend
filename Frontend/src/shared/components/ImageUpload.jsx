import { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({
    type = 'profile', // 'profile' or 'service'
    multiple = false,
    onUploadSuccess,
    currentImage = null,
    maxFiles = 5
}) => {
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (multiple && selectedFiles.length > maxFiles) {
            setError(`Maximum ${maxFiles} files allowed`);
            return;
        }

        setFiles(selectedFiles);
        setError(null);

        // Create previews
        const newPreviews = [];
        selectedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result);
                if (newPreviews.length === selectedFiles.length) {
                    setPreviews(newPreviews);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setError('Please select a file');
            return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();

        if (multiple) {
            files.forEach(file => {
                formData.append('images', file);
            });
        } else {
            formData.append('avatar', files[0]);
        }

        try {
            const endpoint = type === 'profile' ? '/api/upload/profile' : '/api/upload/service';
            const token = localStorage.getItem('token');

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                const urls = response.data.fileUrl || response.data.fileUrls;
                onUploadSuccess(urls);
                setFiles([]);
                setPreviews([]);
            } else {
                setError(response.data.message || 'Upload failed');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'Failed to upload file(s)');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setFiles(newFiles);
        setPreviews(newPreviews);
    };

    return (
        <div className="space-y-4">
            {/* Current Image Display */}
            {currentImage && previews.length === 0 && (
                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                    <img
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${currentImage}`}
                        alt="Current"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                </div>
            )}

            {/* File Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {type === 'profile' ? 'Profile Picture' : 'Service Images'}
                </label>
                <input
                    type="file"
                    accept="image/*"
                    multiple={multiple}
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    disabled={uploading}
                />
                <p className="mt-1 text-xs text-gray-500">
                    {multiple ? `Max ${maxFiles} images, ` : ''}Max 5MB per image (JPEG, PNG, GIF, WEBP)
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Preview */}
            {previews.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Preview:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
                                    disabled={uploading}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Button */}
            <button
                type="button"
                onClick={handleUpload}
                disabled={files.length === 0 || uploading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
                {uploading && (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    );
};

export default ImageUpload;
