# SkinSense by Be Bodywise
> **Understand your products. Improve your routine.**  
> An AI-powered skincare and haircare intelligence platform engineered for the Mosaic Fellowship Builder Challenge.

---

## 🌟 Overview & Core Problem Statement

Most beauty platforms reduce skincare to basic multiple-choice quizzes, generic product recommendation widgets, or superficial chatbots. In reality, modern beauty-tech customers face two critical challenges:

1. **Problem 1: Product Experience Intelligence**  
   Customers experience inconsistent outcomes—a product clears body acne but leaves their skin dehydrated and peeling, or a hair growth serum causes temporary shedding during week 2. Customers struggle to understand whether their barrier is compromised, purging, or adjusting.
2. **Problem 2: Routine Conflict & Multi-Product Compatibility**  
   Customers do not use products in isolation. They layer cleansers, peeling acids, retinoids, toners, and moisturizers simultaneously. Layering multiple leave-on and rinse-off actives multiplies cumulative dermal exposure, causing irritation, barrier breakdown, and paradoxical hyperpigmentation.

**SkinSense by Be Bodywise** solves both problems with evidence-based formulation intelligence, active ingredient pharmacology, longitudinal outcome tracking, and multi-product routine compatibility analysis.

---

## 🎨 Brand Identity & Design System

- **Brand:** SkinSense by Be Bodywise
- **Tagline:** *Understand your products. Improve your routine.*
- **Aesthetic:** Premium beauty-tech meets clinical healthcare technology
- **Palette:** Warm Ivory (`#FDFCF9`), Sage Green (`#4D7854`), Muted Lavender (`#896EAE`), Charcoal (`#1D222A`), and Soft Warm Beige (`#FAF8F5`)
- **Typography:** Modern clean sans-serif (*Plus Jakarta Sans*), with rounded cards, subtle shadows, and generous whitespace
- **Device Support:** Fully responsive across Desktop, Tablet, and Mobile

---

## 🚀 Key Modules & Required Pages

1. **Landing Page:** Interactive teaser, problem breakdown, value props, and live natural-language experience analyzer.
2. **User Authentication & Quick Switcher:** Secure JWT auth with password hashing, skin profile (skin type, active concerns), hair/scalp profile, and instant one-click demo credentials for Evaluators.
3. **Personalized User Dashboard:** Routine summary with AM/PM indicators, active routine switcher (Skincare & Body vs. Hair & Scalp), Routine Health Score gauge, potential conflicts, and weekly milestone summaries.
4. **User Profile:** Full profile configuration, skin barrier status, hair density, scalp oiliness, and saved preferences.
5. **Main Feature One — AI Product Experience Intelligence:**
   - Natural language feedback processing (e.g., *"I have been using the salicylic acid body wash for three weeks. My body acne has reduced, but my skin feels very dry."*).
   - AI extracts: Primary Concern, Positive Outcomes, Negative Changes, Duration, and Classification (*Positive, Mixed, Negative, Neutral*).
   - 5-point dermatological diagnostic report:
     1. What appears to be working
     2. What has not improved or worsened
     3. Possible explanations that need further investigation (lipid barrier stripping vs. sebum extraction)
     4. Reflection questions to consider
     5. Manufacturer-aligned safe next steps
   - Longitudinal experience comparison history with strict non-diagnostic disclaimers.
6. **Main Feature Two — AI Routine Conflict & Compatibility Checker:**
   - Evaluates multi-product routines (Cleanser, Exfoliant, Retinol, Serums, Moisturizer, SPF).
   - Detects repeated active ingredients (e.g. cumulative BHA/AHA stacking), irritating combinations (Retinol + AHA/BHA, Vit C + Retinol), excessive exfoliation, and missing core steps (SPF 50 or barrier ceramides).
   - Transparent Routine Score (0-100) broken down into:
     - Duplication Balance
     - Ingredient Compatibility
     - Application Flow
     - Barrier Safety & Hydration
     - Core Steps Completeness
   - Comprehensive explanation for every warning: triggering ingredients, scientific rationale, missing information, and safer alternatives (e.g., *Skin Cycling*).
7. **AM/PM Routine Planner:**
   - Circadian chronological application order (ranked from thinnest viscosity / lowest pH to occlusive sealants).
   - Official product instructions, precautions, ingredients requiring attention, and alternate-day *Skin Cycling* rules.
8. **Add Product Page (Catalog Search & OCR Label Scanner):**
   - Searchable catalog of authentic Be Bodywise formulations.
   - OCR ingredient scanner to extract active compounds, identify sensitizers (fragrance, drying alcohols), and calculate a Formula Cleanliness Index.
   - Custom product creator for any external skincare product.
9. **AI Product Review Intelligence:**
   - NLP classification of customer feedback across 10 distinct aspects (*Effectiveness, Irritation, Dryness, Pigmentation, Acne, Hair fall, Texture, Fragrance, Absorption, Long-term results*).
   - Frequently reported benefits vs drawbacks, common complaints, and short-term (<3 weeks) vs long-term (>6 weeks) experience patterns.
10. **Product Experience Timeline:**
    - Week-by-week visual timeline cards (Week 1 -> Week 2 -> Week 3 -> Week 4...).
    - Interactive Recharts graphs tracking multivariate metrics: Acne score, Dryness score, Irritation index, Hydration, and Regimen Satisfaction.
    - Weekly check-in modal to log progress over time.
11. **AI Formulation Assistant:**
    - Context-aware assistant synthesizing user routine, active ingredients, manufacturer instructions, and weekly timeline logs.
    - Clickable inquiry chips, product citations, and dermatological disclaimers.
12. **Admin & Brand Intelligence Dashboard:**
    - Post-market surveillance dashboard for formulation teams and product leads.
    - Aggregated, anonymized analysis of complaint rates, unwanted effects, top positive signals, category satisfaction, and emerging friction patterns.
    - Full privacy safeguards compliant with health data standards.

---

## 🛠️ Technical Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Recharts, Lucide Icons, Vite
- **Backend:** Python 3.13, FastAPI, SQLAlchemy, SQLite, Pydantic, PyJWT, Bcrypt, HTTPX
- **AI Engine:** Google Gemini API integration with intelligent heuristic knowledge-graph fallback for 100% offline resilience and zero-latency execution.
- **Port Architecture:**
  - Frontend: `http://127.0.0.1:3000`
  - Backend: `http://127.0.0.1:8000`

---

## ⚡ Quick Start & Demonstration Access

### Default Test Accounts
- **Demo User:** `demo@skinsense.ai` | Password: `demo1234` (Ananya Sharma — pre-loaded with active routine, experience log, and 4-week timeline check-ins)
- **Product Lead / Admin:** `admin@skinsense.ai` | Password: `admin1234` (Dr. Ritu Verma — access to Brand Intelligence Dashboard)
*(Both accounts are accessible via one-click buttons on the navigation bar and authentication page)*

### Running Backend
```bash
python -m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
```

### Running Frontend
```bash
cd frontend
npm run dev -- --host 127.0.0.1 --port 3000
```
"# Mosaic_Wellness_BeBodywise" 
