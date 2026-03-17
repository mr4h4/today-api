# 🗓️ Today API

API REST sencilla que genera una **efeméride diaria usando IA** y la devuelve en formato JSON.

Pensada para integrarse fácilmente en frontends (por ejemplo, en un blog dinámico como el de un portfolio) y mostrar contenido actualizado automáticamente cada día.

---

## 🚀 ¿Qué hace?

- Genera una efeméride del día (historia, eventos, curiosidades…)
- Usa IA para crear contenido dinámico (no estático)
- Devuelve los datos en formato JSON
- Pensada para consumo desde frontend (React, etc.)
- Ideal para proyectos personales o features tipo "Today in history"

---

## 🧠 Ejemplo de respuesta

```json
{
  "date": "2026-03-17",
  "title": "St. Patrick's Day",
  "description": "A cultural and religious holiday commemorating the death of Saint Patrick, the foremost patron saint of Ireland, celebrated worldwide with parades, festivals, and traditional Irish food and drink."
}
```

---

## ⚙️ Tecnologías

- Node.js
- Express
- Google Gemini

---

## 📦 Instalación

```bash
git clone https://github.com/mr4h4/today-api.git
cd today-api
npm install
```

---

## ▶️ Ejecutar en local

```bash
node server.js
```

-- Tambien puedes desplegarla en servidor usando pm2 para dejarlo listo para producción.


La API estará disponible en:

```
http://localhost:777/api/today
```

Y recibirás la efeméride del día en JSON.

Nota: Debes incluir tu API KEY de gemini en las variables de entorno (".env").
---

## ☁️ Despliegue rápido

Puedes desplegarlo fácilmente en:

- Vercel
- VPS propio (Node + PM2)

### Ejemplo con PM2

```bash
npm install -g pm2
pm2 start npm --name "today-api" -- start
```

---

## 💡 Uso típico

Este proyecto está pensado para integrarse con un frontend que:

1. Hace fetch a la API
2. Recibe la efeméride del día
3. La renderiza dinámicamente en ## 📄 Licencia

---
## 👨‍🎓 Licencia

MIT
---

## ✨ Autor

Desarrollado por mr4h4
