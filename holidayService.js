import 'dotenv/config';
import fs from "fs";
import path from "path";

const DATA_FOLDER = "./data";

/**
 * Función interna: Llama a la API de Gemini 2.5 Flash
 */
async function generateFromAI(date) {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Si la clave no está, lanzamos error antes de intentarlo
    if (!apiKey) {
        throw new Error("API Key no configurada en el archivo .env");
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const promptText = `
        Context: You are a historian and expert chronicler of holidays worldwide.
        Task: Return the most relevant real holiday or historical event for the date: ${date}.
        
        Strict instructions:
        1. Return ONLY a JSON object:
        {
          "date": "${date}",
          "title": "Official name of the event",
          "description": "Short, precise, and verifiable description"
        }
        2. Do not use markdown, code blocks, or extra text.
        3. If no event exists, use title "No known historical event".
    `;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || 'Error en la petición a Gemini');
    }

    const text = data.candidates[0].content.parts[0].text;
    // Limpieza de posibles bloques de código markdown
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    return JSON.parse(cleanJson);
}

/**
 * Función principal: Gestiona la caché y la generación (Lo que hacía tu test)
 */
export async function getOrGenerateHoliday(date) {
    // Aseguramos que la carpeta exista
    if (!fs.existsSync(DATA_FOLDER)) {
        fs.mkdirSync(DATA_FOLDER, { recursive: true });
    }

    const filePath = path.join(DATA_FOLDER, `${date}.json`);

    // 1. Intentar leer del archivo (Caché)
    if (fs.existsSync(filePath)) {
        console.log(`[Cache] Leyendo efeméride desde: ${date}.json`);
        const cachedData = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(cachedData);
    }

    // 2. Si no hay archivo, generamos con la IA
    try {
        console.log(`[IA] Generando contenido para la fecha: ${date}...`);
        const holiday = await generateFromAI(date);

        // 3. Guardamos el resultado para la próxima vez
        fs.writeFileSync(filePath, JSON.stringify(holiday, null, 2), "utf-8");
        console.log(`[Sistema] Archivo guardado correctamente en ${filePath}`);

        return holiday;

    } catch (err) {
        console.error("❌ Error en holidayService:", err.message);
        
        // Fallback en caso de error crítico para no romper el server
        return {
            date: date,
            title: "Día de la Historia Digital",
            description: "Un momento para reflexionar sobre el pasado y el futuro de la red."
        };
    }
}