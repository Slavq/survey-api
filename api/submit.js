// api/submit.js

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
console.log("SUPABASE_URL:", SUPABASE_URL); // For debugging – verify it’s correct

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

exports.handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  
  const textData = (typeof req.body === 'string') ? req.body : JSON.stringify(req.body);
  console.log("Received data:", textData);
  console.log("About to insert data into Supabase...");

  // Create a timeout promise (set to 5 seconds here)
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Insert operation timed out")), 5000)
  );

  try {
    const insertPromise = supabase
      .from('Wyniki') // Try using 'wyniki' (all lowercase) if that's how the table is stored
      .insert([
        {
          wynik: textData
          // Omitting created_at so the DB default can apply, if any
        }
      ], { returning: 'representation' });
    
    // Race the insert against the timeout promise
    const { data, error } = await Promise.race([insertPromise, timeoutPromise]);
    
    console.log("After insert, result:", { data, error });

    if (error) {
      console.error("Supabase error:", error);
      res.status(500).json({ message: "Failed to store data", error: error.message });
    } else {
      res.status(200).json({ message: "Data stored successfully.", data });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Failed to store data", error: err.message });
  }
};
