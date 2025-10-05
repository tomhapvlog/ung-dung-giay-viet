import React, { useState, useCallback } from 'react';
import ImageUpload from './ImageUpload';
import CameraView from './CameraView';
import { isShoeImage } from '../services/geminiService';
import type { ImageQuality, ModelAction, ImageType } from '../App';
import { WandIcon, GalleryIcon } from './icons';

interface HomeScreenProps {
  onCharacterImageSelect: (file: File | null) => void;
  onShoeImageSelect: (file: File | null) => void;
  onGenerate: (description: string, quality: ImageQuality, numberOfImages: number) => void;
  characterImage: File | null;
  shoeImage: File | null;
  modelAction: ModelAction;
  onModelActionChange: (action: ModelAction) => void;
  imageType: ImageType;
  onImageTypeChange: (type: ImageType) => void;
  onShowCollection: () => void;
  collectionCount: number;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onCharacterImageSelect,
  onShoeImageSelect,
  onGenerate,
  characterImage,
  shoeImage,
  modelAction,
  onModelActionChange,
  imageType,
  onImageTypeChange,
  onShowCollection,
  collectionCount,
}) => {
  const [description, setDescription] = useState('');
  const [quality, setQuality] = useState<ImageQuality>('standard');
  const [numberOfImages, setNumberOfImages] = useState(1);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFor, setCameraFor] = useState<'character' | 'shoe' | null>(null);

  const [isVerifyingShoe, setIsVerifyingShoe] = useState(false);
  const [shoeError, setShoeError] = useState<string | null>(null);

  const handleShoeImageSelect = useCallback(async (file: File) => {
    setIsVerifyingShoe(true);
    setShoeError(null);
    onShoeImageSelect(file);

    try {
      const isShoe = await isShoeImage(file);
      if (isShoe) {
        onShoeImageSelect(file);
      } else {
        setShoeError("Ảnh không hợp lệ. Vui lòng chọn ảnh là một chiếc giày.");
        onShoeImageSelect(null);
      }
    } catch (error) {
      // The actual error is logged in geminiService.ts for debugging.
      // We show a generic, user-friendly message here.
      const userMessage = "Lỗi kết nối AI: Không thể xác minh ảnh. Vui lòng kiểm tra mạng và thử lại.";
      setShoeError(userMessage);
      onShoeImageSelect(null);
    } finally {
      setIsVerifyingShoe(false);
    }
  }, [onShoeImageSelect]);

  const handleOpenCamera = (type: 'character' | 'shoe') => {
    setCameraFor(type);
    setIsCameraOpen(true);
  };

  const handleCapture = (file: File) => {
    if (cameraFor === 'character') {
      onCharacterImageSelect(file);
    } else if (cameraFor === 'shoe') {
      handleShoeImageSelect(file);
    }
    setIsCameraOpen(false);
    setCameraFor(null);
  };

  const handleGenerateClick = () => {
    if (canGenerate) {
      onGenerate(description, quality, numberOfImages);
    }
  };

  const canGenerate = 
    (imageType === 'model' && characterImage && shoeImage && !isVerifyingShoe && !shoeError) ||
    (imageType === 'turntable' && shoeImage && !isVerifyingShoe && !shoeError);


  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm flex-shrink-0 relative">
        <button 
          onClick={onShowCollection}
          className="absolute top-4 right-4 flex items-center gap-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-semibold transition-colors z-10"
          aria-label={`Mở bộ sưu tập với ${collectionCount} ảnh`}
        >
            <GalleryIcon className="w-5 h-5" />
            <span>Bộ sưu tập ({collectionCount})</span>
        </button>

        <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">THÙY DƯƠNG</h1>
            <h2 className="text-xl font-semibold text-gray-800">Nâng niu bàn chân Việt</h2>
            <p className="text-gray-500 text-sm mt-2">Tạo ảnh chuyên nghiệp với sản phẩm của bạn</p>
        </div>

        <div className="space-y-5">
          {/* Step 1: Product Image */}
          <ImageUpload
            step="1"
            title="Tải ảnh sản phẩm (giày)"
            onFileSelect={handleShoeImageSelect}
            file={shoeImage}
            onOpenCamera={() => handleOpenCamera('shoe')}
            isVerifying={isVerifyingShoe}
            error={shoeError}
          />
          
          {/* Step 2: Image Type Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Bước 2: Chọn loại ảnh</h3>
            <div className="flex space-x-2 rounded-lg bg-gray-200 p-1 w-full">
              <button
                onClick={() => onImageTypeChange('model')}
                className={`flex-1 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${imageType === 'model' ? 'bg-white text-blue-600 shadow-sm' : 'bg-transparent text-gray-600 hover:bg-gray-300/50'}`}
              >
                Người mẫu
              </button>
              <button
                onClick={() => onImageTypeChange('turntable')}
                className={`flex-1 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${imageType === 'turntable' ? 'bg-white text-blue-600 shadow-sm' : 'bg-transparent text-gray-600 hover:bg-gray-300/50'}`}
              >
                Bàn xoay
              </button>
            </div>
          </div>

          {/* Step 3: Conditional Model Image and Actions */}
          {imageType === 'model' && (
            <div className="space-y-5">
              <ImageUpload
                step="3"
                title="Tải ảnh người mẫu"
                onFileSelect={onCharacterImageSelect}
                file={characterImage}
                onOpenCamera={() => handleOpenCamera('character')}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Hành động của người mẫu</h3>
                <div className="flex space-x-2 rounded-lg bg-gray-200 p-1 w-full">
                  <button
                    onClick={() => onModelActionChange('wear')}
                    className={`flex-1 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${modelAction === 'wear' ? 'bg-white text-blue-600 shadow-sm' : 'bg-transparent text-gray-600 hover:bg-gray-300/50'}`}
                  >
                    Mang ở chân
                  </button>
                  <button
                    onClick={() => onModelActionChange('hold')}
                    className={`flex-1 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${modelAction === 'hold' ? 'bg-white text-blue-600 shadow-sm' : 'bg-transparent text-gray-600 hover:bg-gray-300/50'}`}
                  >
                    Cầm trên tay
                  </button>
                  <button
                    onClick={() => onModelActionChange('turntable')}
                    className={`flex-1 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${modelAction === 'turntable' ? 'bg-white text-blue-600 shadow-sm' : 'bg-transparent text-gray-600 hover:bg-gray-300/50'}`}
                  >
                    Đứng cạnh bàn xoay
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Thêm bối cảnh (Tùy chọn)
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder={
              imageType === 'model'
                ? "Để trống để dùng nền studio, hoặc nhập ví dụ: đứng trên bãi biển, quán cà phê cổ điển..."
                : "Để trống để dùng nền studio, hoặc nhập ví dụ: đặt trên kệ gỗ, trong cửa hàng..."
            }
          ></textarea>
        </div>

        <div className="mt-4">
            <div>
                <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-1">Chất lượng</label>
                <select id="quality" value={quality} onChange={e => setQuality(e.target.value as ImageQuality)} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="standard">Tiêu chuẩn</option>
                    <option value="high">Cao</option>
                </select>
            </div>
        </div>

         <div className="mt-4">
            <label htmlFor="numberOfImages" className="block text-sm font-medium text-gray-700 mb-1">Số lượng ảnh ({numberOfImages})</label>
             <input
                type="range"
                id="numberOfImages"
                min="1"
                max="4"
                value={numberOfImages}
                onChange={e => setNumberOfImages(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>

        <div className="mt-6">
          <button
            onClick={handleGenerateClick}
            disabled={!canGenerate}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            <WandIcon className="w-5 h-5" />
            Tạo ảnh ngay
          </button>
        </div>
      </div>
      {isCameraOpen && <CameraView onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />}
    </>
  );
};

export default HomeScreen;
