/* =============================================================
   enquiry.js  –  Enquiry form validation, logic & EmailJS
   ============================================================= */

(function () {

  const form    = document.getElementById("enquiry-form");
  const summary = document.getElementById("enquiry-summary");

  if (!form) return;

  // 1. DYNAMICALLY LOAD EMAILJS SDK
  const emailjsScript = document.createElement("script");
  emailjsScript.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
  emailjsScript.async = true;
  document.head.appendChild(emailjsScript);

  emailjsScript.onload = function() {
    // 2. INITIALIZE EMAILJS WITH YOUR PUBLIC KEY
    
    emailjs.init({
      publicKey: "f0iqRJZsDWW4zAaxk",
    });
  };

  /* Pricing reference (R per unit / per year) */
  const pricing = {
    volunteer : { label: "Volunteer Programme",  cost: 0,     unit: "free" },
    sponsor   : { label: "Corporate Sponsorship", cost: 50000, unit: "per year" },
    borehole  : { label: "Borehole Installation", cost: 85000, unit: "per unit" },
    tank      : { label: "Community Water Tank",  cost: 12000, unit: "per unit" },
    workshop  : { label: "Water Safety Workshop", cost: 3500,  unit: "per session" },
  };

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

  function validatePhone(phone) {
    return /^(\+27|0)[6-8][0-9]{8}$/.test(phone.replace(/\s/g, ""));
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ── Live validation ── */
  form.querySelectorAll("input, select, textarea").forEach(field => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("input-error")) validateField(field);
    });
  });

  function validateField(field) {
    const v = field.value.trim();

    if (field.id === "eq-name") {
      if (v.length < 2) { showError(field, "Full name must be at least 2 characters."); return false; }
      clearError(field); return true;
    }
    if (field.id === "eq-email") {
      if (!validateEmail(v)) { showError(field, "Please enter a valid email address."); return false; }
      clearError(field); return true;
    }
    if (field.id === "eq-phone") {
      if (v && !validatePhone(v)) { showError(field, "Enter a valid SA phone number, e.g. 0671234567."); return false; }
      clearError(field); return true;
    }
    if (field.id === "eq-service") {
      if (!v) { showError(field, "Please select a service."); return false; }
      clearError(field); return true;
    }
    if (field.id === "eq-qty") {
      if (isNaN(v) || parseInt(v) < 1) { showError(field, "Quantity must be at least 1."); return false; }
      clearError(field); return true;
    }
    if (field.id === "eq-date") {
      if (v) {
        const d = new Date(v);
        if (isNaN(d) || d < new Date().setHours(0,0,0,0)) { showError(field, "Please choose a future date."); return false; }
      }
      clearError(field); return true;
    }
    if (field.id === "eq-message") {
      if (v.length < 10) { showError(field, "Please provide a message (at least 10 characters)."); return false; }
      clearError(field); return true;
    }
    return true;
  }

  /* ── Show/hide quantity based on service ── */
  const serviceSelect = document.getElementById("eq-service");
  const qtyGroup = document.getElementById("qty-group");

  serviceSelect && serviceSelect.addEventListener("change", () => {
    const sel = serviceSelect.value;
    if (sel === "volunteer") {
      qtyGroup.style.display = "none";
    } else {
      qtyGroup.style.display = "";
    }
  });

  /* ── Form submit ── */
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate all
    const fields = form.querySelectorAll("input[id], select[id], textarea[id]");
    let valid = true;
    fields.forEach(f => { if (!validateField(f)) valid = false; });
    if (!valid) return;

    // Change button text to show it's sending
    const submitBtn = form.querySelector(".form-submit");
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Sending... Please wait...";
    submitBtn.disabled = true;

    // Gather extra computed data for the email template
    const name         = document.getElementById("eq-name").value.trim();
    const email        = document.getElementById("eq-email").value.trim();
    const phone        = document.getElementById("eq-phone").value.trim();
    const organisation = document.getElementById("eq-org").value.trim();
    const service      = document.getElementById("eq-service").value;
    const qty          = parseInt(document.getElementById("eq-qty")?.value || "1", 10);
    const date         = document.getElementById("eq-date").value;
    const province     = document.getElementById("eq-province").value;
    const message      = document.getElementById("eq-message").value.trim();

    const p = pricing[service] || { label: service, cost: 0, unit: "" };
    const total = p.cost * (service === "volunteer" ? 0 : qty);
    const currency = total === 0 ? "Free of charge" : "R " + total.toLocaleString();

    // 3. PREPARE EMAILJS TEMPLATE PARAMETERS
    
    const templateParams = {
      name: name,
      email: email,
      phone: phone || "Not provided",
      organisation: organisation || "Not provided",
      service: p.label,
      quantity: service === "volunteer" ? "N/A" : qty,
      estimated_cost: `${currency} ${p.unit ? "(" + p.unit + ")" : ""}`,
      preferred_date: date || "To be confirmed",
      province: province || "Not provided",
      message: message
    };

    // 4. SEND EMAIL VIA EMAILJS
    
    emailjs.send("service_7tfb9w4", "template_2m2xwfq", templateParams)
      .then(() => {
        // Build response on success
        const html = `
          <div class="summary-box">
            <h3>✅ Enquiry Received!</h3>
            <p>Thank you, <strong>${name}</strong>. Here are your estimated details:</p>
            <table class="summary-table">
              <tr><th>Service</th><td>${p.label}</td></tr>
              <tr><th>Quantity</th><td>${service === "volunteer" ? "N/A" : qty}</td></tr>
              <tr><th>Estimated Cost</th><td>${currency} ${p.unit ? "(" + p.unit + ")" : ""}</td></tr>
              <tr><th>Preferred Date</th><td>${date || "To be confirmed"}</td></tr>
            </table>
            <p>Our team will contact you within <strong>2 business days</strong> to confirm availability and finalise details.</p>
            <p>Questions? Call <a href="tel:+27679473236">+27 67 947 3236</a> or email <a href="mailto:info@puredrop.com">yomelelasiphelele@gmail.com</a>.</p>
          </div>`;

        summary.innerHTML = html;
        summary.style.display = "block";
        summary.scrollIntoView({ behavior: "smooth" });
        form.reset();
        if (qtyGroup) qtyGroup.style.display = "";
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        alert("Oops! Something went wrong while sending your enquiry. Please try again or contact us directly.");
      })
      .finally(() => {
        // Re-enable button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      });
  });

})();