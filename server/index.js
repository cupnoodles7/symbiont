// server/index.js
import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import { Server } from 'socket.io';
import multer from 'multer';
import { createWorker } from 'tesseract.js';
import * as Jimp from 'jimp';
import jsQR from 'jsqr';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());

// CORS configuration for API access
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-app-id', 'x-app-key']
}));

// serve static files from ../assets
app.use('/assets', express.static(path.join(__dirname, '..', 'assets'), { maxAge: '30d' }));

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Nutritionix API configuration
const APP_ID = process.env.APP_ID;
const APP_KEY = process.env.APP_KEY;

// Gemini AI configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Debug environment variables
console.log('Environment Variables:', {
  APP_ID: APP_ID ? 'Set' : 'Not set',
  APP_KEY: APP_KEY ? 'Set' : 'Not set',
  GEMINI_API_KEY: GEMINI_API_KEY ? 'Set' : 'Not set'
});

if (!APP_ID || !APP_KEY) {
  console.error('Missing Nutritionix API credentials. Please check your .env file');
}

if (!GEMINI_API_KEY) {
  console.error('Missing Gemini API key. AI chat assistant will not work. Please check your .env file');
}

const headers = {
  "x-app-id": APP_ID,
  "x-app-key": APP_KEY,
  "x-remote-user-id": "0"
};

const PHOTO_API_BASE = 'https://photoapi-qa.nutritionix.com';

// Create HTTP server
const httpServer = http.createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('client connected', socket.id);
  socket.on('join', (data) => {
    // for demo we join a 'demo' room
    socket.join(data.userId || 'demo');
  });
});

// Original pet state trigger endpoint
app.get('/trigger/:state', (req, res) => {
  const state = req.params.state;
  io.to('demo').emit('pet_update', {
    state,
    xp: Math.floor(Math.random() * 500),
    level: Math.floor(Math.random() * 10) + 1
  });
  res.json({ ok: true, state });
});

// Route 1: API Info
app.get('/', (req, res) => {
  res.json({
    name: "Food Nutrition API",
    version: "1.0.0",
    endpoints: {
      search: "GET /search?food=apple",
      nutrition: "POST /nutrition with {\"query\": \"1 apple\"}",
      complete: "GET /food-complete?food=apple",
      processImage: "POST /process-image (multipart form with image and type)",
      uploadPhotos: "POST /upload-photos (multipart form with images)",
      petTrigger: "GET /trigger/:state (pet state updates)"
    },
    documentation: "See README.md for detailed API documentation"
  });
});

// Route 2: Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    endpoints: {
      search: "GET /search?food=apple",
      nutrition: "POST /nutrition with {\"query\": \"1 apple\"}",
      complete: "GET /food-complete?food=apple",
      barcode: "GET /barcode/012000161155",
      scanner: "GET / (HTML scanner interface)",
      petTrigger: "GET /trigger/:state"
    }
  });
});

