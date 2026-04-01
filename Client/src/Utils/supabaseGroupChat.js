import { createClient } from '@supabase/supabase-js';

const supabaseChatUrl = "https://ytuxfhuzcbumiazblsox.supabase.co";
const supabaseChatKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0dXhmaHV6Y2J1bWlhemJsc294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NDYxMDIsImV4cCI6MjA5MDQyMjEwMn0.-GdnhJVf0diTHajzfyAQJfqAPt8sm7RnxuctVGGvr6Q";

export const supabaseChat = createClient(supabaseChatUrl, supabaseChatKey);