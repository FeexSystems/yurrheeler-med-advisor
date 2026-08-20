const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// We want to replace the if (ai) block in /api/chat to catch errors and fallback.
code = code.replace(
`    if (ai) {
      const contents: Array<{ role: "user" | "model"; parts: { text: string }[] }> = [];`,
`    if (ai) {
      try {
        const contents: Array<{ role: "user" | "model"; parts: { text: string }[] }> = [];`
);

code = code.replace(
`      return res.json({
        response: text,
        model: "gemini-3.5-flash",
        groundingMetadata: response.candidates?.[0]?.groundingMetadata,
      });
    }

    // Fallback if API key is not configured: intelligent clinical rule-based response`,
`      return res.json({
        response: text,
        model: "gemini-3.5-flash",
        groundingMetadata: response.candidates?.[0]?.groundingMetadata,
      });
      } catch (aiError: any) {
        console.error("AI API Error, falling back to rule-based response:", aiError.message || aiError);
        // Continue to fallback response below
      }
    }

    // Fallback if API key is not configured or rate limited: intelligent clinical rule-based response`
);

// Same for /api/generate-summary
code = code.replace(
`    if (ai) {
      const response = await ai.models.generateContent({`,
`    if (ai) {
      try {
        const response = await ai.models.generateContent({`
);

code = code.replace(
`      return res.json({
        summaryDocument: summaryDoc,
        triageLevel,
        agentName: consultant,
        agentSpecialty: specialty,
        generatedAt: new Date().toISOString(),
      });
    }

    // Fallback deterministic summary generator`,
`      return res.json({
        summaryDocument: summaryDoc,
        triageLevel,
        agentName: consultant,
        agentSpecialty: specialty,
        generatedAt: new Date().toISOString(),
      });
      } catch (aiError: any) {
        console.error("AI API Error during summary, falling back to rule-based generator:", aiError.message || aiError);
        // Continue to fallback
      }
    }

    // Fallback deterministic summary generator`
);


// And for /api/ai-chat, let's catch the stream error if possible, though streamText handles some things.
// Actually streamText will throw immediately if rate limit happens during init.
code = code.replace(
`    const result = streamText({
      model: google("gemini-3.5-flash"),
      messages,
      system: "You are the YurrheelerMed Clinical Intelligence Assistant, an AI designed for clinical triage guidance. Respond professionally and concisely. You DO NOT formulate definitive medical diagnoses or replace formal consultation.",
    });

    result.pipeDataStreamToResponse(res);
  } catch (error) {`,
`    const result = streamText({
      model: google("gemini-3.5-flash"),
      messages,
      system: "You are the YurrheelerMed Clinical Intelligence Assistant, an AI designed for clinical triage guidance. Respond professionally and concisely. You DO NOT formulate definitive medical diagnoses or replace formal consultation.",
    });

    result.pipeDataStreamToResponse(res);
  } catch (error: any) {
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      return res.status(429).json({ error: "Gemini API quota exceeded. Please try again later or configure your own API key." });
    }`
);

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts");