// Route 3: Search for foods (quick search with limited data)
app.get("/search", async (req, res) => {
  try {
    // Check if API credentials are set
    if (!APP_ID || !APP_KEY) {
      console.error('API credentials missing');
      return res.status(500).json({
        error: "Server configuration error",
        message: "API credentials are not configured"
      });
    }

    const query = req.query.food;
    if (!query) {
      return res.status(400).json({ error: "Please provide a food query (?food=...)" });
    }

    console.log('Making search request for:', query);
    const url = "https://trackapi.nutritionix.com/v2/search/instant";

    const response = await axios.get(url, {
      headers,
      params: { query }
    });

    const data = response.data;
    const results = [];

    const parseSearchItem = (item, branded = false) => {
      const entry = {
        food_name: item.food_name,
        serving_qty: item.serving_qty,
        serving_unit: item.serving_unit,
        calories: item.nf_calories || "Unknown",
        protein_g: item.nf_protein || "Get details →",
        carbs_g: item.nf_total_carbohydrate || "Get details →",
        fat_g: item.nf_total_fat || "Get details →"
      };

      if (branded) {
        entry.brand_name = item.brand_name;
        entry.nix_brand_id = item.nix_brand_id;
        entry.nix_item_id = item.nix_item_id;
      }

      return entry;
    };

    // Common foods
    if (data.common) {
      data.common.forEach(item => {
        results.push({ ...parseSearchItem(item), type: "common" });
      });
    }

    // Branded foods
    if (data.branded) {
      data.branded.forEach(item => {
        results.push({ ...parseSearchItem(item, true), type: "branded" });
      });
    }

    res.json({
      query,
      total_results: results.length,
      message: "Use /nutrition endpoint to get full macros for specific foods",
      results
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to search foods" });
  }
});

// Route 4: Get detailed nutrition info (full macros)
app.post("/nutrition", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Please provide a food query" });
    }

    const url = "https://trackapi.nutritionix.com/v2/natural/nutrients";
    const headers = {
      "x-app-id": APP_ID,
      "x-app-key": APP_KEY,
      "x-remote-user-id": "0",
      "Content-Type": "application/json"
    };

    const response = await axios.post(url, { query }, { headers });

    const nutrients = response.data.foods.map(item => ({
      food_name: item.food_name,
      brand_name: item.brand_name || null,
      calories: item.nf_calories,
      protein: item.nf_protein,
      total_fat: item.nf_total_fat,
      carbohydrates: item.nf_total_carbohydrate,
      fiber: item.nf_dietary_fiber,
      sugar: item.nf_sugars,
      serving_qty: item.serving_qty,
      serving_unit: item.serving_unit,
      serving_weight_grams: item.serving_weight_grams
    }));

    res.json({ results: nutrients });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch nutrition data" });
  }
});

// Route 5: Combined search and nutrition (best of both)
app.get("/food-complete", async (req, res) => {
  try {
    const query = req.query.food;
    if (!query) {
      return res.status(400).json({ error: "Please provide a food query (?food=...)" });
    }

    // First, do a quick search
    const searchUrl = "https://trackapi.nutritionix.com/v2/search/instant";
    const searchResponse = await axios.get(searchUrl, {
      headers,
      params: { query }
    });

    const searchData = searchResponse.data;
    const quickResults = [];

    // Parse common foods for quick display
    if (searchData.common) {
      searchData.common.forEach(item => {
        quickResults.push({
          food_name: item.food_name,
          serving_qty: item.serving_qty,
          serving_unit: item.serving_unit,
          type: "common"
        });
      });
    }

    // Parse branded foods for quick display
    if (searchData.branded) {
      searchData.branded.slice(0, 5).forEach(item => { // Limit to 5 branded items
        quickResults.push({
          food_name: item.food_name,
          brand_name: item.brand_name,
          serving_qty: item.serving_qty,
          serving_unit: item.serving_unit,
          type: "branded"
        });
      });
    }

    // Then get detailed nutrition for the first/most relevant result
    let detailedNutrition = null;
    if (quickResults.length > 0) {
      try {
        const nutritionUrl = "https://trackapi.nutritionix.com/v2/natural/nutrients";
        const nutritionResponse = await axios.post(nutritionUrl,
          { query: `1 ${quickResults[0].food_name}` },
          { headers }
        );

        const food = nutritionResponse.data.foods[0];
        detailedNutrition = {
          food_name: food.food_name,
          serving_qty: food.serving_qty,
          serving_unit: food.serving_unit,
          calories: food.nf_calories,
          protein: food.nf_protein,
          carbohydrates: food.nf_total_carbohydrate,
          fat: food.nf_total_fat,
          fiber: food.nf_dietary_fiber,
          sugar: food.nf_sugars,
          sodium: food.nf_sodium
        };
      } catch (nutritionError) {
        console.log("Could not get detailed nutrition for:", quickResults[0].food_name);
      }
    }

    res.json({
      query,
      search_results: quickResults,
      featured_nutrition: detailedNutrition,
      message: "Use POST /nutrition with specific food name to get full details"
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get food data" });
  }
});

// Route 6: Process uploaded images (barcode/nutrition)
app.post("/process-image", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No image provided",
        message: "Please upload an image file"
      });
    }

    const type = req.body.type;
    if (!['barcode', 'nutrition'].includes(type)) {
      return res.status(400).json({
        error: "Invalid type",
        message: "Type must be either 'barcode' or 'nutrition'"
      });
    }

    // Read and process the image file
    let image;
    try {
      image = await Jimp.read(req.file.buffer);

      // Optimize image for processing
      image.normalize() // Adjust contrast
        .scaleToFit(1024, 1024) // Resize if too large
        .greyscale(); // Convert to greyscale for better OCR

    } catch (error) {
      console.error('Image reading error:', error);
      throw new Error('Failed to read image file. Please ensure it\'s a valid image.');
    }

    if (type === 'barcode') {
      // Process image for barcode detection
      const imageBuffer = new Uint8ClampedArray(image.bitmap.data.buffer);
      const imageData = {
        data: imageBuffer,
        width: image.bitmap.width,
        height: image.bitmap.height
      };

      // Detect QR/barcode
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        return res.json({
          barcode: code.data,
          message: "Barcode detected successfully"
        });
      }

      // If jsQR fails, try OCR as fallback for clear barcode numbers
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(req.file.buffer);
      await worker.terminate();

      // Extract numbers from OCR result
      const numbers = text.match(/\d{8,14}/);
      if (numbers) {
        return res.json({
          barcode: numbers[0],
          message: "Barcode detected via OCR"
        });
      }

      throw new Error("No barcode detected in image");

    } else {
      // Process nutrition label with OCR
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(req.file.buffer);
      await worker.terminate();

      // Extract nutrition information
      const nutrition = parseNutritionText(text);

      if (Object.keys(nutrition).length > 0) {
        return res.json({
          nutrition,
          message: "Nutrition information extracted successfully"
        });
      }

      throw new Error("Could not extract nutrition information from image");
    }

  } catch (error) {
    console.error('Image processing error:', error);
    res.status(400).json({
      error: "Processing failed",
      message: error.message
    });
  }
});

