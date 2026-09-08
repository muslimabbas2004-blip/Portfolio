const { GoogleAuth } = require("google-auth-library");

const SPREADSHEET_ID = "1SjNiu02p4sx-UPcOjez5uZaZOwK1q2F6Pi4DoX9reL0";
const SHEET_NAME = "Sheet1";

async function appendToSheet(row) {
  const credentials = {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n").replace(/\r/g, ""),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
    universe_domain: "googleapis.com",
  };

  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values: [row],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Sheets API error ${response.status}: ${text}`);
  }

  return await response.json();
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  if (!body || typeof body !== "object") body = {};

  const { name, email, subject, message } = body;
  const botField = body["bot-field"];

  // Honeypot
  if (botField && String(botField).trim().length > 0) {
    return res.status(200).json({ success: true, message: "Message received." });
  }

  // Validation
  const errors = {};
  const nameTrimmed = (name || "").trim();
  if (!nameTrimmed || nameTrimmed.length < 2) errors.name = "Please enter a valid name.";

  const emailTrimmed = (email || "").trim();
  if (!emailTrimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) errors.email = "Please enter a valid email.";

  const subjectTrimmed = (subject || "").trim();
  if (!subjectTrimmed || subjectTrimmed.length < 3) errors.subject = "Please enter a subject.";

  const messageTrimmed = (message || "").trim();
  if (!messageTrimmed || messageTrimmed.length < 10) errors.message = "Please enter a message (at least 10 characters).";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: "Validation failed.", fields: errors });
  }

  const timestamp = new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" });

  console.log("[Contact] From:", nameTrimmed, "<" + emailTrimmed + "> | Subject:", subjectTrimmed);

  try {
    await appendToSheet([timestamp, nameTrimmed, emailTrimmed, subjectTrimmed, messageTrimmed]);
    console.log("[Contact] Row appended to Google Sheet");
    return res.status(200).json({ success: true, message: "Thanks for reaching out. I will get back to you soon." });
  } catch (err) {
    console.error("[Contact] Sheets error:", err.message);
    return res.status(500).json({ error: "Failed to save message.", detail: err.message });
  }
};
