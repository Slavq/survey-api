// api/submit.js

const { createClient } = require('@supabase/supabase-js');

// Retrieve Supabase credentials from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

console.log("SUPABASE_URL:", SUPABASE_URL); // For debugging; remove in production
// Warning: In production, avoid logging secrets like SUPABASE_ANON_KEY

// Initialize the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Our handler function for the API endpoint
exports.handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  // Get the text data from the request body
  const textData = (typeof req.body === 'string') ? req.body : JSON.stringify(req.body);
  console.log("Received data:", textData);

  try {
    // Insert data into the table. Try without providing created_at.
    const { data, error } = await supabase
      .from('Wyniki')  // Try 'wyniki' or 'Wyniki' based on your actual table name
      .insert([
        {
          wynik: textData
          // Omitting created_at to allow database default if one is set.
        }
      ], { returning: 'representation' });

    console.log("Insert result:", { data, error });

    if (error) {
      console.error("Supabase error:", error);
      res.status(500).json({ message: "Failed to store data", error: error.message });
      return;
    }

    res.status(200).json({ message: "Data stored successfully.", data });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Failed to store data", error: error.message });
  }
};
