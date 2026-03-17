import 'dotenv/config'; 
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { generateHolidayJSON } from "./llm.js";

const app = express();
app.use(cors());

const DATA_FOLDER = "./data";

// 1. Asegurar que la carpeta existe al arrancar el servidor
if (!fs.existsSync(DATA_FOLDER)) {
    fs.mkdirSync(DATA_FOLDER, { recursive: true });
}

app.get("/api/today", async (req, res) => {
    // 2. Usamos el mismo formato que en tu test-generate.js para ser consistentes
    const today = new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD
    const filePath = path.join(DATA_FOLDER, `${today}.json`);

    try {
        // 3. Lógica de Caché: Si el archivo ya existe, lo leemos y enviamos
        if (fs.existsSync(filePath)) {
            console.log(`Sirviendo desde caché: ${today}`);
            const data = fs.readFileSync(filePath, "utf-8");
            return res.json(JSON.parse(data)); 
        }

        // 4. Si no existe, generamos con Gemini 2.5
        console.log(`Generando nueva efeméride para: ${today}`);
        const holiday = await generateHolidayJSON(today);

        // 5. Guardar el resultado en disco (formateado para que se vea bien)
        fs.writeFileSync(filePath, JSON.stringify(holiday, null, 2), "utf-8");
        console.log(`Archivo guardado con éxito en: ${filePath}`);

        // 6. Enviar respuesta al cliente
        res.json(holiday);

    } catch (err) {
        console.error("❌ Error en el endpoint /api/today:", err.message);
        res.status(500).json({ 
            error: "No se pudo obtener la efeméride", 
            message: err.message 
        });
    }
});

const PORT = 777;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}/today/api`);
});