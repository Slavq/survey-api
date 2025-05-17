// api/submit.js
export default function handler(req, res) {
  if (req.method === 'POST') {
    // Extract plain text from the request body (Vercel automatically parses JSON,
    // but for plain text we assume it is in req.body as a string)
    const textData = req.body;
    console.log("Received data:", textData);
    
    // You can add code here to store or process the data.
    // For now, we simply return a success response.
    
    res.status(200).json({ message: "Data stored successfully." });
  } else {
    // If not a POST request, reject it
    res.status(405).end(); // 405 Method Not Allowed
  }
}
