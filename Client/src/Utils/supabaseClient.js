// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://grjdyrvxxxdrvnzaynub.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyamR5cnZ4eHhkcnZuemF5bnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODQ5MzksImV4cCI6MjA3MDU2MDkzOX0.NNoaWaKJOWyUwyJ6p2wtCEXgjb4t4IV50T0dwkns_Tw";

export const supabase = createClient(supabaseUrl, supabaseKey);

const SOURCE_SUPABASE_URL = "https://aipmrlixkhxqbojjxyoz.supabase.co";
const SOURCE_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpcG1ybGl4a2h4cWJvamp4eW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MDc3MTIsImV4cCI6MjA4MTA4MzcxMn0.p26degYcqNEtJJDoNP-1pq8HbCD8ANqkoS0PU7yF8o4"

export const supabaseStorage = createClient(SOURCE_SUPABASE_URL, SOURCE_SUPABASE_KEY);
