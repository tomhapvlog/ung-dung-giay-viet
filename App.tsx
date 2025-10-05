import React, { useState, useCallback, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import EditorScreen from './components/EditorScreen';
import { generateShoeImage } from './services/geminiService';
import { LoadingSpinner, ZaloIcon, VideoIcon, GalleryIcon } from './components/icons';

export type Screen = 'home' | 'editor';
export type ImageQuality = 'standard' | 'high';
export type AspectRatio = '1:1' | '9:16' | '16:9' | '3:4';
export type ModelAction = 'wear' | 'hold' | 'turntable';
export type ImageType = 'model' | 'turntable';


const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [characterImage, setCharacterImage] = useState<File | null>(null);
  const [shoeImage, setShoeImage] = useState<File | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generationAspectRatio, setGenerationAspectRatio] = useState<AspectRatio>('9:16');
  const [modelAction, setModelAction] = useState<ModelAction>('wear');
  const [imageType, setImageType] = useState<ImageType>('model');
  
  // Effect to clear error message after a few seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 7000); // Increased time to 7 seconds for better readability
      return () => clearTimeout(timer);
    }
  }, [error]);

  const isPromptValid = (prompt: string): boolean => {
    const lowercasedPrompt = prompt.toLowerCase();
    const forbiddenKeywords = [
        'túi', 'ví', 'ba lô', 'balo',
        'kính', 'mắt kính',
        'mũ', 'nón',
        'quần áo', 'áo', 'quần', 'váy', 'đầm', 'sơ mi', 'áo phông', 'trang phục',
        'đồng hồ',
        'trang sức', 'vòng cổ', 'nhẫn', 'bông tai', 'lắc tay',
    ];
    // Returns true if NO forbidden keyword is found
    return !forbiddenKeywords.some(keyword => lowercasedPrompt.includes(keyword));
  };


  const handleGenerate = useCallback(async (description: string, quality: ImageQuality, numberOfImages: number) => {
    if (!shoeImage) {
      setError('Vui lòng tải lên ảnh sản phẩm hợp lệ.');
      return;
    }
    if (imageType === 'model' && !characterImage) {
        setError('Vui lòng tải lên ảnh người mẫu.');
        return;
    }
    
    if (!isPromptValid(description)) {
        setError('Mô tả chứa sản phẩm không hợp lệ. Vui lòng chỉ tập trung vào giày dép.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setGenerationAspectRatio('9:16');

    try {
      const resultImages = await generateShoeImage(characterImage, shoeImage, description, quality, numberOfImages, modelAction, imageType);
      setGeneratedImages(resultImages);
      setCurrentScreen('editor');
    } catch (err) {
      // The actual error is logged in geminiService.ts for debugging.
      // We show a generic, user-friendly message to the user as requested.
      const userMessage = 'Lỗi đường truyền mạng, không thể tạo ảnh. Vui lòng thử lại.';
      setError(userMessage);
    } finally {
      setIsLoading(false);
    }
  }, [characterImage, shoeImage, modelAction, imageType]);

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setGeneratedImages([]);
  };
  
  const handleDeleteImages = (indicesToDelete: number[]) => {
    const remainingImages = generatedImages.filter((_, index) => !indicesToDelete.includes(index));
    setGeneratedImages(remainingImages);
    if (remainingImages.length === 0) {
      handleBackToHome();
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl flex justify-center">
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
            <LoadingSpinner className="w-16 h-16 text-white" />
            <p className="text-white text-xl mt-4">AI đang xử lý ảnh của bạn...</p>
            <p className="text-gray-300 mt-2">Quá trình này có thể mất vài phút.</p>
          </div>
        )}

        {currentScreen === 'home' ? (
          <HomeScreen
            onCharacterImageSelect={setCharacterImage}
            onShoeImageSelect={(file) => setShoeImage(file)}
            onGenerate={handleGenerate}
            characterImage={characterImage}
            shoeImage={shoeImage}
            modelAction={modelAction}
            onModelActionChange={setModelAction}
            imageType={imageType}
            onImageTypeChange={setImageType}
          />
        ) : (
          <EditorScreen
            generatedImages={generatedImages}
            onBack={handleBackToHome}
            aspectRatio={generationAspectRatio}
            onDelete={handleDeleteImages}
          />
        )}
      </div>
       {error && (
          <div className="fixed bottom-20 right-5 bg-red-600 text-white py-3 px-5 rounded-lg shadow-lg z-50 animate-fade-in-out max-w-sm">
            <p className="font-bold">Đã xảy ra lỗi</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
      {/* === Tham gia nhóm Zalo Ảnh Xịn === */}
      <a
        href="https://zalo.me/g/ixkphz060"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 left-5 bg-purple-500 text-white rounded-full p-3 shadow-lg hover:bg-purple-600 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 animate-pulse-bounce z-40"
        aria-label="Tham gia nhóm Zalo 'Ảnh Xịn Xây Kênh'"
        title="Tham gia nhóm Zalo 'Ảnh Xịn Xây Kênh'"
      >
        <GalleryIcon className="w-8 h-8" />
      </a>
      {/* === Tham gia nhóm Zalo Video AI === */}
      <a
        href="https://zalo.me/g/dlwjjx911"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 left-5 bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 animate-pulse-bounce z-40"
        aria-label="Tham gia nhóm Zalo 'Miễn phí tạo video AI bằng Pixverse AI'"
        title="Tham gia nhóm Zalo 'Miễn phí tạo video AI bằng Pixverse AI'"
      >
        <VideoIcon className="w-8 h-8" />
      </a>
      {/* === Liên kết đến Zalo: 84945111708 === */}
      <a
        href="https://zalo.me/84945111708" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 animate-pulse-bounce z-40"
        aria-label="Liên hệ qua Zalo"
        title="Liên hệ qua Zalo"
      >
        <ZaloIcon className="w-8 h-8" />
      </a>
      {/* === Copyright Notice === */}
      <p className="fixed bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-500 z-40">
        copyright by GIÀY VIỆT
      </p>
    </div>
  );
};

export default App;