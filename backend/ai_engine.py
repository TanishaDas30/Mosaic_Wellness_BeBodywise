import os
import re
import json
import httpx
from typing import Dict, List, Any, Optional

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

# --- Comprehensive Ingredient Knowledge Base ---
INGREDIENT_KNOWLEDGE_BASE = {
    "salicylic acid": {
        "class": "BHA (Beta Hydroxy Acid)",
        "action": "Lipophilic keratolytic exfoliant, penetrates sebum to clear pores",
        "common_concerns": ["acne", "blackheads", "clogged pores", "oiliness"],
        "potential_sensitivities": ["dryness", "peeling", "mild stinging"],
        "max_recommended_daily_layering": 1,
        "contraindications": ["tretinoin", "retinol", "glycolic acid in same session"],
        "caution_combinations": ["benzoyl peroxide", "lactic acid"],
        "am_or_pm": "PM preferred, AM acceptable with SPF 50"
    },
    "glycolic acid": {
        "class": "AHA (Alpha Hydroxy Acid)",
        "action": "Small-molecule superficial exfoliant, accelerates cell turnover",
        "common_concerns": ["hyperpigmentation", "dullness", "rough texture"],
        "potential_sensitivities": ["photosensitivity", "erythema", "dryness"],
        "max_recommended_daily_layering": 1,
        "contraindications": ["retinol", "salicylic acid at high % in same application"],
        "am_or_pm": "PM only, mandates broad-spectrum sunscreen"
    },
    "lactic acid": {
        "class": "AHA (Alpha Hydroxy Acid)",
        "action": "Mild hydrating chemical exfoliant with natural humectant properties",
        "common_concerns": ["dry texture", "uneven tone", "keratosis pilaris"],
        "potential_sensitivities": ["mild tingling", "sun sensitivity"],
        "max_recommended_daily_layering": 1,
        "contraindications": ["strong retinoids in same step"],
        "am_or_pm": "PM preferred, alternate with other acids"
    },
    "retinol": {
        "class": "Retinoid (Vitamin A derivative)",
        "action": "Stimulates cellular renewal and collagen synthesis in dermal layers",
        "common_concerns": ["fine lines", "acne", "post-inflammatory hyperpigmentation"],
        "potential_sensitivities": ["retinoid dermatitis", "flaking", "dryness", "purging"],
        "max_recommended_daily_layering": 1,
        "contraindications": ["salicylic acid", "glycolic acid", "pure vitamin c in same session"],
        "am_or_pm": "PM strictly, UV degradable"
    },
    "niacinamide": {
        "class": "Vitamin B3",
        "action": "Strengthens lipid barrier, regulates sebum, reduces inflammation",
        "common_concerns": ["enlarged pores", "barrier compromise", "redness"],
        "potential_sensitivities": ["flushing at >10% concentration"],
        "max_recommended_daily_layering": 2,
        "contraindications": [],
        "am_or_pm": "AM and PM, highly compatible with ceramides and zinc"
    },
    "urea": {
        "class": "Natural Moisturizing Factor (NMF) & Keratolytic",
        "action": "Water-binding humectant at <10%, gentle desquamation at >=10%",
        "common_concerns": ["extreme dryness", "keratosis pilaris", "rough body skin"],
        "potential_sensitivities": ["stinging on open skin"],
        "max_recommended_daily_layering": 2,
        "contraindications": [],
        "am_or_pm": "AM and PM, exceptionally restorative"
    },
    "ceramides": {
        "class": "Stratum Corneum Lipids",
        "action": "Replenishes intercellular lipid matrix, blocks TEWL (Transepidermal Water Loss)",
        "common_concerns": ["barrier damage", "dryness", "irritation"],
        "potential_sensitivities": [],
        "max_recommended_daily_layering": 3,
        "contraindications": [],
        "am_or_pm": "AM and PM, essential recovery active"
    },
    "hyaluronic acid": {
        "class": "Glycosaminoglycan Humectant",
        "action": "Binds up to 1000x its molecular weight in water",
        "common_concerns": ["dehydration", "loss of plumpness"],
        "potential_sensitivities": ["can draw moisture out of skin if applied in zero-humidity air without sealant"],
        "max_recommended_daily_layering": 3,
        "contraindications": [],
        "am_or_pm": "AM and PM on damp skin"
    },
    "vitamin c": {
        "class": "L-Ascorbic Acid / Ethyl Ascorbic Acid (Antioxidant)",
        "action": "Neutralizes free radicals, inhibits tyrosinase, boosts photoprotection",
        "common_concerns": ["dark spots", "sun damage", "dull complexion"],
        "potential_sensitivities": ["mild oxidation irritation", "acidic stinging at pH < 3.5"],
        "max_recommended_daily_layering": 1,
        "contraindications": ["benzoyl peroxide", "retinol in same step"],
        "am_or_pm": "AM ideal under sunscreen"
    },
    "redensyl": {
        "class": "Biotech Hair Follicle Reactivator",
        "action": "Stimulates hair follicle stem cells (ORSc) and dermal papilla fibroblasts",
        "common_concerns": ["telogen effluvium", "thinning hair", "hair fall"],
        "potential_sensitivities": ["mild scalp tingling"],
        "max_recommended_daily_layering": 1,
        "contraindications": [],
        "am_or_pm": "PM directly to clean dry scalp"
    },
    "procapil": {
        "class": "Biotinoyl Tripeptide Complex",
        "action": "Inhibits 5-alpha-reductase, enhances microcirculation around follicles",
        "common_concerns": ["hair thinning", "hormonal hair loss"],
        "potential_sensitivities": [],
        "max_recommended_daily_layering": 1,
        "contraindications": [],
        "am_or_pm": "PM to scalp"
    },
    "anagain": {
        "class": "Organic Pea Sprout Extract",
        "action": "Reactivates noggin gene to shorten telogen phase and lengthen anagen phase",
        "common_concerns": ["slow hair growth", "hair shedding"],
        "potential_sensitivities": [],
        "max_recommended_daily_layering": 1,
        "contraindications": [],
        "am_or_pm": "Daily scalp application"
    },
    "salicylic acid body wash": {
        "class": "Rinse-off Exfoliant Wash",
        "action": "Surface and follicular cleansing for trunk skin",
        "common_concerns": ["body acne", "keratosis pilaris"],
        "potential_sensitivities": ["dryness if used with hot water or without follow-up lotion"],
        "max_recommended_daily_layering": 1,
        "contraindications": [],
        "am_or_pm": "Daily in shower"
    }
}


