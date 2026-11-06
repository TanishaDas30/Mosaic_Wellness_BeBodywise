import {
  UserProfile,
  Product,
  UserProduct,
  ProductExperience,
  RoutineAnalysisResult,
  ProductReview,
  ReviewIntelligence,
  TimelineEntry,
  AssistantResponse,
  OCRResult,
  AdminAnalytics
} from '../types';

// Supports optional custom backend URL (e.g. Render / Railway / Localhost)
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

function getHeaders(custom: Record<string, string> = {}): HeadersInit {
  const token = localStorage.getItem('skinsense_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...custom,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// =========================================================================
// DEFAULT SEED DATA FOR VERCEL STATIC / DEMO DEPLOYMENTS
// =========================================================================

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "1% Salicylic Acid Body Wash",
    brand: "Be Bodywise",
    category: "bodycare",
    subcategory: "Body Cleanser",
    description: "Non-drying body wash formulated with 1% Salicylic Acid to gently cleanse sebum-rich pores and clear backne and bumpy strawberry skin.",
    active_ingredients: [
      { name: "Salicylic Acid", percentage: "1%", purpose: "BHA pore-penetrating exfoliant" },
      { name: "Chamomile Extract", percentage: "0.5%", purpose: "Soothing anti-irritant" }
    ],
    full_ingredients: "Aqua, Sodium Lauroyl Sarcosinate, Cocamidopropyl Betaine, Salicylic Acid, Glycerin, Chamomilla Recutita Flower Extract, Betaine, Phenoxyethanol.",
    instructions: "Lather over wet body in shower. Leave on acne zones for 45-60 seconds before rinsing thoroughly. Follow with body lotion.",
    precautions: "Avoid open abrasions. Reduce frequency if dryness emerges.",
    pH_level: "5.5",
    recommended_time: "BOTH",
    frequency: "Daily or Alternate Days",
    is_verified: true,
    image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "10% Lactic Acid Body Lotion",
    brand: "Be Bodywise",
    category: "bodycare",
    subcategory: "Body Exfoliant Lotion",
    description: "Exfoliating and deeply hydrating lotion with 10% Lactic Acid (AHA) and Niacinamide to smoothen keratosis pilaris and rough texture.",
    active_ingredients: [
      { name: "Lactic Acid", percentage: "10%", purpose: "Gentle AHA exfoliant & natural humectant" },
      { name: "Niacinamide", percentage: "2%", purpose: "Evens tone & reinforces lipid barrier" },
      { name: "Shea Butter", percentage: "3%", purpose: "Emollient lipid sealant" }
    ],
    full_ingredients: "Aqua, Lactic Acid, Glycerin, Caprylic/Capric Triglyceride, Shea Butter, Niacinamide, Sodium Hydroxide, Tocopheryl Acetate.",
    instructions: "Apply once daily in the evening onto clean, slightly damp skin. Massage until completely absorbed.",
    precautions: "Contains AHA that may increase sun sensitivity. Apply sunscreen to sun-exposed treated areas.",
    pH_level: "3.8 - 4.2",
    recommended_time: "PM",
    frequency: "Daily in PM",
    is_verified: true,
    image_url: "https://images.unsplash.com/photo-1608248597359-54876b5c00b3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "10% Urea Deep Repair Body Lotion",
    brand: "Be Bodywise",
    category: "bodycare",
    subcategory: "Repair Cream",
    description: "Intense barrier repair cream infused with 10% Pharmaceutical Grade Urea, Ceramides, and Allantoin for severe flaking and rough texture.",
    active_ingredients: [
      { name: "Urea", percentage: "10%", purpose: "Natural Moisturizing Factor (NMF) humectant" },
      { name: "Ceramide NP", percentage: "1%", purpose: "Restores intercellular lipid bilayers" },
      { name: "Allantoin", percentage: "0.5%", purpose: "Skin protectant" }
    ],
    full_ingredients: "Aqua, Urea, Glycerin, Cetearyl Ethylhexanoate, Ceramide NP, Ceramide AP, Phytosphingosine, Allantoin.",
    instructions: "Massage onto dry patches morning and evening. Can be layered over chemical exfoliants.",
    precautions: "May produce brief mild tingling if applied on cracked skin fissures.",
    pH_level: "5.5",
    recommended_time: "BOTH",
    frequency: "Twice daily",
    is_verified: true,
    image_url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "5% Niacinamide Body Lotion",
    brand: "Be Bodywise",
    category: "bodycare",
    subcategory: "Tone Balancing Lotion",
    description: "Daily brightening and barrier replenishing body lotion with 5% pure Niacinamide and soothing Aloe Vera juice to calm marks.",
    active_ingredients: [
      { name: "Niacinamide", percentage: "5%", purpose: "Cell-energizing Vitamin B3, fades blemishes" },
      { name: "Aloe Vera Juice", percentage: "10%", purpose: "Hydration and anti-inflammatory" }
    ],
    full_ingredients: "Aqua, Aloe Barbadensis Leaf Juice, Niacinamide, Glycerin, Squalane, Glyceryl Stearate, Sodium Hyaluronate.",
    instructions: "Apply liberally all over the body every morning after showering.",
    precautions: "Suitable for all skin types. Hypoallergenic.",
    pH_level: "6.0",
    recommended_time: "AM",
    frequency: "Daily in AM",
    is_verified: true,
    image_url: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "3% Redensyl + 3% Procapil Hair Growth Serum",
    brand: "Be Bodywise",
    category: "haircare",
    subcategory: "Scalp Treatment Serum",
    description: "Clinically researched hair growth concentrate targeting hair follicle miniaturization and activating the anagen hair phase.",
    active_ingredients: [
      { name: "Redensyl", percentage: "3%", purpose: "Reactivates dormant stem cells (ORSc)" },
      { name: "Procapil", percentage: "3%", purpose: "DHT blocker & microcirculation enhancer" },
      { name: "Saw Palmetto", percentage: "2%", purpose: "5-alpha-reductase inhibitor" }
    ],
    full_ingredients: "Aqua, Propanediol, Glycerin, Larix Europaea Wood Extract, Glycine, Zinc Chloride, Camellia Sinensis Extract, Biotinoyl Tripeptide-1.",
    instructions: "Apply 1-2 ml directly onto clean, dry scalp using dropper daily before bed. Massage lightly. Do not wash off for 4-6 hours.",
    precautions: "For topical scalp use only. Do not apply onto broken scalp.",
    pH_level: "5.5",
    recommended_time: "PM",
    frequency: "Daily at Night",
    is_verified: true,
    image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "4% AHA Underarm Roll-On (Fragrance Free)",
    brand: "Be Bodywise",
    category: "bodycare",
    subcategory: "Underarm Care",
    description: "Lactic and Mandelic acid roll-on that balances underarm microbiome pH to neutralize odor while exfoliating pigmentation.",
    active_ingredients: [
      { name: "Lactic Acid", percentage: "2.5%", purpose: "Desquamation of surface darkness" },
      { name: "Mandelic Acid", percentage: "1.5%", purpose: "Lipophilic antibacterial AHA" }
    ],
    full_ingredients: "Aqua, Lactic Acid, Mandelic Acid, Niacinamide, Glycerin, Zinc PCA, Phenoxyethanol.",
    instructions: "Glide evenly over clean, dry underarms every morning. Allow 30 seconds to dry.",
    precautions: "Do not apply on razor-burned skin.",
    pH_level: "4.0",
    recommended_time: "AM",
    frequency: "Daily",
    is_verified: true,
    image_url: "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Invisible Fluid SPF 50 PA++++ Mineral Sunscreen",
    brand: "Be Bodywise",
    category: "skincare",
    subcategory: "Sun Protection",
    description: "Ultra-lightweight, zero-whitecast fluid sunscreen with micro-encapsulated Zinc Oxide and Hyaluronic Acid.",
    active_ingredients: [
      { name: "Zinc Oxide", percentage: "12%", purpose: "Broad-spectrum physical UVA/UVB shield" },
      { name: "Hyaluronic Acid", percentage: "1%", purpose: "Multi-depth hydration" }
    ],
    full_ingredients: "Aqua, Zinc Oxide, C12-15 Alkyl Benzoate, Isododecane, Silica, Glycerin, Sodium Hyaluronate, Tocopherol.",
    instructions: "Apply 2 generous finger lengths to face, neck, and exposed chest every morning.",
    precautions: "Reapply every 2 hours if outdoors.",
    pH_level: "6.5",
    recommended_time: "AM",
    frequency: "Every Morning",
    is_verified: true,
    image_url: "https://images.unsplash.com/photo-1556228722-d0b630456475?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "2% Salicylic Acid Face Clarifying Cleanser",
    brand: "Be Bodywise",
    category: "skincare",
    subcategory: "Cleanser",
    description: "Gentle gel cleanser targeting blackheads and blemishes without stripping the natural barrier.",
    active_ingredients: [
      { name: "Salicylic Acid", percentage: "2%", purpose: "Unclogs sebum in pores" },
      { name: "Zinc PCA", percentage: "1%", purpose: "Regulates sebum" }
    ],
    full_ingredients: "Aqua, Cocamidopropyl Betaine, Salicylic Acid, Zinc PCA, Glycerin, Phenoxyethanol.",
    instructions: "Massage for 45-60 seconds onto damp skin, then rinse with lukewarm water.",
    precautions: "Follow with ceramide cream and daily SPF.",
    pH_level: "5.0",
    recommended_time: "BOTH",
    frequency: "Daily",
    is_verified: true,
    image_url: "https://images.unsplash.com/photo-1556228724-44226c6d0422?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9,
    name: "0.3% Pure Retinol Night Reset Serum",
    brand: "Be Bodywise",
    category: "skincare",
    subcategory: "Treatment Serum",
    description: "Stabilized retinol encapsulated in liposomes with bakuchiol and squalane for cellular renewal.",
    active_ingredients: [
      { name: "Retinol", percentage: "0.3%", purpose: "Cellular renewal and collagen boost" },
      { name: "Bakuchiol", percentage: "1%", purpose: "Botanical retinoid booster" }
    ],
    full_ingredients: "Aqua, Squalane, Retinol, Bakuchiol, Phospholipids, Polysorbate 20, Tocopheryl Acetate.",
    instructions: "Apply 3-4 drops to completely dry skin at night only. Follow with barrier moisturizer.",
    precautions: "Do NOT combine with exfoliating acids in same session. Always use SPF 50.",
    pH_level: "5.8",
    recommended_time: "PM",
    frequency: "2-3 nights per week",
    is_verified: true,
    image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80"
  }
];

