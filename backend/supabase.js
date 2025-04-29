import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Missing Supabase configuration. Please check your .env file.');
  }

console.log('✅ SUPABASE_URL:', SUPABASE_URL); // Just for testing!
console.log('✅ SUPABASE_KEY:', SUPABASE_KEY?.slice(0, 5)); // Just show a part of it

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
