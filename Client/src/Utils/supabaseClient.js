// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://grjdyrvxxxdrvnzaynub.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyamR5cnZ4eHhkcnZuemF5bnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODQ5MzksImV4cCI6MjA3MDU2MDkzOX0.NNoaWaKJOWyUwyJ6p2wtCEXgjb4t4IV50T0dwkns_Tw";

export const supabase = createClient(supabaseUrl, supabaseKey);

const SOURCE_SUPABASE_URL = "https://bomgzfyjyjncmvcrxvvj.supabase.co";
const SOURCE_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbWd6ZnlqeWpuY212Y3J4dnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTkwNTAsImV4cCI6MjA3MDczNTA1MH0.rlhK7_I04HyGdc5WC5oqppvnlehg8lgKtVVfEN-n_mo";


export const supabaseStorage = createClient(SOURCE_SUPABASE_URL, SOURCE_SUPABASE_KEY);
