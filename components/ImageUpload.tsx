
import React, { useRef } from 'react';
import CameraIcon from './CameraIcon';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  disabled: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        disabled={disabled}
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-teal-500 text-slate-900 font-bold rounded-lg shadow-md transition-all duration-300 hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:bg-slate-600 disabled:cursor-not-allowed"
      >
        <CameraIcon className="w-6 h-6" />
        <span>Share Artwork</span>
      </button>
    </div>
  );
};

export default ImageUpload;
