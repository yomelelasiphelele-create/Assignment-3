# PureDrop Foundation Website
**Student Number:** ST10101176  
**Module:** Web Design & Development  
**Part:** 3 (Final Submission)

---

## Project Overview
PureDrop Foundation is a fictional South African non-profit organisation dedicated to providing clean, safe, and sustainable drinking water to underserved communities. This website was built across three parts as part of the Web Design module.

---

## File Structure
```
/
├── Home.html          – Landing page with hero, stats, FAQ accordion
├── About.html         – Organisation background, values
├── Impact.html        – Animated counter statistics
├── Project.html       – Gallery with lightbox, search filter, Leaflet map
├── Donate.html        – Donation tiers, corporate sponsorship CTA
├── enquiry.html       – Service enquiry form (Part 3 requirement)
├── ContactUs.html     – General contact form with mailto (Part 3 requirement)
├── Form.html          – Donation form with JS validation
├── robots.txt         – Search engine crawler instructions (Part 3 SEO)
├── sitemap.xml        – XML sitemap for all public pages (Part 3 SEO)
├── css/
│   └── style.css      – All styles including Part 3 additions
└── js/
    ├── main.js        – Shared JS (mobile nav, scroll reveal, accordion,
    │                    lightbox, search filter, counters, map init)
    ├── enquiry.js     – Enquiry form validation and cost summary logic
    └── contact.js     – Contact form validation and mailto handler
```

---

## Deployment
The website can be deployed on any static hosting platform such as:
- **Netlify** – drag and drop the folder or connect to a Git repository
- **GitHub Pages** – push to a repository and enable Pages in settings
- **Vercel** – import the repository and deploy automatically

---

## Changelog

### Part 3 – 2026-06-18

#### [ADD] `enquiry.html` – New service enquiry page
Created a new `enquiry.html` page as required by Part 3 instructions. The form collects full name, email address, phone number (optional, SA format validated), organisation/community name, service type (borehole installation, water tank, safety workshop, corporate sponsorship, or volunteer programme), quantity, preferred start date, province, and a detailed message. Upon valid submission, JavaScript dynamically calculates the estimated cost based on the selected service and quantity, and presents the user with a formatted cost/availability summary without a page refresh. All input is validated client-side using a dedicated `js/enquiry.js` file before the summary is displayed.

#### [ADD] `ContactUs.html` – Rebuilt with full JS validation and mailto
Replaced the minimal Part 2 contact form (which lacked validation, labels, and ids) with a fully rebuilt page in `ContactUs.html`. The new form collects full name, email, optional phone number (SA format), message type (dropdown: General Enquiry, Donation Query, Partnership, Media, Complaint, Volunteer, Other), subject, and a full message body with a live character counter (max 2000 characters). All fields are validated using `js/contact.js` with inline error messages on blur. On valid submission, a `mailto:` link is constructed with the subject and body pre-filled, the user's default email client is launched, and a confirmation message is shown on the page.

#### [ADD] `js/main.js` – Shared JavaScript enhancements
Created a new `js/main.js` file included on every page. It provides:
- **Mobile navigation burger toggle**: A button is injected into the `<nav>` element via JavaScript; clicking it toggles a `.nav-open` class on the `<ul>`, which is revealed via CSS flexbox on screens ≤768 px.
- **Scroll-reveal animations**: Uses `IntersectionObserver` to add a `.reveal` class to `.card`, `.about`, `.section-title`, `.impact-box`, and `.faq-item` elements when they enter the viewport, triggering a CSS fade-in-up transition.
- **FAQ accordion**: Queries all `.faq-question` buttons; clicking one toggles `.open` on the parent `.faq-item` and animates `max-height` to create a smooth expand/collapse. Only one item can be open at a time.
- **Lightbox gallery**: Injects a full-screen `#lightbox` overlay; all images inside `.gallery .card` become clickable thumbnails that open the lightbox with previous/next navigation and keyboard support (Escape, ArrowLeft, ArrowRight).
- **Project search/filter**: Listens to the `#project-search` input on `Project.html` and toggles `.card` elements visible or hidden based on whether their title or description text contains the query string. Displays a "no results" message if no cards match.
- **Animated counters**: Uses `IntersectionObserver` to trigger counting animations on elements with `data-count` attributes when they scroll into view. Used on `Impact.html` and `Home.html`.
- **Smooth scroll**: Prevents default on `#anchor` links and uses `scrollIntoView` with `behavior: smooth`.
- **`window.initMap`**: A globally exposed function that initialises a Leaflet.js map on `Project.html` with four custom markers representing real project provinces, each with a popup description.

