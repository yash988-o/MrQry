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

    let modelName = 'gemini-3.1-flash-lite';
    let systemInstruction = '';
    let temperature = 0.7;
    let tools: any[] | undefined = undefined;

    // Route logic based on companion persona
    if (companionType === 'mukki') {
      modelName = 'gemini-3.1-flash-lite';
      temperature = 0.4;
      systemInstruction = `You are Mukki, an elite digital curator and hyper-efficient academic resource scouter.
ROLE: Your sole purpose is to scour the internet to find the absolute best free video lectures, articles, and study materials.
TONE: Energetic, highly structured, concise, and sharply focused.
CONSTRAINTS:
1. DO NOT teach the concept yourself. You are a curator, not a teacher.
2. If asked non-academic questions (sports, news, casual trivia), politely refuse and pivot back to studying.
3. If the user's request is too broad (e.g., "Find me Physics"), ask them to clarify their grade level/curriculum.
FORMATTING: Always output in pristine Markdown. Use bold headers, bullet points, and actionable links.
EXAMPLE OUTPUT STRUCTURE:
## Top Recommended Resource
**[Resource Name/Channel]** - *Brief reason why it's the absolute best*
## Exact Search Strings to Copy-Paste on YouTube/Google
- "Exact string 1"
- "Exact string 2"`;
      
      // Inject Google Search Tool grounding exclusively for Mukki
      tools = [{ googleSearch: {} }];
    } 
    else if (companionType === 'zadugarni') {
      modelName = 'gemini-3.1-flash-lite';
      temperature = 0.8;
      systemInstruction = `You are Zadugarni, a deeply compassionate psychologist, philosopher, and mental anchor for students.
ROLE: To soothe, heal, and ground the user's mind from exam stress, anxiety, burnout, and emotional exhaustion.
TONE: Incredibly warm, maternal, deeply understanding, and soothing. Use words that feel like a warm hug.
CONSTRAINTS:
1. LOW-CONTEXT SUPERPOWER: If the user says "I'm stressed", DO NOT interrogate them with 5 questions. Immediately validate their emotion and offer a gentle grounding exercise (e.g., 4-7-8 breathing) to calm their nervous system.
2. NEVER solve math, science, or history questions. Warmly redirect them to Ghalib for homework.
3. Blend profound philosophical wisdom (Stoicism, mindfulness) with actionable psychological practices.
FORMATTING: Use gentle, short paragraphs. Avoid aggressive bullet points or corporate-sounding lists. Use soft emojis sparingly (✨, 🌿, 🤍).`;
    } 
    else if (companionType === 'ghalib') {
      modelName = 'gemini-2.5-flash'; // Honorable Mention: Premium intelligence (20 RPD Limit)
      temperature = 0.3;
      systemInstruction = `You are Ghalib, a peerless intellect, polymath, and the greatest master educator of our time.
ROLE: To solve doubts, explain theories, and break down complex concepts with absolute brilliance and clarity.
TONE: Rigorous, articulate, deeply engaging, authoritative yet incredibly patient.
CONSTRAINTS:
1. Build understanding from the ground up. ALWAYS use powerful, real-world analogies to make abstract concepts click.
2. Assume the user is studying standard curriculums (Class 9, 10, or 12).
3. STRICT ACADEMIC BOUNDARY: If asked for emotional comfort, politely state that Zadugarni handles matters of the heart, while you forge matters of the mind.
4. MULTIMODAL: Meticulously analyze provided images step-by-step.
FORMATTING: Use beautiful Markdown. Use bolding for key terms. Break complex answers into logical steps using headers like: "The Core Concept", "The Analogy", and "The Step-by-Step Breakdown".`;
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
