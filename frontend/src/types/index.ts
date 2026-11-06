export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
  skin_type: string;
  skin_concerns: string[];
  hair_type: string;
  scalp_type: string;
  hair_concerns: string[];
  created_at: string;
}

export interface ActiveIngredient {
  name: string;
  percentage?: string;
  purpose?: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: 'skincare' | 'haircare' | 'bodycare';
  subcategory?: string;
  description?: string;
  active_ingredients: ActiveIngredient[];
  full_ingredients?: string;
  instructions?: string;
  precautions?: string;
  pH_level?: string;
  recommended_time?: 'AM' | 'PM' | 'BOTH';
  frequency?: string;
  is_verified?: boolean;
  image_url?: string;
}

export interface UserProduct {
  id: number;
  user_id: number;
  product_id: number;
  is_active: boolean;
  purchased_for_concern?: string;
  application_time: 'AM' | 'PM' | 'BOTH';
  frequency: string;
  notes?: string;
  added_at: string;
  product: Product;
}

export interface ProductExperience {
  id: number;
  user_id: number;
  product_id: number;
  product_name: string;
  brand: string;
  natural_language_feedback: string;
  duration_weeks: number;
  frequency_used: string;
  primary_concern?: string;
  expected_result?: string;
  actual_result?: string;
  positive_outcomes: string[];
  negative_outcomes: string[];
  unwanted_reactions: string[];
  classification: 'positive' | 'mixed' | 'negative' | 'neutral';
  ai_working_summary?: string;
  ai_not_improved_summary?: string;
  ai_explanations: string[];
  ai_questions: string[];
  ai_safe_next_steps: string[];
  created_at: string;
}

export interface ConflictCardData {
  id: string;
  title: string;
  risk_level: 'high' | 'moderate' | 'caution' | 'info';
  ingredients: string[];
  products_involved: string[];
  why: string;
  missing_info: string;
  safe_alternatives: string[];
}

export interface RoutineStep {
  step_number: number;
  step_name: string;
  product_name: string;
  brand: string;
  product_id?: number;
  recommended_frequency: string;
  application_order_reason: string;
  precautions: string;
  attention_ingredients: string[];
  alternate_day_note?: string | null;
}

export interface RoutineAnalysisResult {
  id?: number;
  routine_category: string;
  overall_score: number;
  score_breakdown: {
    duplication_balance: number;
    ingredient_compatibility: number;
    application_flow: number;
    barrier_safety: number;
    completeness: number;
  };
  identified_conflicts: ConflictCardData[];
  structured_am_routine: RoutineStep[];
  structured_pm_routine: RoutineStep[];
  missing_steps: { step: string; reason: string }[];
  disclaimer: string;
}

export interface ProductReview {
  id: number;
  product_id: number;
  product_name: string;
  reviewer_name: string;
  rating: number;
  review_text: string;
  sentiment: 'positive' | 'mixed' | 'negative';
  aspect_tags: string[];
  duration_used: string;
  verified_purchase: boolean;
  source: string;
  created_at: string;
}

export interface ReviewIntelligence {
  product_id: number;
  product_name: string;
  brand: string;
  total_reviews: number;
  average_rating: number;
  sentiment_distribution: {
    positive_pct: number;
    mixed_pct: number;
    negative_pct: number;
  };
  aspect_frequency: Record<string, number>;
  common_benefits: string[];
  common_drawbacks: string[];
  short_vs_long_term: {
    short_term: string;
    long_term: string;
  };
}

export interface TimelineEntry {
  id: number;
  user_id: number;
  product_id?: number;
  week_number: number;
  date_logged: string;
  notes?: string;
  acne_score: number;
  dryness_score: number;
  irritation_score: number;
  hydration_score: number;
  satisfaction_score: number;
}

export interface AssistantResponse {
  response: string;
  citations: { source: string; details: string }[];
  suggested_followups: string[];
  non_diagnostic_notice: string;
  source?: 'gemini' | 'fallback';
  model?: string;
  error?: string;
}

export interface GeminiHealthStatus {
  status: 'connected' | 'not_configured' | 'error' | 'empty_response';
  configured: boolean;
  connected: boolean;
  model: string;
  message: string;
  error?: string;
  sample_output?: string;
}

export interface OCRResult {
  detected_text: string;
  identified_ingredients: string[];
  active_compounds: {
    name: string;
    classification: string;
    purpose: string;
    optimal_timing: string;
  }[];
  potential_sensitizers: string[];
  cleanliness_score: number;
}

export interface AdminAnalytics {
  time_period: string;
  total_anonymized_logs: number;
  most_frequent_unwanted_effects: { effect: string; count: number }[];
  most_common_positive_outcomes: { outcome: string; count: number }[];
  category_satisfaction: {
    category: string;
    satisfaction_pct: number;
    product_count: number;
  }[];
  product_performance_ranking: {
    id: number;
    name: string;
    category: string;
    total_feedback: number;
    complaint_rate_pct: number;
    satisfaction_score: number;
    primary_reported_unwanted: string;
  }[];
  emerging_feedback_patterns: {
    pattern: string;
    impact: string;
    recommended_action: string;
  }[];
}
