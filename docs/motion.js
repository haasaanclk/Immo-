/* ============================================================================
   DOMAINE — motion.js  (cinematic motion layer, dependency-free)
   Scroll-reveal sequencing · image curtain reveal · kinetic titles · parallax ·
   custom cursor with media label · magnetic buttons · luxe page-transition ·
   top scroll-progress · animated counters.
   Works with dynamically-injected content via MutationObserver.
   ========================================================================== */
(function () {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine) and (hover: hover)").matches;
  const isHome = document.body.classList.contains("home");

  /* ---------- scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });

  const REVEAL = [
    ".eyebrow", ".page-title", ".page-sub", ".filters", ".archive-bar", ".cat-rail",
    ".card", ".pcard", ".lrow", ".module", ".module-head", ".spec", ".tier",
    ".cq-q", ".cq-opt", ".dna", ".gallery-main", ".thumbs", ".spec-list",
    ".finance", ".projection", ".atelier-chips", ".atelier-result", ".blind-col",
    ".offmarket-badge", ".cq-result-axes", ".notice", ".site-footer", ".form .field",
    ".dropzone", ".live-dna",
    ".stat", ".panel", ".atlas-card", ".mini-row", ".cmp-card", ".cmp-row", ".viewing-row",
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
      el.style.transitionDelay = Math.min(i, 9) * 70 + "ms";
      io.observe(el);
    };
    const imgApply = (w) => { if (w.classList.contains("reveal-img")) return; w.classList.add("reveal-img"); io.observe(w); };
    if (root.nodeType === 1 && root.matches) { if (root.matches(REVEAL)) apply(root); if (root.matches(IMG_WRAP)) imgApply(root); }
    root.querySelectorAll(REVEAL).forEach(apply);
    root.querySelectorAll(IMG_WRAP).forEach(imgApply);
  }

  /* ---------- split-line title reveal ---------- */
  function splitTitle(el) {
    if (!el || el.dataset.split) return; el.dataset.split = "1";
    const inner = el.innerHTML;
    el.innerHTML = `<span class="line-reveal"><span>${inner}</span></span>`;
    io.observe(el.querySelector(".line-reveal"));
  }

  /* ---------- kinetic word reveal ([data-kinetic]) ---------- */
  function splitKinetic(el) {
    if (!el || el.dataset.kin) return; el.dataset.kin = "1";
    el.classList.add("kin");
    // wrap each word (keeping <br> and <em>) in a masked span
    const html = el.innerHTML;
    const tokens = html.split(/(<br\s*\/?>)/i);
    let out = "", wi = 0;
    tokens.forEach((tok) => {
      if (/<br/i.test(tok)) { out += tok; return; }
      // split on spaces but keep tags intact-ish (simple: split words, tags ride with the word)
      tok.split(/\s+/).filter(Boolean).forEach((w) => {
        out += `<span class="kw" style="transition-delay:${Math.min(wi, 14) * 55}ms"><span style="transition-delay:${Math.min(wi, 14) * 55}ms">${w}</span></span> `;
        wi++;
      });
    });
    el.innerHTML = out;
    io.observe(el);
  }

  /* ---------- animated counters ---------- */
  function countUp(el) {
    const to = parseFloat(el.dataset.count); if (isNaN(to)) return;
    const dur = 1200, t0 = performance.now(), suffix = el.dataset.countSuffix || "";
    (function step(t) {
      const k = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * e) + suffix;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  const counterIO = new IntersectionObserver((ents) => {
    ents.forEach((en) => { if (en.isIntersecting) { countUp(en.target); counterIO.unobserve(en.target); } });
  }, { threshold: 0.4 });

  /* ---------- custom cursor with media label ---------- */
  function initCursor() {
    if (!fine || reduce) return;
    document.body.classList.add("has-mcursor");
    const dot = document.createElement("div"); dot.className = "mcursor";
    const ring = document.createElement("div"); ring.className = "mcursor-ring";
    const label = document.createElement("span"); label.className = "ml"; ring.appendChild(label);
    document.body.append(dot, ring);
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`; });
    (function loop() { rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
    const HOVER = "a,button,.card,.pcard,.chip,.thumb,input,select,textarea,.cq-opt,.label,.hbtn,.atlas-card,.stat,.cmdk-row";
    const MEDIA = ".card-media,.pcard-media,.gallery-main,.plate,.cap,.atlas-card,.strip";
    const labelFor = (el) => el.closest(".strip") ? "Drag" : el.closest(".cap") ? "Open" : "View";
    document.addEventListener("pointerover", (e) => {
      const m = e.target.closest(MEDIA);
      if (m) { label.textContent = labelFor(m); document.body.classList.add("cursor-media"); document.body.classList.remove("cursor-hover"); return; }
      if (e.target.closest(HOVER)) document.body.classList.add("cursor-hover");
    });
    document.addEventListener("pointerout", (e) => {
      if (e.target.closest(MEDIA)) document.body.classList.remove("cursor-media");
      if (e.target.closest(HOVER)) document.body.classList.remove("cursor-hover");
    });
  }

  /* ---------- magnetic buttons ---------- */
  function initMagnetic() {
    if (!fine || reduce) return;
    document.addEventListener("pointermove", (e) => {
      const b = e.target.closest(".btn"); if (!b) return;
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * 0.25}px,${(e.clientY - (r.top + r.height / 2)) * 0.35}px)`;
    });
    document.addEventListener("pointerout", (e) => { const b = e.target.closest(".btn"); if (b) b.style.transform = ""; });
  }

  /* ---------- parallax engine ([data-parallax]) ---------- */
  function initParallax() {
    if (reduce) return;
    const els = [...document.querySelectorAll("[data-parallax]")];
    if (!els.length) return;
    let ticking = false;
    function frame() {
      const vh = innerHeight;
      els.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.12;
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const delta = (r.top + r.height / 2) - vh / 2;
        el.style.transform = `translate3d(0,${(-delta * speed).toFixed(2)}px,0)`;
      });
      ticking = false;
    }
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
    addEventListener("resize", frame); frame();
  }

  /* ---------- top scroll-progress (sub-pages only) ---------- */
  function initScrollProgress() {
    if (reduce || isHome) return;
    const bar = document.createElement("div"); bar.className = "scroll-progress"; document.body.appendChild(bar);
    const doc = document.documentElement;
    addEventListener("scroll", () => {
      const h = (doc.scrollHeight - innerHeight) || 1;
      bar.style.width = ((scrollY || 0) / h * 100) + "%";
    }, { passive: true });
  }

  /* ---------- luxe page-transition curtain ---------- */
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
      setTimeout(() => { location.href = href; }, 560);
    });
    addEventListener("pageshow", (ev) => { if (ev.persisted) curtain.classList.remove("cover"); });
  }

  /* ---------- observe dynamically added content ---------- */
  const mo = new MutationObserver((muts) => {
    muts.forEach((m) => m.addedNodes.forEach((n) => {
      if (n.nodeType !== 1) return;
      tagReveal(n);
      n.querySelectorAll && n.querySelectorAll("[data-count]").forEach((c) => counterIO.observe(c));
      if (n.matches && n.matches(".page-title")) splitTitle(n);
      n.querySelectorAll && n.querySelectorAll(".page-title").forEach(splitTitle);
      n.querySelectorAll && n.querySelectorAll("[data-kinetic]").forEach(splitKinetic);
    }));
  });

  function boot() {
    initCursor(); initMagnetic(); initCurtain(); initScrollProgress();
    document.querySelectorAll("[data-kinetic]").forEach(splitKinetic);
    document.querySelectorAll(".page-title").forEach(splitTitle);
    tagReveal(document);
    initParallax();
    document.querySelectorAll("[data-count]").forEach((c) => counterIO.observe(c));
    mo.observe(document.body, { childList: true, subtree: true });
  }
  if (document.body) boot(); else addEventListener("DOMContentLoaded", boot);
})();