// Helper function to parse nutrition text
function parseNutritionText(text) {
  const nutrition = {};

  // Common patterns in nutrition labels
  const patterns = {
    calories: /calories[:\s]+(\d+)/i,
    protein: /protein[:\s]+(\d+)g/i,
    carbohydrates: /(?:total\s+)?carbohydrates?[:\s]+(\d+)g/i,
    fat: /(?:total\s+)?fat[:\s]+(\d+)g/i,
    sugar: /sugars?[:\s]+(\d+)g/i,
    fiber: /(?:dietary\s+)?fiber[:\s]+(\d+)g/i,
    sodium: /sodium[:\s]+(\d+)mg/i,
    servingSize: /serving\s+size[:\s]+([^\\n]+)/i
  };

  // Extract values using patterns
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match) {
      nutrition[key] = key === 'servingSize' ? match[1].trim() : Number(match[1]);
    }
  }

  return nutrition;
}

// Route 7: Photo upload endpoint
app.post("/upload-photos", async (req, res) => {
  try {
    const { upc, frontImage, nutritionImage, ingredientImage } = req.body;

    if (!upc || !frontImage || !nutritionImage) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "UPC, front package photo, and nutrition label photo are required"
      });
    }

    // Validate UPC format
    if (!/^\d{8,14}$/.test(upc)) {
      return res.status(400).json({
        error: "Invalid UPC format",
        message: "UPC must be 8-14 digits"
      });
    }

    // Make request to Nutritionix Photo API
    const formData = new FormData();
    formData.append('UPC', upc);
    formData.append('frontOfPackage', frontImage);
    formData.append('nutritionLabel', nutritionImage);
    if (ingredientImage) {
      formData.append('ingredientStatement', ingredientImage);
    }

    const response = await axios.post(`${PHOTO_API_BASE}/upload`, formData, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data'
      }
    });

    res.json(response.data);

  } catch (error) {
    console.error('Photo upload error:', error.response?.data || error.message);
    if (error.response?.status === 413) {
      res.status(413).json({
        error: "Image too large",
        message: "One or more images exceed the size limit (5MB per image)"
      });
    } else {
      res.status(error.response?.status || 500).json({
        error: "Upload failed",
        message: error.response?.data?.message || "Failed to upload photos"
      });
    }
  }
});

