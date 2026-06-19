document.addEventListener("DOMContentLoaded", () => {

  // ── EmailJS init ──────────────────────────────────────────────
  emailjs.init("f0iqRJZsDWW4zAaxk");

  const amountInput  = document.getElementById("dn-amount");
  const form         = document.getElementById("donation-form");
  const feedback     = document.getElementById("donation-feedback");

  // ── Tier buttons: scroll to form and pre-fill amount ─────────
  document.querySelectorAll(".donate-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const amount = btn.dataset.amount;

      // Pre-fill amount field (empty for "Any" tier)
      if (amountInput) {
        amountInput.value = amount || "";
        amountInput.focus();
      }

      // Smooth scroll down to the form
      const formSection = document.getElementById("donation-form");
      if (formSection) {
        formSection.closest("section").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ── Form submission → EmailJS ─────────────────────────────────
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Basic validation
      const name    = document.getElementById("dn-name").value.trim();
      const email   = document.getElementById("dn-email").value.trim();
      const amount  = document.getElementById("dn-amount").value.trim();
      const method  = document.getElementById("dn-method").value;
      const message = document.getElementById("dn-message").value.trim();

      if (!name || !email || !amount || !method) {
        showFeedback("Please fill in all required fields.", "error");
        return;
      }

      const submitBtn = form.querySelector(".form-submit");
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      // Send via EmailJS
      emailjs.send("service_7tfb9w4", "template_llzpk4i", {
        donor_name:      name,
        donor_email:     email,
        donation_amount: `R${amount}`,
        payment_method:  method,
        message:         message || "No message provided."
      })
      .then(() => {
        showFeedback(
          `✅ Thank you, ${name}! Your donation of R${amount} has been received. A confirmation has been sent to ${email}.`,
          "success"
        );
        form.reset();
      })
      .catch(err => {
        console.error("EmailJS error:", err);
        showFeedback(
          "Something went wrong sending the email. Please try again or contact us directly.",
          "error"
        );
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Donation";
      });
    });
  }

  // ── Helper: show feedback message ────────────────────────────
  function showFeedback(msg, type) {
    if (!feedback) return;
    feedback.style.display = "block";
    feedback.style.padding = "16px 20px";
    feedback.style.borderRadius = "10px";
    feedback.style.fontSize = "15px";
    feedback.style.fontWeight = "600";
    feedback.style.marginTop = "20px";

    if (type === "success") {
      feedback.style.background = "#f0fdf4";
      feedback.style.border = "2px solid #86efac";
      feedback.style.color = "#166534";
    } else {
      feedback.style.background = "#fef2f2";
      feedback.style.border = "2px solid #fca5a5";
      feedback.style.color = "#991b1b";
    }

    feedback.textContent = msg;
    feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

});
