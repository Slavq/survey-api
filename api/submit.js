// api/submit.js

// This function uses the native fetch API available on Node 18+ (Vercel's default runtime)
// to post data directly to Supabase’s REST endpoint for your "wyniki" table.

const SUPABASE_URL = process.env.SUPABASE_URL; // e.g., "https://your-project.supabase.co"
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY; // your anon key

exports.handler = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  // Read the request body (works whether sent as plain text or JSON)
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
    // Send a POST request to Supabase's REST API endpoint for the "wyniki" table.
    const response = await fetch(`${SUPABASE_URL}/rest/v1/Wyniki`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        // This header tells Supabase to return the inserted row(s).
        'Prefer': 'return=representation'
      },
      body: JSON.stringify([
        {
          wynik: textData,
          created_at: new Date().toISOString() // You can omit this if your table assigns a default.
        }
      ])
    });

    // Parse the JSON response from Supabase.
    const json = await response.json();
    console.log("Insert response:", json);

    if (!response.ok) {
      // If the request failed, send back an error status.
      res.status(response.status).json({ message: "Insert failed", error: json });
      return;
    }

    // Success!
    res.status(200).json({ message: "Data stored successfully.", data: json });
  } catch (err) {
    console.error("Error in fetch:", err);
    res.status(500).json({ message: "Failed to store data", error: err.message });
  }
};
