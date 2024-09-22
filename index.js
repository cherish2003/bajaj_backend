const express = require("express");
const bodyParser = require("body-parser");
const mime = require("mime-types"); // Use mime-types instead
const { Buffer } = require("buffer");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Mock user data
const userData = {
  full_name: "Polu siva sai cherish",
  dob: "04122003",
  email: "sivasai_cherish@srmap.edu.in",
  roll_number: "AP21110010001",
};

// POST /bfhl endpoint
app.post("/bfhl", (req, res) => {
  const { data, file_b64 } = req.body;
  const user_id = `${userData.full_name}_${userData.dob}`;

  // Validate input
  if (!Array.isArray(data)) {
    return res
      .status(400)
      .json({ is_success: false, message: "Invalid input data" });
  }

  const numbers = data.filter((item) => !isNaN(item));
  const alphabets = data.filter((item) => /^[A-Za-z]$/.test(item));
  const highest_lowercase_alphabet =
    alphabets
      .filter((char) => char >= "a" && char <= "z")
      .sort()
      .pop() || "";

  // File handling
  let file_valid = false;
  let file_mime_type = "";
  let file_size_kb = "0";

  if (file_b64) {
    try {
      const matches = file_b64.match(/^data:(.+);base64,(.*)$/);
      if (matches) {
        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, "base64");
        file_size_kb = (buffer.length / 1024).toFixed(2);
        file_valid = true;
        file_mime_type = mimeType;
      }
    } catch (error) {
      console.error("Error processing file:", error);
      file_valid = false;
    }
  }

  // Construct the response
  res.json({
    is_success: true,
    user_id: user_id,
    email: userData.email,
    roll_number: userData.roll_number,
    numbers: numbers,
    alphabets: alphabets,
    highest_lowercase_alphabet: highest_lowercase_alphabet
      ? [highest_lowercase_alphabet]
      : [],
    file_valid: file_valid,
    file_mime_type: file_mime_type,
    file_size_kb: file_size_kb,
  });
});

// GET /bfhl endpoint
app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
