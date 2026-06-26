gsap.registerPlugin(ScrollTrigger);

const DEG = Math.PI / 180;
const PERSPECTIVE = 1600;
const ITEM_COUNT = 136;
const TURNS = 1;
const TILT = 58;
const ROT_Y = 86;
const RING_SCALE = 0.88;
const PARALLAX = 4;
const HOVER_OUT = 16, HOVER_Z = 12, HOVER_SCALE = 1.02, HOVER_DURATION = 0.32;
const MOBILE_MQ = "(max-width: 768px)";
const MOBILE_SELECTED_OUT = 8, MOBILE_SELECTED_Z = 2, MOBILE_SELECTED_SCALE = 1.005;
const MOBILE_TRANSITION = 0.25, MOBILE_FOCUS_ANGLE = -35, MOBILE_DRAG_SPEED = 0.35;

const IMAGES = [
  "image-1","image-2","image-3","image-4","image-5","image-6",
  "image-7","image-8","image-9","image-10","image-11","image-12",
  "image-15","13","14",
].map((n) => `public/${n}.png`);

const PROJECTS = [
  { title:"Villa Helvetia", category:"Villa" },
  { title:"Bahnhofstrasse Penthouse", category:"Penthouse" },
  { title:"Chalet Saint-Moritz", category:"Chalet" },
  { title:"Belgravia Townhouse", category:"Townhouse" },
  { title:"Île Privée Lavaux", category:"Private Island" },
  { title:"Domaine de Lavaux", category:"Vineyard" },
  { title:"Lake Zürich Waterfront", category:"Waterfront" },
  { title:"Schwabing Manor", category:"Manor" },
  { title:"Marina Tower Residence", category:"Tower Residence" },
  { title:"Engadin Retreat", category:"Retreat" },
  { title:"Wachau Country House", category:"Country House" },
  { title:"Soho Loft", category:"Loft" },
  { title:"Tegernsee Estate", category:"Estate" },
  { title:"Palais Ringstrasse", category:"Restoration" },
  { title:"Mayfair Residence", category:"Residence" },
];

const CATEGORIES = [
  { name:"Villa", count:42 }, { name:"Penthouse", count:12 }, { name:"Chalet", count:15 },
  { name:"Townhouse", count:12 }, { name:"Private Island", count:6 }, { name:"Vineyard", count:9 },
  { name:"Waterfront", count:31 }, { name:"Manor", count:13 }, { name:"Tower Residence", count:18 },
  { name:"Retreat", count:17 }, { name:"Country House", count:26 }, { name:"Loft", count:34 },
  { name:"Estate", count:38 }, { name:"Restoration", count:19 }, { name:"Residence", count:24 },
];

const INC = 360 / ITEM_COUNT;
const AMBIENT_SPEED = 0.012; // slow cinematic idle drift (deg/frame)
let radius = 470, yOffset = 0, ringRot = 0, introOffset = 0, introPlaying = false, ambientRot = 0;
const items = [];
let activeCard = null;
const isMobile = window.matchMedia(MOBILE_MQ).matches;
let mobileSelectedCard = null, mobileCurrentRotation = 0, mobileTargetRotation = 0;

const scene = document.querySelector(".scene");
const gallery = document.getElementById("gallery");
const center = document.getElementById("center");
const previewImg = document.querySelector("#previewImg img");
const previewCat = document.getElementById("previewCat");
const previewTitle = document.getElementById("previewTitle");
const labelsWrap = document.getElementById("labels");
const mpImg = document.querySelector("#mpImg img");
const mpCat = document.getElementById("mpCat");
const mpTitle = document.getElementById("mpTitle");
const mobilePreview = document.getElementById("mobilePreview");
const ringHitbox = document.getElementById("ringHitbox");

function computeGeometry() {
  const vw = window.innerWidth, vh = window.innerHeight;
  if (isMobile) { radius = vw * 0.74; }
  else { radius = RING_SCALE * Math.max(300, Math.min(vw * 0.32, vh * 0.55)); }
  const localY = radius * Math.cos(TILT * DEG);
  const depthZ = radius * Math.sin(TILT * DEG);
  yOffset = localY * (PERSPECTIVE / (PERSPECTIVE - depthZ));
  if (isMobile) {
    const pr = mobilePreview.getBoundingClientRect();
    const archiveTop = (pr.bottom > 0 ? pr.bottom : vh * 0.46) + 26;
    const ringCenterX = vw * 0.98;
    gsap.set(gallery, { x: ringCenterX - vw / 2, y: archiveTop - vh / 2 });
    if (ringHitbox) ringHitbox.style.top = Math.round(archiveTop - 12) + "px";
  } else {
    gsap.set(gallery, { x: 0, y: -yOffset });
  }
}