# --- Call Gemini API or fallback helper ---
async def call_llm(prompt: str, system_instruction: str = "") -> Optional[str]:
    """Call Google Gemini API if key is present; returns None on failure or missing key."""
    if not GEMINI_API_KEY:
        return None
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": f"System Context:\n{system_instruction}\n\nUser Request:\n{prompt}"}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 1500
            }
        }
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return text
    except Exception as e:
        print(f"Gemini API call failed: {e}")
    return None


# --- 1. AI Product Experience Intelligence ---
async def analyze_product_experience(
    feedback: str,
    product_name: str,
    brand: str = "Be Bodywise",
    category: str = "skincare",
    intended_concern: Optional[str] = None,
    duration_weeks: int = 3,
    frequency: str = "Daily"
) -> Dict[str, Any]:
    """
    Extracts outcomes, classifies experiences, and provides structured non-diagnostic report:
    1. What appears to be working
    2. What has not improved
    3. Possible explanations that need further investigation
    4. Questions the customer should consider
    5. Safe next steps based on product instructions
    """
    feedback_lower = feedback.lower()
    product_lower = product_name.lower()

    # Rule-based NLP extraction
    positive_patterns = [
        (r"(acne|breakout|bump|pimple|lesion).*?(reduced|improved|cleared|less|subsided|better)", "Reduced acne lesions & clearer surface"),
        (r"(reduced|improved|cleared|less|subsided).*?(acne|breakout|bump|pimple|lesion)", "Reduced acne lesions & clearer surface"),
        (r"(texture|roughness|skin).*?(smooth|softer|improved|better)", "Noticeably smoother skin texture"),
        (r"(smooth|softer).*?(texture|skin|feel)", "Noticeably smoother skin texture"),
        (r"(hair fall|shedding).*?(reduced|less|stopped|decreased)", "Reduced hair fall & minimized shedding"),
        (r"(baby hair|growth|density).*?(notice|sprout|increased|better)", "Follicle stimulation & baby hair sprouting"),
        (r"(dark spot|pigmentation|tan).*?(faded|lightened|reduced)", "Lightened surface pigmentation"),
        (r"(odor|sweat).*?(controlled|neutralized|less|fresh)", "Effective 24-hr odor control")
    ]
    
    negative_patterns = [
        (r"(dry|dryness|dehydrat|tight|tightness)", "Dryness & post-application tightness"),
        (r"(peel|peeling|flak|flaking)", "Surface peeling & flaky desquamation"),
        (r"(sting|stinging|burn|burning)", "Cutaneous stinging / burning"),
        (r"(red|redness|erythema)", "Erythema & mild barrier flush"),
        (r"(itch|itching|pruritus)", "Itching / skin irritation"),
        (r"(purge|purging|breakout)", "Transient active purging")
    ]

    extracted_positives = []
    extracted_negatives = []
    extracted_unwanted = []

    for pattern, label in positive_patterns:
        if re.search(pattern, feedback_lower):
            if label not in extracted_positives:
                extracted_positives.append(label)

    for pattern, label in negative_patterns:
        if re.search(pattern, feedback_lower):
            if any(k in label.lower() for k in ["stinging", "burning", "erythema", "flush"]):
                if label not in extracted_unwanted:
                    extracted_unwanted.append(label)
            else:
                if label not in extracted_negatives:
                    extracted_negatives.append(label)

    # Extract primary concern
    extracted_concern = intended_concern
    if not extracted_concern:
        for c in concern_indicators:
            if c in feedback_lower:
                extracted_concern = c.capitalize()
                break
        if not extracted_concern:
            extracted_concern = "Texture and skin clarity"

    # Default outcomes if empty from heuristic
    if not extracted_positives and not extracted_negatives:
        if "good" in feedback_lower or "great" in feedback_lower or "love" in feedback_lower:
            extracted_positives.append("General skin texture improvement")
        elif "bad" in feedback_lower or "waste" in feedback_lower:
            extracted_negatives.append("Lack of expected efficacy")
        else:
            extracted_positives.append("Progress recorded")

    if not extracted_positives and extracted_negatives:
        classification = "negative"
    elif extracted_positives and not extracted_negatives and not extracted_unwanted:
        classification = "positive"
    elif extracted_positives and (extracted_negatives or extracted_unwanted):
        classification = "mixed"
    else:
        classification = "neutral"

    # Structured dermatological report generation
    working_summary = ""
    not_improved_summary = ""
    explanations = []
    questions = []
    safe_next_steps = []

    # Heuristic clinical generation tailored to Be Bodywise formulations
    if "salicylic" in product_lower or "bha" in product_lower:
        working_summary = f"Active follicular penetration of Salicylic Acid appears to be addressing sebum impactions and {extracted_concern.lower()}, leading to observed improvements in surface bumps."
        if extracted_negatives or extracted_unwanted:
            not_improved_summary = f"Increased sensation of {', '.join(extracted_negatives + extracted_unwanted).lower() or 'dryness'} observed across the treated skin barrier."
            explanations = [
                "Salicylic Acid effectively dissolves lipophilic sebum within follicles, but rinse-off formulations or daily lathering can temporarily strip surface stratum corneum ceramides.",
                "Hot shower water paired with surfactant surfactants can amplify transepidermal water loss (TEWL) during bathing.",
                "Absence of an immediate humectant or emollient sealant within 3 minutes of drying may leave underlying epidermis vulnerable to dehydration."
            ]
            questions = [
                "Are you applying a hydrating ceramide, lactic acid, or urea lotion immediately while skin is slightly damp?",
                "Are you leaving the lather on your skin for more than 60-90 seconds before rinsing?",
                "Has shower water temperature been hotter than lukewarm during application?"
            ]
            safe_next_steps = [
                "Moderate application frequency: Reduce usage to 3 times per week on alternate days until skin tolerance stabilizes.",
                "Short-contact protocol: Limit contact time with the lather to 45 seconds before thoroughly rinsing with lukewarm water.",
                "Barrier restoration: Always follow application with a ceramide-rich, non-comedogenic body moisturizer.",
                "Temporary pause: If stinging persists for more than 48 hours, pause active use and focus on barrier replenishment."
            ]
        else:
            not_improved_summary = "No major adverse barriers or worsening reported."
            explanations = [
                "Consistent cellular desquamation is matching natural epidermal turnover rate.",
                "Lipophilic compatibility is functioning without disruptive surfactant barrier disruption."
            ]
            questions = [
                "Are you pairing this with adequate daily sun protection on sun-exposed treated areas?",
                "Has your skin acclimated comfortably for the current daily frequency?"
            ]
            safe_next_steps = [
                "Maintain consistent current application frequency as tolerated.",
                "Ensure daytime SPF 50 application on exposed skin treated with chemical exfoliants."
            ]

    elif "retinol" in product_lower or "retinoid" in product_lower:
        working_summary = f"Cellular turnover upregulation appears responsive for {extracted_concern.lower()}."
        not_improved_summary = f"Mild retinization symptoms ({', '.join(extracted_negatives + extracted_unwanted) or 'dryness and flaking'}) recorded during week {duration_weeks}."
        explanations = [
            "Retinization is a standard biological response during initial 4-6 weeks as epidermal differentiation accelerates.",
            "Potential friction with other concurrently layered acidic toners or physical scrubs.",
            "Compromised moisture barrier allowing rapid moisture evaporation."
        ]
        questions = [
            "Are you applying the retinol to completely dry skin rather than damp skin?",
            "Are you using the 'sandwich technique' (moisturizer -> retinol -> moisturizer)?",
            "Are you avoiding AHA/BHA exfoliants on the same evening?"
        ]
        safe_next_steps = [
            "Adopt the sandwich buffering method with a soothing ceramide moisturizer.",
            "Scale back frequency to 2 nights per week for 14 days, building tolerance gradually.",
            "Strictly avoid other direct acids or exfoliants on retinol application evenings.",
            "Ensure broad-spectrum SPF 50 is reapplied daily."
        ]

    elif "lactic" in product_lower or "urea" in product_lower:
        working_summary = f"Hydrating humectant and gentle desquamation benefits noted for {extracted_concern.lower()}."
        not_improved_summary = f"Reported sensations of {', '.join(extracted_negatives + extracted_unwanted) or 'mild tingling or dryness'} noted."
        explanations = [
            "Urea and Lactic acid function as physiological humectants but can produce transient tingling if applied to micro-fissured or compromised skin.",
            "Formulation pH may temporarily register on dry patches before optimal moisture equilibrium is established."
        ]
        questions = [
            "Is the lotion applied to freshly shaved or micro-abraded skin?",
            "Is skin dry before application, or is it sealed directly over damp skin?"
        ]
        safe_next_steps = [
            "Avoid applying immediately post-waxing, shaving, or on broken skin.",
            "Apply immediately following shower while skin retains ambient moisture.",
            "If dryness persists, alternate with a pure petrolatum/ceramide barrier balm."
        ]

    elif "hair" in product_lower or "scalp" in product_lower or "redensyl" in product_lower or "procapil" in product_lower:
        working_summary = f"Follicle targeted nourishment initiated for {extracted_concern.lower()}."
        not_improved_summary = f"Hair growth cycles require 90-120 days for visible terminal hair density; week {duration_weeks} reflects early active phase."
        explanations = [
            "Hair follicle anagen reactivation operates on biological 90-180 day hair cycles; transient early shedding (shedding of telogen club hairs) can occasionally precede new growth.",
            "Scalp sebum balance or residual build-up can alter follicular absorption rate."
        ]
        questions = [
            "Are you applying the dropper solution directly to the scalp rather than the hair strands?",
            "Are you massaging gently with fingertips without vigorous friction?",
            "Are you maintaining continuous daily consistency without skipped weeks?"
        ]
        safe_next_steps = [
            "Continue daily evening application directly to dry, parted scalp sections.",
            "Do not wash hair immediately after application; allow a minimum 4-6 hour leave-in absorption window.",
            "Pair with a gentle sulfate-free clarifying shampoo 1-2 times weekly to prevent follicle congestion."
        ]

    else:
        working_summary = f"Product active components are engaging with target skin pathways for {extracted_concern.lower()}."
        not_improved_summary = f"Observed response shows mixed indicators ({', '.join(extracted_negatives + extracted_unwanted) or 'tolerance adjustment'})."
        explanations = [
            "Formulation active concentration requires skin barrier acclimatization over a standard 28-day turnover cycle.",
            "Potential interaction with other products in the daily routine or environmental ambient humidity."
        ]
        questions = [
            "How soon after application are other serums or moisturizers layered?",
            "Are manufacturer instructions for application frequency being strictly observed?"
        ]
        safe_next_steps = [
            "Patch test on inner forearm if unusual sensitivity or redness arises.",
            "Ensure a basic 3-step routine (Gentle Cleanse, Active Treatment, Barrier Seal + AM Sunscreen) is maintained.",
            "Log weekly updates to monitor barrier adaptation."
        ]

    # Attempt Gemini API enhancement if available
    llm_prompt = f"""
    Analyze this customer product feedback for skincare/haircare intelligence:
    Product: {product_name} ({brand})
    Category: {category}
    Intended Concern: {intended_concern or extracted_concern}
    Duration Used: {duration_weeks} weeks ({frequency})
    User Feedback: "{feedback}"

    Return a valid JSON object only with these exact keys:
    {{
      "primary_concern": "{extracted_concern}",
      "positive_outcomes": {json.dumps(extracted_positives)},
      "negative_outcomes": {json.dumps(extracted_negatives)},
      "unwanted_reactions": {json.dumps(extracted_unwanted)},
      "classification": "{classification}",
      "ai_working_summary": "1-2 sentences on what appears to be working based on ingredient science",
      "ai_not_improved_summary": "1-2 sentences on what has not improved or requires attention",
      "ai_explanations": ["explanation 1", "explanation 2", "explanation 3"],
      "ai_questions": ["question 1", "question 2", "question 3"],
      "ai_safe_next_steps": ["step 1", "step 2", "step 3"]
    }}
    IMPORTANT: Do NOT make medical diagnoses or claim a product caused a reaction with certainty. Use cautious, evidence-based language ('Observations suggest', 'Possible explanations include').
    """
    
    llm_result = await call_llm(llm_prompt, "You are an expert dermatological formulation analyst for SkinSense Be Bodywise.")
    if llm_result:
        try:
            # clean json markdown formatting if present
            cleaned = re.sub(r"^```json\s*", "", llm_result.strip(), flags=re.MULTILINE)
            cleaned = re.sub(r"```$", "", cleaned.strip(), flags=re.MULTILINE)
            data = json.loads(cleaned)
            return data
        except Exception:
            pass

    return {
        "primary_concern": extracted_concern,
        "positive_outcomes": extracted_positives,
        "negative_outcomes": extracted_negatives,
        "unwanted_reactions": extracted_unwanted,
        "classification": classification,
        "ai_working_summary": working_summary,
        "ai_not_improved_summary": not_improved_summary,
        "ai_explanations": explanations,
        "ai_questions": questions,
        "ai_safe_next_steps": safe_next_steps
    }


