import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageQuality, ModelAction, ImageType } from '../App';

// Hoàn nguyên để sử dụng process.env.API_KEY, được cung cấp bởi vite.config.ts.
// Cách này ổn định hơn cho môi trường thực thi so với import.meta.env.
const API_KEY = process.env.API_KEY;

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

export const isShoeImage = async (imageFile: File): Promise<boolean> => {
    if (!API_KEY) {
      console.error("API key not found. Ensure VITE_GEMINI_API_KEY is set in your environment variables and the app is rebuilt.");
      // Lỗi chung này sẽ được UI bắt và hiển thị dưới dạng lỗi mạng.
      throw new Error("GENERIC_NETWORK_ERROR");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    try {
        const imageBase64 = await fileToBase64(imageFile);
        const imagePart = {
            inlineData: {
                mimeType: imageFile.type,
                data: imageBase64,
            },
        };
        const textPart = {
            text: "Does this image primarily feature a shoe, sandal, boot, or other type of footwear? Answer with only 'YES' or 'NO'."
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        const resultText = response.text.trim().toUpperCase();
        console.log('Validation response:', resultText);
        return resultText.includes('YES');
    } catch (error) {
        // Ghi lại lỗi thực tế để nhà phát triển gỡ lỗi
        console.error("Gemini Validation Error [Internal Log]:", error);
        // Ném ra một lỗi chung để UI xử lý
        throw new Error("GENERIC_NETWORK_ERROR");
    }
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
  if (!API_KEY) {
    console.error("API key not found. Ensure VITE_GEMINI_API_KEY is set in your environment variables and the app is rebuilt.");
    throw new Error("GENERIC_NETWORK_ERROR");
  }
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const shoeImageBase64 = await fileToBase64(shoeImageFile);

  const shoeImagePart = {
    inlineData: {
      mimeType: shoeImageFile.type,
      data: shoeImageBase64,
    },
  };
  
  let finalPrompt = '';
  const parts: any[] = [shoeImagePart];

  const qualityPrompt = quality === 'high' 
    ? "The final image must be photorealistic, ultra-high definition, with sharp details and professional lighting." 
    : "The final image should be high-resolution and clear.";

  if (imageType === 'turntable') {
      const descriptionPrompt = description 
          ? `The background scene and the display stand must match this description: ${description}.` 
          : "The background scene is a clean, professional studio setting. The display stand is also clean and modern to match.";

      const basePrompt = `**CRITICAL TECHNICAL DIRECTIVE: PRODUCT RE-STAGING ON A NEW, CONTEXTUAL TURNTABLE.**

**ROLE:** You are a professional digital product staging artist. Your task is to take a product image, place it on a new, contextually appropriate turntable, and then set the entire scene in a new background.

**TECHNICAL EXECUTION - A THREE-STEP PROCESS:**

**STEP 1: PRODUCT ISOLATION**
- From the user-provided image, perfectly isolate **only the product (the footwear)**.
- Ignore and discard everything else from the original image (the original background, any original turntable/stand, etc.).
- This isolated footwear is now the **"Pristine Product Layer"**. This layer is SACROSANCT.

**STEP 2: SCENE GENERATION**
- Based on the user's context description, generate a complete scene with two components:
    1.  A **"Contextual Background"**: The overall environment (e.g., 'a marble countertop in a luxury store', 'a wooden dock by a lake').
    2.  A **"Contextual Turntable"**: A product display stand, pedestal, or turntable that fits PERFECTLY with the background's material, style, and lighting (e.g., 'a sleek, white acrylic stand' for a studio, 'a rustic, worn wooden block' for a forest).
- The final output canvas is a 9:16 aspect ratio.

**STEP 3: FINAL COMPOSITING**
- Place the **"Pristine Product Layer"** realistically onto the **"Contextual Turntable"** you just generated.
- Ensure the lighting on the product matches the new scene's lighting, and cast a soft, realistic shadow from the product onto the turntable.

**UNBREAKABLE RULES FOR THE "PRISTINE PRODUCT LAYER":**
-   **ZERO CROPPING:** It is absolutely forbidden to crop, cut, or obscure any part of the product. Any clipping of the product is a critical failure.
-   **ZERO ENLARGEMENT:** You must not scale the product larger than its original size.
-   **FIT TO FRAME:** The entire composition (product on turntable) must fit completely within the 9:16 canvas with a small, professional margin around it. If necessary, scale DOWN the composition (product + turntable together) to fit.
-   **NO DISTORTION:** Do not rotate, warp, or change the perspective of the product in an unnatural way.`;

      finalPrompt = [basePrompt, descriptionPrompt, qualityPrompt].join(' ');
  } else { // imageType === 'model'
      if (!characterImageFile) {
        throw new Error("Character image is required for this generation type.");
      }
      const characterImageBase64 = await fileToBase64(characterImageFile);
      const characterImagePart = {
        inlineData: {
          mimeType: characterImageFile.type,
          data: characterImageBase64,
        },
      };
      parts.unshift(characterImagePart);
    
      let actionPrompt: string;
      if (modelAction === 'hold') {
        actionPrompt = "The person must be holding a PAIR of the shoes from the second image in their hands, presenting them clearly.";
      } else if (modelAction === 'turntable') {
        actionPrompt = "The person must be standing elegantly next to a display stand or turntable. The turntable must be displaying a PAIR of the shoes from the second image. The person should be posing to present the shoes, but is not wearing or holding them.";
      } else { // 'wear'
        actionPrompt = "The person must be wearing a PAIR of the shoes from the second image, one on each foot.";
      }
      
      const basePrompt = `Your task is to create a new promotional photo. **PRIORITY ONE: The new person's face and key identifying features MUST closely resemble the person in the first image.** For the clothing, **take inspiration from the style, color, and type of outfit in the first image**, then create a *new* outfit that is naturally harmonious with the shoes (from the second image) and the requested background. You have creative freedom with the pose and body shape to create an appealing composition. ${actionPrompt}`;
      
      const descriptionPrompt = description 
        ? `For the background, use this description: ${description}.` 
        : "Use a clean, professional studio background.";

      finalPrompt = [basePrompt, descriptionPrompt, qualityPrompt].join(' ');
  }

  const textPart = {
      text: finalPrompt
  }
  parts.push(textPart);

  const generateSingleImage = async (): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: parts,
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    const candidate = response.candidates?.[0];

    // Case 1: No candidates returned, possibly due to safety filters.
    if (!candidate) {
        // Log the full response for debugging safety issues
        console.error("Gemini API returned no candidates. Full response for debugging:", JSON.stringify(response, null, 2));
        const blockReason = (response as any).promptFeedback?.blockReason;
        if (blockReason) {
             throw new Error(`Image generation blocked. Reason: ${blockReason}.`);
        }
        throw new Error("AI failed to generate a response. Please try again.");
    }

    // Case 2: Candidate exists, check for an image part.
    for (const part of candidate.content?.parts || []) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }
    
    // Case 3: No image part found, check for a text-only response which might be an error or refusal.
    const textResponse = response.text?.trim();
    if (textResponse) {
        console.error("Gemini API returned text instead of an image:", textResponse);
        throw new Error(`AI returned a text message instead of an image: "${textResponse}"`);
    }

    // Case 4: Fallback for unexpected response structure.
    console.error("No image data found in the successful API response. Full candidate:", JSON.stringify(candidate, null, 2));
    throw new Error("No image was generated by the API in this request.");
  }

  try {
    const images: string[] = [];
    // This loop now waits for each image to be generated before starting the next one.
    // This prevents the "429 Too Many Requests" error.
    for (let i = 0; i < numberOfImages; i++) {
        const image = await generateSingleImage();
        images.push(image);
    }
    return images;

  } catch (error) {
    // Log the actual, detailed error for developers to debug
    console.error("Gemini Generation Error [Internal Log]:", error);
    // Throw a generic error for the UI to handle gracefully
    throw new Error("GENERIC_NETWORK_ERROR");
  }
};
