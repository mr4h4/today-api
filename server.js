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
    const today = new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD
    const filePath = path.join(DATA_FOLDER, `efemeride.json`);

    try {
        // 3. Lógica de caché con validación por contenido
        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, "utf-8");

            let data;
            try {
                data = JSON.parse(raw);
            } catch {
                data = null; // archivo corrupto
            }

            // 👇 comprobamos si el contenido es de hoy
            if (data && data.date === today) {
                console.log(`Sirviendo desde caché: ${today}`);
                return res.json(data);
            }
        }

        // 4. Si no existe o está desactualizado → generar
        console.log(`Generando nueva efeméride para: ${today}`);
        const holiday = await generateHolidayJSON(today);

        // 👇 añadimos la fecha al JSON
        const result = {
            date: today,
            ...holiday
        };

        // 5. Sobrescribimos siempre el mismo archivo
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2), "utf-8");
        console.log(`Archivo actualizado: ${filePath}`);

        // 6. Enviar respuesta
        res.json(result);

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
    console.log(`🚀 Server running on http://localhost:${PORT}/api/today`);
});