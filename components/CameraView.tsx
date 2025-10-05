import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CloseIcon, SwitchCameraIcon, LoadingSpinner } from './icons';

interface CameraViewProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (isMounted) {
          setError("Camera not supported on this device or browser.");
          setIsInitializing(false);
        }
        return;
      }
      
      if (isMounted) {
        setIsInitializing(true);
        setError(null);
      }
      
      stopStream();

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode }
        }
      };
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (isMounted) {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current?.play();
            };
          }
          // Check for devices only after getting permission successfully
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter(device => device.kind === 'videoinput');
          setHasMultipleCameras(videoInputs.length > 1);
          setIsInitializing(false);
        } else {
            // Component unmounted while getting stream, so stop it.
            stream.getTracks().forEach(track => track.stop());
        }
      } catch (err: any) {
        console.error("Error accessing camera:", err);
        if (isMounted) {
          setError("Không thể truy cập máy ảnh. Vui lòng kiểm tra quyền truy cập trong cài đặt trình duyệt của bạn.");
          setIsInitializing(false);
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      stopStream();
    };
  }, [facingMode, stopStream]);

  const handleCaptureClick = useCallback(() => {
    if (videoRef.current && canvasRef.current && streamRef.current && !isInitializing && !error) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        // Flip the image horizontally when saving if it's the front camera
        // to undo the preview's mirroring effect.
        if (facingMode === 'user') {
          context.translate(video.videoWidth, 0);
          context.scale(-1, 1);
        }
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.png`, { type: 'image/png' });
            onCapture(file);
          }
        }, 'image/png');
      }
    }
  }, [onCapture, facingMode, isInitializing, error]);

  const handleSwitchCamera = useCallback(() => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted // Mute video to prevent feedback loops if audio was enabled
        className="w-full h-full object-cover"
        // Mirror the video for a more natural selfie experience
        style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
      />
      <canvas ref={canvasRef} className="hidden" />

      {isInitializing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-20">
              <LoadingSpinner className="w-12 h-12 text-white" />
              <p className="text-white mt-2">Đang khởi động máy ảnh...</p>
          </div>
      )}

      {error && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500/80 text-white p-4 rounded-lg text-center max-w-sm z-30">
          <p className="font-semibold">Lỗi Máy ảnh</p>
          <p className="text-sm mt-2">{error}</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-white text-red-500 rounded font-bold">
            Đóng
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center z-10">
        <div className="flex items-center justify-between w-full max-w-sm">
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            aria-label="Đóng máy ảnh"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleCaptureClick}
            disabled={!!error || isInitializing}
            className="w-20 h-20 rounded-full border-4 border-white bg-transparent flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Chụp ảnh"
          >
            <div className="w-16 h-16 rounded-full bg-white group-hover:bg-gray-200 transition-colors"></div>
          </button>
          
          {hasMultipleCameras ? (
            <button
              onClick={handleSwitchCamera}
              disabled={!!error || isInitializing}
              className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Chuyển máy ảnh"
            >
              <SwitchCameraIcon className="w-6 h-6" />
            </button>
          ) : (
              <div className="w-12 h-12" /> // Placeholder to keep layout consistent
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraView;