# --- 2. AI Routine Conflict & Compatibility Checker ---
def evaluate_routine_conflicts(products: List[Dict[str, Any]], category: str = "skincare") -> Dict[str, Any]:
    """
    Comprehensive multi-product routine analysis:
    - Repeated active ingredients
    - Potentially irritating combinations (e.g. Retinol + BHA/AHA, Vit C + Retinol)
    - Excessive exfoliation risks
    - Duplicate products
    - Missing routine steps (e.g. Sunscreen, Cleanser, Barrier Moisturizer)
    - Routine Score breakdown (Duplication, Overlap, Complexity, Precautions, Missing Info)
    - Structured AM and PM schedules with application orders, frequencies, alternate-day recommendations.
    """
    conflicts: List[Dict[str, Any]] = []
    missing_steps: List[Dict[str, str]] = []

    # Flatten active ingredients and product types
    active_pool: Dict[str, List[str]] = {}
    product_names = [p.get("name", "") for p in products]
    all_actives = []
    has_sunscreen = False
    has_cleanser = False
    has_moisturizer = False
    has_retinoid = False
    has_strong_acid = False
    acid_products = []
    retinoid_products = []
    niacinamide_products = []
    vit_c_products = []

    for p in products:
        p_name = p.get("name", "")
        p_name_l = p_name.lower()
        subcat = (p.get("subcategory") or "").lower()
        desc = (p.get("description") or "").lower()
        full_ing = (p.get("full_ingredients") or "").lower()

        # Check core steps
        if "sunscreen" in p_name_l or "spf" in p_name_l or "sun" in subcat:
            has_sunscreen = True
        if "wash" in p_name_l or "cleanser" in p_name_l or "cleanser" in subcat:
            has_cleanser = True
        if "moisturizer" in p_name_l or "lotion" in p_name_l or "cream" in p_name_l:
            has_moisturizer = True

        # Extract actives from product struct or keywords
        p_actives = p.get("active_ingredients", [])
        active_names = []
        if isinstance(p_actives, list):
            for a in p_actives:
                if isinstance(a, dict) and "name" in a:
                    active_names.append(a["name"].lower())
                elif isinstance(a, str):
                    active_names.append(a.lower())

        # Fallback keyword extraction from product name/description
        for k in INGREDIENT_KNOWLEDGE_BASE.keys():
            if k in p_name_l or k in desc or k in full_ing:
                if k not in active_names:
                    active_names.append(k)

        for act in active_names:
            all_actives.append((act, p_name))
            if act not in active_pool:
                active_pool[act] = []
            active_pool[act].append(p_name)

            if "retinol" in act or "retinoid" in act or "tretinoin" in act:
                has_retinoid = True
                retinoid_products.append(p_name)
            if "salicylic" in act or "glycolic" in act or "lactic" in act or "mandelic" in act or "bha" in act or "aha" in act:
                has_strong_acid = True
                acid_products.append(p_name)
            if "niacinamide" in act:
                niacinamide_products.append(p_name)
            if "vitamin c" in act or "ascorbic" in act:
                vit_c_products.append(p_name)

    # 1. Check Repeated Active Ingredients
    for act, prods in active_pool.items():
        if len(prods) > 1 and act in ["salicylic acid", "glycolic acid", "lactic acid", "retinol", "benzoyl peroxide"]:
            conflicts.append({
                "id": f"repeat-{act.replace(' ', '-')}",
                "title": f"Cumulative {act.capitalize()} Overlap Detected",
                "risk_level": "moderate",
                "ingredients": [act.capitalize()],
                "products_involved": prods,
                "why": f"Multiple products in your daily routine contain {act.capitalize()}. Layering identical exfoliating or active agents multiplies the cumulative dermal exposure, substantially raising the likelihood of micro-tears, barrier disruption, and dryness.",
                "missing_info": "Exact concentration percentages across both formulations and individual epidermal barrier resilience.",
                "safe_alternatives": [
                    f"Use {prods[0]} on specified days, and preserve {prods[1]} for alternate evenings.",
                    "If one product is a rinse-off cleanser and the other is a leave-on serum, avoid leave-on application on days when cleansing lather is left on for >60s.",
                    "Alternate with a calming ceramide moisturizer."
                ]
            })

    # 2. Check Irritating Combinations: Retinol + Strong Acids (AHA/BHA)
    if retinoid_products and acid_products:
        conflicts.append({
            "id": "conflict-retinol-acids",
            "title": "Concurrent Retinoid + Chemical Exfoliant Layering",
            "risk_level": "high",
            "ingredients": ["Retinol / Retinoid", "AHA / BHA Chemical Acids"],
            "products_involved": list(set(retinoid_products + acid_products)),
            "why": "Both Retinoids and Direct Hydroxy Acids stimulate cellular turnover through distinct biological mechanisms. Layering them in the same application window risks destabilizing the skin's lipid matrix, inducing retinoid dermatitis, erythema, and barrier compromise.",
            "missing_info": "Whether your skin has undergone full retinization (>12 weeks continuous use) and whether buffered application is practiced.",
            "safe_alternatives": [
                "Implement Skin Cycling: Evening 1 Exfoliant (AHA/BHA), Evening 2 Retinol, Evenings 3 & 4 Barrier Recovery (Ceramides & Peptides).",
                "Split usage across day/night: Use mild AHA/BHA in the morning (strictly followed by SPF 50) and reserve Retinol exclusively for the evening.",
                "Buffer the retinoid between light layers of moisturizer (the Sandwich Method)."
            ]
        })

    # 3. Check Vitamin C + Retinol concurrent layering
    if vit_c_products and retinoid_products:
        conflicts.append({
            "id": "conflict-vitc-retinol",
            "title": "Vitamin C and Retinol Concurrent Application",
            "risk_level": "caution",
            "ingredients": ["Pure Vitamin C (L-Ascorbic Acid)", "Retinol"],
            "products_involved": list(set(vit_c_products + retinoid_products)),
            "why": "L-Ascorbic Acid requires an acidic pH environment (<3.5) for optimal follicular bioavailability, whereas Retinol operates most effectively at a neutral physiological pH (5.5 - 6.5). Applying both simultaneously can compromise stability and provoke cutaneous flushing.",
            "missing_info": "Specific derivative form of Vitamin C (e.g. Sodium Ascorbyl Phosphate or Ethyl Ascorbic Acid are more pH-versatile than pure L-Ascorbic Acid).",
            "safe_alternatives": [
                "Shift Vitamin C exclusively to the AM routine to synergize with sunscreen against UV free radicals.",
                "Reserve Retinol strictly for the PM routine to support overnight repair pathways."
            ]
        })

    # 4. Check Missing Steps
    if category == "skincare":
        if (has_strong_acid or has_retinoid) and not has_sunscreen:
            missing_steps.append({
                "step": "Daily Sun Protection (SPF 50 PA++++)",
                "reason": "Exfoliating acids and Retinoids accelerate stratum corneum thinning, increasing photosensitivity and vulnerability to UV-induced erythema and hyperpigmentation."
            })
            conflicts.append({
                "id": "missing-spf",
                "title": "Photosensitizing Actives Without Daily Sun Protection",
                "risk_level": "high",
                "ingredients": ["Photosensitizing Actives (AHA / BHA / Retinoids)"],
                "products_involved": list(set(retinoid_products + acid_products)),
                "why": "Chemical exfoliants and retinoids accelerate stratum corneum renewal, elevating photosensitivity. Omitting daily broad-spectrum sunscreen can lead to paradoxical post-inflammatory hyperpigmentation and accelerated photoaging.",
                "missing_info": "Whether you are utilizing an unlisted standalone sunscreen throughout daytime hours.",
                "safe_alternatives": [
                    "Integrate a broad-spectrum SPF 50 PA++++ mineral or hybrid sunscreen as the final step in every AM routine.",
                    "Reapply every 2-3 hours during direct outdoor exposure."
                ]
            })

        if (has_strong_acid or has_retinoid) and not has_moisturizer:
            missing_steps.append({
                "step": "Barrier Repair Moisturizer (Ceramides / Squalane / Urea)",
                "reason": "Potent chemical actives require physiological lipids to prevent transepidermal water loss and protect the intercellular moisture barrier."
            })

    # 5. Calculate Transparent Routine Score (0 to 100)
    # Starts at 98. Deductions based on transparent rubric:
    # - High conflict: -15 each
    # - Moderate conflict: -8 each
    # - Caution conflict: -5 each
    # - Missing SPF with actives: -12
    # - Complexity overload (>5 active products): -6
    score = 96
    duplication_penalty = 0
    overlap_penalty = 0
    complexity_penalty = 0
    precaution_penalty = 0
    missing_info_penalty = 0

    for c in conflicts:
        if c["risk_level"] == "high":
            precaution_penalty += 12
            score -= 12
        elif c["risk_level"] == "moderate":
            overlap_penalty += 8
            score -= 8
        elif c["risk_level"] == "caution":
            duplication_penalty += 5
            score -= 5

    if len(products) > 6:
        complexity_penalty += 6
        score -= 6
    elif len(products) < 2:
        missing_info_penalty += 5
        score -= 5

    score = max(35, min(98, score))

    score_breakdown = {
        "duplication_balance": max(60, 100 - duplication_penalty * 3),
        "ingredient_compatibility": max(45, 100 - precaution_penalty * 2),
        "application_flow": max(50, 100 - complexity_penalty * 4),
        "barrier_safety": max(40, 100 - (precaution_penalty + overlap_penalty)),
        "completeness": 95 if has_sunscreen and has_moisturizer else 65
    }

    # 6. Generate Structured AM & PM Routine Schedules
    structured_am: List[Dict[str, Any]] = []
    structured_pm: List[Dict[str, Any]] = []

    # Filter products for AM / PM
    step_am = 1
    step_pm = 1

    # Sorting helper: Cleanse -> Tone -> Water-based Serums -> Lotions/Creams -> SPF
    def get_order_weight(prod):
        p_name = prod.get("name", "").lower()
        subcat = (prod.get("subcategory") or "").lower()
        if "wash" in p_name or "cleanser" in p_name: return 1
        if "toner" in p_name: return 2
        if "serum" in p_name or "roll-on" in p_name: return 3
        if "moisturizer" in p_name or "cream" in p_name or "lotion" in p_name: return 4
        if "sunscreen" in p_name or "spf" in p_name: return 5
        return 3

    sorted_products = sorted(products, key=get_order_weight)

    for p in sorted_products:
        rec_time = p.get("recommended_time", "BOTH").upper()
        p_name = p.get("name", "")
        p_name_l = p_name.lower()
        brand_name = p.get("brand", "Be Bodywise")
        freq = p.get("frequency", "Daily")
        pid = p.get("id")

        is_retinoid = "retinol" in p_name_l or "retinoid" in p_name_l
        is_exfoliant = "salicylic" in p_name_l or "glycolic" in p_name_l or "lactic" in p_name_l
        is_spf = "sunscreen" in p_name_l or "spf" in p_name_l

        # AM Routine inclusion
        if not is_retinoid and rec_time in ["AM", "BOTH"] and ("hair" not in p.get("category", "") or "am" in p_name_l):
            structured_am.append({
                "step_number": step_am,
                "step_name": f"Step {step_am}: {p.get('subcategory') or 'Application'}",
                "product_name": p_name,
                "brand": brand_name,
                "product_id": pid,
                "recommended_frequency": "Every Morning" if not is_exfoliant else "2-3x per week",
                "application_order_reason": "Applied from lowest viscosity to highest viscosity for maximum dermal permeability.",
                "precautions": "Follow with broad-spectrum SPF 50; do not rub vigorously." if is_exfoliant else "Pat gently onto clean skin.",
                "attention_ingredients": [a["name"] if isinstance(a, dict) else str(a) for a in p.get("active_ingredients", [])][:2],
                "alternate_day_note": "If using potent actives, limit AM exfoliation to alternate mornings." if is_exfoliant else None
            })
            step_am += 1

        # PM Routine inclusion
        if not is_spf and rec_time in ["PM", "BOTH"]:
            alt_note = None
            if is_retinoid and acid_products:
                alt_note = "Alternate Nights: Use Retinoid on Night 1; alternate with Exfoliant on Night 2. Rest on Night 3."
            elif is_exfoliant and retinoid_products:
                alt_note = "Do not apply on the same night as Retinol. Cycle onto alternate evenings."

            structured_pm.append({
                "step_number": step_pm,
                "step_name": f"Step {step_pm}: {p.get('subcategory') or 'Application'}",
                "product_name": p_name,
                "brand": brand_name,
                "product_id": pid,
                "recommended_frequency": "2-3x per week initially" if (is_retinoid or is_exfoliant) else "Every Evening",
                "application_order_reason": "Nighttime application leverages circadian cellular repair and avoids UV photodegradation.",
                "precautions": "Avoid direct eye orbit and mucous membranes. Follow with a lipid barrier cream." if is_retinoid else "Apply to dry skin.",
                "attention_ingredients": [a["name"] if isinstance(a, dict) else str(a) for a in p.get("active_ingredients", [])][:2],
                "alternate_day_note": alt_note
            })
            step_pm += 1

    # Ensure AM has sunscreen recommendation if missing
    if not has_sunscreen and category == "skincare":
        structured_am.append({
            "step_number": step_am,
            "step_name": f"Step {step_am}: Photoprotection (Recommended)",
            "product_name": "Broad-Spectrum Mineral/Hybrid SPF 50 PA++++",
            "brand": "Be Bodywise",
            "product_id": None,
            "recommended_frequency": "Every morning, reapply every 2-3 hours",
            "application_order_reason": "Final protective shield preventing active-induced photosensitivity and collagen breakdown.",
            "precautions": "Apply 2 finger-lengths to face, neck, and exposed chest.",
            "attention_ingredients": ["Zinc Oxide", "UV Filters", "Niacinamide"],
            "alternate_day_note": "Essential every single day without exception when using active skincare."
        })

    disclaimer = (
        "SkinSense Routine Intelligence Disclaimer: This analysis evaluates formulation compatibility, active ingredient layering, "
        "and published manufacturer guidelines. It does not constitute medical diagnosis or individual clinical dermatological advice. "
        "Formulation tolerance varies by skin barrier health. Always patch-test new products."
    )

    return {
        "routine_category": category,
        "overall_score": score,
        "score_breakdown": score_breakdown,
        "identified_conflicts": conflicts,
        "structured_am_routine": structured_am,
        "structured_pm_routine": structured_pm,
        "missing_steps": missing_steps,
        "disclaimer": disclaimer
    }


