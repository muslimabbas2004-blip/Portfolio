const nodemailer = require("nodemailer");

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

  if (botField && String(botField).trim().length > 0) {
    return res.status(200).json({ success: true, message: "Message received." });
  }

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

  // Log env var presence (never log values)
  const envStatus = {
    SMTP_HOST: !!process.env.SMTP_HOST,
    SMTP_USER: !!process.env.SMTP_USER,
    SMTP_PASS: !!process.env.SMTP_PASS,
    CONTACT_EMAIL_TO: !!process.env.CONTACT_EMAIL_TO,
  };
  console.log("[Contact] ENV status:", JSON.stringify(envStatus));
  console.log("[Contact] From:", nameTrimmed, "<" + emailTrimmed + "> | Subject:", subjectTrimmed);

  const smtpConfigured = envStatus.SMTP_HOST && envStatus.SMTP_USER && envStatus.SMTP_PASS && envStatus.CONTACT_EMAIL_TO;

  if (!smtpConfigured) {
    console.error("[Contact] SMTP env vars missing");
    // Return the env status so we can debug from the browser
    return res.status(500).json({
      error: "SMTP not configured on server.",
      debug: envStatus,
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: false,
      requireTLS: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: '"Portfolio Contact" <' + process.env.SMTP_USER + ">",
      replyTo: '"' + nameTrimmed + '" <' + emailTrimmed + ">",
      to: process.env.CONTACT_EMAIL_TO,
      subject: "[Portfolio Contact] " + subjectTrimmed,
      text: "Name: " + nameTrimmed + "\nEmail: " + emailTrimmed + "\nSubject: " + subjectTrimmed + "\n\n" + messageTrimmed,
      html:
        "<h2>New Portfolio Contact Submission</h2>" +
        "<p><strong>Name:</strong> " + nameTrimmed + "</p>" +
        "<p><strong>Email:</strong> <a href='mailto:" + emailTrimmed + "'>" + emailTrimmed + "</a></p>" +
        "<p><strong>Subject:</strong> " + subjectTrimmed + "</p>" +
        "<hr><p>" + messageTrimmed.replace(/\n/g, "<br>") + "</p>",
    });

    console.log("[Contact] Email sent to", process.env.CONTACT_EMAIL_TO);
    return res.status(200).json({ success: true, message: "Thanks for reaching out. I will get back to you soon." });

  } catch (err) {
    console.error("[Contact] Email error:", err.message, err.code || "");
    // Return the actual error so we can diagnose from browser
    return res.status(500).json({
      error: "Email send failed.",
      detail: err.message,
      code: err.code || null,
    });
  }
};
