/**
 * Netlify Serverless Function: Contact Form Handler
 * Provides an API endpoint at /.netlify/functions/contact
 */

export const handler = async function(event, context) {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    let data;
    if (event.headers && event.headers['content-type'] && event.headers['content-type'].includes('application/json')) {
      data = JSON.parse(event.body);
    } else {
      const params = new URLSearchParams(event.body || '');
      data = Object.fromEntries(params.entries());
    }

    const { name, email, subject, message, 'bot-field': botField } = data;

    // Check honeypot
    if (botField) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: 'Message received.' })
      };
    }

    // Validation
    if (!name || name.trim().length < 2) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Please enter a valid name.' })
      };
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email.trim())) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Please enter a valid email address.' })
      };
    }

    if (!subject || subject.trim().length < 3) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Please enter a valid subject.' })
      };
    }

    if (!message || message.trim().length < 10) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Message must be at least 10 characters long.' })
      };
    }

    console.log(`[Contact Submission] From: ${name} <${email}> | Subject: ${subject}`);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: "Thanks for reaching out. I'll get back to you soon."
      })
    };
  } catch (error) {
    console.error('Contact function error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};

export default handler;
