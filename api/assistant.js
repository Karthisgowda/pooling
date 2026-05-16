const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: "GROQ_API_KEY is not configured." });
  }

  const { message, rides = [] } = request.body ?? {};

  if (!message || typeof message !== "string") {
    return response.status(400).json({ error: "Message is required." });
  }

  const groqResponse = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      max_tokens: 350,
      messages: [
        {
          role: "system",
          content:
            "You are a professional cab sharing assistant. Help users compare rides, understand availability, and write concise ride-planning guidance. Do not invent rides that are not in the provided data.",
        },
        {
          role: "user",
          content: `Current rides JSON: ${JSON.stringify(rides).slice(0, 6000)}\n\nUser question: ${message}`,
        },
      ],
    }),
  });

  if (!groqResponse.ok) {
    const errorText = await groqResponse.text();
    return response.status(502).json({ error: "Groq request failed.", detail: errorText });
  }

  const data = await groqResponse.json();
  return response.status(200).json({ reply: data.choices?.[0]?.message?.content ?? "No response returned." });
};
