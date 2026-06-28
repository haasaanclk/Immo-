/* ============================================================================
   DOMAINE — home.js
   Flagship motion layer (dependency-free): cinematic loader, hero parallax +
   content fade, drifting/draggable Archive marquee, scroll-reveal, scroll
   progress, header state. Pairs with home.css + the shared chrome (store.js).
   ========================================================================== */
(function () {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const D = window.DOMAINE;

  /* ---------- loader (count 0→100) ---------- */
  function runLoader() {
    const el = document.getElementById("loader");
    const num = document.getElementById("loaderNum");
    const bar = document.getElementById("loaderBar");
    if (!el) { document.body.classList.add("ready"); return; }
    if (reduce) { el.classList.add("done"); document.body.classList.add("ready"); return; }
    let v = 0;
    const dur = 1500, t0 = performance.now();
    (function step(t) {
      const k = Math.min((t - t0) / dur, 1);
      v = Math.round((1 - Math.pow(1 - k, 2)) * 100);
      if (num) num.textContent = v;
      if (bar) bar.style.width = v + "%";
      if (k < 1) requestAnimationFrame(step);
      else setTimeout(() => { el.classList.add("done"); document.body.classList.add("ready"); }, 220);
    })(t0);
  }

  /* ---------- scroll: header state + progress + hero parallax ---------- */
  function initScroll() {
    const progress = document.querySelector(".progress span");
    const hero = document.getElementById("hero");
    const media = hero ? hero.querySelector(".hero-media") : null;
    const inner = hero ? hero.querySelector(".hero-inner") : null;
    const doc = document.documentElement;
    function onScroll() {
      const y = window.scrollY || window.pageYOffset;
      const h = (doc.scrollHeight - innerHeight) || 1;
      if (progress) progress.style.height = (y / h * 100) + "%";
      document.body.classList.toggle("scrolled", y > innerHeight * 0.62);
      if (!reduce && hero && y < innerHeight * 1.1) {
        if (media) media.style.transform = "translateY(" + (y * 0.22) + "px)";
        if (inner) { inner.style.transform = "translateY(" + (y * -0.08) + "px)"; inner.style.opacity = String(Math.max(1 - y / (innerHeight * 0.72), 0)); }
      }
    }
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- hero pointer parallax ---------- */
  function initHeroPointer() {
    if (reduce || !matchMedia("(pointer:fine)").matches) return;
    const media = document.querySelector(".hero-media img");
    if (!media) return;
    addEventListener("pointermove", (e) => {
      if ((window.scrollY || 0) > innerHeight) return;
      const px = (e.clientX / innerWidth - 0.5), py = (e.clientY / innerHeight - 0.5);
      media.style.transformOrigin = (60 + px * 10) + "% " + (40 + py * 10) + "%";
    });
  }

  /* ---------- reveal ---------- */
  function initReveal() {
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
    document.querySelectorAll(".r,.rl").forEach((el, i) => {
      const sibs = el.parentElement ? [...el.parentElement.children].filter((c) => c.classList.contains("r") || c.classList.contains("rl")) : [el];
      el.style.transitionDelay = Math.min(sibs.indexOf(el), 6) * 80 + "ms";
      io.observe(el);
    });
  }

  /* ---------- Archive marquee (auto-drift + drag) ---------- */
  function buildMarquee() {
    const track = document.getElementById("stripTrack");
    const strip = document.getElementById("strip");
    if (!track || !D) return;
    const estates = D.getEstates();
    const plate = (e) => `<a class="plate" href="estate.html?id=${e.id}">
        <img src="${e.image}" alt="${e.title}" onerror="this.src='public/image-1.png'"/>
        <div class="plate-cap"><div class="pc-cat">${e.category} · ${e.city}</div>
          <div class="pc-t">${e.title}</div><div class="pc-x">${D.money(e.price)}</div></div></a>`;
    const html = estates.map(plate).join("");
    track.innerHTML = html + html;                                  // duplicate for seamless loop
    const half = () => track.scrollWidth / 2;

    let x = 0, paused = false, dragging = false, startX = 0, startPos = 0, vel = 0, lastX = 0;
    strip.addEventListener("pointerenter", () => paused = true);
    strip.addEventListener("pointerleave", () => { if (!dragging) paused = false; });
    strip.addEventListener("pointerdown", (e) => { dragging = true; paused = true; strip.classList.add("drag");
      startX = e.clientX; startPos = x; lastX = e.clientX; vel = 0; try { strip.setPointerCapture(e.pointerId); } catch (_) {} });
    strip.addEventListener("pointermove", (e) => { if (!dragging) return; x = startPos + (e.clientX - startX); vel = e.clientX - lastX; lastX = e.clientX; });
    const end = () => { dragging = false; paused = false; strip.classList.remove("drag"); };
    strip.addEventListener("pointerup", end); strip.addEventListener("pointercancel", end);

    function loop() {
      if (!reduce) {
        if (!paused) x -= 0.55;
        else if (!dragging && vel) { x += vel; vel *= 0.9; if (Math.abs(vel) < 0.1) vel = 0; }
        const H = half();
        if (x <= -H) x += H; if (x > 0) x -= H;
        track.style.transform = "translateX(" + x + "px)";
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  /* ---------- animated counters (for the noir numbers band) ---------- */
  function initCounters() {
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (!en.isIntersecting) return; io.unobserve(en.target);
        const el = en.target, to = parseFloat(el.dataset.num), dec = +(el.dataset.dec || 0);
        if (isNaN(to)) return;
        const t0 = performance.now(), dur = 1400, pre = el.dataset.pre || "";
        (function step(t) {
          const k = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - k, 3), val = to * e;
          el.textContent = pre + val.toFixed(dec);
          if (k < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll("[data-num]").forEach((el) => io.observe(el));
  }

  function boot() {
    runLoader();
    buildMarquee();
    initReveal();
    initScroll();
    initHeroPointer();
    initCounters();
    // live hero stat from the real portfolio
    const stat = document.getElementById("heroStat");
    if (stat && D) stat.textContent = D.getEstates().length + " selected estates · 8 markets";
  }
  if (document.body) boot(); else addEventListener("DOMContentLoaded", boot);
})();
