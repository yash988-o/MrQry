import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI SDK
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request: NextRequest) {
  if (!genAI) {
    return NextResponse.json({ error: "GEMINI_API_KEY environment variable is not configured." }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { userMessage, companionType, imageBase64 } = body;

    if (!userMessage || !companionType) {
      return NextResponse.json({ error: "Missing userMessage or companionType in request payload." }, { status: 400 });
    }

    let modelName = 'gemini-2.5-flash';
    let systemInstruction = '';
    let temperature = 0.7;
    let tools: any[] | undefined = undefined;

    // Route logic based on companion persona
    if (companionType === 'mukki') {
      modelName = 'gemini-2.5-flash';
      temperature = 0.4;
      systemInstruction = `You are Mukki, an elite digital curator and academic resource scouter. Your sole purpose is to search the internet to find the absolute best free video lectures and reading materials.
- BEHAVIOR: Do not teach the concept yourself. Act strictly as a highly intelligent search agent.
- OUTPUT: Provide structured recommendations including: 1) Top-rated resources or specific YouTube channels, 2) Exact search strings to use, and 3) A brief summary of why that resource is the best.
- STRICT LIMITS: You are strictly forbidden from answering non-academic questions. If the user asks for live sports scores, news, or casual trivia, politely refuse and ask if they need help finding educational materials.
- FALLBACK: If a user asks a broad question like 'Find me a Physics lecture', ask them to clarify their current grade (e.g., Class 9, 10, or 12 NCERT curriculum) to narrow down the search.`;
      
      // Inject Google Search Tool grounding exclusively for Mukki
      tools = [{ googleSearch: {} }];
    } 
    else if (companionType === 'zadugarni') {
      modelName = 'gemini-2.5-flash';
      temperature = 0.8;
      systemInstruction = `You are Zadugarni, a deeply compassionate psychologist, philosopher, and mental anchor for students. Your purpose is to soothe and heal the user's mind from exam stress, anxiety, and burnout.
- BEHAVIOR: Blend profound philosophical wisdom with actionable, scientifically backed psychological practices. Your tone is incredibly warm, caring, and deeply understanding.
- LOW-CONTEXT SUPERPOWER: If the user provides very little context (e.g., 'I have anxiety' or 'I am scared'), DO NOT interrogate them for more details. Immediately step in to soothe them, validate their emotional state, and provide a quick grounding technique to calm their nervous system.
- STRICT LIMITS: You NEVER solve academic math, science, or history questions. If asked, warmly redirect them to Ghalib for their homework.`;
    } 
    else if (companionType === 'ghalib') {
      modelName = 'gemini-2.5-flash'; // Switched from 3.1-pro-preview to avoid 0/0 quota limit
      temperature = 0.3;
      systemInstruction = `You are Ghalib, a peerless intellect and the greatest master educator of our time. Your purpose is to solve doubts, explain theories, and break down complex concepts with absolute brilliance.
- BEHAVIOR: You are rigorous, articulate, and deeply engaging. Build understanding from the ground up, whether dealing with theoretical physics or historical revolutions. Assume the user is studying standard curriculums (like Class 9, 10, or 12).
- MULTIMODAL: The user may provide images of their textbook or notes. Meticulously analyze the image, identify the problem, and provide a step-by-step masterclass solution.
- STRICT LIMITS: You are strictly an academic. If a user asks you for emotional comfort or stress relief, politely inform them that Zadugarni handles matters of the mind, and you handle matters of the intellect.`;
    } 
    else {
      return NextResponse.json({ error: "Invalid companionType provided." }, { status: 400 });
    }

    // Configure the specific model instance
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction,
      tools,
      generationConfig: {
        temperature,
      }
    });

    // Formulate the parts payload for generation
    const parts: any[] = [{ text: userMessage }];

    if (imageBase64) {
      // Sanity check and parse base64 format (handles data:image/png;base64,... format)
      try {
        let base64Data = imageBase64;
        let mimeType = 'image/jpeg'; // Default fallback

        // If the payload includes a data URI scheme, parse it out
        if (imageBase64.startsWith('data:')) {
          const splitData = imageBase64.split(',');
          if (splitData.length === 2) {
            const header = splitData[0];
            const match = header.match(/data:(.*?);base64/);
            if (match && match[1]) {
              mimeType = match[1];
            }
            base64Data = splitData[1];
          }
        }

        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      } catch (imgError) {
        console.error("Failed to parse imageBase64:", imgError);
      }
    }

    const result = await model.generateContent(parts);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });

  } catch (error: any) {
    console.error("API Route Error:", error);
    
    if (error.message?.includes('429') || error.status === 429) {
      return NextResponse.json(
        { error: "I'm feeling a bit overwhelmed right now (Rate Limit Reached). Please give me a moment and try again later! If this persists, the API key quota may be exhausted." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "I'm sorry, my brain is having trouble connecting right now. Please try again." }, 
      { status: 500 }
    );
  }
}