const DEFAULT_USER: UserProfile = {
  id: 1,
  email: "demo@skinsense.ai",
  full_name: "Ananya Sharma",
  role: "user",
  skin_type: "Combination / Acne-Prone",
  skin_concerns: ["Body Acne", "Uneven Texture", "Dehydration"],
  hair_type: "Wavy / Medium Density",
  scalp_type: "Oily Scalp",
  hair_concerns: ["Hair Fall", "Delayed Follicle Growth"],
  created_at: new Date().toISOString()
};

const DEFAULT_ROUTINE: UserProduct[] = [
  { id: 1, user_id: 1, product_id: 1, is_active: true, purchased_for_concern: "Body Acne & Back Breakouts", application_time: "PM", frequency: "Daily in shower", added_at: new Date().toISOString(), product: DEFAULT_PRODUCTS[0] },
  { id: 2, user_id: 1, product_id: 2, is_active: true, purchased_for_concern: "Strawberry Legs & KP", application_time: "PM", frequency: "Alternate evenings", added_at: new Date().toISOString(), product: DEFAULT_PRODUCTS[1] },
  { id: 3, user_id: 1, product_id: 5, is_active: true, purchased_for_concern: "Hair Thinning", application_time: "PM", frequency: "Every night before sleep", added_at: new Date().toISOString(), product: DEFAULT_PRODUCTS[4] },
  { id: 4, user_id: 1, product_id: 7, is_active: true, purchased_for_concern: "Sun Protection with Actives", application_time: "AM", frequency: "Daily every morning", added_at: new Date().toISOString(), product: DEFAULT_PRODUCTS[6] },
  { id: 5, user_id: 1, product_id: 9, is_active: true, purchased_for_concern: "Post-acne marks", application_time: "PM", frequency: "2x weekly", added_at: new Date().toISOString(), product: DEFAULT_PRODUCTS[8] }
];

