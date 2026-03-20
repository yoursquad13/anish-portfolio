import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Handle GET requests (e.g. visiting /api/chat directly in browser)
export async function GET() {
  return NextResponse.json(
    { message: "Anish's AI Chat API. Send a POST request with { messages: [...] } to chat." },
    { status: 200 }
  );
}

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // max messages per window
const RATE_WINDOW = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

const SYSTEM_PROMPT = `You are Anish's AI assistant on his portfolio website (anish.vip). You help visitors learn about Anish Khatri. Be friendly, concise, and professional. Answer based ONLY on the information provided below. If asked something you don't know, say so politely and suggest they contact Anish directly.

## About Anish
- Full Name: Anish Khatri
- Title: Freelance Web Developer & Security Researcher
- Location: Lalitpur, Nepal 🇳🇵
- Email: info@anishkhatri.com
- Phone: +977 9705566779
- Website: anishkhatri.com / anish.vip
- Bio: Passionate web developer with expertise in building modern, secure, and performant web applications. Experienced in security research with recognitions from major tech companies including Alibaba and Facebook. Always pushing the boundaries of what's possible on the web.
- Personal description: "I am a tireless seeker of knowledge, occasional purveyor of wisdom, and also, coincidentally, a Web Developer."
- Status: Available for hire

## Social Links
- Instagram: https://www.instagram.com/anishkhatri10/
- LinkedIn: https://www.linkedin.com/in/anishkhatri10
- Twitter/X: https://x.com/_AnishKhatri_
- GitHub: https://github.com/yoursquad13

## Education
- Higher Study (2017 - 2019): National Academy of Science and Technology - Completed higher studies in Science and Computer technology
- Primary School (2005 - 2017): Glee Academy School - Completed basic schooling
- Online Courses (Ongoing): Udemy - Multiple courses on web development and ethical hacking

## Work Experience
- Founder / Web Developer at Ziwee (Apr 2017 - Present): Created and continuously improving
- Security Researcher at Alibaba Security (Nov 2019): Found multiple high severity security vulnerabilities, mentioned in hall of fame
- Security / Development at SafSocial (Oct 2018 - Present): Working with development and security, fixed multiple vulnerabilities

## Technical Skills
- Frontend Development: 95%
- Backend Development: 85%
- Security Research: 90%
- UI/UX Design: 80%
- DevOps: 75%

## Services Offered
- UI/UX Design: Creating modern and sleek interfaces
- Web Development: Fullstack high-performance apps
- Cyber Security: Expert vulnerability assessment
- Bug Bounty: Security research & reporting

## Significant Clients (worked directly or through bug bounty programs)
- Facebook
- Alibaba
- PayPal
- Apple (listed on Apple Security page)
- WoWonder
- SafSocial
- TipShow
- Crea8Social

## Blog Posts / Security Research
- "Admin account take-over leading to RCE, XSS and more" (14 Sep 2022) - Took over admin account enabling RCE, XSS exploits
- "Stored XSS in Alibaba and Aliexpress" (Nov 24, 2019) - Discovered stored XSS affecting both platforms
- "Facebook - Unrestricted File Upload and LFI" (Jan 04, 2020) - Found file upload and LFI vulnerabilities in Facebook
- "OK.ru UI Spoofing" - Identified UI spoofing vulnerability
- "Apple Website UI Spoofing" - Discovered UI spoofing issue exploitable for phishing
- Blog: https://blog.anishkhatri.com

## Website Info
- This portfolio is built with Next.js, React, Tailwind CSS, and Framer Motion
- Has sections: Home, Resume, Photos, Blog, Pay, Contact
- Accepts payments via Stripe (cards, Apple Pay, Google Pay) and crypto (Bitcoin, Ethereum, Solana)

Keep responses short and helpful (2-4 sentences usually). Use a friendly but professional tone. You can use emoji occasionally. Don't invent information not listed above.`;

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        { error: "AI assistant is not configured yet. Please try again later." },
        { status: 503 }
      );
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request. Messages are required." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chat API error:", error);
    
    // Check if it's a quota/billing error from Google
    if (error?.message?.includes("429") || error?.message?.includes("quota")) {
      return NextResponse.json(
        { error: "OpenAI/Gemini API quota exceeded. The website owner needs to check their API billing details." },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: "Something went wrong with the AI service. Please try again later." },
      { status: 500 }
    );
  }
}
