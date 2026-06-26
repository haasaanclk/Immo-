# DOMAINE — PropTech SaaS Architecture

> **Not a listing site — a *Personal Property Intelligence* platform.**
> Keywords: **PropTech · Personal Concierge · Private-by-Design.**

This document is the technical blueprint: the persona/terminology, the module
specification (A–D), the data model (`User · Lifestyle · Property · Match ·
Privacy`), the recommended stack, and a matrix of **what is live now in the
static demo vs. what requires the production backend.**

---

## 0. Persona & North-Star Terms

| Term | Meaning |
|---|---|
| **Hyper-Personalization Engine** | Deep, user-centric recommendation over lifestyle vectors. |
| **Private-by-Design Architecture** | Privacy is a primitive of the data model, not a feature flag. |
| **Concierge-as-a-Service (CaaS)** | A continuous conversational assistant replaces the classic UI. |
| **Zero-Knowledge Authentication** | Buyer ⇄ seller identities never cross; only proofs of qualification do. |
| **Immersive Spatial UX** | 3D, cinematic, fluid motion (the GSAP ring + module transitions). |

---

## 1. Module Specification

### A. The Intelligent Core — AI Concierge (CaaS)
- **Spec:** Conversational UI (CUI) + NLP + Predictive Behavioral Modeling.
- **Function:** capture lifestyle as **vector embeddings**
  `life_style: { privacy, social, location, architecture, prestige, investment }`,
  stored for ANN retrieval.
- **Production:** Claude (`claude-opus-4-8`) tool-use over a streaming endpoint →
  structured profile → embedding model → **Pinecone** upsert.
- **Live now:** `docs/concierge.html` runs the lifestyle interview → 6-D
  `profileVector` → **cosine similarity** ranking in `store.js` (static analog of
  a Pinecone query). The Next.js app (`app/api/concierge`) already does the real
  Claude NLP version with a demo fallback.

### B. The Privacy Engine — Invisible Buyer / Blind Matching
- **Spec:** Encrypted Identity Masking + Role-Based Access Control (RBAC),
  *escrow-style visibility*.
- **Function:** identities are withheld on both sides; only a **verified,
  masked qualification band** crosses (zero-knowledge proof of funds).
- **Live now:** `store.js → blindMatch()` issues a stable anonymous **Buyer
  token**, a masked **qualification band**, and a `verified` flag; rendered on
  `estate.html` as a two-column "what stays hidden vs. what the seller sees".

### C. Property Intelligence — The DNA Report
- **Spec:** Multi-Dimensional Scoring Algorithm (MDSA) + Automated Valuation
  Modeling (AVM).
- **Function:** six axes (architecture, materials, privacy, location, prestige,
  investment) + Quality Index, visualized as a **Radar / Spider chart**.
- **Live now:** `store.js → computeDNA()` (deterministic, attribute-weighted) +
  an SVG **radar chart** + serial/passport on `estate.html`. AVM projection in
  `finance()` (10-yr value model). Production AVM = gradient-boosted comparables.

### D. The First Access Pipeline — VIP Tier
- **Spec:** Tiered Access Control + Tokenized Priority + **TTL**.
- **Function:** off-market estates expose a 48h **Private Preview** window to
  invited tiers only; **scarcity** triggers ("X people viewing now").
- **Live now:** `store.js → firstAccess()` (rolling 48h TTL + live viewers) +
  `docs/private.html` with per-card countdowns and a pulsing scarcity indicator;
  off-market badge + ticker on `estate.html`. Production = time-limited private
  routes/endpoints gated by tier token (signed JWT, DB-level `valid_until`).

---

## 2. Data Model (`User · Lifestyle · Property · Match · Privacy`)

