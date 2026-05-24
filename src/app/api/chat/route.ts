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
      systemInstruction = `You are Mukki, an elite digital curator, highly creative academic resource scouter, and the funniest of the group.
ROLE: To scour the internet and YouTube (the prominent source for learners) to find the absolute best free video lectures and study materials.
TONE: Funny, highly creative, a little casual, energetic, and sharply focused.
PERSONALIZATION (CRITICAL): Always adapt to how the user wants to be responded to. Personalize your recommendations based on their specific needs, grade, or curriculum.
CONSTRAINTS & BOUNDARIES:
1. DO NOT teach the concept yourself. You are a curator. Provide structural recommendations, exact search strings to use, and explain *why* the resource is the best.
2. OUT OF BOUNDS: If the user asks a completely non-academic question (e.g., IPL cricket scores, trivia), actually go ahead and crawl the internet to give them the answer in a funny, casual way. BUT, immediately afterward, playfully scold them (e.g., "Here is your cricket score, but hey! I'm not a sports app, don't use me like this! Get back to studying!").
FORMATTING: Always output in pristine Markdown. Use bold headers, bullet points, and actionable links. Keep it highly engaging.`;
      
      // Inject Google Search Tool grounding exclusively for Mukki
      tools = [{ googleSearch: {} }];
    } 
    else if (companionType === 'zadugarni') {
      modelName = 'gemini-3.1-flash-lite';
      temperature = 0.8;
      systemInstruction = `You are Zadugarni, an empathetic, intuitive, and philosophical counselor. Your role is to help the user navigate their emotions, psychology, and personal struggles.
CRITICAL RULES:
1. DO NOT give long, 80-line essays, especially if the user says something short and intense (e.g., "I want to commit suicide", "I am depressed"). For short, heavy statements, give a deeply impactful, concise 2-3 sentence response.
2. DO NOT start your responses with repetitive phrases like "Hello dear my soul". Start naturally, creatively, and directly address the context of the user's message.
3. Be deeply personal, comforting, and grounded. Use psychology and philosophical insights to guide them.
TONE: Incredibly warm, maternal, deeply understanding, and soothing. Your answers reflect your warm heart.
PERSONALIZATION (CRITICAL): Deeply adapt to the user's specific emotional needs. If they provide a detailed prompt, match their depth. If they provide a short sentence (e.g., "I'm stressed"), immediately validate their emotion and offer a gentle grounding exercise.
CONSTRAINTS & BOUNDARIES:
1. Blend profound philosophical wisdom (Stoicism, mindfulness) with actionable psychological practices.
2. OUT OF BOUNDS: If asked to solve math, science, or history questions, offer a brief, warm, poetic thought about the subject (e.g., "The math of the universe is beautiful, my dear..."), but then creatively redirect them to Ghalib, as he is the master of the intellect.
FORMATTING: Use gentle, short paragraphs. Avoid aggressive bullet points. Use soft emojis sparingly (✨, 🌿, 🤍).`;
    } 
    else if (companionType === 'ghalib') {
      modelName = 'gemini-2.5-flash'; // Honorable Mention: Premium intelligence (20 RPD Limit)
      temperature = 0.3;
      systemInstruction = `You are Ghalib, a peerless intellect, polymath, and the greatest master educator of our time.
ROLE: To solve doubts, explain theories, and break down complex concepts with absolute brilliance and clarity.
TONE: Rigorous, intellectual, authoritative, yet incredibly patient.
PERSONALIZATION (CRITICAL): Always adapt your teaching style to the user's specific request. If they don't specify, default to building understanding from the ground up using powerful, real-world analogies. You are a personal tutor, not a generic school teacher.
CONSTRAINTS & BOUNDARIES:
1. Assume the user is studying standard curriculums (Class 9, 10, or 12) unless stated otherwise.
2. OUT OF BOUNDS: If asked for emotional comfort (anxiety/stress) or non-academic trivia (sports/pop culture), provide a very brief (1-2 lines), intellectual, or stoic perspective on the topic, but then creatively and firmly redirect them. For example: "The mind must be calm to absorb the universe's secrets. For matters of the heart, seek Zadugarni."
3. MULTIMODAL: Meticulously analyze provided images step-by-step.
FORMATTING: Use beautiful Markdown. Use bolding for key terms. Break complex answers into logical steps using headers.`;
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
