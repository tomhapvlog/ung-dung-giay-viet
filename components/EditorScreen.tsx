import React, { useState, useEffect } from 'react';
import { BackArrowIcon, TrashIcon } from './icons';
import type { AspectRatio } from '../App';

interface EditorScreenProps {
  generatedImages: string[];
  onBack: () => void;
  aspectRatio: AspectRatio; // Giữ lại prop này nếu App đang truyền xuống, nhưng không dùng nữa
  onDelete: (indices: number[]) => void;
}

const EditorScreen: React.FC<EditorScreenProps> = ({ generatedImages, onBack, aspectRatio, onDelete }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedForDeletion, setSelectedForDeletion] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const selectedImage = generatedImages[selectedIndex];

  useEffect(() => {
    if (!generatedImages[selectedIndex] && generatedImages.length > 0) {
      setSelectedIndex(0);
    }
  }, [generatedImages, selectedIndex]);

  const handleToggleSelection = (index: number) => {
    setSelectedForDeletion(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleConfirmDelete = () => {
    onDelete(selectedForDeletion);
    setSelectedForDeletion([]);
    setIsDeleteModalOpen(false);
  };

  if (!selectedImage) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm flex-shrink-0 text-center">
        <h2 className="text-xl font-bold">Không có ảnh để hiển thị</h2>
        <button onClick={onBack} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg">Quay lại</button>
      </div>
    );
  }

  const handleDownload = async () => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = selectedImage;
    await new Promise((res) => (image.onload = res));

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "#ffffff"; // nền trắng
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scale = Math.max(canvas.width / image.width, canvas.height / image.height);
      const x = (canvas.width / 2) - (image.width / 2) * scale;
      const y = (canvas.height / 2) - (image.height / 2) * scale;

      ctx.drawImage(image, x, y, image.width * scale, image.height * scale);

      // Add watermark
      const watermarkText = "GIÀY VIỆT";
      const padding = 20;
      ctx.font = "bold 30px Arial";
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      
      // Add a subtle shadow for better visibility
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillText(watermarkText, canvas.width - padding, canvas.height - padding);
    }

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `giay-anh-viet-${selectedIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm flex-shrink-0">
        <div className="flex items-center mb-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
            <BackArrowIcon className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 mx-auto">Chỉnh sửa ảnh</h1>
          <div className="w-8"></div>
        </div>

        {/* Main Image Display */}
        <div className="relative mb-4 w-full max-w-[300px] mx-auto">
          <div className="w-full overflow-hidden rounded-lg mx-auto aspect-[9/16]">
            <img src={selectedImage} alt={`Generated image ${selectedIndex + 1}`} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Thumbnails Gallery */}
        {generatedImages.length > 1 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 text-sm mb-2">Các phiên bản khác</h3>
            <div className="grid grid-cols-4 gap-2">
              {generatedImages.map((image, index) => (
                <div 
                  key={index}
                  className={`relative rounded-lg transition-all ${selectedForDeletion.includes(index) ? 'ring-2 ring-blue-500' : 'ring-0'}`}
                >
                  <button onClick={() => setSelectedIndex(index)} className={`block w-full rounded-md overflow-hidden border-2 ${selectedIndex === index ? 'border-blue-500' : 'border-transparent'}`}>
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover aspect-square" />
                  </button>
                  <input
                    type="checkbox"
                    id={`delete-checkbox-${index}`}
                    checked={selectedForDeletion.includes(index)}
                    onChange={() => handleToggleSelection(index)}
                    className="absolute top-1.5 right-1.5 h-5 w-5 bg-white rounded text-blue-600 border-gray-400 shadow-sm focus:ring-blue-500 cursor-pointer"
                    aria-label={`Select image ${index + 1} for deletion`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Editing Tools */}
        <div className="flex justify-end items-center text-center text-xs text-gray-600 mb-6 p-2 bg-gray-50 rounded-lg">
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={selectedForDeletion.length === 0}
            className="flex flex-col items-center p-1 rounded hover:bg-red-100 w-12 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <TrashIcon className="w-6 h-6 mb-1 text-red-500"/>Xóa
          </button>
        </div>
        
        <div className="mt-6 space-y-3">
          <button
            onClick={handleDownload}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tải xuống
          </button>
        </div>
      </div>

      {/* Deletion Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <TrashIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Xóa ảnh đã chọn?</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Bạn có chắc chắn muốn xóa {selectedForDeletion.length} ảnh đã chọn không? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none"
                onClick={handleConfirmDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditorScreen;