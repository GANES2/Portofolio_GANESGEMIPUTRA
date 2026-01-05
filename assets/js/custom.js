
/**
 * Custom additions for iPortfolio:
 * - Certificates grid (popup modal + download + original link)
 * - Easy data editing: update CERTIFICATES array below
 */

(function () {
  "use strict";

  // Wait until HTML (including modals) is ready
  window.addEventListener("DOMContentLoaded", function () {

  console.log('Custom script loaded');

  function resolveUrl(path) {
    try {
      return new URL(path, document.baseURI).href;
    } catch (e) {
      return path;
    }
  }


  // ---- 1) Edit your certificates here ----
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

  console.log('CERTIFICATES array:', CERTIFICATES);

  // ---- 2) Render cards ----
  const grid = document.getElementById("certGrid");

  const cardHTML = (c, idx) => `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm border-0">
        <div class="ratio ratio-16x9 bg-light">
          <img src="${new URL(c.previewImg, window.location.href).href}" class="card-img-top" alt="Preview ${c.title}" style="object-fit: cover;">
        </div>
        <div class="card-body">
          <h5 class="card-title mb-1">${c.title}</h5>
          <div class="small text-muted">${c.issuer} • ${c.date}</div>

          <div class="d-flex gap-2 flex-wrap mt-3">
            <button
              class="btn btn-sm btn-primary"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#certModal"
              data-cert-index="${idx}">
              <i class="bi bi-eye me-1"></i>Preview
            </button>

            <a class="btn btn-sm btn-outline-primary" href="${new URL(c.downloadFile, window.location.href).href}" download>
              <i class="bi bi-download me-1"></i>Download
            </a>

            <a class="btn btn-sm btn-outline-secondary" href="${c.originalLink}" target="_blank" rel="noopener">
              <i class="bi bi-box-arrow-up-right me-1"></i>Link Asli
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  if (grid) {
    grid.innerHTML = CERTIFICATES.map(cardHTML).join("");
  }

  // ---- 3) Modal populate ----
  const modalEl = document.getElementById("certModal");
  const titleEl = document.getElementById("certModalTitle");
  const metaEl = document.getElementById("certModalMeta");
  const imgEl = document.getElementById("certModalImg");
  const downloadBtn = document.getElementById("certDownloadBtn");
  const originalBtn = document.getElementById("certOriginalBtn");

  if (modalEl) {
    modalEl.addEventListener("show.bs.modal", function (event) {
      const trigger = event.relatedTarget;
      const idx = Number(trigger?.getAttribute("data-cert-index"));
      const c = CERTIFICATES[idx];
      if (!c) return;

      // ambil elemen di dalam modal (lebih aman dari id mismatch)
      const titleEl = modalEl.querySelector("#certModalTitle");
      const metaEl = modalEl.querySelector("#certModalMeta");
      const imgEl = modalEl.querySelector("#certModalImg");
      const downloadBtn = modalEl.querySelector("#certDownloadBtn");
      const originalBtn = modalEl.querySelector("#certOriginalBtn");

      if (titleEl) titleEl.textContent = c.title;
      if (metaEl) metaEl.textContent = `${c.issuer} • ${c.date}`;

      if (imgEl) {
        imgEl.src = resolveUrl(c.previewImg);
        imgEl.alt = `Preview ${c.title}`;
        imgEl.setAttribute('data-glightbox', 'cert-gallery');
        imgEl.setAttribute('data-gallery', 'certificates');
        imgEl.style.cursor = 'pointer';
        imgEl.onerror = () => console.error("Preview image 404:", imgEl.src);
      }

      if (downloadBtn) downloadBtn.href = resolveUrl(c.downloadFile);
      if (originalBtn) originalBtn.href = c.originalLink;

      if (originalBtn) {
        if (!c.originalLink || c.originalLink.trim() === "#") {
          originalBtn.classList.add("d-none");
        } else {
          originalBtn.classList.remove("d-none");
        }
      }
    });
  }
  // ---- 4) Projects (with images + modal) ----
  // Tip: put project thumbnails in /assets/img/projects/
  const PROJECTS = [
    {
      title: "Personal Finance Manager",
      meta: "Python • REST API",
      desc: "Aplikasi CLI/API untuk manajemen keuangan pribadi: budgeting, savings plan, dan ringkasan laporan.",
      img: "assets/img/projects/pfm.png",
      badges: ["Python", "REST API"],
      demo: "#",
      github: "#"
    },
    {
      title: "Kelas Pak Galuh Website",
      meta: "Next.js • React • Tailwind",
      desc: "Website showcase & event untuk komunitas/teman: landing page, galeri, dan section interaktif.",
      img: "assets/img/projects/kelaspakgaluh.png",
      badges: ["Next.js", "React", "Tailwind"],
      demo: "#",
      github: "#"
    },
    {
      title: "E-Commerce Microservices",
      meta: "Spring Boot • MySQL • Gateway",
      desc: "Arsitektur microservice: user-service, product-service, discovery, dan API gateway.",
      img: "assets/img/projects/microservices.png",
      badges: ["Spring Boot", "MySQL", "API Gateway"],
      demo: "#",
      github: "#"
    },
    {
      title: "Node.js CRUD Mahasiswa",
      meta: "Node.js • Express • MySQL",
      desc: "Aplikasi web CRUD data mahasiswa dengan RESTful API, UI sederhana, dan validasi form.",
      img: "assets/img/projects/nodecrud.png",
      badges: ["Node.js", "Express", "MySQL"],
      demo: "#",
      github: "#"
    },
    {
      title: "Laravel Web POS (UMKM)",
      meta: "Laravel • Bootstrap • MySQL",
      desc: "Aplikasi kasir sederhana: produk, transaksi, laporan, dan manajemen pengguna (role).",
      img: "assets/img/projects/laravelpos.png",
      badges: ["Laravel", "Bootstrap", "MySQL"],
      demo: "#",
      github: "#"
    },
    {
      title: "Portfolio iPortfolio (Customize)",
      meta: "Bootstrap • JS • Responsive",
      desc: "Custom template iPortfolio: Sertifikat popup+download, MySkill icon, MyProject card preview.",
      img: "assets/img/projects/iportfolio.png",
      badges: ["Bootstrap", "JavaScript"],
      demo: "#",
      github: "#"
    },
    {
      title: "HTML • CSS • JavaScript Certificate",
      meta: "MySkill • 2025",
      desc: "Sertifikat kompetensi dalam HTML, CSS, dan JavaScript dari MySkill.",
      img: "assets/img/certificates/myskill-html-css-js.png",
      badges: ["HTML", "CSS", "JavaScript"],
      demo: "#",
      github: "#"
    },
    {
      title: "Laravel Backend Certificate",
      meta: "MySkill • 2025",
      desc: "Sertifikat kompetensi dalam Laravel Backend dari MySkill.",
      img: "assets/img/certificates/laravel-backend.png",
      badges: ["Laravel", "Backend"],
      demo: "#",
      github: "#"
    },
    {
      title: "Golang + MySQL Certificate",
      meta: "MySkill • 2025",
      desc: "Sertifikat kompetensi dalam Golang dan MySQL dari MySkill.",
      img: "assets/img/certificates/golang-mysql.png",
      badges: ["Golang", "MySQL"],
      demo: "#",
      github: "#"
    },
    {
      title: "Foundations of Cybersecurity Certificate",
      meta: "Google • 2025",
      desc: "Sertifikat Foundations of Cybersecurity dari Google via Coursera.",
      img: "assets/img/certificates/foundations-of-cybersecurity-google.png",
      badges: ["Cybersecurity", "Google"],
      demo: "#",
      github: "#"
    }
  ];

  const projectGrid = document.getElementById("projectGrid");
  const projectModalEl = document.getElementById("projectModal");

  const projectCardHTML = (p, idx) => `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm border-0 project-card">
        <div class="ratio ratio-16x9 bg-light">
          <img src="${resolveUrl(p.img)}" class="card-img-top" alt="Preview ${p.title}" loading="lazy" style="object-fit: cover;">
        </div>
        <div class="card-body">
          <h5 class="card-title mb-1">${p.title}</h5>
          <div class="small text-muted">${p.meta}</div>

          <div class="d-flex flex-wrap gap-1 mt-3">
            ${(p.badges || []).slice(0, 4).map(b => `<span class="badge text-bg-light border">${b}</span>`).join("")}
          </div>

          <div class="d-flex gap-2 flex-wrap mt-3">
            <button
              type="button"
              class="btn btn-sm btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#projectModal"
              data-project-index="${idx}"
            >
              <i class="bi bi-eye me-1"></i>Preview
            </button>

            ${p.demo && p.demo !== "#" ? `
              <a class="btn btn-sm btn-outline-primary" href="${p.demo}" target="_blank" rel="noopener">
                <i class="bi bi-globe2 me-1"></i>Demo
              </a>` : ``}

            ${p.github && p.github !== "#" ? `
              <a class="btn btn-sm btn-outline-dark" href="${p.github}" target="_blank" rel="noopener">
                <i class="bi bi-github me-1"></i>GitHub
              </a>` : ``}
          </div>
        </div>
      </div>
    </div>
  `;

  if (projectGrid) {
    projectGrid.innerHTML = PROJECTS.map(projectCardHTML).join("");
  }

  if (projectModalEl) {
    const pTitleEl = document.getElementById("projectModalTitle");
    const pMetaEl = document.getElementById("projectModalMeta");
    const pImgEl = document.getElementById("projectModalImg");
    const pDescEl = document.getElementById("projectModalDesc");
    const pBadgesEl = document.getElementById("projectModalBadges");
    const pDemoBtn = document.getElementById("projectModalDemo");
    const pGitBtn = document.getElementById("projectModalGit");

    projectModalEl.addEventListener("show.bs.modal", function (event) {
      const trigger = event.relatedTarget;
      const idx = Number(trigger?.getAttribute("data-project-index"));
      const p = PROJECTS[idx];
      if (!p) return;

      pTitleEl.textContent = p.title;
      pMetaEl.textContent = p.meta || "";
      pImgEl.src = resolveUrl(p.img);
      pImgEl.alt = `Preview ${p.title}`;
      pImgEl.setAttribute('data-glightbox', 'project-gallery');
      pImgEl.setAttribute('data-gallery', 'projects');
      pImgEl.style.cursor = 'pointer';
      pDescEl.textContent = p.desc || "";

      // badges
      pBadgesEl.innerHTML = (p.badges || []).map(b => `<span class="badge text-bg-light border">${b}</span>`).join("");

      // demo button
      if (p.demo && p.demo !== "#") {
        pDemoBtn.href = p.demo;
        pDemoBtn.classList.remove("d-none");
      } else {
        pDemoBtn.classList.add("d-none");
        pDemoBtn.href = "#";
      }

      // github button
      if (p.github && p.github !== "#") {
        pGitBtn.href = p.github;
        pGitBtn.classList.remove("d-none");
      } else {
        pGitBtn.classList.add("d-none");
        pGitBtn.href = "#";
      }
    });
  }

  });

})(); 
