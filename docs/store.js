/* ============================================================================
   DOMAINE — store.js
   Self-contained data + intelligence layer for the static luxury estate site.
   - Seed portfolio + user-published listings (localStorage)
   - Property DNA generator (deterministic, attribute-weighted)
   - Concierge lifestyle interview + profile + matching
   - Shared chrome (header/footer) renderer
   ========================================================================== */
(function (global) {
  "use strict";

  const LS_LISTINGS = "domaine.listings.v1";
  const LS_PROFILE = "domaine.profile.v1";
  const LS_SAVED = "domaine.saved.v1";

  /* ---------- formatting ---------- */
  const EUR = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  function money(n) { return EUR.format(n); }
  function area(n) { return n.toLocaleString("de-DE") + " m²"; }

  /* ---------- taxonomy (concept-aligned) ---------- */
  const CATEGORIES = [
    "Villa", "Penthouse", "Chalet", "Townhouse", "Waterfront",
    "Vineyard", "Manor", "Tower Residence", "Country House", "Loft",
    "Estate", "Private Island", "Retreat", "Restoration", "Residence",
  ];
  const RESIDENCE_TYPES = ["Birincil konut", "İkinci konut / Yazlık", "Yatırım mülkü", "Pied-à-terre"];
  const ROOF_TYPES = ["Düz teras çatı", "Kırma çatı", "Cam atrium", "Yeşil çatı", "Mansard"];
  const CITIES = ["München", "Zürich", "Wien", "Dubai", "London", "Genève", "Sankt Moritz", "Monaco"];

  const CITY_TIER = { London: 96, Monaco: 95, Zürich: 93, "Genève": 90, Dubai: 89, "Sankt Moritz": 88, München: 86, Wien: 83, default: 78 };
  const PRIVACY_BY_CAT = {
    "Private Island": 99, "Estate": 94, "Vineyard": 92, "Manor": 90, "Chalet": 88, "Country House": 86,
    "Villa": 84, "Retreat": 86, "Waterfront": 80, "Restoration": 78, "Residence": 70,
    "Penthouse": 72, "Tower Residence": 66, "Townhouse": 64, "Loft": 58, default: 72,
  };

  /* ---------- seed portfolio (15) ---------- */
  const IMGS = ["image-1","image-2","image-3","image-4","image-5","image-6","image-7","image-8","image-9","image-10","image-11","image-12","image-15","13","14"];
  const SEED = [
    { title:"Villa Helvetia",          category:"Villa",           city:"Zürich",       price:8_900_000,  m2:540, beds:6, floors:3, year:2019, roof:"Düz teras çatı", residence:"Birincil konut",      blurb:"Zürichberg yamacında, göl manzaralı, tam mahremiyetli bir cam-taş villa." },
    { title:"Bahnhofstrasse Penthouse",category:"Penthouse",       city:"Zürich",       price:12_400_000, m2:380, beds:4, floors:2, year:2021, roof:"Cam atrium",     residence:"Pied-à-terre",        blurb:"Şehrin en prestijli aksında, 360° teraslı çatı katı." },
    { title:"Chalet Saint-Moritz",     category:"Chalet",          city:"Sankt Moritz", price:15_800_000, m2:620, beds:7, floors:4, year:2017, roof:"Kırma çatı",     residence:"İkinci konut / Yazlık",blurb:"Engadin'de geleneksel ahşap işçiliği, özel kayak çıkışı ve spa." },
    { title:"Belgravia Townhouse",     category:"Townhouse",       city:"London",       price:22_500_000, m2:450, beds:5, floors:5, year:1890, roof:"Mansard",        residence:"Birincil konut",      blurb:"Korunmuş cephe ardında tamamen yenilenmiş klasik bir şehir konağı." },
    { title:"Île Privée Lavaux",       category:"Private Island",  city:"Genève",       price:34_000_000, m2:300, beds:5, floors:2, year:2020, roof:"Yeşil çatı",     residence:"İkinci konut / Yazlık",blurb:"Léman Gölü'nde tek ev barındıran özel ada — mutlak izolasyon." },
    { title:"Domaine de Lavaux",       category:"Vineyard",        city:"Genève",       price:18_200_000, m2:480, beds:6, floors:3, year:2015, roof:"Kırma çatı",     residence:"Yatırım mülkü",       blurb:"İşler bir bağ, mahzen ve konak — UNESCO terasları üzerinde." },
    { title:"Lake Zürich Waterfront",  category:"Waterfront",      city:"Zürich",       price:16_700_000, m2:410, beds:5, floors:2, year:2022, roof:"Düz teras çatı", residence:"Birincil konut",      blurb:"Kendi iskelesi ve yüzme havuzuyla göl kıyısında modern bir ev." },
    { title:"Schwabing Manor",         category:"Manor",           city:"München",      price:9_600_000,  m2:560, beds:6, floors:3, year:1908, roof:"Mansard",        residence:"Birincil konut",      blurb:"Jugendstil bir konak, olgun bahçe içinde, sessiz bir caddede." },
    { title:"Marina Tower Residence",  category:"Tower Residence", city:"Dubai",        price:7_300_000,  m2:320, beds:4, floors:1, year:2023, roof:"Cam atrium",     residence:"Yatırım mülkü",       blurb:"Marina silüetine bakan, otel hizmetli yüksek kat rezidansı." },
    { title:"Engadin Retreat",         category:"Retreat",         city:"Sankt Moritz", price:11_100_000, m2:430, beds:5, floors:3, year:2018, roof:"Yeşil çatı",     residence:"İkinci konut / Yazlık",blurb:"Dağ yamacında minimal beton-cam bir inziva, panoramik manzara." },
    { title:"Wachau Country House",    category:"Country House",   city:"Wien",         price:5_400_000,  m2:380, beds:5, floors:2, year:2012, roof:"Kırma çatı",     residence:"İkinci konut / Yazlık",blurb:"Tuna vadisinde, bağlar arasında taş bir kır evi." },
    { title:"Soho Loft",               category:"Loft",            city:"London",       price:6_800_000,  m2:240, beds:3, floors:1, year:2016, roof:"Düz teras çatı", residence:"Pied-à-terre",        blurb:"Dönüştürülmüş bir endüstri yapısında çift-katlı sanatçı loft'u." },
    { title:"Tegernsee Estate",        category:"Estate",          city:"München",      price:19_900_000, m2:700, beds:8, floors:3, year:2014, roof:"Kırma çatı",     residence:"Birincil konut",      blurb:"Göl cepheli arazi, ana ev, misafirhane ve tekne evi." },
    { title:"Palais Ringstrasse",      category:"Restoration",     city:"Wien",         price:13_300_000, m2:620, beds:6, floors:4, year:1875, roof:"Mansard",        residence:"Birincil konut",      blurb:"Ringstrasse üzerinde restore edilmiş bir palais — tavan freskleriyle." },
    { title:"Mayfair Residence",       category:"Residence",       city:"London",       price:14_600_000, m2:300, beds:4, floors:2, year:2020, roof:"Cam atrium",     residence:"Pied-à-terre",        blurb:"Mayfair'de lateral bir daire — concierge ve özel asansörle." },
  ];

  /* ---------- deterministic hash → seeded value ---------- */
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function seeded(str, salt) { const h = hash(str + "::" + salt); return (h % 1000) / 1000; } // 0..1
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function round(n) { return Math.round(n); }

  /* ---------- Property DNA ----------
     Six axes (0-100) + Quality Index + serial. Deterministic from the listing
     so the same property always yields the same DNA. */
  function computeDNA(p) {
    const cityTier = CITY_TIER[p.city] || CITY_TIER.default;
    const priceN = clamp(Math.log10(Math.max(p.price, 1)) / 7.6, 0, 1);   // ~0 for €1, ~1 for €40M
    const spaceN = clamp(p.m2 / 750, 0, 1);
    const ageN = clamp((2026 - (p.year || 2020)) / 160, 0, 1);            // heritage factor
    const wobble = (k) => (seeded(p.title + p.city, k) - 0.5) * 16;       // ±8 stable jitter

    const architecture = clamp(round(58 + spaceN * 22 + ageN * 14 + wobble("arch")), 30, 99);
    const materials    = clamp(round(60 + priceN * 26 + wobble("mat")), 30, 99);
    const privacy      = clamp(round((PRIVACY_BY_CAT[p.category] || PRIVACY_BY_CAT.default) + wobble("priv") - p.floors * 0.5), 30, 99);
    const location     = clamp(round(cityTier - 6 + wobble("loc")), 30, 99);
    const prestige     = clamp(round(40 + priceN * 40 + cityTier * 0.18 + wobble("pres")), 30, 99);
    const investment   = clamp(round(46 + cityTier * 0.3 + priceN * 14 + wobble("inv")), 30, 99);

    const axes = { architecture, materials, privacy, location, prestige, investment };
    const quality = round((architecture * 0.18 + materials * 0.18 + privacy * 0.16 + location * 0.18 + prestige * 0.16 + investment * 0.14));
    const serial = "DMN-" + (hash(p.title + p.city + p.m2).toString(36).toUpperCase().slice(0, 6));
    return { axes, quality, serial };
  }

  const AXIS_LABELS = {
    architecture: "Mimari", materials: "Malzeme", privacy: "Mahremiyet",
    location: "Lokasyon", prestige: "Prestij", investment: "Yatırım",
  };

  /* ---------- listing CRUD ---------- */
  function readLS(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (_) { return fallback; } }
  function writeLS(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (_) {} }

  function seedEstates() {
    return SEED.map((s, i) => ({ id: "seed-" + (i + 1), image: "public/" + IMGS[i % IMGS.length] + ".png", images: ["public/" + IMGS[i % IMGS.length] + ".png"], seed: true, ...s }));
  }
  function publishedEstates() { return readLS(LS_LISTINGS, []); }
  function getEstates() { return [...publishedEstates(), ...seedEstates()]; }
  function getEstate(id) { return getEstates().find((e) => e.id === id) || null; }

  function saveEstate(record) {
    const list = publishedEstates();
    const id = "user-" + Date.now().toString(36);
    const images = (record.images && record.images.length) ? record.images : ["public/image-1.png"];
    const estate = { id, seed: false, createdAt: Date.now(), image: images[0], ...record, images };
    list.unshift(estate);
    writeLS(LS_LISTINGS, list);
    return estate;
  }
  function deleteEstate(id) { writeLS(LS_LISTINGS, publishedEstates().filter((e) => e.id !== id)); }

  /* ---------- saved / shortlist ---------- */
  function getSaved() { return readLS(LS_SAVED, []); }
  function toggleSaved(id) {
    const s = getSaved(); const i = s.indexOf(id);
    if (i >= 0) s.splice(i, 1); else s.push(id);
    writeLS(LS_SAVED, s); return s.indexOf(id) >= 0;
  }
  function isSaved(id) { return getSaved().includes(id); }

  /* ---------- Concierge: lifestyle interview ----------
     Each option nudges DNA-axis preferences (0..1 weights). */
  const QUESTIONS = [
    { q: "Bir evde önce neyi ararsınız?",
      opts: [
        { label: "Mutlak mahremiyet ve sessizlik", w: { privacy: 1, location: .3 } },
        { label: "Mimari ve tasarım ifadesi",      w: { architecture: 1, materials: .6 } },
        { label: "Konum ve erişim",                w: { location: 1, prestige: .4 } },
        { label: "Değer ve yatırım potansiyeli",   w: { investment: 1, prestige: .5 } },
      ] },
    { q: "İdeal bir gününüz nerede geçer?",
      opts: [
        { label: "Doğanın içinde, şehirden uzak",  w: { privacy: .9, architecture: .3 } },
        { label: "Kültürün merkezinde, yürüme mesafesinde", w: { location: 1, prestige: .5 } },
        { label: "Su kenarında",                   w: { location: .6, privacy: .5 } },
        { label: "Dağda, yükseklerde",             w: { privacy: .8, materials: .4 } },
      ] },
    { q: "Tarz olarak size yakın olan?",
      opts: [
        { label: "Sıcak, klasik, zamansız",        w: { architecture: .7, materials: .8 } },
        { label: "Saf, modern, minimal",           w: { architecture: 1, materials: .5 } },
        { label: "Tarihî, restore edilmiş",        w: { architecture: .6, prestige: .8 } },
        { label: "İddialı, ikonik",                w: { prestige: 1, investment: .5 } },
      ] },
    { q: "Bu mülk sizin için ne?",
      opts: [
        { label: "Birincil yaşam alanım",          w: { architecture: .6, privacy: .6 } },
        { label: "Bir kaçış / ikinci ev",          w: { privacy: .8, location: .4 } },
        { label: "Stratejik bir yatırım",          w: { investment: 1, prestige: .6 } },
        { label: "Bir miras / aile mülkü",         w: { prestige: .8, privacy: .5, materials: .5 } },
      ] },
    { q: "Ölçek tercihiniz?",
      opts: [
        { label: "Geniş arazi, büyük hacim",       w: { privacy: .7, architecture: .5 } },
        { label: "Kompakt ama kusursuz",           w: { materials: 1, location: .5 } },
        { label: "Dikey, manzaraya hâkim",         w: { location: .8, prestige: .6 } },
        { label: "Esnek, çok amaçlı",              w: { investment: .7, architecture: .4 } },
      ] },
  ];

  function buildProfile(answers) {
    // answers: array of option indices aligned with QUESTIONS
    const prof = { architecture: 0, materials: 0, privacy: 0, location: 0, prestige: 0, investment: 0 };
    answers.forEach((ai, qi) => {
      const opt = QUESTIONS[qi] && QUESTIONS[qi].opts[ai];
      if (!opt) return;
      for (const k in opt.w) prof[k] += opt.w[k];
    });
    // normalise to 0..100
    const max = Math.max(...Object.values(prof), 1);
    for (const k in prof) prof[k] = round((prof[k] / max) * 100);
    return prof;
  }
  function saveProfile(p) { writeLS(LS_PROFILE, p); }
  function getProfile() { return readLS(LS_PROFILE, null); }

  function matchEstates(profile, limit) {
    const keys = Object.keys(AXIS_LABELS);
    const wsum = keys.reduce((s, k) => s + (profile[k] || 0), 0) || 1;
    const scored = getEstates().map((e) => {
      const dna = computeDNA(e).axes;
      // weighted alignment: profile weight * estate axis strength
      let score = 0;
      keys.forEach((k) => { score += (profile[k] || 0) * dna[k]; });
      score = score / wsum; // 0..100-ish
      // strongest aligned axis -> reason
      let best = keys[0], bestVal = -1;
      keys.forEach((k) => { const v = (profile[k] || 0) * dna[k]; if (v > bestVal) { bestVal = v; best = k; } });
      const reason = reasonFor(best, dna[best]);
      return { estate: e, score: round(score), match: round(clamp(score, 0, 100)), reasonAxis: best, reason };
    });
    scored.sort((a, b) => b.score - a.score);
    return limit ? scored.slice(0, limit) : scored;
  }
  function reasonFor(axis, val) {
    const m = {
      architecture: "Mimari ifadesi önceliğinizle örtüşüyor",
      materials: "Malzeme ve işçilik kaliteniz için seçildi",
      privacy: "Aradığınız mahremiyet seviyesini sunuyor",
      location: "Konum tercihinizle güçlü uyum",
      prestige: "Prestij beklentinizi karşılıyor",
      investment: "Yatırım profilinize uygun",
    };
    return m[axis] + " (" + val + "/100).";
  }

  /* ---------- Finance / investment intelligence (deterministic) ---------- */
  function finance(estate, opts) {
    const o = Object.assign({ downPct: 35, termYears: 20, ratePct: 3.4 }, opts || {});
    const price = estate.price || 0;
    const down = price * o.downPct / 100;
    const loan = Math.max(price - down, 0);
    const r = o.ratePct / 100 / 12, n = o.termYears * 12;
    const monthly = r === 0 ? (n ? loan / n : 0) : (loan * r) / (1 - Math.pow(1 + r, -n));
    const maintenance = price * 0.012;            // annual
    const energy = (estate.m2 || 0) * 18;          // annual
    const tax = price * 0.004;                      // annual
    const annualOwnership = maintenance + energy + tax;
    const monthlyAll = monthly + annualOwnership / 12;
    const dna = computeDNA(estate).axes;
    const growth = 0.02 + (dna.investment / 100) * 0.05; // 2%–7% / yr
    const projection = [];
    for (let y = 0; y <= 10; y++) projection.push(Math.round(price * Math.pow(1 + growth, y)));
    return { price, down, loan, monthly: Math.round(monthly), maintenance: Math.round(maintenance),
      energy: Math.round(energy), tax: Math.round(tax), monthlyAll: Math.round(monthlyAll),
      growthPct: +(growth * 100).toFixed(1), projection };
  }

  /* ---------- Atelier — AI interior style studio (deterministic) ---------- */
  const ATELIER_STYLES = [
    { key: "minimal",   name: "Modern Minimal", palette: ["#EDEAE3", "#0D0D0D", "#9A7B4F"], perM2: 1200, impact: 6.5,
      materials: "Cilalı beton, dudak detaylı meşe, mat siyah çelik, geniş cam",
      note: "Hatları sadeleştirir, ışığı serbest bırakır — değer artışının çoğu algıdan gelir." },
    { key: "scandi",    name: "İskandinav",     palette: ["#F4F1EA", "#D8CBB8", "#7E8B7A"], perM2: 850, impact: 4.0,
      materials: "Açık meşe, keten, kireç badana, yün, doğal taş",
      note: "Sıcak ve nefes alan bir sadelik; geniş alıcı kitlesine hitap eder." },
    { key: "oldmoney",  name: "Klasik · Old Money", palette: ["#1E3A2F", "#B08D57", "#EFEDE6"], perM2: 1900, impact: 9.0,
      materials: "Ceviz lambri, pirinç, kannellü mermer, kadife, antika parke",
      note: "Zamansız prestij. En yüksek değer etkisi, en yüksek maliyet." },
    { key: "mediterran",name: "Akdeniz",        palette: ["#F0E6D2", "#C9784F", "#5B7B7A"], perM2: 980, impact: 5.0,
      materials: "Kireç sıva, terrakota, zeytin ağacı, dokuma, pişmiş toprak",
      note: "Tatil-evi karakteri; ikinci konut ve kiralama getirisini güçlendirir." },
  ];
  function atelier(estate, key) {
    const s = ATELIER_STYLES.find((x) => x.key === key) || ATELIER_STYLES[0];
    const jitter = (seeded(estate.title + s.key, "atl") - 0.5) * 1.6;
    const cost = Math.round((estate.m2 || 200) * s.perM2);
    const impactPct = +(s.impact + jitter).toFixed(1);
    const valueGain = Math.round((estate.price || 0) * impactPct / 100);
    return { style: s, cost, impactPct, valueGain };
  }

  /* ---------- shared chrome ---------- */
  const NAV = [
    { href: "index.html", label: "Archive", key: "archive" },
    { href: "estates.html", label: "Estates", key: "estates" },
    { href: "concierge.html", label: "Concierge", key: "concierge" },
    { href: "publish.html", label: "Publish", key: "publish" },
  ];
  function renderHeader(activeKey) {
    const nav = NAV.map((n) => `<a href="${n.href}" class="${n.key === activeKey ? "is-active" : ""}">${n.label}</a>`).join("");
    return `
    <header class="site-header site-header--solid">
      <div class="header-left">
        <a class="brand" href="index.html">DOMAINE<span class="brand-dot">®</span></a>
        <nav class="nav">${nav}</nav>
      </div>
      <div class="lang"><span>EN</span><span class="sep">/</span><span class="muted">DE</span></div>
      <button class="menu-toggle" id="menuToggle" type="button" aria-label="Menu"><span></span><span></span></button>
    </header>
    <nav class="mobile-nav" id="mobileNav">${NAV.map((n)=>`<a href="${n.href}">${n.label}</a>`).join("")}</nav>`;
  }
  function renderFooter() {
    return `
    <footer class="site-footer">
      <div class="foot-grid">
        <div><div class="brand">DOMAINE<span class="brand-dot">®</span></div>
          <p class="foot-tag">Zamanını koru. Mahremiyetini koru. Sana özel olanı gör.</p></div>
        <div><h4>Piyasalar</h4><p>München · Zürich · Wien · Genève · London · Dubai</p></div>
        <div><h4>İletişim</h4><p>concierge@domaine.estate</p><p>Davet ile üyelik</p></div>
      </div>
      <div class="foot-base"><span>© 2026 DOMAINE® — Private AI Real Estate Concierge</span><span>EN / DE</span></div>
    </footer>`;
  }
  function mountChrome(activeKey) {
    document.body.insertAdjacentHTML("afterbegin", renderHeader(activeKey));
    document.body.insertAdjacentHTML("beforeend", renderFooter());
    const t = document.getElementById("menuToggle"), m = document.getElementById("mobileNav");
    if (t && m) t.addEventListener("click", () => m.classList.toggle("open"));
  }

  global.DOMAINE = {
    money, area, CATEGORIES, RESIDENCE_TYPES, ROOF_TYPES, CITIES, AXIS_LABELS,
    computeDNA, getEstates, getEstate, saveEstate, deleteEstate,
    getSaved, toggleSaved, isSaved,
    QUESTIONS, buildProfile, saveProfile, getProfile, matchEstates,
    finance, ATELIER_STYLES, atelier,
    renderHeader, renderFooter, mountChrome,
  };
})(window);
