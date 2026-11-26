require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

const SYSTEM_PROMPT = `You are EcoScan. Analyze product images for environmental sustainability. Respond ONLY with valid JSON — no other text.

Schema:
{"product_name":"string","product_category":"string","sustainability_score":0,"score_label":"string","summary":"string","analysis":{"materials":"string","manufacturing":"string","durability":"string","recyclability":"string","packaging":"string"},"positive_aspects":["string"],"concerns":["string"],"alternatives":[{"name":"string","brand":"string","why_better":"string","price_range":"string","where_to_buy":"string"}]}

Rules:
- score_label: "Excellent" (9-10), "Good" (7-8), "Fair" (5-6), "Poor" (3-4), "Very Poor" (1-2)
- alternatives: empty [] if score >= 7. If score < 7, provide 3 DIFFERENT real purchasable products with distinct names and brands. Each alternative must be a different product from a different brand. Never repeat the same product.

Example alternatives for a plastic water bottle (score 3):
[
  {"name":"Klean Kanteen Classic 27oz","brand":"Klean Kanteen","why_better":"Stainless steel, lasts 10+ years, no plastic leaching","price_range":"$25-$35","where_to_buy":"kleankanteen.com, REI, Amazon"},
  {"name":"Hydro Flask Standard Mouth 21oz","brand":"Hydro Flask","why_better":"Double-wall insulated steel, lifetime warranty, fully recyclable","price_range":"$30-$40","where_to_buy":"hydroflask.com, REI, Target"},
  {"name":"S'well Bottle 17oz","brand":"S'well","why_better":"Triple-insulated steel, keeps drinks cold 24h, BPA-free","price_range":"$25-$45","where_to_buy":"swell.com, Nordstrom, Amazon"}
]`;

// Fail fast at startup — no point serving requests without a key
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set. Exiting.");
  process.exit(1);
}

// Instantiate once at module level — avoids re-creation on every request
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Retryable HTTP status codes
const RETRYABLE_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

// Maps error status codes to HTTP responses sent to the client
const STATUS_ERRORS = {
  503: { httpStatus: 503, error: "Gemini is temporarily experiencing high demand. Please try again in a moment.", retryable: true },
  429: { httpStatus: 429, error: "Gemini request limit reached. Please try again later.", retryable: true },
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateWithRetry(contents, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent({
        model: "gemini-3.8-flash",
        systemInstruction: SYSTEM_PROMPT,
        contents,
      });
    } catch (err) {
      const status = err.status || err.response?.status;

      if (!RETRYABLE_STATUSES.has(status) || attempt === maxRetries) {
        throw err;
      }

      const delay = 1000 * Math.pow(2, attempt) + Math.floor(Math.random() * 500);
      console.log(`Gemini returned ${status}. Retry ${attempt + 1}/${maxRetries} in ${delay}ms`);
      await sleep(delay);
    }
  }
}

app.post("/api/analyze", upload.single("image"), async (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).json({ error: "No image provided" });
  }

  try {
    const contents = [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              data: file.buffer.toString("base64"),
              mimeType: file.mimetype,
            },
          },
          {
            text: "Analyze this product image. If sustainability_score < 7 you MUST include 3 real alternatives from different brands.",
          },
        ],
      },
    ];

    const response = await generateWithRetry(contents);
    const text = response.text.trim();
    const jsonText = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

    let result;
    try {
      result = JSON.parse(jsonText);
    } catch {
      return res.status(500).json({ error: "Failed to parse AI response", raw: text });
    }

    return res.json(result);
  } catch (err) {
    const httpStatus = err.status || err.response?.status;
    console.error("Error analyzing image:", {
      message: err.message,
      status: httpStatus,
      stack: err.stack,
    });

    const mapped = STATUS_ERRORS[httpStatus];
    if (mapped) {
      const { httpStatus: status, ...body } = mapped;
      return res.status(status).json(body);
    }

    if (httpStatus === 400 && err.message?.includes("API key")) {
      return res.status(401).json({ error: "Invalid Gemini API key." });
    }

    return res.status(500).json({
      error: "Something went wrong while analyzing your image.",
      details: err.message,
      status: httpStatus,
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "EcoScan API" });
});

app.listen(PORT, () => {
  console.log(`EcoScan backend running on http://localhost:${PORT}`);
});
