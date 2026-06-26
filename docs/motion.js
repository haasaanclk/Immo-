/* ============================================================================
   DOMAINE — motion.js  (cinematic motion layer, dependency-free)
   Scroll-reveal sequencing · image settle · custom cursor · magnetic buttons ·
   page-transition curtain · animated counters · split-line titles.
   Works with dynamically-injected content via MutationObserver.
   ========================================================================== */
(function () {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine) and (hover: hover)").matches;

  /* ---------- scroll reveal (IntersectionObserver) ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });

  const REVEAL = [
    ".eyebrow", ".page-title", ".page-sub", ".filters", ".archive-bar", ".cat-rail",
    ".card", ".pcard", ".lrow", ".module", ".module-head", ".spec", ".tier",
    ".cq-q", ".cq-opt", ".dna", ".gallery-main", ".thumbs", ".spec-list",
    ".finance", ".projection", ".atelier-chips", ".atelier-result", ".blind-col",
    ".offmarket-badge", ".cq-result-axes", ".notice", ".site-footer", ".form .field",
    ".dropzone", ".live-dna",
  ].join(",");

  const IMG_WRAP = ".card-media,.pcard-media,.gallery-main,.mp-img,.preview-img,.atl-palette";

  function tagReveal(scope) {
    const root = scope && scope.querySelectorAll ? scope : document;
    const seen = new Map();
    const apply = (el) => {
      if (el.hasAttribute("data-reveal") || el.closest(".page-curtain")) return;
      el.setAttribute("data-reveal", "");
      const p = el.parentElement || document.body;
      const i = seen.get(p) || 0; seen.set(p, i + 1);
      el.style.transitionDelay = Math.min(i, 9) * 65 + "ms";
      io.observe(el);
    };
    const imgApply = (w) => { if (w.classList.contains("reveal-img")) return; w.classList.add("reveal-img"); io.observe(w); };
    // the injected node itself may match (top-level cards/questions/sections)
    if (root.nodeType === 1 && root.matches) { if (root.matches(REVEAL)) apply(root); if (root.matches(IMG_WRAP)) imgApply(root); }
    root.querySelectorAll(REVEAL).forEach(apply);
    root.querySelectorAll(IMG_WRAP).forEach(imgApply);
  }

  /* ---------- split-line title reveal ---------- */
  function splitTitle(el) {
    if (!el || el.dataset.split) return; el.dataset.split = "1";
    // keep inner HTML (em etc.) — wrap whole content in a line-reveal span
    const inner = el.innerHTML;
    el.innerHTML = `<span class="line-reveal"><span>${inner}</span></span>`;
    const lr = el.querySelector(".line-reveal");
    io.observe(lr);
  }

  /* ---------- animated counters ---------- */
  function countUp(el) {
    const to = parseFloat(el.dataset.count); if (isNaN(to)) return;
    const dur = 1100, t0 = performance.now(), suffix = el.dataset.countSuffix || "";
    function step(t) {
      const k = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * e) + suffix;
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const counterIO = new IntersectionObserver((ents) => {
    ents.forEach((en) => { if (en.isIntersecting) { countUp(en.target); counterIO.unobserve(en.target); } });
  }, { threshold: 0.4 });

  /* ---------- custom cursor ---------- */
  function initCursor() {
    if (!fine || reduce) return;
    document.body.classList.add("has-mcursor");
    const dot = document.createElement("div"); dot.className = "mcursor";
    const ring = document.createElement("div"); ring.className = "mcursor-ring";
    document.body.append(dot, ring);
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener("pointermove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    const HOVER = "a,button,.card,.pcard,.chip,.thumb,input,select,textarea,.cq-opt,.label";
    document.addEventListener("pointerover", (e) => { if (e.target.closest(HOVER)) document.body.classList.add("cursor-hover"); });
    document.addEventListener("pointerout", (e) => { if (e.target.closest(HOVER)) document.body.classList.remove("cursor-hover"); });
    addEventListener("pointerdown", () => ring.style.opacity = ".5");
    addEventListener("pointerup", () => ring.style.opacity = "1");
  }

  /* ---------- magnetic buttons ---------- */
  function initMagnetic() {
    if (!fine || reduce) return;
    document.addEventListener("pointermove", (e) => {
      const b = e.target.closest(".btn"); if (!b) return;
      const r = b.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.35;
      b.style.transform = `translate(${dx}px,${dy}px)`;
    });
    document.addEventListener("pointerout", (e) => { const b = e.target.closest(".btn"); if (b) b.style.transform = ""; });
  }

  /* ---------- page-transition curtain ---------- */
  function initCurtain() {
    if (reduce) return;
    const curtain = document.createElement("div");
    curtain.className = "page-curtain";
    curtain.innerHTML = `<div class="pc-mark">DOMAINE<span>®</span></div>`;
    document.body.appendChild(curtain);
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a"); if (!a) return;
      const href = a.getAttribute("href") || "";
      if (a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto")) return;
      if (!/\.html(\?|$)/.test(href) && href !== "index.html") return;
      e.preventDefault();
      curtain.classList.add("cover");
      setTimeout(() => { location.href = href; }, 520);
    });
    // safety: if returning via back/forward cache, ensure curtain is reset
    addEventListener("pageshow", (ev) => { if (ev.persisted) curtain.classList.remove("cover"); });
  }

  /* ---------- observe dynamically added content ---------- */
  const mo = new MutationObserver((muts) => {
    muts.forEach((m) => m.addedNodes.forEach((n) => {
      if (n.nodeType !== 1) return;
      tagReveal(n);
      n.querySelectorAll && n.querySelectorAll("[data-count]").forEach((c) => counterIO.observe(c));
      // title split for dynamically rendered page titles
      if (n.matches && n.matches(".page-title")) splitTitle(n);
      n.querySelectorAll && n.querySelectorAll(".page-title").forEach(splitTitle);
    }));
  });

  function boot() {
    initCursor(); initMagnetic(); initCurtain();
    document.querySelectorAll(".page-title").forEach(splitTitle);
    tagReveal(document);
    document.querySelectorAll("[data-count]").forEach((c) => counterIO.observe(c));
    mo.observe(document.body, { childList: true, subtree: true });
  }
  if (document.body) boot();              // script sits at end of <body>: run before inline render paints
  else addEventListener("DOMContentLoaded", boot);
})();
