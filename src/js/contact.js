/**
 * Contact Form Controller - Railway/Express Edition
 * Features:
 * - Client-side validation with real-time feedback
 * - Anti-spam bot-field honeypot handling
 * - Double-submission prevention & loading state
 * - Posts to /api/contact (Express server endpoint)
 * - User-facing success & error notifications
 */

export function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const successBox = document.getElementById("formSuccess");
  const errorBox = document.getElementById("formError");
  const submitBtn = form.querySelector(".submit-btn");

  const fields = {
    name: { el: document.getElementById("fname"), err: document.getElementById("err-name") },
    email: { el: document.getElementById("femail"), err: document.getElementById("err-email") },
    subject: { el: document.getElementById("fsubject"), err: document.getElementById("err-subject") },
    message: { el: document.getElementById("fmessage"), err: document.getElementById("err-message") }
  };

  function validate() {
    let valid = true;

    const nameVal = fields.name.el ? fields.name.el.value.trim() : "";
    if (!nameVal) {
      if (fields.name.err) fields.name.err.textContent = "Please enter your name.";
      if (fields.name.el) fields.name.el.classList.add("invalid");
      valid = false;
    } else if (nameVal.length < 2) {
      if (fields.name.err) fields.name.err.textContent = "Name must be at least 2 characters.";
      if (fields.name.el) fields.name.el.classList.add("invalid");
      valid = false;
    } else {
      if (fields.name.err) fields.name.err.textContent = "";
      if (fields.name.el) fields.name.el.classList.remove("invalid");
    }

    const emailVal = fields.email.el ? fields.email.el.value.trim() : "";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailPattern.test(emailVal)) {
      if (fields.email.err) fields.email.err.textContent = "Please enter a valid email address.";
      if (fields.email.el) fields.email.el.classList.add("invalid");
      valid = false;
    } else {
      if (fields.email.err) fields.email.err.textContent = "";
      if (fields.email.el) fields.email.el.classList.remove("invalid");
    }

    const subjectVal = fields.subject.el ? fields.subject.el.value.trim() : "";
    if (!subjectVal) {
      if (fields.subject.err) fields.subject.err.textContent = "Please enter a subject.";
      if (fields.subject.el) fields.subject.el.classList.add("invalid");
      valid = false;
    } else if (subjectVal.length < 3) {
      if (fields.subject.err) fields.subject.err.textContent = "Subject must be at least 3 characters.";
      if (fields.subject.el) fields.subject.el.classList.add("invalid");
      valid = false;
    } else {
      if (fields.subject.err) fields.subject.err.textContent = "";
      if (fields.subject.el) fields.subject.el.classList.remove("invalid");
    }

    const messageVal = fields.message.el ? fields.message.el.value.trim() : "";
    if (!messageVal || messageVal.length < 10) {
      if (fields.message.err) fields.message.err.textContent = "Please enter a message (at least 10 characters).";
      if (fields.message.el) fields.message.el.classList.add("invalid");
      valid = false;
    } else {
      if (fields.message.err) fields.message.err.textContent = "";
      if (fields.message.el) fields.message.el.classList.remove("invalid");
    }

    return valid;
  }

  // Real-time re-validation on input
  Object.values(fields).forEach(f => {
    if (!f.el) return;
    f.el.addEventListener("input", () => {
      if (f.el.classList.contains("invalid")) validate();
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (successBox) successBox.style.display = "none";
    if (errorBox) errorBox.style.display = "none";

    if (!validate()) return;

    // Honeypot check - silently drop bot submissions
    const botField = form.querySelector("input[name=\"bot-field\"]");
    if (botField && botField.value.trim()) {
      if (successBox) {
        successBox.textContent = "Thanks for reaching out. I will get back to you soon.";
        successBox.style.display = "block";
      }
      form.reset();
      return;
    }

    // Enter SUBMITTING state
    const originalBtnText = submitBtn ? submitBtn.textContent : "Send Message";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    const formData = new FormData(form);
    const payload = {
      name: formData.get("name") || "",
      email: formData.get("email") || "",
      subject: formData.get("subject") || "",
      message: formData.get("message") || "",
      "bot-field": formData.get("bot-field") || ""
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        if (successBox) {
          successBox.textContent = data.message || "Thanks for reaching out. I will get back to you soon.";
          successBox.style.display = "block";
        }
        form.reset();
        Object.values(fields).forEach(f => {
          if (f.el) f.el.classList.remove("invalid");
          if (f.err) f.err.textContent = "";
        });
      } else {
        const errMsg = (data && data.error) ? data.error : "Something went wrong. Please try again.";
        if (errorBox) {
          errorBox.textContent = errMsg;
          errorBox.style.display = "block";
        }
      }
    } catch (err) {
      console.warn("Contact form submission error:", err);
      if (errorBox) {
        errorBox.textContent = "Something went wrong. Please try again or contact me directly.";
        errorBox.style.display = "block";
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  });
}
