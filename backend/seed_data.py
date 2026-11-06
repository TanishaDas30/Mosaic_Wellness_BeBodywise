import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import engine, SessionLocal, Base
import models
from auth import get_password_hash

def seed_database(db: Session):
    # Check if already seeded
    if db.query(models.User).filter(models.User.email == "demo@skinsense.ai").first():
        print("Database already seeded.")
        return

    print("Seeding initial demonstration data for SkinSense by Be Bodywise...")

    # 1. Create Default Users
    demo_user = models.User(
        email="demo@skinsense.ai",
        hashed_password=get_password_hash("demo1234"),
        full_name="Ananya Sharma",
        role="user",
        skin_type="Combination / Acne-Prone",
        skin_concerns=json.dumps(["Body Acne", "Uneven Texture", "Dehydration"]),
        hair_type="Wavy / Medium Density",
        scalp_type="Oily Scalp",
        hair_concerns=json.dumps(["Hair Fall", "Delayed Follicle Growth"]),
        created_at=datetime.utcnow() - timedelta(days=35)
    )

    admin_user = models.User(
        email="admin@skinsense.ai",
        hashed_password=get_password_hash("admin1234"),
        full_name="Dr. Ritu Verma (Product Formulation Lead)",
        role="admin",
        skin_type="Normal",
        skin_concerns=json.dumps(["Barrier Maintenance"]),
        hair_type="Straight",
        scalp_type="Balanced",
        hair_concerns=json.dumps(["Maintenance"]),
        created_at=datetime.utcnow() - timedelta(days=60)
    )

    db.add(demo_user)
    db.add(admin_user)
    db.commit()
    db.refresh(demo_user)
    db.refresh(admin_user)

    # 2. Create Products (Be Bodywise Range)
    products_data = [
        {
            "name": "1% Salicylic Acid Body Wash",
            "brand": "Be Bodywise",
            "category": "bodycare",
            "subcategory": "Body Cleanser",
            "description": "Non-drying body wash formulated with 1% Salicylic Acid to gently cleanse sebum-rich pores and clear backne and bumpy strawberry skin.",
            "active_ingredients": json.dumps([
                {"name": "Salicylic Acid", "percentage": "1%", "purpose": "BHA pore-penetrating exfoliant"},
                {"name": "Chamomile Extract", "percentage": "0.5%", "purpose": "Soothing anti-irritant"}
            ]),
            "full_ingredients": "Aqua, Sodium Lauroyl Sarcosinate, Cocamidopropyl Betaine, Salicylic Acid, Glycerin, Chamomilla Recutita (Matricaria) Flower Extract, Betaine, Sodium Benzoate, Phenoxyethanol, Disodium EDTA.",
            "instructions": "Lather over wet body in the shower. Leave in contact for 45-60 seconds on acne-prone zones before rinsing thoroughly. Follow immediately with a hydrating body lotion.",
            "precautions": "Avoid open cuts or micro-abrasions. Use 3-4 times a week initially. Reduce frequency if dryness emerges.",
            "pH_level": "5.5",
            "recommended_time": "BOTH",
            "frequency": "Daily or Alternate Days",
            "is_verified": True,
            "image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"
        },
        {
            "name": "10% Lactic Acid Body Lotion",
            "brand": "Be Bodywise",
            "category": "bodycare",
            "subcategory": "Body Exfoliant Lotion",
            "description": "Exfoliating and deeply hydrating lotion with 10% Lactic Acid (AHA) and Niacinamide to smoothen keratosis pilaris and rough elbows/knees.",
            "active_ingredients": json.dumps([
                {"name": "Lactic Acid", "percentage": "10%", "purpose": "Gentle AHA exfoliant & natural humectant"},
                {"name": "Niacinamide", "percentage": "2%", "purpose": "Evens skin tone & reinforces lipid barrier"},
                {"name": "Shea Butter", "percentage": "3%", "purpose": "Emollient lipid sealant"}
            ]),
            "full_ingredients": "Aqua, Lactic Acid, Glycerin, Caprylic/Capric Triglyceride, Butyrospermum Parkii (Shea) Butter, Niacinamide, Cetearyl Alcohol, Ceteareth-20, Sodium Hydroxide, Tocopheryl Acetate, Ethylhexylglycerin.",
            "instructions": "Apply once daily in the evening onto clean, slightly damp body skin. Massage until completely absorbed.",
            "precautions": "Contains an Alpha Hydroxy Acid (AHA) that may increase photosensitivity. Apply sunscreen to sun-exposed treated areas. Do not apply immediately after shaving.",
            "pH_level": "3.8 - 4.2",
            "recommended_time": "PM",
            "frequency": "Daily in PM",
            "is_verified": True,
            "image_url": "https://images.unsplash.com/photo-1608248597359-54876b5c00b3?auto=format&fit=crop&w=600&q=80"
        },
        {
            "name": "10% Urea Deep Repair Body Lotion",
            "brand": "Be Bodywise",
            "category": "bodycare",
            "subcategory": "Repair Cream",
            "description": "Intense barrier repair cream infused with 10% Pharmaceutical Grade Urea, Ceramides, and Allantoin for severe flaking and chronically rough texture.",
            "active_ingredients": json.dumps([
                {"name": "Urea", "percentage": "10%", "purpose": "Natural Moisturizing Factor (NMF) humectant"},
                {"name": "Ceramide NP", "percentage": "1%", "purpose": "Restores intercellular lipid bilayers"},
                {"name": "Allantoin", "percentage": "0.5%", "purpose": "Skin protectant and anti-irritant"}
            ]),
            "full_ingredients": "Aqua, Urea, Glycerin, Cetearyl Ethylhexanoate, Isopropyl Isostearate, Ceramide NP, Ceramide AP, Phytosphingosine, Allantoin, Carbomer, Phenoxyethanol.",
            "instructions": "Massage a coin-sized portion onto dry and rough patches morning and evening. Can be layered over exfoliants after 10 minutes.",
            "precautions": "May produce brief mild tingling if applied on cracked or inflamed fissures.",
            "pH_level": "5.5",
            "recommended_time": "BOTH",
            "frequency": "Twice daily",
            "is_verified": True,
            "image_url": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80"
        },
        {
            "name": "5% Niacinamide Body Lotion",
            "brand": "Be Bodywise",
            "category": "bodycare",
            "subcategory": "Tone Balancing Lotion",
            "description": "Daily brightening and barrier replenishing body lotion with 5% pure Niacinamide and soothing Aloe Vera juice to calm sun damage and marks.",
            "active_ingredients": json.dumps([
                {"name": "Niacinamide", "percentage": "5%", "purpose": "Cell-energizing Vitamin B3, fades blemishes"},
                {"name": "Aloe Barbadensis Leaf Juice", "percentage": "10%", "purpose": "Hydration and anti-inflammatory"},
                {"name": "Squalane", "percentage": "2%", "purpose": "Biocompatible lightweight lipid"}
            ]),
            "full_ingredients": "Aqua, Aloe Barbadensis Leaf Juice, Niacinamide, Glycerin, Squalane, Glyceryl Stearate, C12-15 Alkyl Benzoate, Sodium Hyaluronate, Polyacrylate Crosspolymer-6, Phenoxyethanol.",
            "instructions": "Apply liberally all over the body every morning after showering.",
            "precautions": "Suitable for all skin types. Hypoallergenic and fragrance-free.",
            "pH_level": "6.0",
            "recommended_time": "AM",
            "frequency": "Daily in AM",
            "is_verified": True,
            "image_url": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80"
        },
        {
            "name": "3% Redensyl + 3% Procapil Hair Growth Serum",
            "brand": "Be Bodywise",
            "category": "haircare",
            "subcategory": "Scalp Treatment Serum",
            "description": "Clinically researched hair growth concentrate targeting hair follicle miniaturization, activating anagen hair phase, and reducing excessive shedding.",
            "active_ingredients": json.dumps([
                {"name": "Redensyl", "percentage": "3%", "purpose": "Reactivates dormant stem cells (ORSc)"},
                {"name": "Procapil", "percentage": "3%", "purpose": "DHT blocker and microcirculation enhancer"},
                {"name": "Saw Palmetto Extract", "percentage": "2%", "purpose": "Natural 5-alpha-reductase inhibitor"}
            ]),
            "full_ingredients": "Aqua, Propanediol, Butylene Glycol, Glycerin, Larix Europaea Wood Extract, Glycine, Zinc Chloride, Camellia Sinensis Leaf Extract, Apigenin, Oleanolic Acid, Biotinoyl Tripeptide-1, Serenoa Serrulata (Saw Palmetto) Fruit Extract, Phenoxyethanol.",
            "instructions": "Apply 1-2 ml directly onto clean, dry scalp using the dropper daily before bed. Gently massage with fingertips. Do not wash off for at least 4-6 hours.",
            "precautions": "For topical scalp use only. Do not apply onto broken, inflamed scalp. Consistent use for 90-120 days is advised.",
            "pH_level": "5.5",
            "recommended_time": "PM",
            "frequency": "Daily at Night",
            "is_verified": True,
            "image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
        },
        {
            "name": "4% AHA Underarm Roll-On (Fragrance Free)",
            "brand": "Be Bodywise",
            "category": "bodycare",
            "subcategory": "Underarm Care",
            "description": "Lactic and Mandelic acid roll-on that balances underarm microbiome pH to neutralize odor-causing bacteria while gently exfoliating pigmentation.",
            "active_ingredients": json.dumps([
                {"name": "Lactic Acid", "percentage": "2.5%", "purpose": "Gentle desquamation of surface darkness"},
                {"name": "Mandelic Acid", "percentage": "1.5%", "purpose": "Lipophilic AHA targeting bacteria"},
                {"name": "Niacinamide", "percentage": "1%", "purpose": "Soothes friction-induced darkening"}
            ]),
            "full_ingredients": "Aqua, Lactic Acid, Mandelic Acid, Niacinamide, Glycerin, Hydroxyethylcellulose, Zinc PCA, Phenoxyethanol, Ethylhexylglycerin.",
            "instructions": "Glide evenly over clean, dry underarms every morning. Allow 30 seconds to dry before dressing.",
            "precautions": "Do not apply on razor-burned or freshly waxed skin. Discontinue if redness occurs.",
            "pH_level": "4.0",
            "recommended_time": "AM",
            "frequency": "Daily",
            "is_verified": True,
            "image_url": "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=600&q=80"
        },
        {
            "name": "Invisible Fluid SPF 50 PA++++ Mineral Sunscreen",
            "brand": "Be Bodywise",
            "category": "skincare",
            "subcategory": "Sun Protection",
            "description": "Ultra-lightweight, zero-whitecast fluid sunscreen with micro-encapsulated Zinc Oxide, Titanium Dioxide, and Hyaluronic Acid.",
            "active_ingredients": json.dumps([
                {"name": "Zinc Oxide", "percentage": "12%", "purpose": "Broad-spectrum physical UVA/UVB filter"},
                {"name": "Hyaluronic Acid", "percentage": "1%", "purpose": "Multi-depth hydration"},
                {"name": "Vitamin E", "percentage": "0.5%", "purpose": "Antioxidant photoprotector"}
            ]),
            "full_ingredients": "Aqua, Zinc Oxide, C12-15 Alkyl Benzoate, Caprylic/Capric Triglyceride, Isododecane, Silica, Glycerin, Polyglyceryl-4 Diisostearate, Sodium Hyaluronate, Tocopherol, Phenoxyethanol.",
            "instructions": "Apply 2 generous finger lengths to face, neck, and exposed chest every morning as the final step. Reapply every 2 hours if outdoors.",
            "precautions": "External use only. Avoid contact with eyes.",
            "pH_level": "6.5",
            "recommended_time": "AM",
            "frequency": "Every Morning",
            "is_verified": True,
            "image_url": "https://images.unsplash.com/photo-1556228722-d0b630456475?auto=format&fit=crop&w=600&q=80"
        },
        {
            "name": "2% Salicylic Acid Face Clarifying Cleanser",
            "brand": "Be Bodywise",
            "category": "skincare",
            "subcategory": "Cleanser",
            "description": "Gentle gel cleanser targeting blackheads and cystic facial blemishes without stripping the natural barrier.",
            "active_ingredients": json.dumps([
                {"name": "Salicylic Acid", "percentage": "2%", "purpose": "Unclogs sebum in pores"},
                {"name": "Zinc PCA", "percentage": "1%", "purpose": "Regulates sebum production"}
            ]),
            "full_ingredients": "Aqua, Cocamidopropyl Betaine, Sodium Lauroyl Oat Amino Acids, Salicylic Acid, Zinc PCA, Glycerin, Citric Acid, Phenoxyethanol.",
            "instructions": "Dispense 1 pump onto damp palms, massage in circular motions for 45-60 seconds, then rinse with lukewarm water.",
            "precautions": "Follow with a ceramide cream and daily SPF. If dryness occurs, alternate with a gentle milky wash.",
            "pH_level": "5.0",
            "recommended_time": "BOTH",
            "frequency": "Daily",
            "is_verified": True,
            "image_url": "https://images.unsplash.com/photo-1556228724-44226c6d0422?auto=format&fit=crop&w=600&q=80"
        },
        {
            "name": "0.3% Pure Retinol Night Reset Serum",
            "brand": "Be Bodywise",
            "category": "skincare",
            "subcategory": "Treatment Serum",
            "description": "Stabilized retinol encapsulated in liposomes with bakuchiol and squalane for cellular regeneration and smoothing fine lines.",
            "active_ingredients": json.dumps([
                {"name": "Retinol", "percentage": "0.3%", "purpose": "Cellular renewal and collagen boost"},
                {"name": "Bakuchiol", "percentage": "1%", "purpose": "Synergistic botanical retinoid booster"},
                {"name": "Squalane", "percentage": "5%", "purpose": "Barrier buffering"}
            ]),
            "full_ingredients": "Aqua, Squalane, Retinol, Bakuchiol, Phospholipids, Polysorbate 20, Dimethicone, Tocopheryl Acetate, Xanthan Gum, Phenoxyethanol.",
            "instructions": "Apply 3-4 drops to completely dry skin at night only. Follow with a rich barrier moisturizer. Begin 2 nights a week.",
            "precautions": "Do NOT combine with exfoliating acids (AHA/BHA) in the same session. Always use daytime sunscreen SPF 50.",
            "pH_level": "5.8",
            "recommended_time": "PM",
            "frequency": "2-3 nights per week",
            "is_verified": True,
            "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80"
        }
    ]

    created_products = []
    for p_info in products_data:
        p_obj = models.Product(**p_info)
        db.add(p_obj)
        created_products.append(p_obj)

    db.commit()
    for p in created_products:
        db.refresh(p)

    # 3. Add User's Current Products for Demo User
    # Ananya uses: Salicylic Body Wash, Lactic Acid Body Lotion, Hair Growth Serum, Retinol Night Serum, and Sunscreen
    user_prods = [
        models.UserProduct(
            user_id=demo_user.id,
            product_id=created_products[0].id, # 1% Salicylic Acid Body Wash
            is_active=True,
            purchased_for_concern="Body Acne & Back Breakouts",
            application_time="PM",
            frequency="Daily in shower",
            custom_order=1,
            notes="Focusing on upper back and shoulder area."
        ),
        models.UserProduct(
            user_id=demo_user.id,
            product_id=created_products[1].id, # 10% Lactic Acid Body Lotion
            is_active=True,
            purchased_for_concern="Strawberry Legs & Keratosis Pilaris",
            application_time="PM",
            frequency="Alternate evenings",
            custom_order=2,
            notes="Applying after drying off from shower."
        ),
        models.UserProduct(
            user_id=demo_user.id,
            product_id=created_products[4].id, # 3% Redensyl Hair Growth Serum
            is_active=True,
            purchased_for_concern="Hair Thinning & Scalp Fall",
            application_time="PM",
            frequency="Every night before sleep",
            custom_order=3,
            notes="Targeting front hairline and center parting."
        ),
        models.UserProduct(
            user_id=demo_user.id,
            product_id=created_products[6].id, # Invisible Fluid SPF 50
            is_active=True,
            purchased_for_concern="Sun Damage Prevention with Actives",
            application_time="AM",
            frequency="Daily every morning",
            custom_order=1,
            notes="Applying 2 finger lengths."
        ),
        models.UserProduct(
            user_id=demo_user.id,
            product_id=created_products[8].id, # 0.3% Retinol Night Serum
            is_active=True,
            purchased_for_concern="Post-inflammatory Marks & Texture",
            application_time="PM",
            frequency="2x weekly",
            custom_order=4,
            notes="Trying to alternate with acids."
        )
    ]
    for up in user_prods:
        db.add(up)
    db.commit()

    # 4. Create Initial Product Experience Record (Main Feature 1)
    exp1 = models.ProductExperience(
        user_id=demo_user.id,
        product_id=created_products[0].id, # Salicylic Body Wash
        user_product_id=1,
        natural_language_feedback="I have been using the 1% salicylic acid body wash for three weeks. My body acne on my back and shoulders has noticeably reduced, but my skin feels very dry and tight right after showering.",
        duration_weeks=3,
        frequency_used="Daily in shower",
        primary_concern="Body Acne",
        expected_result="Clear back acne without irritation",
        actual_result="Acne reduced, but moderate skin dryness observed",
        positive_outcomes=json.dumps(["Reduced body acne lesions", "Less inflammation on upper back"]),
        negative_outcomes=json.dumps(["Skin feels dry and tight post-shower"]),
        unwanted_reactions=json.dumps(["Mild tightness sensation"]),
        classification="mixed",
        ai_working_summary="Lipophilic Salicylic Acid is penetrating follicular infundibulum and dissolving trapped keratinized plugs, producing measurable reduction in comedones.",
        ai_not_improved_summary="Stratum corneum moisture balance has dipped, leading to elevated transepidermal water loss (TEWL) post-rinse.",
        ai_explanations=json.dumps([
            "Salicylic Acid effectively reduces sebum, but prolonged contact or high water temperatures in the shower dissolves protective surface intercellular lipids.",
            "Absence of an immediate ceramide or urea-based occlusive moisturizer applied within 3 minutes of stepping out of the shower.",
            "Daily contact frequency may currently exceed your individual stratum corneum tolerance threshold."
        ]),
        ai_questions=json.dumps([
            "Are you applying a hydrating lotion within 3 minutes while skin is still slightly damp?",
            "Are you leaving the lather on your skin for longer than 60 seconds before rinsing off?",
            "Is the shower water temperature very warm or hot during body wash application?"
        ]),
        ai_safe_next_steps=json.dumps([
            "Adjust frequency: Reduce use to 3 times per week on alternate days until dryness subsides.",
            "Short contact therapy: Keep lather contact time to 45 seconds maximum and rinse with lukewarm water.",
            "Seal immediately: Apply a ceramide or 10% urea lotion right after patting skin dry."
        ]),
        created_at=datetime.utcnow() - timedelta(days=7)
    )
    db.add(exp1)

    # 5. Create Routine Analysis Record (Main Feature 2)
    routine_analysis = models.RoutineAnalysis(
        user_id=demo_user.id,
        routine_category="skincare",
        overall_score=78,
        score_breakdown=json.dumps({
            "duplication_balance": 88,
            "ingredient_compatibility": 70,
            "application_flow": 82,
            "barrier_safety": 72,
            "completeness": 94
        }),
        identified_conflicts=json.dumps([
            {
                "id": "conflict-retinol-exfoliants",
                "title": "Concurrent Retinoid + Multi-Acid Exfoliant Stress",
                "risk_level": "high",
                "ingredients": ["Retinol (0.3%)", "Salicylic Acid (1%)", "Lactic Acid (10%)"],
                "products_involved": ["0.3% Pure Retinol Night Reset Serum", "10% Lactic Acid Body Lotion", "1% Salicylic Acid Body Wash"],
                "why": "Layering Retinol and direct chemical exfoliants simultaneously accelerates cellular desquamation beyond the lipid replenishment rate, significantly elevating risk of barrier compromise, peeling, and redness.",
                "missing_info": "Exact skin barrier acclimatization level and whether products are separated across nights.",
                "safe_alternatives": [
                    "Implement a 4-night Skin Cycling protocol: Night 1 Exfoliate, Night 2 Retinol, Nights 3 & 4 Barrier Recovery.",
                    "Never apply Lactic Acid lotion on the same evening you apply Retinol serum.",
                    "Always buffer with a soothing ceramide moisturizer."
                ]
            },
            {
                "id": "repeat-exfoliant-body",
                "title": "Dual Chemical Acid Exposure (Salicylic + Lactic)",
                "risk_level": "moderate",
                "ingredients": ["Salicylic Acid (BHA)", "Lactic Acid (AHA)"],
                "products_involved": ["1% Salicylic Acid Body Wash", "10% Lactic Acid Body Lotion"],
                "why": "Using a BHA wash followed immediately by a 10% AHA lotion combines deep pore sebum dissolution with superficial stratum corneum desquamation. This dual-acid protocol can provoke stinging or dryness if skin is dry.",
                "missing_info": "Body skin thickness variations (e.g. back vs arms/legs).",
                "safe_alternatives": [
                    "Reserve the Salicylic wash for oily trunk zones (back and chest) and apply Lactic Acid lotion to keratinized zones (arms and legs).",
                    "Alternate: use gentle hydrating wash on nights when using 10% Lactic Acid lotion."
                ]
            }
        ]),
        structured_am_routine=json.dumps([
            {
                "step_number": 1,
                "step_name": "Step 1: Gentle Body Cleanse",
                "product_name": "1% Salicylic Acid Body Wash",
                "brand": "Be Bodywise",
                "product_id": created_products[0].id,
                "recommended_frequency": "Alternate days (Mon, Wed, Fri)",
                "application_order_reason": "Cleanse away overnight sweat and sebum to prepare skin.",
                "precautions": "Lukewarm water only. Keep contact under 60 seconds.",
                "attention_ingredients": ["Salicylic Acid 1%"],
                "alternate_day_note": "Use gentle non-active wash on intermediate days."
            },
            {
                "step_number": 2,
                "step_name": "Step 2: Photoprotection (Facial & Exposed Areas)",
                "product_name": "Invisible Fluid SPF 50 PA++++ Mineral Sunscreen",
                "brand": "Be Bodywise",
                "product_id": created_products[6].id,
                "recommended_frequency": "Every single morning",
                "application_order_reason": "Final protective barrier preventing active-induced photosensitivity.",
                "precautions": "Reapply every 2 hours during direct outdoor exposure.",
                "attention_ingredients": ["Zinc Oxide 12%"],
                "alternate_day_note": "Non-negotiable daily step."
            }
        ]),
        structured_pm_routine=json.dumps([
            {
                "step_number": 1,
                "step_name": "Step 1: Active Exfoliation OR Retinoid (Skin Cycling)",
                "product_name": "0.3% Pure Retinol Serum OR 10% Lactic Acid Lotion",
                "brand": "Be Bodywise",
                "product_id": created_products[8].id,
                "recommended_frequency": "Cycled on alternate evenings",
                "application_order_reason": "Nighttime promotes biological cellular repair without UV degradation.",
                "precautions": "Do not apply both on the same evening. Avoid contact with eye contours.",
                "attention_ingredients": ["Retinol 0.3%", "Lactic Acid 10%"],
                "alternate_day_note": "Night 1: Lactic Acid. Night 2: Retinol. Night 3 & 4: Hydration Recovery."
            },
            {
                "step_number": 2,
                "step_name": "Step 2: Scalp Follicle Treatment",
                "product_name": "3% Redensyl + 3% Procapil Hair Growth Serum",
                "brand": "Be Bodywise",
                "product_id": created_products[4].id,
                "recommended_frequency": "Every evening at bedtime",
                "application_order_reason": "Targeted scalp follicular delivery with 6-8 hour overnight leave-in.",
                "precautions": "Apply directly to dry scalp, massage with fingertips.",
                "attention_ingredients": ["Redensyl 3%", "Procapil 3%"],
                "alternate_day_note": "Consistent daily use is required for anagen phase activation."
            }
        ]),
        missing_steps=json.dumps([
            {
                "step": "Ceramide Recovery Barrier Balm",
                "reason": "Crucial for recovery nights in skin cycling to counterbalance dryness from salicylic and lactic acid."
            }
        ]),
        created_at=datetime.utcnow() - timedelta(days=6)
    )
    db.add(routine_analysis)

    # 6. Create Timeline History Logs (Feature 6: Visual Timeline)
    timeline_entries = [
        models.TimelineLog(
            user_id=demo_user.id,
            product_id=created_products[0].id,
            week_number=1,
            date_logged=datetime.utcnow() - timedelta(days=21),
            notes="Started 1% Salicylic body wash daily. Slight tingling in the shower, acne still active.",
            acne_score=8.0,
            dryness_score=3.5,
            irritation_score=2.0,
            hydration_score=6.0,
            satisfaction_score=6.0
        ),
        models.TimelineLog(
            user_id=demo_user.id,
            product_id=created_products[0].id,
            week_number=2,
            date_logged=datetime.utcnow() - timedelta(days=14),
            notes="Reduced acne on shoulders! However, arms feel tight and flaky after hot showers.",
            acne_score=5.5,
            dryness_score=6.8,
            irritation_score=4.0,
            hydration_score=4.5,
            satisfaction_score=6.5
        ),
        models.TimelineLog(
            user_id=demo_user.id,
            product_id=created_products[0].id,
            week_number=3,
            date_logged=datetime.utcnow() - timedelta(days=7),
            notes="Reduced body wash frequency to alternate days and lowered shower temp. Dryness easing off.",
            acne_score=3.8,
            dryness_score=4.5,
            irritation_score=2.5,
            hydration_score=6.5,
            satisfaction_score=8.0
        ),
        models.TimelineLog(
            user_id=demo_user.id,
            product_id=created_products[0].id,
            week_number=4,
            date_logged=datetime.utcnow(),
            notes="Current status: Acne mostly clear, skin feeling much smoother. Routine compatibility score high.",
            acne_score=2.5,
            dryness_score=3.0,
            irritation_score=1.5,
            hydration_score=7.8,
            satisfaction_score=9.0
        )
    ]
    for tl in timeline_entries:
        db.add(tl)

    # 7. Create Synthetic Demonstration Reviews with Aspect Tags (Feature 5)
    reviews_data = [
        {
            "product_id": created_products[0].id, # Salicylic Body Wash
            "reviewer_name": "Pooja M.",
            "rating": 4.5,
            "review_text": "Reduced my stubborn back acne within 3 weeks. It cleared up deep bumps, but can feel drying if you don't use body lotion immediately after.",
            "sentiment": "mixed",
            "aspect_tags": json.dumps(["effectiveness", "acne", "dryness", "long-term results"]),
            "duration_used": "3 weeks",
            "verified_purchase": True,
            "source": "official_store"
        },
        {
            "product_id": created_products[0].id,
            "reviewer_name": "Karan S.",
            "rating": 5.0,
            "review_text": "Great lather, fragrance free and completely cleared gym sweat breakouts. Absorbs clean without residue.",
            "sentiment": "positive",
            "aspect_tags": json.dumps(["effectiveness", "acne", "fragrance", "absorption"]),
            "duration_used": "2 months",
            "verified_purchase": True,
            "source": "official_store"
        },
        {
            "product_id": created_products[1].id, # 10% Lactic Acid Lotion
            "reviewer_name": "Meera D.",
            "rating": 4.0,
            "review_text": "Effective for strawberry legs. My skin texture is noticeably smoother. Just don't apply right after waxing or it stings.",
            "sentiment": "mixed",
            "aspect_tags": json.dumps(["effectiveness", "texture", "irritation"]),
            "duration_used": "1 month",
            "verified_purchase": True,
            "source": "official_store"
        },
        {
            "product_id": created_products[4].id, # Redensyl Hair Growth Serum
            "reviewer_name": "Rahul T.",
            "rating": 4.5,
            "review_text": "Been using this every night for 3 months. Initial shedding during week 2 scared me, but by month 2 baby hairs started sprouting along my hairline. Non-greasy texture.",
            "sentiment": "positive",
            "aspect_tags": json.dumps(["effectiveness", "hair fall", "texture", "long-term results", "absorption"]),
            "duration_used": "3 months",
            "verified_purchase": True,
            "source": "official_store"
        },
        {
            "product_id": created_products[5].id, # AHA Underarm Roll-on
            "reviewer_name": "Shreya K.",
            "rating": 4.8,
            "review_text": "Zero odor throughout 12-hour workday. Lightened dark friction patches after 4 weeks. No sticky feeling.",
            "sentiment": "positive",
            "aspect_tags": json.dumps(["effectiveness", "pigmentation", "absorption", "long-term results"]),
            "duration_used": "5 weeks",
            "verified_purchase": True,
            "source": "community"
        },
        {
            "product_id": created_products[6].id, # SPF 50 Mineral Sunscreen
            "reviewer_name": "Tanvi P.",
            "rating": 4.7,
            "review_text": "Zero white cast on Indian medium-tan skin! Sits beautifully under makeup without feeling greasy.",
            "sentiment": "positive",
            "aspect_tags": json.dumps(["effectiveness", "texture", "absorption"]),
            "duration_used": "6 weeks",
            "verified_purchase": True,
            "source": "official_store"
        }
    ]
    for r in reviews_data:
        db.add(models.ProductReview(**r))

    db.commit()
    print("Seeding completed successfully!")

if __name__ == "__main__":
    db = SessionLocal()
    seed_database(db)
    db.close()
