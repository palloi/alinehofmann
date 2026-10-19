/* Site improvements — GA4 WhatsApp events, Instagram lazy-load, a11y helpers. */
(function () {
  "use strict";

  var WA_SELECTOR = 'a[href*="whatsapp.com"], a[href*="wa.me"]';

  document.addEventListener("click", function (event) {
    var link = event.target.closest(WA_SELECTOR);
    if (!link) return;
    if (typeof window.gtag === "function") {
      var locationLabel = link.getAttribute("data-wa-location") || "unknown";
      window.gtag("event", "whatsapp_click", {
        event_category: "engagement",
        event_label: locationLabel
      });
      window.gtag("event", "generate_lead", {
        method: "whatsapp",
        event_label: locationLabel
      });
    }
  });

  function labelCarouselButtons() {
    document.querySelectorAll(".owl-prev").forEach(function (btn) {
      btn.removeAttribute("role");
      if (!btn.getAttribute("aria-label")) {
        btn.setAttribute("aria-label", "Ver resultado anterior");
      }
    });
    document.querySelectorAll(".owl-next").forEach(function (btn) {
      btn.removeAttribute("role");
      if (!btn.getAttribute("aria-label")) {
        btn.setAttribute("aria-label", "Ver próximo resultado");
      }
    });
  }

  function loadInstagram(container) {
    if (!container || container.getAttribute("data-loaded") === "1") return;
    container.setAttribute("data-loaded", "1");
    var permalink = container.getAttribute("data-permalink");
    container.innerHTML = "";
    var blockquote = document.createElement("blockquote");
    blockquote.className = "instagram-media";
    blockquote.setAttribute("data-instgrm-permalink", permalink);
    blockquote.setAttribute("data-instgrm-version", "14");
    blockquote.setAttribute("title", "Publicação do Instagram da Dra. Aline Hofmann");
    blockquote.style.cssText =
      "background:#FFF;border:0;border-radius:3px;margin:1px;max-width:540px;min-width:326px;padding:0;width:calc(100% - 2px);";
    container.appendChild(blockquote);

    function titleIframes() {
      container.querySelectorAll("iframe").forEach(function (frame) {
        if (!frame.getAttribute("title")) {
          frame.setAttribute("title", "Publicação do Instagram da Dra. Aline Hofmann");
        }
      });
    }

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    script.onload = function () {
      if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
      }
      titleIframes();
      setTimeout(titleIframes, 1200);
    };
    document.body.appendChild(script);
  }

  function initInstagramLazy() {
    var embed = document.querySelector(".ig-embed");
    if (!embed) return;
    var button = embed.querySelector(".ig-embed-load");
    if (button) {
      button.addEventListener("click", function () {
        loadInstagram(embed);
      });
    }
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              loadInstagram(embed);
              observer.disconnect();
            }
          });
        },
        { rootMargin: "200px 0px" }
      );
      observer.observe(embed);
    }
  }

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    initInstagramLazy();
    labelCarouselButtons();
    setTimeout(labelCarouselButtons, 800);
  });
})();
