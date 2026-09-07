/**
 * server.js - Production server for Railway deployment
 *
 * Serves the Vite-built static portfolio and handles the contact form API.
 * Listens on process.env.PORT (set automatically by Railway).
 */

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS
const allowedOrigins = [
  process.env.SITE_URL,
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:4173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("CORS: origin " + origin + " not allowed"));
    },
    methods: ["GET", "POST"],
    credentials: false,
  })
);

// Body parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

// Static files - serve Vite build output
const DIST = path.join(__dirname, "dist");
app.use(
  express.static(DIST, {
    setHeaders(res, filePath) {
      if (filePath.includes("/assets/")) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else {
        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      }
    },
  })
);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Contact form API
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body || {};
  const botField = req.body ? req.body["bot-field"] : undefined;

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

  // Log submission
  console.log(
    "[Contact] From: " + nameTrimmed + " <" + emailTrimmed + "> | Subject: " + subjectTrimmed + " | " + new Date().toISOString()
  );

  // Email sending (if SMTP is configured)
  const smtpConfigured =
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.CONTACT_EMAIL_TO;

  if (smtpConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
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

      console.log("[Contact] Email sent to " + process.env.CONTACT_EMAIL_TO);
    } catch (emailErr) {
      console.error("[Contact] Email send error:", emailErr.message);
    }
  } else {
    console.log(
      "[Contact] SMTP not configured. Submission logged above. Set SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_EMAIL_TO to enable email."
    );
  }

  return res.status(200).json({
    success: true,
    message: "Thanks for reaching out. I will get back to you soon.",
  });
});

// SPA fallback - return index.html for all unmatched routes
app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(DIST, "index.html"));
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error("[Server Error]", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on http://0.0.0.0:" + PORT);
  console.log("Environment: " + (process.env.NODE_ENV || "development"));
  console.log("SMTP configured: " + !!(process.env.SMTP_HOST && process.env.SMTP_USER));
});