function angleOf(card) { return card.index * INC - 90 + ringRot + introOffset + ambientRot; }
function depthOpacity(rotZdeg) { const back = Math.cos(rotZdeg * DEG); return 1 - (back + 1) * 0.25; }

function placeResting(card) {
  const rotZ = angleOf(card); card.depth = depthOpacity(rotZ);
  gsap.set(card.el, { rotationZ: rotZ }); gsap.set(card.cardEl, { opacity: card.depth });
}
function updateRing() {
  for (const card of items) {
    const rotZ = angleOf(card); card.depth = depthOpacity(rotZ);
    gsap.set(card.el, { rotationZ: rotZ }); gsap.set(card.cardEl, { opacity: card.depth });
  }
}

function buildGallery() {
  const pool = [];
  while (pool.length < ITEM_COUNT) pool.push(...IMAGES);
  for (let k = pool.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [pool[k], pool[j]] = [pool[j], pool[k]]; }
  const frag = document.createDocumentFragment();
  for (let i = 0; i < ITEM_COUNT; i++) {
    const el = document.createElement("div"); el.className = "item";
    const cardEl = document.createElement("div"); cardEl.className = "item-card";
    const img = document.createElement("img"); img.src = pool[i]; img.alt = "";
    cardEl.appendChild(img); el.appendChild(cardEl); frag.appendChild(el);
    const card = { el, cardEl, index: i, project: PROJECTS[i % PROJECTS.length], img: img.src, hovered: false, depth: 1 };
    el._card = card; items.push(card);
  }
  gallery.appendChild(frag);
}

function setupItems() {
  for (const card of items) {
    gsap.set(card.el, { xPercent: -50, yPercent: -50, transformOrigin: `50% ${radius}px`, rotationZ: angleOf(card) });
    gsap.set(card.cardEl, { rotationY: ROT_Y, x: 0, y: 0, z: 0, scale: 1, opacity: card.depth });
  }
}

function onPointerMove(e) {
  if (isMobile) return;
  const target = document.elementFromPoint(e.clientX, e.clientY);
  const hit = target && target.closest(".item");
  setActive(hit ? hit._card : null);
}
function setActive(card) {
  if (card === activeCard) return;
  const prev = activeCard; activeCard = card;
  if (prev) restoreCard(prev);
  if (card) { pullOut(card); setPreview(card); } else { center.classList.remove("show-project"); }
}

function pullOut(card, opts) {
  const out = opts ? opts.out : HOVER_OUT, fwd = opts ? opts.z : HOVER_Z;
  const scl = opts ? opts.scale : HOVER_SCALE, dur = opts ? opts.duration : HOVER_DURATION;
  card.cardEl.classList.add("is-active");
  const Cx = window.innerWidth / 2, Cy = window.innerHeight / 2;
  const rect = card.el.getBoundingClientRect();
  const px = rect.left + rect.width / 2, py = rect.top + rect.height / 2;
  const len = Math.hypot(px - Cx, py - Cy) || 1;
  const dxs = ((px - Cx) / len) * out, dys = ((py - Cy) / len) * out;
  const T = TILT * DEG;
  const gx = dxs, gy = dys * Math.cos(T) + fwd * Math.sin(T), gz = -dys * Math.sin(T) + fwd * Math.cos(T);
  const phi = angleOf(card) * DEG, cosP = Math.cos(phi), sinP = Math.sin(phi);
  gsap.to(card.cardEl, { x: gx * cosP + gy * sinP, y: -gx * sinP + gy * cosP, z: gz,
    scale: scl, duration: dur, ease: "power3.out", overwrite: true });
}
function restoreCard(card, duration) {
  card.cardEl.classList.remove("is-active");
  gsap.to(card.cardEl, { x: 0, y: 0, z: 0, scale: 1, duration: duration || HOVER_DURATION, ease: "power2.out", overwrite: true });
}
function setPreview(card) {
  previewImg.src = card.img; previewCat.textContent = card.project.category; previewTitle.textContent = card.project.title;
  center.classList.add("show-project");
  gsap.fromTo(previewImg, { opacity: 0.35 }, { opacity: 1, duration: 0.5 });
}