// Route 8: Barcode-specific lookup endpoint
app.get("/barcode/:upc", async (req, res) => {
  try {
    const upc = req.params.upc;

    // Validate UPC format (should be numeric and 8+ digits)
    if (!/^\d{8,}$/.test(upc)) {
      return res.status(400).json({ error: "Invalid UPC format. Please provide a valid barcode number." });
    }

    const url = `https://trackapi.nutritionix.com/v2/search/item?upc=${upc}`;
    const response = await axios.get(url, { headers });

    const food = response.data.foods[0];
    const result = {
      food_name: food.food_name,
      brand_name: food.brand_name,
      serving_qty: food.serving_qty,
      serving_unit: food.serving_unit,
      serving_weight_grams: food.serving_weight_grams,
      calories: food.nf_calories,
      total_fat: food.nf_total_fat,
      saturated_fat: food.nf_saturated_fat,
      cholesterol: food.nf_cholesterol,
      sodium: food.nf_sodium,
      total_carbohydrate: food.nf_total_carbohydrate,
      dietary_fiber: food.nf_dietary_fiber,
      sugars: food.nf_sugars,
      protein: food.nf_protein,
      potassium: food.nf_potassium,
      photo: food.photo
    };

    res.json({
      upc,
      result
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    if (error.response?.status === 404) {
      res.status(404).json({
        error: "Product not found",
        message: "This barcode is not in the Nutritionix database. Try searching by product name instead."
      });
    } else {
      res.status(500).json({
        error: "Failed to lookup barcode",
        details: error.response?.data?.message || error.message
      });
    }
  }
});

// Route 9: Gemini AI Chat Assistant
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!genAI) {
      return res.status(503).json({
        error: "AI service unavailable",
        message: "Gemini API key is not configured"
      });
    }

    // Create a model instance
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare the prompt with context
    const prompt = `${context || `You are a specialized AI health assistant. You can ONLY answer questions related to:
           - Health and wellness
           - Nutrition and diet
           - Exercise and fitness
           - Mental health and stress
           - Sleep and recovery
           - Medical conditions (general advice only)
           - Healthy lifestyle tips
           
           If someone asks about anything else (politics, technology, entertainment, etc.), politely redirect them back to health topics.
           
           Always provide evidence-based, helpful health advice. For serious medical concerns, recommend consulting healthcare professionals.
           
           Keep responses friendly, informative, and focused on health and wellness.`}

User: ${message}

Assistant:`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini API Error:', error);

    // Handle specific Gemini API errors
    if (error.message.includes('API_KEY_INVALID')) {
      return res.status(401).json({
        error: "Invalid API key",
        message: "Please check your Gemini API key configuration"
      });
    }

    if (error.message.includes('QUOTA_EXCEEDED')) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        message: "You've reached the free tier limit. Please wait a moment and try again, or upgrade your plan for higher limits.",
        retryAfter: "33s"
      });
    }

    res.status(500).json({
      error: "AI service error",
      message: "Failed to get response from AI assistant",
      details: error.message
    });
  }
});

