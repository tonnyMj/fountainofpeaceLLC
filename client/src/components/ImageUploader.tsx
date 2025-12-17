import { useState, useEffect } from 'react';
import { Upload, CheckCircle, AlertCircle, Trash2, X } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import ConfirmationModal from './ui/ConfirmationModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ImageUploaderProps {
    imageType?: 'hero' | 'gallery';
    onUploadSuccess?: () => void;
}

const ImageUploader = ({ imageType = 'gallery', onUploadSuccess }: ImageUploaderProps) => {
    const { showToast } = useToast();
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<string | null>(null);

    const fetchExistingImages = async () => {
        try {
            const response = await fetch(`${API_URL}/api/images?type=${imageType}`, { cache: 'no-store' });
            if (response.ok) {
                const data = await response.json();
                setExistingImages(data);
            }
        } catch (err) {
            console.error('Failed to fetch existing images:', err);
        }
    };

    // Fetch images on mount
    useEffect(() => {
        fetchExistingImages();
    }, [imageType]); // Re-fetch if imageType changes

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const removeSelectedFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('type', imageType); // Append type FIRST for reliability
        files.forEach((file) => {
            formData.append('images', file);
        });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            showToast(`Successfully uploaded ${data.count || 1} images!`, 'success');

            setFiles([]);
            // Clear input
            const fileInput = document.getElementById(`file-input-${imageType}`) as HTMLInputElement;
            if (fileInput) fileInput.value = '';

            // Refresh existing images list
            fetchExistingImages();

            if (onUploadSuccess) onUploadSuccess();
        } catch (err: any) {
            console.error(err);
            showToast('Failed to upload images. Please try again.', 'error');
        } finally {
            setUploading(false);
        }
    };

    const confirmDelete = (filename: string) => {
        setImageToDelete(filename);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!imageToDelete) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/images/${imageToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Handle 200 OK or 404 Not Found (already deleted) as success
            if (response.ok || response.status === 404) {
                showToast('Image deleted successfully.', 'success');
                fetchExistingImages();
            } else {
                showToast('Failed to delete image.', 'error');
            }
        } catch (err) {
            console.error('Error deleting image:', err);
            showToast('Error deleting image.', 'error');
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Upload Photos</h3>

            <div className="flex flex-col items-center gap-4 mb-8">
                <input
                    id={`file-input-${imageType}`}
                    type="file"
                    accept="image/*"
                    multiple // Allow multiple files
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-primary
            hover:file:bg-blue-100
          "
                />

                {/* Selected Files Preview List */}
                {files.length > 0 && (
                    <div className="w-full flex flex-wrap gap-2 justify-center">
                        {files.map((file, idx) => (
                            <div key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700 flex items-center gap-2">
                                <span className="truncate max-w-[150px]">{file.name}</span>
                                <button onClick={() => removeSelectedFile(idx)} className="text-gray-400 hover:text-red-500">
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {files.length > 0 && (
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50"
                    >
                        {uploading ? 'Uploading...' : 'Upload Selected'}
                        {!uploading && <Upload size={18} />}
                    </button>
                )}
            </div>

            {/* Existing Images Preview */}
            {existingImages.length > 0 && (
                <div className="border-t pt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4 text-left">Existing {imageType === 'hero' ? 'Banner' : 'Gallery'} Images</h4>
                    <div className="grid grid-cols-3 gap-2">
                        {existingImages.map((img, index) => {
                            // Extract filename from path for deletion
                            const filename = img.split('/').pop() || '';
                            return (
                                <div key={index} className="aspect-square relative rounded-lg overflow-hidden border border-gray-200 group">
                                    <img
                                        src={img}
                                        alt={`Existing ${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => confirmDelete(filename)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                                        title="Delete Image"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Image"
                message="Are you sure you want to delete this image? This action cannot be undone."
                confirmText="Delete"
                confirmType="danger"
            />
        </div>
    );
};

export default ImageUploader;
