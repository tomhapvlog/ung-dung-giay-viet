
import React, { useState, useRef, useEffect } from 'react';
import { UserIcon, ShoeIcon, CameraIcon, GalleryIcon, WandIcon, LoadingSpinner } from './icons';

interface ImageUploadProps {
  step: string;
  title: string;
  onFileSelect: (file: File) => void;
  file: File | null;
  onOpenCamera: () => void;
  hasSmartTool?: boolean;
  smartToolText?: string;
  isVerifying?: boolean;
  error?: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ step, title, onFileSelect, file, onOpenCamera, hasSmartTool, smartToolText, isVerifying = false, error = null }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        // Trigger animation
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 700); // Animation duration is 700ms
        return () => clearTimeout(timer);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [file]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
    // Reset file input to allow selecting the same file again
    if(event.target) {
        event.target.value = "";
    }
  };
  
  const icon = step === '1' ? <UserIcon className="w-10 h-10 text-gray-400" /> : <ShoeIcon className="w-10 h-10 text-gray-400" />;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Bước {step}: {title}</h3>
      <div className="flex gap-4">
        <div 
          className={`relative w-32 h-40 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer overflow-hidden ${isAnimating ? 'animate-border-flash' : ''} ${error ? 'border-red-500' : 'border-gray-300'}`}
          onClick={() => !isVerifying && fileInputRef.current?.click()}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            icon
          )}
          {isVerifying && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                <LoadingSpinner className="w-8 h-8 text-blue-500" />
                <p className="text-xs text-gray-700 font-semibold mt-2">Đang kiểm tra...</p>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            {hasSmartTool && (
                <div className="mb-2 bg-blue-100 text-blue-800 p-2 rounded-lg text-xs flex items-center gap-2">
                    <WandIcon className="w-4 h-4 flex-shrink-0" />
                    <span>Công cụ tách nền thông minh</span>
                </div>
            )}
            {smartToolText && <p className="text-xs text-gray-500 mb-3">{smartToolText}</p>}
            
            <div className="flex flex-col space-y-2">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isVerifying}
                    className="w-full bg-blue-500 text-white text-sm font-semibold py-2 px-3 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    <GalleryIcon className="w-4 h-4" />
                    Chọn ảnh từ Thư viện
                </button>
                <button 
                    onClick={onOpenCamera}
                    disabled={isVerifying}
                    className="w-full bg-white text-gray-700 text-sm font-semibold py-2 px-3 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:cursor-not-allowed">
                    <CameraIcon className="w-4 h-4" />
                    Chụp ảnh mới
                </button>
            </div>

          </div>
        </div>
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default ImageUpload;
