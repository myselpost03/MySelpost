import { createClient } from "@supabase/supabase-js";
import cloudinary from "cloudinary";

// Old Cloudinary credentials (only needed if some images are private)
const oldCloudinary = cloudinary.v2;
oldCloudinary.config({
  cloud_name: 'dzoctpmmi',
  api_key: '655189232776565',
  api_secret: 'uZ3TBw3YSlZDpniQfnF63OI223Q',
});

// New Cloudinary credentials (target account)
const newCloudinary = cloudinary.v2;
newCloudinary.config({
  cloud_name: 'dqhajyve8',
  api_key: '229219812359522',
  api_secret: 'DIQRf6_0Uon_zGbF1A46aOX2C8E',
});

// Supabase DB
const supabaseUrl = "https://grjdyrvxxxdrvnzaynub.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyamR5cnZ4eHhkcnZuemF5bnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODQ5MzksImV4cCI6MjA3MDU2MDkzOX0.NNoaWaKJOWyUwyJ6p2wtCEXgjb4t4IV50T0dwkns_Tw"; // or anon key if read-only
const supabase = createClient(supabaseUrl, supabaseKey);


async function migrateImages() {
  const { data: images, error } = await supabase
    .from("images")
    .select("id, image_url");

  if (error) throw error;

  for (const img of images) {
    if (!img.image_url) continue;

    console.log(`Migrating image ID ${img.id} ...`);

    try {
      // 1. Download from old Cloudinary (public URLs still work directly)
      const response = await fetch(img.image_url);
      const buffer = Buffer.from(await response.arrayBuffer());

      // 2. Upload to new Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        newCloudinary.uploader
          .upload_stream({ folder: "images" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(buffer);
      });

      // 3. Update DB with new URL
      const { error: updateError } = await supabase
        .from("images")
        .update({ image_url: uploadResult.secure_url })
        .eq("id", img.id);

      if (updateError) throw updateError;

      console.log(`✅ Migrated ${img.id} → ${uploadResult.secure_url}`);
    } catch (err) {
      console.error(`❌ Failed for ${img.id}:`, err.message);
    }
  }

  console.log("🎉 Migration finished.");
}

migrateImages();
