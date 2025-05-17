// api/submit.js

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
console.log("SUPABASE_URL:", SUPABASE_URL);  // For debugging

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

exports.handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  
  // Get the text data from the request body
  const textData = (typeof req.body === 'string') ? req.body : JSON.stringify(req.body);
  console.log("Received data:", textData);

  // Log immediately before the insert call
  console.log("About to insert data into Supabase...");

  try {
    const { data, error } = await supabase
      .from('Wyniki')  // Try 'wyniki' (or experiment with 'Wyniki' if needed)
      .insert([
        {
          wynik: textData
          // Omitting created_at so the database default can take effect
        }
      ], { returning: 'representation' });
    
    // Log the result of the insert call
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
