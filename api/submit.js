// api/submit.js

// Using CommonJS syntax with require (make sure your file is named .js)
const { createClient } = require('@supabase/supabase-js');

// Retrieve Supabase credentials from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Initialize the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Our handler function for the API endpoint
exports.handler = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  // Get the text data from the request body
  const textData = req.body;
  console.log("Received data:", textData);

  try {
    // Insert data into the 'survey_responses' table
    const { data, error } = await supabase
      .from('Wyniki')
      .insert([
        {
          //created_at: new Date().toISOString(),
		  wynik: textData
        }
      ], { returning: 'representation' });

    if (error) {
      console.error("Supabase error:", error);
      res.status(500).json({ message: "Failed to store data", error: error.message });
      return;
    }

    // Return a success response
    res.status(200).json({ message: "Data stored successfully.", data });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: "Failed to store data", error: error.message });
  }
};
