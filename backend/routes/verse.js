import express from 'express';
import { AzureOpenAI } from "openai";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const router = express.Router();

// Enable CORS for all routes
router.use(cors());

// Azure OpenAI Configuration
const endpoint = "https://jeanj-ma27s5e4-swedencentral.openai.azure.com/openai/deployments/gpt-4-32k/chat/completions?api-version=2025-01-01-preview";
const apiKey = process.env.NEW_AZURE_AI_KEY;
const apiVersion = "2025-01-01-preview";
const deployment = "gpt-4-32k"; // Deployment name from Azure Portal

// Validate configuration
if (!endpoint || !apiKey) {
  throw new Error('Missing required Azure OpenAI configuration');
}

// Add debugging
console.log('Azure OpenAI Configuration:', {
  endpoint: endpoint?.substring(0, 10) + '...',
  hasKey: !!apiKey,
  deployment,
  environment: process.env.NODE_ENV
});

// Initialize Azure OpenAI client
const client = new AzureOpenAI({ 
  endpoint, 
  apiKey, 
  apiVersion, 
  deployment 
});

// GET /api/verse/daily
router.get('/daily', async (req, res) => {
  try {
    console.log('Using deployment:', deployment);
    
    const result = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an AI assistant specialized in providing Bible verses. When asked for a verse, respond with exactly two lines: the verse text on the first line, followed by its biblical reference on the second line. Keep responses concise and accurate."
        },
        {
          role: "user",
          content: "Give me an inspiring Bible verse for today."
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: null
    });

    const content = result.choices[0].message.content.trim();
    console.log('Raw response:', content);

    const [text, reference] = content.split('\n').map(s => s.trim());
    
    if (!text || !reference) {
      throw new Error('Invalid verse format in response');
    }

    res.json({ 
      text, 
      reference,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('Azure OpenAI Error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch verse',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/verse-by-emotion
router.get('/verse-by-emotion', async (req, res) => {
  try {
    const { emotion } = req.query;
    
    if (!emotion) {
      return res.status(400).json({ 
        error: 'Emotion parameter is required',
        timestamp: new Date().toISOString()
      });
    }

    console.log(`Fetching verse for emotion: ${emotion}`);
    
    const result = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an AI assistant specialized in providing relevant Bible verses for different emotional states. When asked for a verse, respond with exactly two lines: the verse text on the first line, followed by its biblical reference on the second line. Keep responses concise and accurate."
        },
        {
          role: "user",
          content: `I'm feeling ${emotion}. Can you provide a Bible verse that would help someone dealing with this emotion?`
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: null
    });

    const content = result.choices[0].message.content.trim();
    console.log('Raw response:', content);

    const [text, reference] = content.split('\n').map(s => s.trim());
    
    if (!text || !reference) {
      throw new Error('Invalid verse format in response');
    }

    res.json({ 
      text, 
      reference,
      emotion,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('Azure OpenAI Error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch verse',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;