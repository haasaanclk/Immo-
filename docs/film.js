/* ============================================================================
   DOMAINE — film.js
   Cinematic film engine: boot/letterbox, estates filmstrip, kinetic titles,
   active-scene tracking (timecode + caption + side index), scroll-snap nav,
   keyboard control, number counters, ⌘K palette, exit fade.
   ========================================================================== */
(function () {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const D = window.DOMAINE;
  const reel = document.getElementById("reel");
  const scenes = [...document.querySelectorAll(".scene")];
  const riItems = [...document.querySelectorAll(".ri-item")];
  const labels = riItems.map((r) => r.querySelector(".ri-t").textContent);
  const tbMid = document.getElementById("tbMid");
  const bbCap = document.getElementById("bbCap");

  /* ---------- kinetic word split (keeps <em> phrases intact) ---------- */
  function kw(content, i, isHTML) {
    const outer = document.createElement("span"); outer.className = "kw";
    const inner = document.createElement("span");
    inner.style.transitionDelay = Math.min(i, 14) * 60 + "ms";
    if (isHTML) inner.innerHTML = content; else inner.textContent = content;
    outer.appendChild(inner); return outer;
  }
  function splitKinetic(el) {
    const nodes = [...el.childNodes]; el.innerHTML = ""; let wi = 0;
    nodes.forEach((n) => {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach((tok) => {
          if (/^\s+$/.test(tok)) { el.appendChild(document.createTextNode(" ")); return; }
          if (!tok) return; el.appendChild(kw(tok, wi++, false));
        });
      } else if (n.nodeType === 1) { el.appendChild(kw(n.outerHTML, wi++, true)); }
    });
  }
  document.querySelectorAll("[data-kinetic]").forEach(splitKinetic);

  /* ---------- estates filmstrip ---------- */
  (function buildStrip() {
    const track = document.getElementById("fsTrack"); if (!track || !D) return;
    const frame = (e) => `<a class="fs-frame" href="estate.html?id=${e.id}">
        <img src="${e.image}" alt="${e.title}" onerror="this.src='public/image-1.png'"/>
        <div class="fs-cap"><div class="c1">${e.category} · ${e.city}</div><div class="c2">${e.title}</div></div></a>`;
    track.innerHTML = D.getEstates().map(frame).join("");
  })();

  /* ---------- number counters ---------- */
  function runCounters(scene) {
    if (scene.dataset.counted) return; scene.dataset.counted = "1";
    scene.querySelectorAll("[data-num]").forEach((el) => {
      const to = parseFloat(el.dataset.num), dec = +(el.dataset.dec || 0), pre = el.dataset.pre || "";
      if (isNaN(to)) return;
      if (reduce) { el.textContent = pre + to.toFixed(dec); return; }
      const t0 = performance.now(), dur = 1300;
      (function step(t) {
        const k = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - k, 3);
        el.textContent = pre + (to * e).toFixed(dec);
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    });
  }

  /* ---------- active scene tracking ---------- */
  let active = -1;
  function setActive(i) {
    if (i === active) return; active = i;
    const sc = scenes[i];
    sc.classList.add("live"); runCounters(sc);
    riItems.forEach((r, k) => r.classList.toggle("on", k === i));
    const n = String(i + 1).padStart(2, "0");
    if (tbMid) tbMid.textContent = `REEL — ${n} / 06 · ${labels[i].toUpperCase()}`;
    if (bbCap) bbCap.innerHTML = sc.dataset.cap || "";
  }
  const io = new IntersectionObserver((ents) => {
    let best = null, bestRatio = 0;
    ents.forEach((en) => { if (en.intersectionRatio > bestRatio) { bestRatio = en.intersectionRatio; best = en.target; } });
    if (best && bestRatio > 0.5) setActive(scenes.indexOf(best));
  }, { root: reel, threshold: [0.5, 0.75, 0.95] });
  scenes.forEach((s) => io.observe(s));

  /* ---------- navigation ---------- */
  function goTo(i) { i = Math.max(0, Math.min(scenes.length - 1, i)); scenes[i].scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); }
  riItems.forEach((r) => r.addEventListener("click", () => goTo(+r.dataset.i)));
  document.addEventListener("keydown", (e) => {
    if (document.body.classList.contains("cmdk-open")) return;
    if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); goTo(active + 1); }
    else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); goTo(active - 1); }
    else if (e.key === "Home") { e.preventDefault(); goTo(0); }
    else if (e.key === "End") { e.preventDefault(); goTo(scenes.length - 1); }
  });

  /* ---------- exit fade on internal navigation ---------- */
  const exit = document.getElementById("filmExit");
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a"); if (!a || reduce) return;
    const href = a.getAttribute("href") || "";
    if (a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (!/\.html(\?|$)/.test(href)) return;
    if (a.closest(".reel-index")) return;        // internal scene jumps don't navigate
    e.preventDefault(); exit.classList.add("on");
    setTimeout(() => { location.href = href; }, 480);
  });

  /* ---------- boot ---------- */
  function boot() {
    if (D && D.initOverlays) D.initOverlays();   // ⌘K palette + theme
    const fb = document.getElementById("filmBoot");
    const start = () => { document.body.classList.add("framed"); setActive(0); };
    if (reduce) { if (fb) fb.classList.add("done"); start(); return; }
    setTimeout(() => { if (fb) fb.classList.add("done"); start(); }, 1250);
  }
  if (document.readyState !== "loading") boot(); else addEventListener("DOMContentLoaded", boot);
})();
