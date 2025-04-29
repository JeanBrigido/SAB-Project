import express from 'express';
import { AzureOpenAI } from "openai";
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Azure OpenAI Configuration
const endpoint = process.env.AZURE_AI_ENDPOINT;
const apiKey = process.env.AZURE_AI_KEY;
const deployment = "gpt-35-turbo"; // Changed to match Azure deployment name
const apiVersion = "2024-12-01-preview";

// Add debugging
console.log('Azure OpenAI Configuration:', {
  endpoint: endpoint?.substring(0, 10) + '...',
  deploymentName: deployment,
  hasKey: !!apiKey,
  apiVersion,
  environment: process.env.NODE_ENV
});

// Initialize Azure OpenAI client
const client = new AzureOpenAI({
  endpoint,
  apiKey,
  deployment,
  apiVersion
});

// Simple test route to verify configuration
router.get('/test', (req, res) => {
  res.json({ 
    status: 'ok',
    config: {
      hasEndpoint: !!endpoint,
      hasApiKey: !!apiKey,
      hasDeployment: !!deployment
    }
  });
});

// GET /api/verse/daily
router.get('/daily', async (req, res) => {
  try {
    console.log('Using deployment:', deployment);
    
    // Updated messages following Azure OpenAI chat completion best practices
    const messages = [
      {
        role: "system",
        content: "You are an AI assistant specialized in providing Bible verses. When asked for a verse, respond with exactly two lines: the verse text on the first line, followed by its biblical reference on the second line. Keep responses concise and accurate."
      },
      {
        role: "user",
        content: "Give me a Bible verse for today."
      },
      {
        role: "assistant",
        content: "Trust in the Lord with all your heart and lean not on your own understanding.\nProverbs 3:5"
      },
      {
        role: "user",
        content: "Give me another verse that offers wisdom or encouragement for today."
      }
    ];

    const response = await client.chat.completions.create({
      model: deployment,           // Added model parameter
      messages: messages,
      max_tokens: 150,            // Reduced for more concise responses
      temperature: 0.3,           // Reduced for more consistent outputs
      top_p: 0.95,
      frequency_penalty: 0.0,
      presence_penalty: 0.0
    });

    if (!response?.choices?.[0]?.message?.content) {
      throw new Error('No verse content received from Azure OpenAI');
    }

    const content = response.choices[0].message.content.trim();
    console.log('Raw response:', content); // Debug log

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

export default router;
