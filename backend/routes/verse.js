import express from 'express';
import { AzureKeyCredential, OpenAIClient } from '@azure/openai';

const router = express.Router();

// In-memory cache for daily verse
let dailyVerseCache = {
  verse: null,
  timestamp: null
};

// Check if cache is older than 24 hours
const isCacheValid = () => {
  if (!dailyVerseCache.timestamp) return false;
  const now = new Date();
  const cacheAge = now - dailyVerseCache.timestamp;
  return cacheAge < 24 * 60 * 60 * 1000; // 24 hours in milliseconds
};

const client = new OpenAIClient(
  process.env.AZURE_AI_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_AI_KEY)
);

router.get('/verse-of-the-day', async (req, res) => {
  try {
    // Verify Azure OpenAI configuration
    if (!process.env.AZURE_AI_ENDPOINT || !process.env.AZURE_AI_KEY || !process.env.AZURE_DEPLOYMENT_NAME) {
      throw new Error('Missing Azure OpenAI configuration');
    }

    // Check cache first
    if (isCacheValid()) {
      return res.json(dailyVerseCache.verse);
    }

    const messages = [
      { role: "system", content: "You are a helpful assistant that provides Bible verses. Return only the verse text and reference, separated by a newline." },
      { role: "user", content: "Give me a short Bible verse of the day." }
    ];

    try {
      const response = await client.getChatCompletions(
        process.env.AZURE_DEPLOYMENT_NAME,
        messages
      );

      if (!response?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response from Azure OpenAI');
      }

      const content = response.choices[0].message.content.trim();
      const [text, reference] = content.split('\n').map(str => str.trim());

      if (!text || !reference) {
        throw new Error('Invalid verse format received');
      }

      const verse = { text, reference };

      // Update cache
      dailyVerseCache = {
        verse,
        timestamp: new Date()
      };

      res.json(verse);
    } catch (aiError) {
      console.error('Azure OpenAI Error:', aiError);
      throw new Error('Failed to communicate with Azure OpenAI');
    }
  } catch (err) {
    console.error('Error details:', err);
    res.status(500).json({ 
      error: 'Failed to fetch verse',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      code: err.code || 'UNKNOWN_ERROR'
    });
  }
});

router.get('/verse-by-emotion', async (req, res) => {
  try {
    const { emotion } = req.query;
    if (!emotion) {
      return res.status(400).json({ error: 'Emotion parameter is required' });
    }

    const messages = [
      { role: "system", content: "You are a helpful assistant that provides Bible verses." },
      { role: "user", content: `Give me a short Bible verse to encourage someone who is feeling ${emotion}. Only return the verse text and the reference.` }
    ];

    const response = await client.getChatCompletions(
      process.env.AZURE_DEPLOYMENT_NAME,
      messages
    );

    const verse = {
      text: response.choices[0].message.content.split('\n')[0],
      reference: response.choices[0].message.content.split('\n')[1]
    };

    res.json(verse);
  } catch (err) {
    console.error('Error fetching verse by emotion:', err);
    res.status(500).json({ error: 'Failed to fetch verse' });
  }
});

router.get('/test', (req, res) => {
  res.json({ 
    status: 'ok',
    env: process.env.NODE_ENV,
    hasAzureConfig: {
      endpoint: !!process.env.AZURE_AI_ENDPOINT,
      key: !!process.env.AZURE_AI_KEY,
      deployment: !!process.env.AZURE_DEPLOYMENT_NAME
    }
  });
});

export default router;