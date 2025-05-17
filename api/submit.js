// api/submit.js

const fetch = require('node-fetch'); // Using node-fetch version 2

// Retrieve Supabase credentials from environment variables.
const SUPABASE_URL = process.env.SUPABASE_URL; // e.g., "https://your-project.supabase.co"
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY; // Your anon key

exports.handler = async (req, res) => {
  // Only allow POST requests.
  if (req.method !== 'POST') {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }
  
  // Read the request body.
  let textData = req.body;
  if (!textData) {
    res.status(400).json({ message: "No data provided" });
    return;
  }
  if (typeof textData !== 'string') {
    textData = JSON.stringify(textData);
  }
  
  console.log("Received data:", textData);
  
  try {
    // Construct the Supabase REST URL for the "Wyniki" table.
    const url = `${SUPABASE_URL}/rest/v1/Wyniki`;
    console.log("Posting to URL:", url);
    
    // Make the POST request to Supabase.
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify([
        {
          wynik: textData
          //created_at: new Date().toISOString() // Omit this field if your table has a default value.
        }
      ])
    });
    
    // Log that the fetch call has returned.
    console.log("After fetch call, waiting for response.");
    
    // Parse the JSON response.
    const json = await response.json();
    console.log("Insert response:", json);
    
    if (!response.ok) {
      res.status(response.status).json({ message: "Insert failed", error: json });
      return;
    }
    
    // Return a success response.
    res.status(200).json({ message: "Data stored successfully.", data: json });
  } catch (err) {
    console.error("Error in fetch:", err);
    res.status(500).json({ message: "Failed to store data", error: err.message });
  }
};
