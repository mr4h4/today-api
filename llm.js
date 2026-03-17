import 'dotenv/config';

export async function generateHolidayJSON(date) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  // USAMOS EL MODELO QUE TU KEY SÍ TIENE: gemini-2.5-flash
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

const promptText = `
Context: You are a historian and expert chronicler of official holidays and historical events worldwide. Your goal is to provide accurate and verifiable information.

Task: Return the most relevant **real and documented** holiday or historical event for the date: ${date}.

Strict instructions:
1. Return **ONLY a JSON object** with exactly these fields:
{
  "date": "${date}",
  "title": "Official name of the holiday or historical event",
  "description": "A short, precise, and verifiable description of the event"
}
2. Do not invent holidays or events.
3. Do not use markdown, code blocks, or any extra text.
4. If there is no known historical event for this date, return:
{
  "date": "${date}",
  "title": "No known historical event",
  "description": "There are no verified events for this date"
}
`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error de la API:", data);
      throw new Error(data.error?.message || 'Error en la petición');
    }

    // En Gemini 2.x la estructura sigue siendo la misma
    const text = data.candidates[0].content.parts[0].text;
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    return JSON.parse(cleanJson);

  } catch (err) {
    console.error("❌ Error motor Gemini 2.5:", err.message);
    // Fallback por si acaso
    return {
        date: date,
        title: "No Historical Event Today",
        description: "No verified events today. Perfect excuse to start a new tradition!"
    };
  }
}