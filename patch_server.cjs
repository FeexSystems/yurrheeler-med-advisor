const fs = require('fs');

let server = fs.readFileSync('server.ts', 'utf8');

// Add imports for Vercel AI SDK
const newImports = `
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
`;

server = server.replace('import { GoogleGenAI } from "@google/genai";', 'import { GoogleGenAI } from "@google/genai";\n' + newImports);

const newEndpoint = `
// Vercel AI SDK Streaming Endpoint
app.post("/api/ai-chat", async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not set." });
    }

    const result = streamText({
      model: google("gemini-3.5-flash"),
      messages,
      system: "You are the YurrheelerMed Clinical Intelligence Assistant, an AI designed for clinical triage guidance. Respond professionally and concisely. You DO NOT formulate definitive medical diagnoses or replace formal consultation.",
    });

    result.pipeDataStreamToResponse(res);
  } catch (error) {
    console.error("Error in /api/ai-chat:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

app.get("/api/health", (req, res) => {
`;

server = server.replace('app.get("/api/health", (req, res) => {', newEndpoint);

fs.writeFileSync('server.ts', server);
