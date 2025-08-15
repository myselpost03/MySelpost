import { createClient } from "@supabase/supabase-js";

// Supabase connection
const SUPABASE_URL = "https://grjdyrvxxxdrvnzaynub.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyamR5cnZ4eHhkcnZuemF5bnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODQ5MzksImV4cCI6MjA3MDU2MDkzOX0.NNoaWaKJOWyUwyJ6p2wtCEXgjb4t4IV50T0dwkns_Tw"; // or anon key if read-only
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function getProfilePic() {
  const { data, error } = await supabase
    .from("users")
    .select("profile_pic")
    .eq("name", "Shivani")
    .single(); // Expect only one result

  if (error) {
    console.error("❌ Error fetching profile pic:", error);
    return;
  }

  if (!data) {
    console.log("⚠️ No user found with the name Shivani.");
    return;
  }

  console.log(`📷 Shivani's profile picture URL: ${data.profile_pic}`);
}

getProfilePic();