export const api = {
  // --- Auth ---
  async login(email: string, password: string) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('skinsense_token', data.access_token);
        return data;
      }
    } catch (e) {
      // Local fallback on static Vercel preview
    }

    // Client fallback
    const role = email.includes('admin') ? 'admin' : 'user';
    const user: UserProfile = {
      ...DEFAULT_USER,
      email,
      role: role as any,
      full_name: role === 'admin' ? 'Dr. Ritu Verma (Product Lead)' : 'Ananya Sharma'
    };
    localStorage.setItem('skinsense_token', 'demo-vercel-token');
    localStorage.setItem('skinsense_user', JSON.stringify(user));
    return { access_token: 'demo-vercel-token', user };
  },

  async register(userData: any) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('skinsense_token', data.access_token);
        return data;
      }
    } catch (e) {}

    const user: UserProfile = {
      id: Date.now(),
      email: userData.email,
      full_name: userData.full_name,
      role: 'user',
      skin_type: userData.skin_type || 'Combination',
      skin_concerns: userData.skin_concerns || [],
      hair_type: userData.hair_type || 'Wavy / Medium',
      scalp_type: userData.scalp_type || 'Oily Scalp',
      hair_concerns: userData.hair_concerns || [],
      created_at: new Date().toISOString()
    };
    localStorage.setItem('skinsense_token', 'demo-vercel-token');
    localStorage.setItem('skinsense_user', JSON.stringify(user));
    return { access_token: 'demo-vercel-token', user };
  },

  async getMe(): Promise<UserProfile> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: getHeaders() });
      if (res.ok) return res.json();
    } catch (e) {}

    const stored = localStorage.getItem('skinsense_user');
    return stored ? JSON.parse(stored) : DEFAULT_USER;
  },

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(profile),
      });
      if (res.ok) return res.json();
    } catch (e) {}

    const current = await this.getMe();
    const updated = { ...current, ...profile };
    localStorage.setItem('skinsense_user', JSON.stringify(updated));
    return updated;
  },

  logout() {
    localStorage.removeItem('skinsense_token');
    localStorage.removeItem('skinsense_user');
  },

  // --- Products ---
  async getProducts(category?: string, search?: string): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);

      const res = await fetch(`${API_BASE}/products?${params.toString()}`, { headers: getHeaders() });
      if (res.ok) return res.json();
    } catch (e) {}

    let prods = [...DEFAULT_PRODUCTS];
    if (category && category !== 'all') {
      prods = prods.filter(p => p.category === category || (category === 'skincare' && p.category === 'bodycare'));
    }
    if (search) {
      prods = prods.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    return prods;
  },

  async getProduct(productId: number) {
    try {
      const res = await fetch(`${API_BASE}/products/${productId}`, { headers: getHeaders() });
      if (res.ok) return res.json();
    } catch (e) {}

    const p = DEFAULT_PRODUCTS.find(x => x.id === productId) || DEFAULT_PRODUCTS[0];
    return { product: p, review_count: 6, average_rating: 4.6, reviews: [] };
  },

  async createCustomProduct(product: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products/custom`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(product),
      });
      if (res.ok) return res.json();
    } catch (e) {}

    const newP: Product = {
      id: Date.now(),
      name: product.name || 'Custom Product',
      brand: product.brand || 'Be Bodywise',
      category: product.category || 'skincare',
      subcategory: product.subcategory || 'Serum',
      active_ingredients: product.active_ingredients || [],
      instructions: product.instructions,
      precautions: product.precautions,
      recommended_time: product.recommended_time || 'PM',
      frequency: product.frequency || 'Daily',
      is_verified: false
    };
    DEFAULT_PRODUCTS.push(newP);
    return newP;
  },

  // --- User Routine Products ---
  async getUserRoutine(): Promise<UserProduct[]> {
    try {
      const res = await fetch(`${API_BASE}/user-products`, { headers: getHeaders() });
      if (res.ok) return res.json();
    } catch (e) {}

    const stored = localStorage.getItem('skinsense_routine');
    return stored ? JSON.parse(stored) : DEFAULT_ROUTINE;
  },

  async addToRoutine(item: {
    product_id: number;
    purchased_for_concern?: string;
    application_time?: string;
    frequency?: string;
    notes?: string;
  }) {
    try {
      const res = await fetch(`${API_BASE}/user-products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(item),
      });
      if (res.ok) return res.json();
    } catch (e) {}

    const routine = await this.getUserRoutine();
    const prod = DEFAULT_PRODUCTS.find(p => p.id === item.product_id) || DEFAULT_PRODUCTS[0];
    const newUp: UserProduct = {
      id: Date.now(),
      user_id: 1,
      product_id: prod.id,
      is_active: true,
      purchased_for_concern: item.purchased_for_concern,
      application_time: (item.application_time as any) || 'PM',
      frequency: item.frequency || 'Daily',
      added_at: new Date().toISOString(),
      product: prod
    };
    routine.push(newUp);
    localStorage.setItem('skinsense_routine', JSON.stringify(routine));
    return { message: 'Product added to routine', id: newUp.id };
  },

  async removeFromRoutine(userProductId: number) {
    try {
      const res = await fetch(`${API_BASE}/user-products/${userProductId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) return res.json();
    } catch (e) {}

    let routine = await this.getUserRoutine();
    routine = routine.filter(r => r.id !== userProductId);
    localStorage.setItem('skinsense_routine', JSON.stringify(routine));
    return { message: 'Product removed' };
  },

  // --- Feature 1: AI Product Experience Intelligence ---
  async recordExperience(payload: {
    product_id: number;
    natural_language_feedback: string;
    duration_weeks?: number;
    frequency_used?: string;
    primary_concern?: string;
    expected_result?: string;
    actual_result?: string;
  }): Promise<ProductExperience> {
    try {
      const res = await fetch(`${API_BASE}/experience`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      if (res.ok) return res.json();
    } catch (e) {}

    const prod = DEFAULT_PRODUCTS.find(p => p.id === payload.product_id) || DEFAULT_PRODUCTS[0];
    const feedbackLower = payload.natural_language_feedback.toLowerCase();
    const hasDry = feedbackLower.includes('dry') || feedbackLower.includes('tight');
    const hasAcneReduced = feedbackLower.includes('reduced') || feedbackLower.includes('cleared') || feedbackLower.includes('better');

    const exp: ProductExperience = {
      id: Date.now(),
      user_id: 1,
      product_id: prod.id,
      product_name: prod.name,
      brand: prod.brand,
      natural_language_feedback: payload.natural_language_feedback,
      duration_weeks: payload.duration_weeks || 3,
      frequency_used: payload.frequency_used || 'Daily',
      primary_concern: payload.primary_concern || 'Body Acne',
      expected_result: payload.expected_result || 'Clear bumps without flaking',
      actual_result: payload.actual_result || 'Reduced acne lesions with post-shower dryness',
      positive_outcomes: hasAcneReduced ? ['Reduced acne lesions & clearer surface'] : ['Progress noticed'],
      negative_outcomes: hasDry ? ['Dryness & post-application tightness'] : [],
      unwanted_reactions: hasDry ? ['Cutaneous stratum corneum tightness'] : [],
      classification: hasAcneReduced && hasDry ? 'mixed' : hasAcneReduced ? 'positive' : 'mixed',
      ai_working_summary: `Lipophilic active agents in ${prod.name} are penetrating follicular infundibulum to clear comedones.`,
      ai_not_improved_summary: hasDry ? 'Stratum corneum moisture balance dipped, elevating post-rinse TEWL.' : 'No major adverse barrier changes.',
      ai_explanations: [
        'Salicylic / chemical acids dissolve sebum, but hot shower water and surfactant exposure strip protective intercellular ceramides.',
        'Absence of an immediate humectant / ceramide sealant within 3 minutes of bathing.',
        'Application contact time may exceed current epidermal tolerance.'
      ],
      ai_questions: [
        'Are you applying a hydrating lotion within 3 minutes while skin is still slightly damp?',
        'Are you leaving lather on skin for more than 60 seconds before rinsing?',
        'Has shower water temperature been hotter than lukewarm?'
      ],
      ai_safe_next_steps: [
        'Reduce frequency to 3x weekly on alternate days until dryness subsides.',
        'Keep lather contact time strictly to 45 seconds maximum before thorough rinsing.',
        'Seal immediately with a 10% Urea or Ceramide body lotion.'
      ],
      created_at: new Date().toISOString()
    };

    const history = await this.getExperienceHistory();
    history.unshift(exp);
    localStorage.setItem('skinsense_history', JSON.stringify(history));
    return exp;
  },

  async getExperienceHistory(): Promise<ProductExperience[]> {
    try {
      const res = await fetch(`${API_BASE}/experience/history`, { headers: getHeaders() });
      if (res.ok) return res.json();
    } catch (e) {}

    const stored = localStorage.getItem('skinsense_history');
    if (stored) return JSON.parse(stored);

    return [
      {
        id: 1,
        user_id: 1,
        product_id: 1,
        product_name: "1% Salicylic Acid Body Wash",
        brand: "Be Bodywise",
        natural_language_feedback: "I have been using the 1% salicylic acid body wash for three weeks. My body acne has reduced on my back and shoulders, but my chest feels very dry.",
        duration_weeks: 3,
        frequency_used: "Daily in shower",
        primary_concern: "Body Acne",
        expected_result: "Clear acne without irritation",
        actual_result: "Acne reduced, but moderate skin dryness observed",
        positive_outcomes: ["Reduced acne lesions on upper back"],
        negative_outcomes: ["Dryness & post-application tightness"],
        unwanted_reactions: ["Mild tightness sensation"],
        classification: "mixed",
        ai_working_summary: "Active follicular penetration of Salicylic Acid is reducing comedones and surface impactions.",
        ai_not_improved_summary: "Elevated transepidermal water loss (TEWL) observed on treated zones.",
        ai_explanations: [
          "Prolonged surfactant exposure dissolving protective lipid bilayers.",
          "Absence of immediate ceramide / urea sealant post-shower."
        ],
        ai_questions: [
          "Are you applying body lotion within 3 minutes of drying off?",
          "Are you rinsing with hot rather than lukewarm water?"
        ],
        ai_safe_next_steps: [
          "Reduce application to alternate days (3x per week).",
          "Apply 10% Urea Repair Lotion immediately while skin is slightly damp."
        ],
        created_at: new Date().toISOString()
      }
    ];
  },

  // --- Feature 2: AI Routine Conflict Checker ---
  async analyzeRoutine(payload: {
    product_ids?: number[];
    manual_products?: any[];
    routine_category?: string;
  }): Promise<RoutineAnalysisResult> {
    try {
      const res = await fetch(`${API_BASE}/routine/analyze`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      if (res.ok) return res.json();
    } catch (e) {}

    return {
      routine_category: payload.routine_category || 'skincare',
      overall_score: 78,
      score_breakdown: {
        duplication_balance: 85,
        ingredient_compatibility: 72,
        application_flow: 84,
        barrier_safety: 74,
        completeness: 92
      },
      identified_conflicts: [
        {
          id: "conflict-retinol-exfoliants",
          title: "Concurrent Retinoid + Multi-Acid Exfoliant Stress",
          risk_level: "high",
          ingredients: ["Retinol (0.3%)", "Salicylic Acid (1%)", "Lactic Acid (10%)"],
          products_involved: ["0.3% Pure Retinol Night Reset Serum", "10% Lactic Acid Body Lotion", "1% Salicylic Acid Body Wash"],
          why: "Layering Retinol and direct chemical hydroxy acids simultaneously accelerates cellular desquamation beyond the lipid replenishment rate, significantly elevating risk of barrier compromise, peeling, and redness.",
          missing_info: "Skin barrier acclimatization level and whether products are separated across nights.",
          safe_alternatives: [
            "Implement a 4-night Skin Cycling protocol: Night 1 Exfoliate, Night 2 Retinol, Nights 3 & 4 Barrier Recovery.",
            "Never apply Lactic Acid lotion on the same evening as Retinol serum.",
            "Buffer with a soothing ceramide moisturizer."
          ]
        },
        {
          id: "repeat-exfoliant-body",
          title: "Dual Chemical Acid Exposure (Salicylic + Lactic)",
          risk_level: "moderate",
          ingredients: ["Salicylic Acid (BHA)", "Lactic Acid (AHA)"],
          products_involved: ["1% Salicylic Acid Body Wash", "10% Lactic Acid Body Lotion"],
          why: "Using a BHA wash followed immediately by a 10% AHA lotion combines deep pore sebum dissolution with superficial stratum corneum desquamation.",
          missing_info: "Body skin thickness variations (back vs arms/legs).",
          safe_alternatives: [
            "Reserve Salicylic wash for oily trunk zones and apply Lactic Acid lotion to keratinized zones (arms and legs).",
            "Alternate days: use gentle hydrating wash on nights using 10% Lactic Acid lotion."
          ]
        }
      ],
      structured_am_routine: [
        {
          step_number: 1,
          step_name: "Step 1: Gentle Body Cleanse",
          product_name: "1% Salicylic Acid Body Wash",
          brand: "Be Bodywise",
          product_id: 1,
          recommended_frequency: "Alternate days (Mon, Wed, Fri)",
          application_order_reason: "Cleanse away overnight sweat and sebum to prepare skin.",
          precautions: "Lukewarm water only. Keep contact under 60 seconds.",
          attention_ingredients: ["Salicylic Acid 1%"],
          alternate_day_note: "Use gentle non-active wash on intermediate days."
        },
        {
          step_number: 2,
          step_name: "Step 2: Photoprotection (Facial & Exposed Areas)",
          product_name: "Invisible Fluid SPF 50 PA++++ Mineral Sunscreen",
          brand: "Be Bodywise",
          product_id: 7,
          recommended_frequency: "Every single morning",
          application_order_reason: "Final protective barrier preventing active-induced photosensitivity.",
          precautions: "Reapply every 2 hours during direct outdoor exposure.",
          attention_ingredients: ["Zinc Oxide 12%"],
          alternate_day_note: "Non-negotiable daily step."
        }
      ],
      structured_pm_routine: [
        {
          step_number: 1,
          step_name: "Step 1: Active Exfoliation OR Retinoid (Skin Cycling)",
          product_name: "0.3% Pure Retinol Serum OR 10% Lactic Acid Lotion",
          brand: "Be Bodywise",
          product_id: 9,
          recommended_frequency: "Cycled on alternate evenings",
          application_order_reason: "Nighttime promotes biological cellular repair without UV degradation.",
          precautions: "Do not apply both on the same evening.",
          attention_ingredients: ["Retinol 0.3%", "Lactic Acid 10%"],
          alternate_day_note: "Night 1: Lactic Acid. Night 2: Retinol. Nights 3 & 4: Hydration Recovery."
        },
        {
          step_number: 2,
          step_name: "Step 2: Scalp Follicle Treatment",
          product_name: "3% Redensyl + 3% Procapil Hair Growth Serum",
          brand: "Be Bodywise",
          product_id: 5,
          recommended_frequency: "Every evening at bedtime",
          application_order_reason: "Targeted scalp follicular delivery with 6-8 hour overnight leave-in.",
          precautions: "Apply directly to dry scalp, massage with fingertips.",
          attention_ingredients: ["Redensyl 3%", "Procapil 3%"],
          alternate_day_note: "Consistent daily use is required for anagen phase activation."
        }
      ],
      missing_steps: [
        {
          step: "Ceramide Recovery Barrier Balm",
          reason: "Crucial for recovery nights in skin cycling to counterbalance dryness from salicylic and lactic acid."
        }
      ],
      disclaimer: "SkinSense Routine Intelligence Disclaimer: This analysis evaluates formulation compatibility and does not constitute individual clinical dermatological advice."
    };
  },

  async getLatestRoutine(category: string = 'skincare'): Promise<RoutineAnalysisResult | null> {
    try {
      const res = await fetch(`${API_BASE}/routine/latest?category=${category}`, { headers: getHeaders() });
      if (res.ok) return res.json();
    } catch (e) {}

    return this.analyzeRoutine({ routine_category: category });
  },

  // --- Feature 3: Product Review Intelligence ---
  async getReviews(params: any): Promise<ProductReview[]> {
    try {
      const q = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/reviews?${q}`, { headers: getHeaders() });
      if (res.ok) return res.json();
    } catch (e) {}

    return [
      {
        id: 1,
        product_id: params.product_id || 1,
        product_name: "1% Salicylic Acid Body Wash",
        reviewer_name: "Pooja M.",
        rating: 4.5,
        review_text: "Reduced my stubborn back acne within 3 weeks. It cleared up deep bumps, but can feel drying if you don't use body lotion immediately after.",
        sentiment: "mixed",
        aspect_tags: ["effectiveness", "acne", "dryness", "long-term results"],
        duration_used: "3 weeks",
        verified_purchase: true,
        source: "official_store",
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        product_id: params.product_id || 1,
        reviewer_name: "Karan S.",
        rating: 5.0,
        review_text: "Great lather, fragrance free and completely cleared gym sweat breakouts. Absorbs clean without residue.",
        sentiment: "positive",
        aspect_tags: ["effectiveness", "acne", "fragrance", "absorption"],
        duration_used: "2 months",
        verified_purchase: true,
        source: "official_store",
        created_at: new Date().toISOString()
      }
    ];
  },

  async submitReview(review: any): Promise<ProductReview> {
    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(review),
      });
      if (res.ok) return res.json();
    } catch (e) {}

    return {
      id: Date.now(),
      product_id: review.product_id,
      product_name: "Be Bodywise Formulation",
      reviewer_name: review.reviewer_name || "Verified Customer",
      rating: review.rating,
      review_text: review.review_text,
      sentiment: review.rating >= 4 ? 'positive' : review.rating <= 2 ? 'negative' : 'mixed',
      aspect_tags: ["effectiveness", "texture", "absorption"],
      duration_used: review.duration_used || "1 month",
      verified_purchase: true,
      source: "community",
      created_at: new Date().toISOString()
    };
  },

  async getReviewIntelligence(productId: number): Promise<ReviewIntelligence> {
    try {
      const res = await fetch(`${API_BASE}/reviews/intelligence/${productId}`, { headers: getHeaders() });
      if (res.ok) return res.json();
    } catch (e) {}

    return {
      product_id: productId,
      product_name: "Be Bodywise Active Formulation",
      brand: "Be Bodywise",
      total_reviews: 14,
      average_rating: 4.6,
      sentiment_distribution: { positive_pct: 78, mixed_pct: 18, negative_pct: 4 },
      aspect_frequency: { effectiveness: 12, acne: 10, dryness: 8, texture: 6, absorption: 5 },
      common_benefits: [
        "Reduced stubborn back acne and body breakouts within 3 weeks",
        "Fragrance-free formula that does not sting gym sweat",
        "Noticeably smoother stratum corneum skin texture"
      ],
      common_drawbacks: [
        "Skin feels tight or dry if lotion is not applied immediately after shower",
        "Mild transient peeling during initial week of active desquamation"
      ],
      short_vs_long_term: {
        short_term: "Weeks 1-2: Noticeable clarifying of surface oiliness; occasional transient tightness post-shower.",
        long_term: "Weeks 4+: Consistent reduction in bumps, stabilized epidermal sebum, and visibly clearer skin."
      }
    };
  },

  // --- Feature 4: Product Experience Timeline ---
  async getTimeline(): Promise<TimelineEntry[]> {
    try {
      const res = await fetch(`${API_BASE}/timeline`, { headers: getHeaders() });
      if (res.ok) return res.json();
    } catch (e) {}

    return [
      { id: 1, user_id: 1, week_number: 1, date_logged: new Date(Date.now() - 21 * 86400000).toISOString(), notes: "Started 1% Salicylic body wash daily. Slight tingling in the shower, acne still active.", acne_score: 8.0, dryness_score: 3.5, irritation_score: 2.0, hydration_score: 6.0, satisfaction_score: 6.0 },
      { id: 2, user_id: 1, week_number: 2, date_logged: new Date(Date.now() - 14 * 86400000).toISOString(), notes: "Reduced acne on shoulders! However, arms feel tight and flaky after hot showers.", acne_score: 5.5, dryness_score: 6.8, irritation_score: 4.0, hydration_score: 4.5, satisfaction_score: 6.5 },
      { id: 3, user_id: 1, week_number: 3, date_logged: new Date(Date.now() - 7 * 86400000).toISOString(), notes: "Reduced body wash frequency to alternate days and lowered shower temp. Dryness easing off.", acne_score: 3.8, dryness_score: 4.5, irritation_score: 2.5, hydration_score: 6.5, satisfaction_score: 8.0 },
      { id: 4, user_id: 1, week_number: 4, date_logged: new Date().toISOString(), notes: "Current status: Acne mostly clear, skin feeling much smoother. Routine compatibility score high.", acne_score: 2.5, dryness_score: 3.0, irritation_score: 1.5, hydration_score: 7.8, satisfaction_score: 9.0 }
    ];
  },

  async logTimelineWeek(entry: any): Promise<TimelineEntry> {
    try {
      const res = await fetch(`${API_BASE}/timeline`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(entry),
      });
      if (res.ok) return res.json();
    } catch (e) {}

    return {
      id: Date.now(),
      user_id: 1,
      week_number: entry.week_number,
      date_logged: new Date().toISOString(),
      notes: entry.notes,
      acne_score: entry.acne_score,
      dryness_score: entry.dryness_score,
      irritation_score: entry.irritation_score,
      hydration_score: entry.hydration_score,
      satisfaction_score: entry.satisfaction_score
    };
  },

  // --- Feature 5: AI Assistant ---
  async askAssistant(message: string, context_type: string = 'all'): Promise<AssistantResponse> {
    try {
      const res = await fetch(`${API_BASE}/assistant/chat`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ message, context_type }),
      });
      if (res.ok) return res.json();
    } catch (e) {}

    const mLower = message.toLowerCase();
    let answer = "";
    if (mLower.includes('dry') || mLower.includes('tight')) {
      answer = "Based on your active routine, dryness frequently emerges when chemical exfoliants (such as 1% Salicylic Acid or 10% Lactic Acid) accelerate epidermal turnover faster than intercellular lipids can replenish.\n\nRecommended adjustment:\n1. Moderate usage frequency to alternate days (3 evenings per week).\n2. Seal with a 10% Urea or Ceramide cream within 3 minutes of washing while skin is damp.\n3. Keep shower water lukewarm rather than hot.";
    } else if (mLower.includes('conflict') || mLower.includes('too many') || mLower.includes('exfoliat')) {
      answer = "Reviewing your active products, multiple exfoliating active pathways were detected. We recommend adopting 'Skin Cycling':\n• Night 1: Exfoliate (AHA or BHA product)\n• Night 2: Retinoid or Treatment Serum\n• Nights 3 & 4: Recovery (Hydration, Ceramides, Squalane)\n\nThis prevents cumulative acid stacking and preserves your stratum corneum.";
    } else {
      answer = "Every active ingredient performs best when supported by balanced moisture and calibrated frequency. Introduce new active serums one at a time over a 2-week window, and never skip daytime broad-spectrum SPF 50 when using cell-renewing actives.";
    }

    return {
      response: answer,
      citations: [
        { source: "SkinSense Barrier Physiology Reference", details: "Transepidermal Water Loss (TEWL) post-keratolytic application." },
        { source: "Be Bodywise Formulation Protocol", details: "Active ingredient pairing thresholds." }
      ],
      suggested_followups: [
        "Why does my skin feel dry after using these products?",
        "Am I using too many exfoliating ingredients?",
        "What should I check before adding another product?"
      ],
      non_diagnostic_notice: "SkinSense provides formulation pharmacology insights and does not provide medical diagnoses or replace consultations with licensed dermatologists."
    };
  },

  // --- Feature 6: OCR Label Scanner ---
  async scanLabelOCR(payload: any): Promise<OCRResult> {
    try {
      const res = await fetch(`${API_BASE}/ocr/analyze`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      if (res.ok) return res.json();
    } catch (e) {}

    return {
      detected_text: payload.raw_text || "Aqua, Salicylic Acid (2%), Niacinamide (5%), Zinc PCA, Allantoin, Phenoxyethanol",
      identified_ingredients: ["Aqua", "Salicylic Acid", "Niacinamide", "Zinc PCA", "Allantoin"],
      active_compounds: [
        { name: "Salicylic Acid", classification: "BHA Exfoliant", purpose: "Penetrates sebum to clear pores", optimal_timing: "PM preferred" },
        { name: "Niacinamide", classification: "Vitamin B3", purpose: "Strengthens lipid barrier & reduces sebum", optimal_timing: "AM and PM" }
      ],
      potential_sensitizers: payload.raw_text?.toLowerCase().includes('parfum') ? ["Parfum (Fragrance)"] : [],
      cleanliness_score: payload.raw_text?.toLowerCase().includes('parfum') ? 85 : 98
    };
  },

  // --- Feature 7: Admin Analytics ---
  async getAdminAnalytics(category: string = 'all', timePeriod: string = 'last_30_days'): Promise<AdminAnalytics> {
    try {
      const res = await fetch(`${API_BASE}/admin/analytics?category=${category}&time_period=${timePeriod}`, {
        headers: getHeaders(),
      });
      if (res.ok) return res.json();
    } catch (e) {}

    return {
      time_period: timePeriod,
      total_anonymized_logs: 24,
      most_frequent_unwanted_effects: [
        { effect: "Post-wash dryness / tightness", count: 14 },
        { effect: "Transient flaking", count: 8 },
        { effect: "Mild tingling on shaved areas", count: 5 }
      ],
      most_common_positive_outcomes: [
        { outcome: "Reduced backne and shoulder bumps", count: 28 },
        { outcome: "Noticeably smoother skin texture", count: 22 },
        { outcome: "Faded post-blemish pigmentation", count: 15 }
      ],
      category_satisfaction: [
        { category: "Bodycare", satisfaction_pct: 88, product_count: 5 },
        { category: "Skincare", satisfaction_pct: 84, product_count: 3 },
        { category: "Haircare", satisfaction_pct: 91, product_count: 2 }
      ],
      product_performance_ranking: [
        { id: 1, name: "1% Salicylic Acid Body Wash", category: "bodycare", total_feedback: 16, complaint_rate_pct: 12, satisfaction_score: 88, primary_reported_unwanted: "Post-wash dryness if lotion is skipped" },
        { id: 2, name: "10% Lactic Acid Body Lotion", category: "bodycare", total_feedback: 11, complaint_rate_pct: 9, satisfaction_score: 91, primary_reported_unwanted: "Tingling on freshly shaved skin" },
        { id: 5, name: "3% Redensyl + Procapil Hair Serum", category: "haircare", total_feedback: 9, complaint_rate_pct: 7, satisfaction_score: 93, primary_reported_unwanted: "Week 2 shedding anxiety" }
      ],
      emerging_feedback_patterns: [
        {
          pattern: "High incidence of post-shower TEWL (dryness) when using 1% Salicylic Acid Body Wash",
          impact: "Customers stop using product prematurely believing it caused an allergy",
          recommended_action: "Update label instructions to mandate applying 10% Urea or Ceramide lotion within 3 minutes of bathing."
        },
        {
          pattern: "Retinol serum co-administered with AHA/BHA exfoliants in single PM routine",
          impact: "Elevated reports of stinging and peeling during Week 2",
          recommended_action: "Introduce 'Skin Cycling' educational card in routine builder and packaging QR code."
        }
      ]
    };
  }
};