const MOBILE_OPTS = { out: MOBILE_SELECTED_OUT, z: MOBILE_SELECTED_Z, scale: MOBILE_SELECTED_SCALE, duration: MOBILE_TRANSITION };
function nearestMobileCard() {
  let idx = Math.round((MOBILE_FOCUS_ANGLE + 90 - ringRot) / INC);
  idx = ((idx % ITEM_COUNT) + ITEM_COUNT) % ITEM_COUNT; return items[idx];
}
function updateMobileSelection() {
  if (introPlaying) return;
  const card = nearestMobileCard();
  if (card === mobileSelectedCard) return;
  if (mobileSelectedCard) restoreCard(mobileSelectedCard, MOBILE_TRANSITION);
  mobileSelectedCard = card; pullOut(card, MOBILE_OPTS); updateMobilePreview(card);
}
function updateMobilePreview(card) {
  mpCat.textContent = card.project.category; mpTitle.textContent = card.project.title; mpImg.src = card.img;
  gsap.fromTo(mpImg, { opacity: 0.3 }, { opacity: 1, duration: MOBILE_TRANSITION, overwrite: true });
}

let mobileDragging = false, mobileVelocity = 0;
function mobileTick() {
  if (!mobileDragging) { mobileTargetRotation += mobileVelocity; mobileVelocity *= 0.92; if (Math.abs(mobileVelocity) < 0.01) mobileVelocity = 0; }
  mobileCurrentRotation += (mobileTargetRotation - mobileCurrentRotation) * 0.16;
  ringRot = mobileCurrentRotation; updateRing(); updateMobileSelection();
  requestAnimationFrame(mobileTick);
}
function initMobile() {
  mobileCurrentRotation = mobileTargetRotation = ringRot;
  let lastX = 0, lastY = 0;
  ringHitbox.addEventListener("pointerdown", (e) => {
    mobileDragging = true; mobileVelocity = 0; lastX = e.clientX; lastY = e.clientY;
    try { ringHitbox.setPointerCapture(e.pointerId); } catch (_) {}
  });
  ringHitbox.addEventListener("pointermove", (e) => {
    if (!mobileDragging) return; e.preventDefault();
    const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY;
    const delta = dx * MOBILE_DRAG_SPEED + dy * 0.12; mobileTargetRotation += delta; mobileVelocity = delta;
  });
  const endDrag = (e) => { if (!mobileDragging) return; mobileDragging = false;
    try { if (ringHitbox.hasPointerCapture(e.pointerId)) ringHitbox.releasePointerCapture(e.pointerId); } catch (_) {} };
  ringHitbox.addEventListener("pointerup", endDrag);
  ringHitbox.addEventListener("pointercancel", endDrag);
  ringHitbox.addEventListener("wheel", (e) => { e.preventDefault(); mobileTargetRotation += e.deltaY * 0.18; }, { passive: false });
  updateMobileSelection();
  requestAnimationFrame(mobileTick);
}

function initParallax() {
  window.addEventListener("mousemove", (e) => {
    const px = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const py = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    gsap.to(gallery, { rotationX: TILT + py * PARALLAX, rotationY: -px * PARALLAX, duration: 1, ease: "power2.out", overwrite: "auto" });
  });
}

function initCursor() {
  if (!window.matchMedia("(pointer: fine) and (hover: hover)").matches) return;
  const cursor = document.getElementById("cursor");
  gsap.set(cursor, { xPercent: -50, yPercent: -50, scale: 1 });
  const xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3.out" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3.out" });
  window.addEventListener("pointermove", (e) => { xTo(e.clientX); yTo(e.clientY); });   // <-- dot FOLLOWS the mouse
  document.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
  document.addEventListener("mouseenter", () => cursor.classList.remove("is-hidden"));
  const setScale = (s) => gsap.to(cursor, { scale: s, duration: 0.3, ease: "power3.out", overwrite: "auto" });
  scene.addEventListener("pointerenter", () => setScale(1.25));
  scene.addEventListener("pointerleave", () => setScale(1));
  document.querySelectorAll(".nav a, .corner, .label").forEach((el) => {
    el.addEventListener("pointerenter", () => setScale(0.6));
    el.addEventListener("pointerleave", () => setScale(1));
  });
}

