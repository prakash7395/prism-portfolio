
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("API key missing in .env");
  process.exit(1);
}

console.log("Testing Gemini REST API...");

try {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: "Reply with only OK" }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 20,
        },
      }),
      signal: AbortSignal.timeout(120000),
    }
  );

  const data = await response.json();

  console.log("HTTP Status:", response.status);

  if (!response.ok) {
    console.log("API Error:", JSON.stringify(data.error || data));
  } else {
    console.log(
      "Gemini Reply:",
      data.candidates?.[0]?.content?.parts?.[0]?.text
    );
  }
} catch (error) {
  console.error("REST Test Failed:", error.message);
}
