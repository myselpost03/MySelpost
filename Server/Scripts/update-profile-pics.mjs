import { createClient } from "@supabase/supabase-js";

// 1️⃣ Target Supabase (where you want to update users)
const TARGET_SUPABASE_URL = "https://grjdyrvxxxdrvnzaynub.supabase.co";
const TARGET_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyamR5cnZ4eHhkcnZuemF5bnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODQ5MzksImV4cCI6MjA3MDU2MDkzOX0.NNoaWaKJOWyUwyJ6p2wtCEXgjb4t4IV50T0dwkns_Tw";
const targetSupabase = createClient(TARGET_SUPABASE_URL, TARGET_SUPABASE_KEY);

// 2️⃣ Source Supabase (where images are stored)
const SOURCE_SUPABASE_URL = "https://bomgzfyjyjncmvcrxvvj.supabase.co";
const SOURCE_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbWd6ZnlqeWpuY212Y3J4dnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTkwNTAsImV4cCI6MjA3MDczNTA1MH0.rlhK7_I04HyGdc5WC5oqppvnlehg8lgKtVVfEN-n_mo";
const sourceSupabase = createClient(SOURCE_SUPABASE_URL, SOURCE_SUPABASE_KEY);

// 3️⃣ Bucket name in the source database
const BUCKET_NAME = "profile-pics";
const FOLDER_NAME = "avatars"; // <-- added

async function updateProfilePics() {
  const { data: users, error } = await targetSupabase
    .from("users")
    .select("id, profile_pic");

  if (error) throw error;

  for (const user of users) {
    if (!user.profile_pic) continue;

    // Extract filename
    const filename = user.profile_pic.split("/").pop();

    // Add folder path before filename
    const filePath = `${FOLDER_NAME}/${filename}`;

    // Get public URL from source Supabase
    const { data: publicUrlData } = sourceSupabase
      .storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    const newUrl = publicUrlData?.publicUrl;

    if (!newUrl) {
      console.warn(`⚠️ No public URL found for ${filePath}`);
      continue;
    }

    // Update profile_pic in target DB
    const { error: updateError } = await targetSupabase
      .from("users")
      .update({ profile_pic: newUrl })
      .eq("id", user.id);

    if (updateError) {
      console.error(`❌ Failed to update ${filePath}:`, updateError);
    } else {
      console.log(`✅ Updated ${filePath} for user ${user.id}`);
    }
  }

  console.log("🎯 All profile pictures updated!");
}

updateProfilePics().catch(console.error);
