// migrateTables.js
import { createClient } from "@supabase/supabase-js";
import admin from "firebase-admin";
import fs from "fs";

// ---------------- Supabase Setup ----------------
const supabaseUrl = "https://grjdyrvxxxdrvnzaynub.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyamR5cnZ4eHhkcnZuemF5bnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODQ5MzksImV4cCI6MjA3MDU2MDkzOX0.NNoaWaKJOWyUwyJ6p2wtCEXgjb4t4IV50T0dwkns_Tw"; // or anon key if read-only
const supabase = createClient(supabaseUrl, supabaseKey);

// ---------------- Firestore Setup ----------------
const serviceAccount = JSON.parse(fs.readFileSync("firebaseServiceAccount.json", "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ---------------- Tables to Migrate ----------------
const tables = ["contact_us", "feedbacks"]; // add more table names here

// ---------------- Migration Logic ----------------
async function migrateTable(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("*");

    if (error) {
      console.error(`Error fetching data from Supabase table "${tableName}":`, error);
      return;
    }

    console.log(`Fetched ${data.length} rows from Supabase table "${tableName}".`);

    const batch = db.batch();
    data.forEach((row) => {
      const docRef = db.collection(tableName).doc(); // auto-generated doc id
      batch.set(docRef, row);
    });

    await batch.commit();
    console.log(`Table "${tableName}" successfully migrated to Firestore!`);
  } catch (err) {
    console.error(`Migration failed for table "${tableName}":`, err);
  }
}

async function migrateAllTables() {
  for (const table of tables) {
    await migrateTable(table);
  }
  console.log("All tables migration complete!");
}

// Run the migration
migrateAllTables();
