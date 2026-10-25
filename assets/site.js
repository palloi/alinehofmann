(function () {
  "use strict";

  var WA_SELECTOR = 'a[data-whatsapp], a[href*="api.whatsapp.com"], a[href*="wa.me"]';

  var PROCEDURE_CONTENT = {
    "/harmonizacao-orofacial/bioestimuladores-de-colageno/": "Bioestimuladores de colágeno",
    "/harmonizacao-orofacial/fios-de-pdo/": "Fios de PDO",
    "/harmonizacao-orofacial/microagulhamento-com-ativos/": "Microagulhamento com ativos",
    "/harmonizacao-orofacial/preenchimento-acido-hialuronico/": "Preenchimento com ácido hialurônico",
    "/harmonizacao-orofacial/skinbooster/": "Skinbooster",
    "/harmonizacao-orofacial/toxina-botulinica/": "Toxina botulínica"
  };

  function procedurePath() {
    return window.location.pathname.replace(/\/index\.html$/, "/").replace(/\/?$/, "/");
  }

  function trackViewContent() {
    var contentName = PROCEDURE_CONTENT[procedurePath()];
    if (!contentName || typeof fbq !== "function") return;
    fbq("track", "ViewContent", { content_name: contentName });
  }

  function trackWhatsApp(href) {
    if (typeof gtag === "function") {
      gtag("event", "generate_lead", {
        method: "whatsapp",
        event_category: "engagement",
        event_label: "whatsapp_click"
      });
      gtag("event", "whatsapp_click", {
        event_category: "engagement",
        link_url: href || ""
      });
    }
    if (typeof fbq === "function") {
      fbq("track", "Contact");
    }
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest(WA_SELECTOR);
    if (!link) return;
    trackWhatsApp(link.href);
  });

  trackViewContent();

  function enhanceCarouselNav() {
    document.querySelectorAll(".owl-nav button").forEach(function (btn) {
      btn.removeAttribute("role");
      if (btn.classList.contains("owl-prev")) {
        btn.setAttribute("aria-label", "Ver resultado anterior");
      } else if (btn.classList.contains("owl-next")) {
        btn.setAttribute("aria-label", "Ver próximo resultado");
      }
    });
  }

  window.addEventListener("load", function () {
    enhanceCarouselNav();
    setTimeout(enhanceCarouselNav, 800);
  });

  function titleInstagramFrames() {
    document.querySelectorAll('iframe[src*="instagram.com"]').forEach(function (frame) {
      if (!frame.getAttribute("title")) {
        frame.setAttribute("title", "Publicação do Instagram da Dra. Aline Hofmann");
      }
    });
  }

  function loadInstagram() {
    if (window.__igEmbedLoaded) return;
    window.__igEmbedLoaded = true;
    var script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.onload = function () {
      var tries = 0;
      var timer = setInterval(function () {
        titleInstagramFrames();
        if (++tries > 20) clearInterval(timer);
      }, 400);
    };
    document.body.appendChild(script);
  }

  var instagram = document.querySelector(".instagram-media, [data-instgrm-permalink]");
  if (instagram && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      if (entries.some(function (entry) { return entry.isIntersecting; })) {
        loadInstagram();
        observer.disconnect();
      }
    }, { rootMargin: "300px 0px" });
    observer.observe(instagram);
  } else if (instagram) {
    loadInstagram();
  }
})();
