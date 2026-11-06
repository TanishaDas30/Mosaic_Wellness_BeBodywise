from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Auth & User Schemas ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    skin_type: Optional[str] = "Combination"
    skin_concerns: Optional[List[str]] = []
    hair_type: Optional[str] = "Wavy / Medium"
    scalp_type: Optional[str] = "Oily Scalp"
    hair_concerns: Optional[List[str]] = []

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    skin_type: Optional[str] = None
    skin_concerns: Optional[List[str]] = None
    hair_type: Optional[str] = None
    scalp_type: Optional[str] = None
    hair_concerns: Optional[List[str]] = None

class UserProfileResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    skin_type: str
    skin_concerns: List[str]
    hair_type: str
    scalp_type: str
    hair_concerns: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserProfileResponse


# --- Product Schemas ---
class ActiveIngredientItem(BaseModel):
    name: str
    percentage: Optional[str] = ""
    purpose: Optional[str] = ""

class ProductBase(BaseModel):
    name: str
    brand: Optional[str] = "Be Bodywise"
    category: str  # skincare, haircare, bodycare
    subcategory: Optional[str] = ""
    description: Optional[str] = ""
    active_ingredients: List[ActiveIngredientItem] = []
    full_ingredients: Optional[str] = ""
    instructions: Optional[str] = ""
    precautions: Optional[str] = ""
    pH_level: Optional[str] = "5.5"
    recommended_time: Optional[str] = "PM"  # AM, PM, BOTH
    frequency: Optional[str] = "Daily"
    is_verified: Optional[bool] = True
    image_url: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True


# --- User Product Schemas ---
class UserProductCreate(BaseModel):
    product_id: int
    purchased_for_concern: Optional[str] = None
    application_time: Optional[str] = "PM"
    frequency: Optional[str] = "Daily"
    notes: Optional[str] = None

class UserProductUpdate(BaseModel):
    is_active: Optional[bool] = None
    purchased_for_concern: Optional[str] = None
    application_time: Optional[str] = None
    frequency: Optional[str] = None
    notes: Optional[str] = None

class UserProductResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    is_active: bool
    purchased_for_concern: Optional[str]
    application_time: str
    frequency: str
    notes: Optional[str]
    added_at: datetime
    product: ProductResponse

    class Config:
        from_attributes = True


# --- Product Experience Schemas ---
class ExperienceCreate(BaseModel):
    product_id: int
    natural_language_feedback: str
    duration_weeks: Optional[int] = 3
    frequency_used: Optional[str] = "Daily"
    primary_concern: Optional[str] = None
    expected_result: Optional[str] = None
    actual_result: Optional[str] = None

class ExperienceResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    product_name: str
    brand: str
    natural_language_feedback: str
    duration_weeks: int
    frequency_used: str
    primary_concern: Optional[str]
    expected_result: Optional[str]
    actual_result: Optional[str]
    positive_outcomes: List[str]
    negative_outcomes: List[str]
    unwanted_reactions: List[str]
    classification: str
    ai_working_summary: Optional[str]
    ai_not_improved_summary: Optional[str]
    ai_explanations: List[str]
    ai_questions: List[str]
    ai_safe_next_steps: List[str]
    created_at: datetime

    class Config:
        from_attributes = True


# --- Routine Conflict & Compatibility Schemas ---
class RoutineCheckRequest(BaseModel):
    product_ids: Optional[List[int]] = None
    manual_products: Optional[List[Dict[str, Any]]] = None
    routine_category: Optional[str] = "skincare"

class ConflictCard(BaseModel):
    id: str
    title: str
    risk_level: str  # "caution", "moderate", "high", "info"
    ingredients: List[str]
    products_involved: List[str]
    why: str
    missing_info: str
    safe_alternatives: List[str]

class RoutineStep(BaseModel):
    step_number: int
    step_name: str
    product_name: str
    brand: str
    product_id: Optional[int] = None
    recommended_frequency: str
    application_order_reason: str
    precautions: str
    attention_ingredients: List[str]
    alternate_day_note: Optional[str] = None

class RoutineAnalysisResponse(BaseModel):
    id: Optional[int] = None
    routine_category: str
    overall_score: int
    score_breakdown: Dict[str, int]
    identified_conflicts: List[ConflictCard]
    structured_am_routine: List[RoutineStep]
    structured_pm_routine: List[RoutineStep]
    missing_steps: List[Dict[str, str]]
    disclaimer: str


# --- Review Schemas ---
class ReviewCreate(BaseModel):
    product_id: int
    reviewer_name: Optional[str] = "Verified Customer"
    rating: float
    review_text: str
    duration_used: Optional[str] = "1 month"
    verified_purchase: Optional[bool] = True
    source: Optional[str] = "community"

class ReviewResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    reviewer_name: str
    rating: float
    review_text: str
    sentiment: str
    aspect_tags: List[str]
    duration_used: str
    verified_purchase: bool
    source: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- Timeline Log Schemas ---
class TimelineLogCreate(BaseModel):
    product_id: Optional[int] = None
    week_number: int
    notes: Optional[str] = None
    acne_score: float = Field(default=5.0, ge=1.0, le=10.0)
    dryness_score: float = Field(default=3.0, ge=1.0, le=10.0)
    irritation_score: float = Field(default=2.0, ge=1.0, le=10.0)
    hydration_score: float = Field(default=7.0, ge=1.0, le=10.0)
    satisfaction_score: float = Field(default=8.0, ge=1.0, le=10.0)

class TimelineLogResponse(BaseModel):
    id: int
    user_id: int
    product_id: Optional[int]
    week_number: int
    date_logged: datetime
    notes: Optional[str]
    acne_score: float
    dryness_score: float
    irritation_score: float
    hydration_score: float
    satisfaction_score: float

    class Config:
        from_attributes = True


# --- AI Assistant Schemas ---
class AssistantQueryRequest(BaseModel):
    message: str
    context_type: Optional[str] = "all"  # routine, experience, product, all

class AssistantResponse(BaseModel):
    response: str
    citations: List[Dict[str, str]]
    suggested_followups: List[str]
    non_diagnostic_notice: str
    source: Optional[str] = "gemini"  # "gemini" or "fallback"
    model: Optional[str] = None
    error: Optional[str] = None

class GeminiHealthResponse(BaseModel):
    status: str
    configured: bool
    connected: bool
    model: str
    message: str
    error: Optional[str] = None
    sample_output: Optional[str] = None


# --- OCR Schemas ---
class OCRRequest(BaseModel):
    image_base64: Optional[str] = None
    image_url: Optional[str] = None
    raw_text: Optional[str] = None

class OCRResponse(BaseModel):
    detected_text: str
    identified_ingredients: List[str]
    active_compounds: List[Dict[str, str]]
    potential_sensitizers: List[str]
    cleanliness_score: int
