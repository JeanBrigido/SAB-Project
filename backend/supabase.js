import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

console.log('✅ SUPABASE_URL:', SUPABASE_URL); // Just for testing!
console.log('✅ SUPABASE_KEY:', SUPABASE_KEY?.slice(0, 5)); // Just show a part of it

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
