import React, { useState } from 'react';
import { TrashIcon, DownloadIcon, LoadingSpinner, CloseIcon } from './icons';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Helper to add watermark to an image
const addWatermark = (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = imageUrl;

        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 1080;
            canvas.height = 1920;
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                return reject(new Error("Could not get canvas context"));
            }

            // Draw white background and scaled image
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const scale = Math.max(canvas.width / image.width, canvas.height / image.height);
            const x = (canvas.width / 2) - (image.width / 2) * scale;
            const y = (canvas.height / 2) - (image.height / 2) * scale;
            ctx.drawImage(image, x, y, image.width * scale, image.height * scale);

            // Add watermark text
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

            // Resolve with the new data URL
            const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
            resolve(dataUrl);
        };

        image.onerror = (err) => {
            reject(new Error(`Failed to load image for watermarking: ${err}`));
        };
    });
};

const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
};

const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// FIX: Define CollectionViewProps interface
interface CollectionViewProps {
  images: string[];
  onDelete: (indices: number[]) => void;
  showToast: (message: string) => void;
}

const CollectionView: React.FC<CollectionViewProps> = ({ images, onDelete, showToast }) => {
  const [selectedForDeletion, setSelectedForDeletion] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingType, setDownloadingType] = useState<'selected' | 'all' | null>(null);

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
  
  const handleDownload = async (type: 'selected' | 'all') => {
    const imagesToDownload = type === 'all' 
      ? images
      : selectedForDeletion.map(index => images[index]);

    const indicesToDownload = type === 'all'
      ? images.map((_, i) => i)
      : selectedForDeletion;

    if (imagesToDownload.length === 0) return;
    
    setIsDownloading(true);
    setDownloadingType(type);

    try {
        if (imagesToDownload.length === 1) {
            showToast('Đang xử lý ảnh...');
            const image = imagesToDownload[0];
            const originalIndex = indicesToDownload[0];
            const watermarkedImage = await addWatermark(image);
            saveAs(watermarkedImage, `giay-anh-viet-${originalIndex + 1}.jpg`);
            showToast('Tải xuống hoàn tất!');
        } else if (isMobileDevice()) {
            for (let i = 0; i < imagesToDownload.length; i++) {
                const image = imagesToDownload[i];
                const originalIndex = indicesToDownload[i];
                showToast(`Đang xử lý & tải ảnh ${i + 1}/${imagesToDownload.length}...`);
                const watermarkedImage = await addWatermark(image);
                saveAs(watermarkedImage, `giay-anh-viet-${originalIndex + 1}.jpg`);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            showToast('Tải xuống hoàn tất!');
        } else {
            showToast('Đang xử lý & nén ảnh... Vui lòng đợi.');
            const zip = new JSZip();
            for (let i = 0; i < imagesToDownload.length; i++) {
                const imageDataUrl = imagesToDownload[i];
                const originalIndex = indicesToDownload[i];
                const filename = `giay-anh-viet-${originalIndex + 1}.jpg`;
                const watermarkedImageDataUrl = await addWatermark(imageDataUrl);
                const blob = dataURLtoBlob(watermarkedImageDataUrl);
                if (blob) {
                    zip.file(filename, blob);
                }
            }
            const zipBlob = await zip.generateAsync({ type: "blob" });
            saveAs(zipBlob, `giay-anh-viet-collection.zip`);
            showToast('Tải xuống thành công!');
        }

        if (type === 'selected') {
            setSelectedForDeletion([]);
        }
    } catch (error) {
        console.error("Error during download:", error);
        showToast("Đã xảy ra lỗi khi xử lý và tải ảnh.");
    } finally {
        setIsDownloading(false);
        setDownloadingType(null);
    }
  };


  if (images.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Bộ sưu tập của bạn đang trống.</p>
        <p className="text-gray-400 text-sm mt-2">Hãy tạo một vài ảnh để bắt đầu!</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Bộ sưu tập ({images.length})</h3>
        <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownload('all')}
              disabled={isDownloading || images.length === 0}
              className="flex items-center gap-2 text-sm text-green-600 bg-green-100 hover:bg-green-200 px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading && downloadingType === 'all' ? (
                <>
                  <LoadingSpinner className="w-4 h-4 mr-1" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <DownloadIcon className="w-4 h-4" />
                  <span>Tải tất cả</span>
                </>
              )}
            </button>
            <button
                onClick={() => handleDownload('selected')}
                disabled={isDownloading || selectedForDeletion.length === 0}
                className="flex items-center gap-2 text-sm text-blue-600 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isDownloading && downloadingType === 'selected' ? (
                  <>
                    <LoadingSpinner className="w-4 h-4 mr-1" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <DownloadIcon className="w-4 h-4" />
                    <span>Tải ({selectedForDeletion.length})</span>
                  </>
                )}
            </button>
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isDownloading || selectedForDeletion.length === 0}
              className="flex items-center gap-2 text-sm text-red-600 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              <TrashIcon className="w-4 h-4" />
              Xóa ({selectedForDeletion.length})
            </button>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto pr-2">
        {images.map((image, index) => (
           <div 
             key={index}
             className="relative rounded-lg overflow-hidden cursor-pointer group"
             onClick={() => handleToggleSelection(index)}
           >
            <img src={image} alt={`Saved image ${index + 1}`} className="w-full h-full object-cover aspect-square" />
            <div className={`absolute inset-0 bg-black transition-opacity ${selectedForDeletion.includes(index) ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'}`}></div>
            <input
              type="checkbox"
              readOnly
              checked={selectedForDeletion.includes(index)}
              className="absolute top-2 right-2 h-5 w-5 rounded text-blue-500 border-gray-300 focus:ring-blue-400 pointer-events-none"
              aria-label={`Select image ${index + 1} for deletion`}
            />
          </div>
        ))}
      </div>
      
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
    </div>
  );
};

export default CollectionView;