# --- 3. OCR & Ingredient Label Extraction ---
def extract_ingredients_from_text(raw_text: str) -> Dict[str, Any]:
    """
    Intelligent OCR cosmetic label ingredient extraction:
    Extracts active ingredients, categorizes them, detects potential irritants (drying alcohols, artificial fragrances).
    """
    cleaned = raw_text.replace("\n", " ").replace(";", ",")
    tokens = [t.strip().strip(".") for t in re.split(r",|•|\|", cleaned) if len(t.strip()) > 1]

    recognized_actives = []
    potential_sensitizers = []
    active_compounds = []

    sensitizer_patterns = ["fragrance", "parfum", "denatured alcohol", "alcohol denat", "essential oil", "limonene", "linalool", "menthol"]

    for token in tokens:
        token_lower = token.lower()
        for sens in sensitizer_patterns:
            if sens in token_lower and token not in potential_sensitizers:
                potential_sensitizers.append(token)

        for kb_item, details in INGREDIENT_KNOWLEDGE_BASE.items():
            if kb_item in token_lower:
                if kb_item not in recognized_actives:
                    recognized_actives.append(kb_item.capitalize())
                    active_compounds.append({
                        "name": kb_item.capitalize(),
                        "classification": details["class"],
                        "purpose": details["action"],
                        "optimal_timing": details["am_or_pm"]
                    })

    cleanliness_score = max(50, 100 - len(potential_sensitizers) * 15)

    return {
        "detected_text": raw_text.strip(),
        "identified_ingredients": [t for t in tokens if len(t) < 50][:25],
        "active_compounds": active_compounds,
        "potential_sensitizers": potential_sensitizers,
        "cleanliness_score": cleanliness_score
    }


# --- 4. Review Intelligence Aspect NLP Classification ---
def classify_review_aspects(review_text: str, rating: float) -> Dict[str, Any]:
    """
    NLP aspect classification:
    Effectiveness, Irritation, Dryness, Pigmentation, Acne, Hair fall, Texture, Fragrance, Absorption, Long-term results.
    """
    text_lower = review_text.lower()
    aspects = []

    if any(k in text_lower for k in ["work", "result", "effective", "helped", "cleared", "improvement", "waste"]):
        aspects.append("effectiveness")
    if any(k in text_lower for k in ["sting", "burn", "red", "itch", "irritat", "sensitive"]):
        aspects.append("irritation")
    if any(k in text_lower for k in ["dry", "flak", "peel", "dehydrat", "moistur"]):
        aspects.append("dryness")
    if any(k in text_lower for k in ["dark spot", "pigment", "tan", "blemish", "glow"]):
        aspects.append("pigmentation")
    if any(k in text_lower for k in ["acne", "pimple", "breakout", "blackhead", "pore"]):
        aspects.append("acne")
    if any(k in text_lower for k in ["hair fall", "shedding", "density", "hair growth", "scalp"]):
        aspects.append("hair fall")
    if any(k in text_lower for k in ["texture", "smooth", "soft", "rough", "bumpy"]):
        aspects.append("texture")
    if any(k in text_lower for k in ["smell", "scent", "fragrance", "perfume"]):
        aspects.append("fragrance")
    if any(k in text_lower for k in ["absorb", "sticky", "greasy", "lightweight", "heavy"]):
        aspects.append("absorption")
    if any(k in text_lower for k in ["month", "weeks", "long term", "bottle", "repurchase"]):
        aspects.append("long-term results")

    if not aspects:
        aspects = ["effectiveness", "texture"]

    if rating >= 4.0:
        sentiment = "positive"
    elif rating <= 2.5:
        sentiment = "negative"
    else:
        sentiment = "mixed"

    return {
        "sentiment": sentiment,
        "aspect_tags": aspects
    }


