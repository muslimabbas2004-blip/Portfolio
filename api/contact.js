import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  // Vercel auto-parses JSON body when Content-Type is application/json
  // but guard against string body just in case
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body || typeof body !== "object") body = {};

  const { name, email, subject, message } = body;
  const botField = body["bot-field"];

  // Honeypot check
  if (botField && String(botField).trim().length > 0) {
    return res.status(200).json({ success: true, message: "Message received." });
  }

  // Server-side validation
  const errors = {};

  const nameTrimmed = (name || "").trim();
  if (!nameTrimmed || nameTrimmed.length < 2) {
    errors.name = "Please enter a valid name (at least 2 characters).";
  }

  const emailTrimmed = (email || "").trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailTrimmed || !emailPattern.test(emailTrimmed)) {
    errors.email = "Please enter a valid email address.";
  }

  const subjectTrimmed = (subject || "").trim();
  if (!subjectTrimmed || subjectTrimmed.length < 3) {
    errors.subject = "Please enter a subject (at least 3 characters).";
  }

  const messageTrimmed = (message || "").trim();
  if (!messageTrimmed || messageTrimmed.length < 10) {
    errors.message = "Please enter a message (at least 10 characters).";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: "Validation failed.", fields: errors });
  }

  console.log(
    "[Contact] From: " + nameTrimmed + " <" + emailTrimmed +
    "> | Subject: " + subjectTrimmed + " | " + new Date().toISOString()
  );

  // Check env vars
  const smtpConfigured =
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.CONTACT_EMAIL_TO;

  if (!smtpConfigured) {
    console.error("[Contact] SMTP env vars missing:", {
      SMTP_HOST: !!process.env.SMTP_HOST,
      SMTP_USER: !!process.env.SMTP_USER,
      SMTP_PASS: !!process.env.SMTP_PASS,
      CONTACT_EMAIL_TO: !!process.env.CONTACT_EMAIL_TO,
    });
    // Still return success to user
    return res.status(200).json({
      success: true,
      message: "Thanks for reaching out. I will get back to you soon.",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: false,        // false = STARTTLS on port 587
      requireTLS: true,     // force TLS upgrade — needed on Vercel/cloud
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // allow self-signed certs on SMTP relay
      },
    });

    await transporter.sendMail({
      from: '"Portfolio Contact" <' + process.env.SMTP_USER + ">",
      replyTo: '"' + nameTrimmed + '" <' + emailTrimmed + ">",
      to: process.env.CONTACT_EMAIL_TO,
      subject: "[Portfolio Contact] " + subjectTrimmed,
      text:
        "Name: " + nameTrimmed +
        "\nEmail: " + emailTrimmed +
        "\nSubject: " + subjectTrimmed +
        "\n\n" + messageTrimmed,
      html:
        "<h2>New Portfolio Contact Submission</h2>" +
        "<p><strong>Name:</strong> " + nameTrimmed + "</p>" +
        "<p><strong>Email:</strong> <a href='mailto:" + emailTrimmed + "'>" + emailTrimmed + "</a></p>" +
        "<p><strong>Subject:</strong> " + subjectTrimmed + "</p>" +
        "<hr><p>" + messageTrimmed.replace(/\n/g, "<br>") + "</p>",
    });

    console.log("[Contact] Email sent successfully to " + process.env.CONTACT_EMAIL_TO);
  } catch (emailErr) {
    console.error("[Contact] Email send error:", emailErr.message, emailErr.code || "");
    // Return success to user even if email fails — don't expose SMTP errors
  }

  return res.status(200).json({
    success: true,
    message: "Thanks for reaching out. I will get back to you soon.",
  });
}