// Route 10: Health Task Generation with AI
app.post("/api/gemini/health-tasks", async (req, res) => {
  try {
    if (!genAI) {
      return res.status(503).json({
        error: "AI service unavailable",
        message: "Gemini API key is not configured"
      });
    }

    const { context, userData, weatherData } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an AI Health Agent that creates personalized daily health tasks (quests) for users. 

Based on the provided context, generate 3-5 engaging health tasks that are:
1. Weather-appropriate (indoor vs outdoor activities)
2. Personalized to the user's health goals and fitness level
3. Varied in difficulty and category
4. Motivating and achievable

Context provided:
- User Profile: ${JSON.stringify(context.userProfile)}
- Weather: ${JSON.stringify(context.weather)}
- Performance: ${JSON.stringify(context.performance)}

Generate tasks in this exact JSON format:
{
  "tasks": [
    {
      "id": 1,
      "title": "Task Title",
      "description": "Detailed description of what to do",
      "category": "hydration|fitness|nutrition|mental|sleep",
      "difficulty": "easy|moderate|hard",
      "points": 10-30,
      "icon": "relevant emoji",
      "weatherAdapted": true/false,
      "weatherReason": "explanation if weather-adapted"
    }
  ]
}

Rules:
- If weather is rainy/snowy/extreme temps, suggest indoor activities
- If weather is nice, suggest outdoor activities
- Consider user's fitness level and health goals
- Mix easy and moderate tasks, avoid too many hard tasks
- Include at least one weather-adapted task
- Make tasks specific and actionable
- Use appropriate emojis for icons

Return ONLY the JSON response, no additional text.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the JSON response
    try {
      const tasksData = JSON.parse(text);
      res.json(tasksData);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return fallback tasks if parsing fails
      res.json({
        tasks: [
          {
            id: 1,
            title: "Hydration Challenge",
            description: "Drink 8 glasses of water throughout the day",
            category: "hydration",
            difficulty: "easy",
            points: 10,
            icon: "💧",
            weatherAdapted: false
          },
          {
            id: 2,
            title: "Mindful Breathing",
            description: "Practice 5 minutes of deep breathing exercises",
            category: "mental",
            difficulty: "easy",
            points: 15,
            icon: "🧘",
            weatherAdapted: false
          },
          {
            id: 3,
            title: context.weather.isIndoor ? "Indoor Stretching" : "Outdoor Walk",
            description: context.weather.isIndoor
              ? "Complete a 10-minute stretching routine"
              : "Take a 20-minute walk outside",
            category: "fitness",
            difficulty: "moderate",
            points: 20,
            icon: context.weather.isIndoor ? "🧘‍♀️" : "🚶",
            weatherAdapted: true,
            weatherReason: context.weather.isIndoor
              ? "Indoor activity due to weather conditions"
              : "Perfect weather for outdoor activity"
          }
        ]
      });
    }

  } catch (error) {
    console.error('Health Tasks API Error:', error);

    // Handle specific Gemini API errors
    if (error.message.includes('API_KEY_INVALID')) {
      return res.status(401).json({
        error: "Invalid API key",
        message: "Please check your Gemini API key configuration"
      });
    }

    if (error.message.includes('QUOTA_EXCEEDED')) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        message: "You've reached the free tier limit. Please wait a moment and try again, or upgrade your plan for higher limits.",
        retryAfter: "33s"
      });
    }

    res.status(500).json({
      error: "AI service error",
      message: "Failed to generate health tasks",
      details: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on the server'
  });
});

// 404 handler - must be the last route
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    method: req.method,
    path: req.path,
    availableEndpoints: [
      'GET /',
      'GET /search?food=apple',
      'POST /nutrition',
      'GET /food-complete?food=apple',
      'GET /barcode/:upc',
      'GET /health',
      'GET /trigger/:state',
      'POST /api/gemini/chat',
      'POST /api/gemini/health-tasks'
    ]
  });
});

// Start server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🍎 Food Tracker API running on http://localhost:${PORT}`);
  console.log(`
Available endpoints:
- GET  /                           (API Info)
- GET  /search?food=apple          (Quick search, limited data)
- POST /nutrition                  (Full macros, send {"query": "1 apple"} or {"query": "012000161155"})
- GET  /food-complete?food=apple   (Combined search + nutrition)
- GET  /barcode/012000161155      (Direct barcode lookup)
- GET  /health                     (API health check)
- GET  /trigger/:state            (Pet state updates)
- POST /process-image             (Process food images)
- POST /upload-photos             (Upload food photos)
- POST /api/gemini/chat          (AI Chat Assistant)
- POST /api/gemini/health-tasks   (AI Health Task Generation)

🚀 Server is ready to handle requests!
  `);
});