import 'dotenv/config';

async function listMyModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error de acceso:", data.error?.message);
      return;
    }

    console.log("--- MODELOS DISPONIBLES PARA TU KEY ---");
    data.models.forEach(m => {
      // Filtramos para ver solo los que sirven para generar contenido
      if (m.supportedGenerationMethods.includes("generateContent")) {
        console.log(`✅ ID: ${m.name.split('/').pop()} | Nombre: ${m.displayName}`);
      }
    });
    console.log("---------------------------------------");

  } catch (err) {
    console.error("Fallo al conectar:", err.message);
  }
}

listMyModels();