/**
 * Google Gemini and AI Configuration
 */
let GoogleGenerativeAI = null;
try {
  const genai = require('@google/genai');
  GoogleGenerativeAI = genai.GoogleGenerativeAI || genai;
} catch (e) {
  // Optional package fallback
}

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return { apiKey };
};

module.exports = { getAIClient };
