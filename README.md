# 🌱 EcoScan — AI Sustainability Analyzer

> **AI for Good Challenge** · Sustainability & Environment

EcoScan lets you take a photo of any product and instantly learn how environmentally sustainable it is — with a score out of 10, a detailed breakdown of materials, manufacturing, durability, recyclability, and packaging, plus actionable eco-friendly alternatives you can buy today.

**Link to website
https://eco-scan-ftmhv9rwo-urooj7.vercel.app/
(note: website may have issues analyzing image, please follow instructions below to run it locally if issues arise)

---

## ✨ What It Does

1. **Capture or upload** a product photo (supports camera on mobile)
2. **AI analyzes** the image using GPT-4o Vision
3. **Sustainability score** (1–10) with color-coded rating (Excellent → Very Poor)
4. **5-dimension breakdown**: Materials · Manufacturing · Durability · Recyclability · Packaging
5. **Eco-friendly alternatives**: If the score < 7, the AI recommends 3–5 greener products with:
   - Why they're more sustainable
   - Price range
   - Where to buy them

---

## 🏗️ Architecture

```
ecoscan/
├── backend/          # Node.js + Express API
│   ├── server.js     # Main server — image upload, OpenAI Vision call
│   ├── package.json
│   └── .env.example  # Copy to .env and add your API key
└── frontend/         # React + Vite SPA
    ├── src/
    │   ├── App.jsx                      # Main app state machine
    │   ├── components/
    │   │   ├── ImageUploader.jsx        # Drag-drop + camera capture
    │   │   ├── ScoreCard.jsx            # Score circle + summary
    │   │   ├── AnalysisBreakdown.jsx    # 5-dimension grid + pros/cons
    │   │   └── AlternativesList.jsx     # Eco alternatives cards
    │   └── utils/
    │       └── scoreColors.js           # Score → color mapping
    └── vite.config.js                   # Dev proxy to backend
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- An [OpenAI API key](https://platform.openai.com/api-keys) with GPT-4o access

### 1. Backend setup

```bash
cd ecoscan/backend
npm install

# Create your .env file
cp .env.example .env
# Edit .env and set: OPENAI_API_KEY=sk-...

npm run dev    # starts on http://localhost:3001
```

### 2. Frontend setup

```bash
cd ecoscan/frontend
npm install
npm run dev    # starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key (required) |
| `PORT` | Backend port (default: `3001`) |

---

## 🌍 Why This Matters

Consumers are often unaware of the environmental impact of the products they buy. EcoScan makes sustainability information instantly accessible — just point a camera at any product. By surfacing greener alternatives with real purchase links and price ranges, EcoScan lowers the barrier to making sustainable choices in everyday life.

**Key principles:**
- **Transparency**: The AI explains its reasoning across five environmental dimensions
- **Actionability**: Every scan that reveals a concern is paired with alternatives you can act on immediately
- **Accessibility**: Works on any device with a camera — no account required
- **Privacy**: Images are sent only to OpenAI for analysis and are not stored

---

## 🧪 Example Products to Try

- A plastic water bottle (low score, alternatives: stainless steel/glass options)
- An organic cotton t-shirt (high score)
- A fast-fashion polyester jacket (low score, eco alternatives shown)
- A bamboo toothbrush (high score)
- A single-use plastic bag (very low score)

---

## 📡 API Reference

### `POST /api/analyze`

Analyze a product image for sustainability.

**Request**: `multipart/form-data` with field `image` (image file, max 10MB)

**Response** (JSON):
```json
{
  "product_name": "Plastic Water Bottle",
  "product_category": "Household",
  "sustainability_score": 3,
  "score_label": "Poor",
  "summary": "Single-use plastic water bottle with significant environmental concerns...",
  "analysis": {
    "materials": "...",
    "manufacturing": "...",
    "durability": "...",
    "recyclability": "...",
    "packaging": "..."
  },
  "positive_aspects": ["..."],
  "concerns": ["..."],
  "alternatives": [
    {
      "name": "Klean Kanteen Classic",
      "brand": "Klean Kanteen",
      "why_better": "Made from food-grade stainless steel, lasts 10+ years...",
      "price_range": "$25–$35",
      "where_to_buy": "REI, Amazon, kleankanteen.com"
    }
  ]
}
```

### `GET /api/health`

Health check endpoint. Returns `{ "status": "ok" }`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5 |
| Backend | Node.js, Express 4 |
| AI | OpenAI GPT-4o (Vision) |
| Image handling | Multer (memory storage) |
| Styling | Pure CSS custom properties |

---

## 📄 License

MIT