```sql
-- USER (identity + tier)
user(
  id uuid pk, email citext unique, name text, created_at timestamptz,
  tier text check (tier in ('resident','prive','cercle_noir')) default 'resident'
)

-- LIFESTYLE (the embedding the Hyper-Personalization Engine retrieves on)
lifestyle(
  user_id uuid fk -> user.id, updated_at timestamptz,
  axes jsonb,                       -- {privacy, social, location, architecture, prestige, investment}
  embedding vector(6)               -- pgvector / mirrored into Pinecone
)

-- PROPERTY (+ its DNA)
property(
  id uuid pk, title text, category text, city text, price numeric, m2 int,
  beds int, floors int, roof text, residence text, year int, images text[],
  off_market bool default false, owner_id uuid fk -> user.id, serial text
)
property_dna(
  property_id uuid fk -> property.id,
  axes jsonb, quality int,          -- MDSA result
  embedding vector(6)               -- for ANN match against lifestyle.embedding
)

-- MATCH (cosine result, cached)
match(
  user_id uuid fk, property_id uuid fk, score numeric,   -- cosine 0..1
  reason_axis text, created_at timestamptz,
  primary key (user_id, property_id)
)

-- PRIVACY (blind matching / escrow visibility + tokenized first access)
blind_interest(
  id uuid pk, property_id uuid fk, buyer_token text,     -- anonymous, not user.id
  qualification_band text, zk_verified bool, created_at timestamptz
)
first_access_grant(
  property_id uuid fk, tier text, token text,            -- tokenized priority
  valid_from timestamptz, valid_until timestamptz        -- TTL (48h window)
)
```

**RBAC rule of thumb:** a seller query can join `blind_interest` but **never**
`user`; a buyer query can read `first_access_grant` only when
`now() between valid_from and valid_until` **and** `user.tier >= grant.tier`.

---

## 3. Recommended Stack

| Layer | Choice | Why |
|---|---|---|
| Front-end | **Next.js (App Router) + TypeScript** | SSR/edge, route-level access control. |
| Spatial UX | **Three.js / React-Three-Fiber + GSAP / Framer Motion** | Parallax 3D scrolling, morphing transitions. |
| Concierge | **Claude (`claude-opus-4-8`) tool-use, streaming** | CUI + structured profile extraction. |
| Embeddings + ANN | **Pinecone** (or `pgvector`) | "sessiz ve modern" → vectorized retrieval. |
| Relational | **PostgreSQL** (Turso/libSQL in this repo today) | Strong constraints for RBAC + TTL. |
| Auth | **JWT (httpOnly) + RBAC tiers** | Tokenized priority, zero-knowledge flows. |
| Payments | **Stripe Checkout** | Tier upgrades. |
| Hosting | **Vercel** (prod) · **GitHub Pages** (this static demo) | — |

> **This repository already ships** the Next.js + libSQL + Claude version under
> `app/`, `lib/`, `db/`; the **`docs/`** folder is the self-contained static
> demo (the only host reachable from the build sandbox) implementing the same
> modules client-side.

---

## 4. Live-now vs. Backend matrix

| Module | Static demo (`docs/`) | Production backend |
|---|---|---|
| A · Concierge / embeddings | interview → 6-D vector → **cosine** | Claude NLP → Pinecone ANN |
| B · Invisible Buyer | `blindMatch()` token + masked band | RBAC + ZK proof-of-funds |
| C · Property DNA | `computeDNA()` + **radar** + AVM projection | MDSA + ML AVM (comparables) |
| D · First Access | `firstAccess()` rolling 48h TTL + scarcity | signed tier tokens + DB `valid_until` |
| Spatial UX | GSAP 3D ring + module transitions | + Three.js / R3F walkthroughs |

---

## 5. Master Prompt (hand to any AI / team)

> Build a luxury **Private AI Concierge** PropTech platform — a *Personal
> Property Intelligence* system, not a listing site. Implement: (A) NLP
> conversational onboarding that converts lifestyle → vector embeddings; (B) a
> **Blind Matching** "Invisible Buyer" flow where buyer/seller identities stay
> hidden and only zero-knowledge-style financial validation crosses; (C)
> **Dynamic Property DNA** scored on quality/privacy/location/investment and
> shown as a **Radar/Spider chart**; (D) **Tiered Access** with a 48h **TTL**
> First-Access window + scarcity triggers. UI/UX: Framer Motion + Three.js
> cinematic, private-banking aesthetic — minimalist negative space,
> high-contrast type, glassmorphism. Stack: Next.js + Three.js + PostgreSQL +
> Pinecone. Deliver the `User·Lifestyle·Property·Match·Privacy` schema and the
> front-end architecture.
