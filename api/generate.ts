
import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageQuality, ModelAction, ImageType } from '../App';

// Vercel Edge Functions không hỗ trợ đầy đủ Node.js API, nhưng biến môi trường thì có.
// Lưu ý: Tên biến ở đây là GEMINI_API_KEY vì đó là tên chúng ta đặt trong Vercel.
const API_KEY = process.env.GEMINI_API_KEY;

// Cấu hình để Vercel triển khai file này dưới dạng Edge Function cho tốc độ tối ưu.
export const runtime = 'edge';

// Hàm chính xử lý yêu cầu POST từ giao diện người dùng
export default async function POST(request: Request) {
  try {
    if (!API_KEY) {
      console.error("API key not found on server.");
      return new Response(JSON.stringify({ error: "Server configuration error: API key missing." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const {
      characterImage,
      shoeImage,
      description,
      quality,
      numberOfImages,
      modelAction,
      imageType
    } = body;
    
    // --- Logic tạo ảnh được chuyển từ geminiService.ts vào đây ---

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const shoeImagePart = {
      inlineData: {
        mimeType: shoeImage.mimeType,
        data: shoeImage.base64,
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

        const basePrompt = `**CRITICAL TECHNICAL DIRECTIVE: PRODUCT RE-STAGING ON A NEW, CONTEXTUAL TURNTABLE.** **ROLE:** You are a professional digital product staging artist. Your task is to take a product image, place it on a new, contextually appropriate turntable, and then set the entire scene in a new background. **TECHNICAL EXECUTION - A THREE-STEP PROCESS:** **STEP 1: PRODUCT ISOLATION** - From the user-provided image, perfectly isolate **only the product (the footwear)**. - Ignore and discard everything else from the original image (the original background, any original turntable/stand, etc.). - This isolated footwear is now the **"Pristine Product Layer"**. This layer is SACROSANCT. **STEP 2: SCENE GENERATION** - Based on the user's context description, generate a complete scene with two components: 1.  A **"Contextual Background"**: The overall environment (e.g., 'a marble countertop in a luxury store', 'a wooden dock by a lake'). 2.  A **"Contextual Turntable"**: A product display stand, pedestal, or turntable that fits PERFECTLY with the background's material, style, and lighting (e.g., 'a sleek, white acrylic stand' for a studio, 'a rustic, worn wooden block' for a forest). - The final output canvas is a 9:16 aspect ratio. **STEP 3: FINAL COMPOSITING** - Place the **"Pristine Product Layer"** realistically onto the **"Contextual Turntable"** you just generated. - Ensure the lighting on the product matches the new scene's lighting, and cast a soft, realistic shadow from the product onto the turntable. **UNBREAKABLE RULES FOR THE "PRISTINE PRODUCT LAYER":** -   **ZERO CROPPING:** It is absolutely forbidden to crop, cut, or obscure any part of the product. Any clipping of the product is a critical failure. -   **ZERO ENLARGEMENT:** You must not scale the product larger than its original size. -   **FIT TO FRAME:** The entire composition (product on turntable) must fit completely within the 9:16 canvas with a small, professional margin around it. If necessary, scale DOWN the composition (product + turntable together) to fit. -   **NO DISTORTION:** Do not rotate, warp, or change the perspective of the product in an unnatural way.`;

        finalPrompt = [basePrompt, descriptionPrompt, qualityPrompt].join(' ');
    } else { // imageType === 'model'
        if (!characterImage) {
           return new Response(JSON.stringify({ error: "Character image is required for this generation type." }), { status: 400 });
        }
        const characterImagePart = {
          inlineData: {
            mimeType: characterImage.mimeType,
            data: characterImage.base64,
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

    const textPart = { text: finalPrompt };
    parts.push(textPart);

    const generateSingleImage = async (): Promise<string> => {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
        });
        const candidate = response.candidates?.[0];
        if (!candidate) {
            const blockReason = (response as any).promptFeedback?.blockReason;
            if (blockReason) throw new Error(`Image generation blocked. Reason: ${blockReason}.`);
            throw new Error("AI failed to generate a response.");
        }
        for (const part of candidate.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        const textResponse = response.text?.trim();
        if (textResponse) throw new Error(`AI returned a text message: "${textResponse}"`);
        throw new Error("No image was generated by the API.");
    };

    const images: string[] = [];
    for (let i = 0; i < numberOfImages; i++) {
        const image = await generateSingleImage();
        images.push(image);
    }
    
    return new Response(JSON.stringify({ images }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Error in API route:", error);
    return new Response(JSON.stringify({ error: error.message || "An unknown server error occurred." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