function initAmbient() {
  function tick() {
    if (!introPlaying && !activeCard) { ambientRot += AMBIENT_SPEED; updateRing(); }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initScroll() {
  ScrollTrigger.create({ trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.4,
    onUpdate: (self) => { ringRot = self.progress * 360 * TURNS; updateRing(); } });
}

function buildLabels() {
  const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  const lrx = radius + 245, lry = radius * Math.cos(TILT * DEG) + 160, n = CATEGORIES.length;
  labelsWrap.innerHTML = "";
  CATEGORIES.forEach((cat, i) => {
    const angle = -90 + (360 / n) * i, rad = angle * DEG;
    const x = cx + Math.cos(rad) * lrx, y = cy + Math.sin(rad) * lry;
    const el = document.createElement("a"); el.className = "label";
    el.href = `estates.html?cat=${encodeURIComponent(cat.name)}`;
    el.style.left = `${x}px`; el.style.top = `${y}px`;
    el.innerHTML = `<span class="ul">${cat.name}</span><sup>(${cat.count})</sup>`;
    labelsWrap.appendChild(el);
  });
}

function initLoader() {
  const overlay = document.getElementById("loadingScreen");
  if (!overlay) return;
  const minLoad = new Promise((res) => setTimeout(res, 1400));
  const imageLoad = Promise.allSettled(IMAGES.map((src) => new Promise((res) => {
    const im = new Image(); im.onload = res; im.onerror = res; im.src = src;
  })));
  Promise.all([minLoad, imageLoad]).then(async () => {
    introOffset = 0; computeGeometry(); updateRing();
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    document.body.classList.add("page-ready");
    overlay.classList.add("is-hidden");
    revealUI();
    runIntro();
    gsap.timeline({ onComplete: () => overlay.remove() })
      .to(".loading-inner", { opacity: 0, y: -6, duration: 0.4, ease: "power2.in" })
      .to(overlay, { opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.1");
  });
}

function runIntro() {
  introPlaying = true; introOffset = -360; updateRing();
  gsap.to({ v: -360 }, { v: 0, duration: 1.6, ease: "power3.out",
    onUpdate() { introOffset = this.targets()[0].v; updateRing(); },
    onComplete() { introOffset = 0; introPlaying = false; updateRing(); } });
}

function revealUI() {
  const slideUi = [document.querySelector(".site-header"), ...document.querySelectorAll(".corner")];
  if (isMobile && mobilePreview) slideUi.push(mobilePreview);
  gsap.fromTo(slideUi.filter(Boolean), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.06 });
  if (!isMobile) {
    gsap.fromTo(center, { opacity: 0 }, { opacity: 1, duration: 0.9, ease: "power3.out" });
    gsap.fromTo(".label", { opacity: 0 }, { opacity: 0.85, duration: 0.8, ease: "power2.out", stagger: 0.012, delay: 0.15 });
  }
}

function onResize() {
  computeGeometry(); setupItems(); updateRing();
  if (!isMobile) { buildLabels(); ScrollTrigger.refresh(); }
}

function init() {
  initLoader();
  computeGeometry();
  buildGallery();      // <-- runs for BOTH desktop AND mobile (BUG 2 fix)
  setupItems();
  updateRing();
  gsap.set(gallery, { rotationX: TILT });
  if (isMobile) {
    initMobile();
  } else {
    buildLabels(); initParallax(); initScroll(); initCursor(); initAmbient();
    scene.addEventListener("pointermove", onPointerMove);
    scene.addEventListener("pointerleave", () => setActive(null));
  }
  requestAnimationFrame(onResize);
  setTimeout(onResize, 300);
  window.addEventListener("load", onResize);
  let rt;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(onResize, 150); });
  window.matchMedia(MOBILE_MQ).addEventListener("change", () => location.reload());
}

window.addEventListener("DOMContentLoaded", init);