#### [ADD] `js/enquiry.js` – Enquiry form validation module
Separated the enquiry form logic into its own file for maintainability. Validates name (min 2 chars), email (regex), phone (optional, SA format `/^(\+27|0)[6-8][0-9]{8}$/`), service selection, quantity (≥1), preferred date (must be future), and message (min 10 chars). Shows/hides the quantity field when "Volunteer Programme" is selected. On valid submit, calculates total cost using a pricing reference object and renders a formatted HTML summary table.

#### [ADD] `js/contact.js` – Contact form validation module
Separated the contact form logic into its own file. Validates name, email, phone (optional), message type selection, subject (min 3 chars), and message body (min 20, max 2000 chars). Includes a live character counter on the textarea. On valid submit, constructs a `mailto:` URI with pre-filled subject (`[PureDrop] <subject>`) and body containing all form data, then calls `window.location.href` to open the user's email client.

#### [UPDATE] All HTML pages – SEO meta tags added
Added the following to every page `<head>`:
- `<title>` tags with unique, descriptive, keyword-rich titles per page.
- `<meta name="description">` with a unique 150–160 character description per page.
- `<meta name="keywords">` with relevant keyword phrases per page.
- `<meta name="robots" content="index, follow">` on all public pages.
- `<link rel="canonical">` pointing to the intended canonical URL for each page.
- Open Graph tags (`og:title`, `og:description`, `og:type`, `og:url`) on `Home.html`.

#### [UPDATE] All HTML pages – Structural and accessibility fixes
- Changed `<div class="logo">` to `<a href="Home.html" class="logo">` to make the logo a proper link.
- Added `aria-label="Main navigation"` to all `<nav>` elements.
- Added `aria-current="page"` to the active nav link on each page.
- Added `aria-label` and `aria-live` attributes to form regions and dynamic content containers.
- Fixed duplicate `<footer>` tags (Part 2 had nested `<footer>` inside `<footer>`).
- Replaced placeholder `<address>` text with proper `<address>` HTML elements.
- Added `loading="lazy"` to all non-critical images.
- Added `width` and `height` attributes to all `<img>` elements to prevent layout shift.
- Added `rel="noopener"` to all external `target="_blank"` links.
- Added `href` values to all social media links (previously `href="#"`).

#### [UPDATE] `Project.html` – Leaflet interactive map added
Imported Leaflet.js 1.9.4 CSS and JS via CDN (integrity hashes included for security). Added a `<div id="map">` inside a dedicated section. The `window.initMap()` function in `main.js` fires on `window.load` and places markers for PureDrop's four active provinces with popup descriptions. Map height is set to 420 px via CSS and `z-index: 1` to prevent overlay conflicts with the fixed navbar.

#### [UPDATE] `Project.html` – Search filter added
Added a `<div class="search-wrap">` with a labelled `<input type="search" id="project-search">` above the gallery. The `initSearch()` function in `main.js` listens for `input` events and toggles card visibility based on keyword matching in both `h3` and `p` text, with a "no results" paragraph injected dynamically.

#### [UPDATE] `Impact.html` – Animated counters added
Added `data-count` and `data-suffix` attributes to counter `<span>` elements. The `initCounters()` function in `main.js` uses `IntersectionObserver` to trigger count-up animations only when counters scroll into the viewport, improving performance. The same counters were also added to the stats section on `Home.html`.

#### [UPDATE] `css/style.css` – Part 3 styles appended
Added approximately 300 lines of new CSS at the end of the existing stylesheet covering: mobile navigation responsive menu, scroll-reveal pre/post states, lightbox overlay and controls, search bar styling, FAQ accordion with height animation, Leaflet map container sizing, shared form layout (`.form-page`, `.form-card`, `.form-group`, `.form-row`), input focus/error states (`.input-error`, `.error-msg`), character counter styling, form submit button, summary/feedback box (`.summary-box`, `.summary-table`), page header banner, donation tier cards (`.donate-cards`, `.donate-card`), and a required field asterisk helper (`.req`). All new selectors are namespaced to avoid conflicts with Part 2 styles.

#### [ADD] `robots.txt` – Search engine crawler instructions
Created `robots.txt` at the site root. Allows all user agents to index the site. Disallows `/js/` and `/css/` directories (assets, not content). Includes a `Sitemap:` directive pointing to `sitemap.xml`.

#### [ADD] `sitemap.xml` – XML sitemap for all public pages
Created a well-formed XML sitemap listing all seven public pages with `<loc>`, `<lastmod>` (2026-06-18), `<changefreq>` (monthly), and `<priority>` values. `Home.html` and `Project.html` are assigned the highest priorities (1.0 and 0.9) as they are the primary entry and discovery pages. `Form.html` is excluded from the sitemap as it is an internal utility page tagged `noindex`.

---

*End of Changelog*
