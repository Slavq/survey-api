// api/submit.js

const { createClient } = require('@supabase/supabase-js');

// Retrieve Supabase credentials from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// (Optional) Log to check that the SUPABASE_URL is being read correctly.
// Do not log the anon key in production!
console.log("SUPABASE_URL:", SUPABASE_URL);

// Create a Supabase client instance
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

exports.handler = async (req, res) => {
  // Allow only POST requests.
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Read the request body.
  // This works whether the request is sent as plain text or JSON.
  let payload = req.body;
  if (!payload) {
    return res.status(400).json({ message: 'No data provided' });
  }
  if (typeof payload !== 'string') {
    payload = JSON.stringify(payload);
  }

  console.log("Received data:", payload);

  try {
    // Attempt to insert the provided data into the "wyniki" table.
    // Make sure that the table name ("wyniki") exactly matches your Supabase table (likely all lowercase).
    const { data, error } = await supabase
      .from('Wyniki')
      .insert(
        [
          {
            wynik: payload,
            created_at: new Date().toISOString(), // You can omit this if your DB sets a default.
          },
        ],
        { returning: 'representation' }
      );

    if (error) {
      console.error("Supabase Insert Error:", error);
      return res.status(500).json({ message: 'Failed to store data', error: error.message });
    }

    console.log("Insert result:", data);
    return res.status(200).json({ message: 'Data stored successfully.', data });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ message: 'Failed to store data', error: err.message });
  }
};
