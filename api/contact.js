import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

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

  // Send email via Gmail SMTP
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
      // Still return success to user — don't expose internal errors
    }
  } else {
    console.log("[Contact] SMTP not configured. Submission logged only.");
  }

  return res.status(200).json({
    success: true,
    message: "Thanks for reaching out. I will get back to you soon.",
  });
}
