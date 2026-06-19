/* =============================================
   contact.js  –  Contact form validation & mailto
   ============================================= */

(function () {

  const form    = document.getElementById("contact-form");
  const feedback = document.getElementById("contact-feedback");

  if (!form) return;

  /* ── Helpers ── */
  function showError(field, msg) {
    clearError(field);
    field.classList.add("input-error");
    const err = document.createElement("span");
    err.className = "error-msg";
    err.textContent = msg;
    field.parentNode.appendChild(err);
  }

  function clearError(field) {
    field.classList.remove("input-error");
    const old = field.parentNode.querySelector(".error-msg");
    if (old) old.remove();
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /^(\+27|0)[6-8][0-9]{8}$/.test(phone.replace(/\s/g, ""));
  }

  /* ── Live validation ── */
  form.querySelectorAll("input[id], select[id], textarea[id]").forEach(field => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("input-error")) validateField(field);
    });
  });

  function validateField(field) {
    const v = field.value.trim();

    if (field.id === "ct-name") {
      if (v.length < 2) { showError(field, "Name must be at least 2 characters."); return false; }
      clearError(field); return true;
    }
    if (field.id === "ct-email") {
      if (!validateEmail(v)) { showError(field, "Enter a valid email address."); return false; }
      clearError(field); return true;
    }
    if (field.id === "ct-phone") {
      if (v && !validatePhone(v)) { showError(field, "Enter a valid SA number, e.g. 0671234567."); return false; }
      clearError(field); return true;
    }
    if (field.id === "ct-type") {
      if (!v) { showError(field, "Please select a message type."); return false; }
      clearError(field); return true;
    }
    if (field.id === "ct-subject") {
      if (v.length < 3) { showError(field, "Subject must be at least 3 characters."); return false; }
      clearError(field); return true;
    }
    if (field.id === "ct-message") {
      if (v.length < 20) { showError(field, "Message must be at least 20 characters."); return false; }
      if (v.length > 2000) { showError(field, "Message may not exceed 2000 characters."); return false; }
      clearError(field); return true;
    }
    return true;
  }

  /* ── Character counter for message ── */
  const msgField = document.getElementById("ct-message");
  const charCount = document.getElementById("char-count");
  if (msgField && charCount) {
    msgField.addEventListener("input", () => {
      const len = msgField.value.length;
      charCount.textContent = len + " / 2000";
      charCount.style.color = len > 1800 ? "#dc2626" : "#64748b";
    });
  }

  /* ── Form submit ── */
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const fields = form.querySelectorAll("input[id], select[id], textarea[id]");
    let valid = true;
    fields.forEach(f => { if (!validateField(f)) valid = false; });
    if (!valid) return;

    const name    = document.getElementById("ct-name").value.trim();
    const email   = document.getElementById("ct-email").value.trim();
    const phone   = document.getElementById("ct-phone").value.trim();
    const type    = document.getElementById("ct-type").value;
    const subject = document.getElementById("ct-subject").value.trim();
    const message = document.getElementById("ct-message").value.trim();

    emailjs.send("service_7tfb9w4", "template_2m2xwfq",
    {
        name: name,
        email: email,
        phone: phone || "Not provided",
        enquiry_type: type,
        subject: subject,
        message: message
    }
)
.then(() => {

    feedback.innerHTML = `
      <div class="summary-box">
        <h3>✅ Message Sent!</h3>
        <p>Thank you for contacting PureDrop Foundation.</p>
        <p>We aim to respond within <strong>1–2 business days</strong>.</p>
      </div>`;

    feedback.style.display = "block";
    feedback.scrollIntoView({ behavior: "smooth" });

    form.reset();

    if (charCount) {
        charCount.textContent = "0 / 2000";
    }

})
.catch((error) => {

    feedback.innerHTML = `
      <div class="summary-box">
        <h3>❌ Message Failed</h3>
        <p>There was a problem sending your message.</p>
        <p>Please try again later, or email us directly at <a href="mailto:info@puredrop.com">info@puredrop.com</a>.</p>
      </div>`;

    feedback.style.display = "block";
    feedback.scrollIntoView({ behavior: "smooth" });

    console.error("EmailJS Error:", error);

});
  });

})();
