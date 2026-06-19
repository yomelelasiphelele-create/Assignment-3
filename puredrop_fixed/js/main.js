/* =============================================
   PureDrop Foundation – main.js
   Part 3 JavaScript Enhancements
   ============================================= */

/* ── 1. Mobile Navigation Toggle ── */
(function initMobileNav() {
  const nav = document.querySelector("nav");
  if (!nav) return;

  const burger = document.createElement("button");
  burger.className = "burger";
  burger.setAttribute("aria-label", "Toggle navigation");
  burger.innerHTML = "&#9776;";
  nav.appendChild(burger);

  const ul = nav.querySelector("ul");
  burger.addEventListener("click", () => {
    ul.classList.toggle("nav-open");
    burger.innerHTML = ul.classList.contains("nav-open") ? "&#10005;" : "&#9776;";
  });

  // Close on link click
  ul.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      ul.classList.remove("nav-open");
      burger.innerHTML = "&#9776;";
    });
  });
})();


/* ── 2. Scroll-reveal animations ── */
(function initScrollReveal() {
  const targets = document.querySelectorAll(".card, .about, .section-title, .impact-box, .faq-item");
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => {
    el.classList.add("pre-reveal");
    observer.observe(el);
  });
})();


/* ── 3. Accordion / FAQ ── */
(function initAccordion() {
  document.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const answer = item.querySelector(".faq-answer");
      const isOpen = item.classList.contains("open");

      // Close all
      document.querySelectorAll(".faq-item.open").forEach(open => {
        open.classList.remove("open");
        open.querySelector(".faq-answer").style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
})();


/* ── 4. Lightbox Gallery ── */
(function initLightbox() {
  const galleryImgs = document.querySelectorAll(".gallery .card img");
  if (!galleryImgs.length) return;

  // Build overlay
  const overlay = document.createElement("div");
  overlay.id = "lightbox";
  overlay.innerHTML = `
    <button id="lb-close" aria-label="Close">&times;</button>
    <button id="lb-prev" aria-label="Previous">&#8592;</button>
    <img id="lb-img" src="" alt="">
    <p id="lb-caption"></p>
    <button id="lb-next" aria-label="Next">&#8594;</button>
  `;
  document.body.appendChild(overlay);

  let current = 0;
  const images = Array.from(galleryImgs);

  function openLightbox(index) {
    current = index;
    const img = images[current];
    document.getElementById("lb-img").src = img.src;
    document.getElementById("lb-caption").textContent =
      img.closest(".card").querySelector("h3")?.textContent || "";
    overlay.classList.add("lb-active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    overlay.classList.remove("lb-active");
    document.body.style.overflow = "";
  }

  images.forEach((img, i) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => openLightbox(i));
  });

  document.getElementById("lb-close").addEventListener("click", closeLightbox);
  document.getElementById("lb-prev").addEventListener("click", () =>
    openLightbox((current - 1 + images.length) % images.length)
  );
  document.getElementById("lb-next").addEventListener("click", () =>
    openLightbox((current + 1) % images.length)
  );
  overlay.addEventListener("click", e => { if (e.target === overlay) closeLightbox(); });

  document.addEventListener("keydown", e => {
    if (!overlay.classList.contains("lb-active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightbox((current - 1 + images.length) % images.length);
    if (e.key === "ArrowRight") openLightbox((current + 1) % images.length);
  });
})();


/* ── 5. Project Search / Filter ── */
(function initSearch() {
  const searchInput = document.getElementById("project-search");
  if (!searchInput) return;

  const cards = document.querySelectorAll(".gallery .card");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    let visible = 0;

    cards.forEach(card => {
      const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
      const desc  = card.querySelector("p")?.textContent.toLowerCase() || "";
      const match = title.includes(query) || desc.includes(query);
      card.style.display = match ? "" : "none";
      if (match) visible++;
    });

    // No-results message
    let noRes = document.getElementById("no-results");
    if (!noRes) {
      noRes = document.createElement("p");
      noRes.id = "no-results";
      noRes.textContent = "No projects match your search.";
      noRes.style.cssText = "text-align:center;color:#64748b;padding:20px;display:none;";
      document.querySelector(".gallery")?.after(noRes);
    }
    noRes.style.display = visible === 0 && query ? "block" : "none";
  });
})();


/* ── 6. Animated Counter (Impact page) ── */
(function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let count = 0;
      const step = Math.ceil(target / 80);
      const interval = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count.toLocaleString() + (el.dataset.suffix || "");
        if (count >= target) clearInterval(interval);
      }, 20);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ── 7. Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});


/* ── 8. Leaflet Map initialiser (runs only if #map exists) ── */
window.initMap = function () {
  const mapEl = document.getElementById("map");
  if (!mapEl || typeof L === "undefined") return;

  const map = L.map("map").setView([-33.0, 27.9], 6);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const projects = [
    { lat: -33.015, lng: 27.912, title: "Gqeberha HQ", desc: "PureDrop Foundation Headquarters" },
    { lat: -28.743, lng: 24.767, title: "Northern Cape Project", desc: "Borehole installation – 500 families served" },
    { lat: -25.746, lng: 28.188, title: "Tshwane Outreach", desc: "Water safety workshops – 3 schools" },
    { lat: -29.853, lng: 31.021, title: "KZN Distribution", desc: "Clean water tank installation" },
  ];

  projects.forEach(p => {
    L.marker([p.lat, p.lng])
      .addTo(map)
      .bindPopup(`<strong>${p.title}</strong><br>${p.desc}`);
  });
};
