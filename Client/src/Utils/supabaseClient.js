// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rfdadtqbicukjmypcjpt.supabase.co'; // replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmZGFkdHFiaWN1a2pteXBjanB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MjA5MzYsImV4cCI6MjA1OTQ5NjkzNn0.LS97_pRDEgk_8ScjqLi_iVUjVeATynsWXVx6yuSxB88'; // replace with your anon/public key

export const supabase = createClient(supabaseUrl, supabaseKey);
