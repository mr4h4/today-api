import 'dotenv/config';

export async function generateHolidayJSON(date) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  // USAMOS EL MODELO QUE TU KEY SÍ TIENE: gemini-2.5-flash
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

const promptText = `
Context: You are a historian and expert chronicler of globally recognized historical events and international observances.

Task: Return the most relevant **real, documented, and globally significant** holiday or historical event for the date: ${date}.

Strict instructions:
1. Return ONLY a JSON object with exactly these fields:
{
  "date": "${date}",
  "title": "Official name of the holiday or historical event",
  "description": "A short, precise, and verifiable description of the event"
}

2. The event MUST be globally relevant and widely recognized. It must NOT be:
- Local or regional celebrations
- National-only holidays without global recognition
- Obscure cultural or religious festivals limited to specific countries or communities
- Internet trends, folklore, or unofficial commemorations

3. The event SHOULD be one of the following types:
- United Nations international days (e.g. World Health Day, International Women’s Day)
- Major world historical events (wars, treaties, revolutions, global political milestones)
- Scientific breakthroughs with global impact
- Birth or death of globally influential historical figures, scientists, leaders, or cultural icons
- Major cultural events recognized internationally (e.g. moon landing, fall of Berlin Wall)
- Global humanitarian or environmental observances promoted by organizations like UN, UNESCO, WHO, etc.

4. Prioritize:
- Global historical impact > international recognition > cultural relevance

5. If multiple valid events exist, choose the most globally significant one.

6. Do not invent events.

7. Do not use markdown, code blocks, or any extra text.

8. If there is no highly significant global event for this exact date, still return the most relevant **real historical event or observance available worldwide**, prioritizing:
- Lesser-known but still internationally documented events
- Secondary historical events from major world history
- Recognized but less prominent international observances

9. Ensure the output remains factual, verifiable, and globally contextualized at all times.
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

    // Estructura prompt Gemini
    const text = data.candidates[0].content.parts[0].text;
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    return JSON.parse(cleanJson);

  } catch (err) {
    console.error("❌ Error motor Gemini 2.5:", err.message);
    // Fallback por si acaso
    return {
        title: "Something went wrong",
        description: "We’re having trouble loading today’s highlights. Please try again later."
    };
  }
}