
import type { ImageQuality, ModelAction, ImageType } from '../App';

// Helper function to convert a File object to a base64 string
const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        // result is "data:image/jpeg;base64,LzlqLzRBQ...""
        // We need to split it to get the mimeType and the base64 data
        const [header, data] = result.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] || file.type;
        resolve({ base64: data, mimeType });
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateShoeImage = async (
  characterImageFile: File | null, 
  shoeImageFile: File, 
  description: string, 
  quality: ImageQuality,
  numberOfImages: number,
  modelAction: ModelAction,
  imageType: ImageType
): Promise<string[]> => {
  
  // Convert files to base64 to send as JSON to our secure API endpoint
  const shoeImage = await fileToBase64(shoeImageFile);
  const characterImage = characterImageFile ? await fileToBase64(characterImageFile) : null;

  // The frontend now calls our OWN backend API, not Google's directly.
  // This keeps the API key secure.
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      shoeImage,
      characterImage,
      description,
      quality,
      numberOfImages,
      modelAction,
      imageType
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    // If the server returned an error, throw it so the UI can catch it
    console.error("API Route Error:", result.error);
    throw new Error(result.error || 'An unknown error occurred.');
  }

  // The API route returns an object like { images: [...] }
  return result.images;
};