# --- 5. AI Assistant Context Synthesizer ---
async def generate_assistant_response(
    query: str,
    user_profile: Dict[str, Any],
    user_products: List[Dict[str, Any]],
    experiences: List[Dict[str, Any]],
    routine_analysis: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Context-aware AI Product Assistant:
    Answers user queries citing saved products, ingredients, official instructions, and routine conflicts.
    Avoids medical diagnosis and maintains evidence-based dermatological rigor.
    """
    q_lower = query.lower()
    citations = []

    # Identify relevant products from user's routine
    matched_products = []
    for up in user_products:
        p = up.get("product", {})
        p_name = p.get("name", "")
        if p_name.lower() in q_lower or any(a.get("name", "").lower() in q_lower for a in p.get("active_ingredients", [])):
            matched_products.append(p)
            citations.append({
                "source": f"Product: {p_name} ({p.get('brand', 'Be Bodywise')})",
                "details": f"Actives: {', '.join([a.get('name', '') for a in p.get('active_ingredients', [])])}. Instructions: {p.get('instructions', 'Apply as directed')}."
            })

    # Prepare context string
    routine_summary = ", ".join([up.get("product", {}).get("name", "Unknown") for up in user_products])
    skin_info = f"Skin Type: {user_profile.get('skin_type', 'Combination')}, Concerns: {', '.join(user_profile.get('skin_concerns', []))}"
    hair_info = f"Hair Type: {user_profile.get('hair_type', 'Medium')}, Scalp: {user_profile.get('scalp_type', 'Normal')}"

    # LLM Prompt
    llm_prompt = f"""
    User Query: "{query}"

    User Context:
    - {skin_info}
    - {hair_info}
    - Currently Used Products: {routine_summary or 'No products saved yet'}
    - Recent Experience Feedback: {json.dumps([e.get('natural_language_feedback') for e in experiences[-2:]]) if experiences else 'None'}
    - Active Routine Score: {routine_analysis.get('overall_score', 85) if routine_analysis else 85}/100

    Provide an evidence-based, empathetic explanation.
    Address:
    1. Direct answer citing specific ingredients in their routine.
    2. Physiological explanation (e.g. skin barrier, active concentrations, application frequency).
    3. Actionable adjustments based on official instructions (e.g. alternate day cycling, sandwich buffering).

    Important guidelines:
    - Do NOT state medical diagnoses (e.g. don't diagnose eczema or dermatitis).
    - Use phrases like 'Based on formulation pharmacology...', 'Observations indicate...'.
    - Keep tone premium, calm, and trustworthy.
    """

    llm_answer = await call_llm(llm_prompt, "You are SkinSense Be Bodywise Senior Product Intelligence Specialist.")
    
    if llm_answer:
        response_text = llm_answer
    else:
        # High quality fallback generation
        if "dry" in q_lower:
            response_text = (
                "Based on your current routine, dryness frequently emerges when chemical exfoliants (such as Salicylic Acid or Lactic Acid) "
                "or Retinoids accelerate stratum corneum turnover faster than intercellular lipids (ceramides, cholesterol, fatty acids) can replenish. "
                "In rinse-off washes or leave-on serums, surfactants and BHAs dissolve sebum inside the pores, which clears acne but temporarily leaves "
                "the epidermal barrier thirsty for moisture.\n\n"
                "Recommended adjustment:\n"
                "1. Moderate usage frequency to alternate days (3 evenings per week).\n"
                "2. Seal in moisture with a ceramide-rich cream within 3 minutes of washing while skin is still slightly damp.\n"
                "3. Ensure water temperature in the shower is lukewarm rather than hot."
            )
            citations.append({
                "source": "SkinSense Barrier Physiology Reference",
                "details": "Transepidermal Water Loss (TEWL) post-keratolytic application."
            })
        elif "too many" in q_lower or "exfoliat" in q_lower or "conflict" in q_lower:
            response_text = (
                "Reviewing your active products, multiple exfoliating active pathways were detected. "
                "When you layer multiple chemical exfoliants (e.g. BHA body wash paired with an AHA toner or Retinoid), "
                "the cumulative desquamation rate can overwhelm your skin's acid mantle.\n\n"
                "We recommend adopting 'Skin Cycling':\n"
                "• Night 1: Exfoliate (AHA or BHA product)\n"
                "• Night 2: Retinoid or Treatment Serum\n"
                "• Nights 3 & 4: Recovery (Hydration, Ceramides, Squalane)\n\n"
                "This allows targeted efficacy without compounding barrier stress."
            )
            citations.append({
                "source": "Routine Compatibility Engine",
                "details": "Multi-acid accumulation safety threshold guidelines."
            })
        elif "hair" in q_lower or "scalp" in q_lower or "growth" in q_lower:
            response_text = (
                "For targeted hair and scalp formulations (e.g. Redensyl, Procapil, or Anagain serums), consistency across 90 to 120 days is essential. "
                "Follicular stem cells operate on biological hair cycles; early shedding during weeks 2 to 4 is often normal as miniaturized telogen hairs "
                "give way to emerging anagen growth.\n\n"
                "Application best practice:\n"
                "• Apply directly to clean, dry scalp sections with the dropper.\n"
                "• Massage lightly with pads of fingertips; avoid vigorous friction.\n"
                "• Leave on overnight or for at least 4-6 hours without washing."
            )
            citations.append({
                "source": "Be Bodywise Haircare Clinical Protocol",
                "details": "Redensyl + Procapil anagen phase activation guidelines."
            })
        else:
            response_text = (
                f"Analyzing your profile and saved routine ({routine_summary or 'your active products'}), "
                "every active ingredient performs best when supported by balanced moisture and calibrated frequency. "
                "To optimize results and prevent unwanted friction, introduce new active serums one at a time over a 2-week window, "
                "and never skip daytime broad-spectrum SPF 50 when using cell-renewing actives."
            )
            citations.append({
                "source": "SkinSense Intelligence Knowledge Base",
                "details": "General product layering and epidermal acclimatization."
            })

    followups = [
        "Why does my skin feel dry after using these products?",
        "Am I using too many exfoliating ingredients?",
        "Which products in my routine have overlapping active ingredients?",
        "What should I check before adding another product?"
    ]

    return {
        "response": response_text,
        "citations": citations,
        "suggested_followups": [f for f in followups if f.lower() not in q_lower][:3],
        "non_diagnostic_notice": "SkinSense provides ingredient pharmacology and routine compatibility insights. It does not provide medical diagnoses or replace consultations with certified dermatologists or trichologists."
    }
