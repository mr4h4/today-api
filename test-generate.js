import fs from "fs";
import path from "path";
import { generateHolidayJSON } from "./llm.js"; // Importa tu función de Gemini

const DATA_FOLDER = "./data";

async function test() {
  const today = new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD
  const filePath = path.join(DATA_FOLDER, `${today}.json`);

  try {
    console.log("Generando JSON para:", today);
    const holiday = await generateHolidayJSON(today);

    if (!fs.existsSync(DATA_FOLDER)) fs.mkdirSync(DATA_FOLDER);

    fs.writeFileSync(filePath, JSON.stringify(holiday, null, 2), "utf-8");
    console.log("JSON generado en:", filePath);
    console.log(holiday);
  } catch (err) {
    console.error("Error generando JSON:", err);
  }
}

test();