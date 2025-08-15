// Install supabase client if you haven't:
// npm install @supabase/supabase-js

import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and API Key
const SUPABASE_URL = 'https://rfdadtqbicukjmypcjpt.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmZGFkdHFiaWN1a2pteXBjanB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MjA5MzYsImV4cCI6MjA1OTQ5NjkzNn0.LS97_pRDEgk_8ScjqLi_iVUjVeATynsWXVx6yuSxB88'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchUsersByDate() {
  const startDate = '2025-08-11T00:00:00Z';
  const endDate = '2025-08-15T23:59:59Z';

  const { data, error } = await supabase
    .from('users')
    .select('name')
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (error) {
    console.error('Error fetching users:', error);
    return;
  }

  console.log('Users added between 13-08-2025 and 15-08-2025:');
  console.table(data);
}

fetchUsersByDate();
