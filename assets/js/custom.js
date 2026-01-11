/**
 * Custom additions for iPortfolio:
 * - Premium Certificates UI (featured + filter + search + modal details)
 * - Easy data editing: update CERTIFICATES array below
 */
(function () {
  "use strict";

  window.addEventListener("DOMContentLoaded", function () {
    // Helpers
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const safeText = (v) => (v ?? "").toString();

    function resolveUrl(path) {
      try { return new URL(path, window.location.href).toString(); }
      catch (e) { return path; }
    }

    // === DATA ===
    // Tambahkan / edit item sertifikat di array ini.
    // Tips: Kamu bisa tambahkan optional field:
    // - category: "UI/UX" | "Frontend" | "Backend" | "Cybersecurity" | "General"
    // - tags: ["Google", "Coursera", ...]
    // - featured: true/false
    // - description: "..."

    const CERTIFICATES = [
        {
          title: "Front-End Meta",
          issuer: "29 Desember",
          date: "2025",
          previewImg: "assets/img/certificates/GanesGemiPutra_Introduction to Front-End Development_META.png",
          downloadFile: "assets/certificates/GanesGemiPutra_Introduction to Front-End Development_META.pdf",
          originalLink: "https://www.coursera.org/account/accomplishments/verify/EYG4XIJRJ375?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=pdf_header_button&utm_product=course" // replace with real certificate link
        },
        {
          title: "Maganghub-Design Thinking",
          issuer: "Jakarta 29 Desember",
          date: "2025",
          previewImg: "assets/img/certificates/GanesGemiPutra_Essential Skills Design Thinking.png",
          downloadFile: "assets/certificates/laravel-backend.pdf",
          originalLink: "https://hrcentro-resources.s3.ap-southeast-1.amazonaws.com/certificate/315/7fc8bc52-d2e7-4710-8ef8-6d4c231343bc.pdf?v=1767026320"
        },
        {
          title: "Prototype-Google",
          issuer: "29 Desember",
          date: "2025",
          previewImg: "assets/img/certificates/GanesGemiPutra_BuildWireframesandLow-FidelityPrototype-Google.png",
          downloadFile: "assets/certificates/GanesGemiPutra_BuildWireframesandLow-FidelityPrototype-Google.pdf",
          originalLink: "https://www.coursera.org/account/accomplishments/certificate/18LCV1FSU4PN"
        },
        {
          title: "Foundations of Cybersecurity-Google",
          issuer: "30 Desember",
          date: "2025",
          previewImg: "assets/img/certificates/foundations-of-cybersecurity-google.png",
          downloadFile: "assets/certificates/foundations-of-cybersecurity-google.pdf",
          originalLink: "https://www.coursera.org/account/accomplishments/verify/PXPGBGF9TY5W"
        }
      ];


    // === CATEGORY INFERENCE (kalau kamu tidak isi manual) ===
    function inferCategory(c) {
      const hay = (safeText(c.title) + " " + safeText(c.issuer) + " " + safeText(c.previewImg) + " " + safeText(c.downloadFile)).toLowerCase();

      if (hay.includes("cyber") || hay.includes("security")) return "Cybersecurity";
      if (hay.includes("ux") || hay.includes("ui") || hay.includes("wireframe") || hay.includes("prototype") || hay.includes("design")) return "UI/UX";
      if (hay.includes("front") || hay.includes("html") || hay.includes("css") || hay.includes("javascript") || hay.includes("react")) return "Frontend";
      if (hay.includes("back") || hay.includes("api") || hay.includes("laravel") || hay.includes("spring") || hay.includes("node") || hay.includes("database")) return "Backend";
      return "General";
    }

    function inferIssuerBadge(c) {
      const hay = (safeText(c.title) + " " + safeText(c.previewImg)).toLowerCase();
      if (hay.includes("google")) return "Google";
      if (hay.includes("meta")) return "Meta";
      if (hay.includes("coursera")) return "Coursera";
      return safeText(c.issuer).trim() || "Certificate";
    }

    function autoFeatured(c, idx) {
      const hay = (safeText(c.title) + " " + safeText(c.previewImg)).toLowerCase();
      if (hay.includes("google") || hay.includes("meta") || hay.includes("cybersecurity") || hay.includes("security")) return true;
      return idx < 4;
    }

    // Normalize data
    const CERTS = (CERTIFICATES || []).map((c, idx) => {
      const cat = c.category || inferCategory(c);
      const issuerBadge = c.issuerBadge || inferIssuerBadge(c);
      const tags = Array.isArray(c.tags) ? c.tags : [cat, issuerBadge].filter(Boolean);

      return {
        ...c,
        _idx: idx,
        category: cat,
        issuerBadge,
        tags,
        featured: typeof c.featured === "boolean" ? c.featured : autoFeatured(c, idx),
        description: c.description || ""
      };
    });

    // Elements
    const gridEl = $("#certGrid");
    const featuredEl = $("#certFeatured");
    const filtersEl = $("#certFilters");
    const searchEl = $("#certSearch");
    const emptyEl = $("#certEmpty");
    const countEl = $("#certCount");

    if (!gridEl || !featuredEl || !filtersEl) return;

    // State
    let activeCategory = "All";
    let query = "";

    // Build filter pills
    const categories = ["All", ...Array.from(new Set(CERTS.map(c => c.category))).sort((a,b)=>a.localeCompare(b))];

    function renderFilters() {
      filtersEl.innerHTML = "";
      categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cert-pill" + (cat === activeCategory ? " is-active" : "");
        btn.textContent = cat;
        btn.addEventListener("click", () => {
          activeCategory = cat;
          $$(".cert-pill", filtersEl).forEach(b => b.classList.toggle("is-active", b.textContent === cat));
          renderAll();
        });
        filtersEl.appendChild(btn);
      });
    }

    function certCard(c, variant = "grid") {
      const img = resolveUrl(c.previewImg);
      const title = safeText(c.title);
      const issuerBadge = safeText(c.issuerBadge || c.issuer);
      const date = safeText(c.date);
      const cat = safeText(c.category);

      const colClass = variant === "featured" ? "col-12 col-md-6 col-lg-6" : "col-12 col-sm-6 col-lg-4";

      return `
        <div class="${colClass}">
          <article class="cert-card ${variant === "featured" ? "cert-card--featured" : ""}" data-cert-index="${c._idx}">
            <div class="cert-thumb">
              <img src="${img}" alt="Preview ${title}" loading="lazy" />
              <div class="cert-overlay"></div>
              <div class="cert-badges">
                <span class="cert-badge">${issuerBadge}</span>
                <span class="cert-badge cert-badge--muted">${cat}</span>
              </div>
            </div>

            <div class="cert-body">
              <h4 class="cert-title">${title}</h4>
              <div class="cert-meta">${safeText(c.issuer)} • ${date}</div>

              <div class="cert-actions">
                <button class="btn btn-sm btn-primary cert-preview-btn" type="button"
                  data-bs-toggle="modal" data-bs-target="#certModal" data-cert-index="${c._idx}">
                  <i class="bi bi-eye me-1"></i><span class="btn-label">Preview</span>
                </button>

                <a class="btn btn-sm btn-outline-secondary cert-download-btn" href="${resolveUrl(c.downloadFile)}" download>
                  <i class="bi bi-download me-1"></i><span class="btn-label">Download</span>
                </a>

                <a class="btn btn-sm btn-outline-secondary cert-origin-btn" href="${safeText(c.originalLink) || "#"}" target="_blank" rel="noopener">
                  <i class="bi bi-box-arrow-up-right me-1"></i><span class="btn-label">Link Asli</span>
                </a>
              </div>
            </div>
          </article>
        </div>
      `;
    }

    function matchFilter(c) {
      const matchesCategory = activeCategory === "All" || c.category === activeCategory;
      const hay = (safeText(c.title) + " " + safeText(c.issuer) + " " + safeText(c.issuerBadge) + " " + safeText(c.date)).toLowerCase();
      const matchesQuery = !query || hay.includes(query);
      return matchesCategory && matchesQuery;
    }

    function renderFeatured(list) {
      const featured = list.filter(c => c.featured).slice(0, 4);
      featuredEl.innerHTML = featured.map(c => certCard(c, "featured")).join("");
    }

    function renderGrid(list) {
      gridEl.innerHTML = list.map(c => certCard(c, "grid")).join("");
    }

    function renderAll() {
      const filtered = CERTS.filter(matchFilter);

      // Featured only when "All" and no query (biar tidak membingungkan)
      const showFeatured = (activeCategory === "All" && !query);
      const featuredPool = showFeatured ? CERTS : filtered;

      renderFeatured(featuredPool);

      const featuredIdx = new Set(featuredPool.filter(c=>c.featured).slice(0,4).map(c=>c._idx));
      const gridList = filtered.filter(c => !(showFeatured && featuredIdx.has(c._idx)));

      renderGrid(gridList);

      const total = filtered.length;
      if (countEl) countEl.textContent = `${total} sertifikat`;
      if (emptyEl) emptyEl.hidden = total !== 0;
    }

    // Search
    if (searchEl) {
      searchEl.addEventListener("input", (e) => {
        query = (e.target.value || "").trim().toLowerCase();
        renderAll();
      });
    }

    // Modal wiring
    const modalTitle = $("#certModalTitle");
    const modalMeta = $("#certModalMeta");
    const modalImg = $("#certModalImg");
    const modalTags = $("#certModalTags");
    const modalDesc = $("#certModalDesc");
    const downloadBtn = $("#certDownloadBtn");
    const originalBtn = $("#certOriginalBtn");

    document.addEventListener("click", (e) => {
      const previewBtn = e.target.closest(".cert-preview-btn");
      const card = e.target.closest(".cert-card");

      // Click thumbnail/card opens modal via triggering preview button (UX nice)
      if (card && !previewBtn && !e.target.closest("a") && !e.target.closest("button")) {
        const idx = card.getAttribute("data-cert-index");
        const trigger = document.querySelector(`.cert-preview-btn[data-cert-index="${idx}"]`);
        if (trigger) trigger.click();
        return;
      }

      if (!previewBtn) return;

      const idx = Number(previewBtn.getAttribute("data-cert-index"));
      const c = CERTS.find(x => x._idx === idx);
      if (!c) return;

      if (modalTitle) modalTitle.textContent = safeText(c.title);
      if (modalMeta) modalMeta.textContent = `${safeText(c.issuer)} • ${safeText(c.date)} • ${safeText(c.category)}`;

      if (modalImg) {
        modalImg.src = resolveUrl(c.previewImg);
        modalImg.alt = `Preview ${safeText(c.title)}`;
      }

      if (modalTags) {
        modalTags.innerHTML = (c.tags || []).slice(0, 8).map(t => `<span class="cert-tag">${safeText(t)}</span>`).join("");
      }

      if (modalDesc) {
        const desc = safeText(c.description).trim();
        modalDesc.textContent = desc ? desc : "Klik Link Asli untuk verifikasi / informasi resmi.";
      }

      if (downloadBtn) {
        downloadBtn.href = resolveUrl(c.downloadFile);
        downloadBtn.setAttribute("download", "");
      }

      if (originalBtn) {
        const link = safeText(c.originalLink).trim();
        originalBtn.href = link || "#";
        originalBtn.classList.toggle("disabled", !link);
        originalBtn.setAttribute("aria-disabled", !link ? "true" : "false");
      }
    });

    // Init
    renderFilters();
    renderAll();

    // Handle refresh behavior: keep hash if present, start from top if no hash
    window.addEventListener("load", () => {
      // Jika URL TIDAK punya hash, pastikan mulai dari atas
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0 });
      }
      // Jika ADA hash (#certificates, #projects, dll)
      // browser akan otomatis scroll ke section → BIARKAN
    });

    // === BIRTHDAY-LIKE CELEBRATION EFFECT ===
    // Trigger confetti when scrolling to bottom (footer area)
    let celebrationTriggered = false;

    function showScrollNotification() {
      // Create notification element
      const notification = document.createElement('div');
      notification.id = 'scroll-notification';
      notification.textContent = '🎉 Sudah mencapai batas scroll! 🎉';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
        padding: 15px 30px;
        border-radius: 30px;
        font-weight: 700;
        font-size: 16px;
        box-shadow: 0 10px 40px rgba(79, 172, 254, 0.4);
        backdrop-filter: blur(15px);
        border: 2px solid rgba(255,255,255,0.3);
        z-index: 10000;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        pointer-events: none;
        text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        letter-spacing: 0.5px;
      `;

      document.body.appendChild(notification);

      // Animate in
      setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
      }, 100);

      // Remove after 3 seconds
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, 3000);
    }

    function createConfetti() {
      // Show notification
      showScrollNotification();

      const canvas = document.createElement('canvas');
      canvas.id = 'celebration-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '9999';
      document.body.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      const particleCount = 150;
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe', '#fd79a8', '#e17055'];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          vx: (Math.random() - 0.5) * 10,
          vy: Math.random() * 5 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10
        });
      }

      let animationId;
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle, index) => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vy += 0.1; // gravity
          particle.rotation += particle.rotationSpeed;

          // Reset particles that go off screen
          if (particle.y > canvas.height) {
            particle.y = -10;
            particle.x = Math.random() * canvas.width;
          }

          // Draw particle
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.rotation * Math.PI / 180);
          ctx.fillStyle = particle.color;
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
          ctx.restore();
        });

        animationId = requestAnimationFrame(animate);
      }

      animate();

      // Remove canvas after 5 seconds
      setTimeout(() => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
        celebrationTriggered = false; // Allow retrigger after cooldown
      }, 5000);
    }

    function checkScrollBottom() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Trigger when user is within 100px of bottom
      if (scrollTop + windowHeight >= documentHeight - 100 && !celebrationTriggered) {
        celebrationTriggered = true;
        createConfetti();
      }
    }

    // Throttle scroll events for performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          checkScrollBottom();
          scrollTimeout = null;
        }, 100);
      }
    });

    // Also check on page load in case user starts at bottom
    checkScrollBottom();
  });
})();
