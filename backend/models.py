import json
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="user")  # "user" or "admin"
    
    # Skin profile
    skin_type = Column(String(100), default="Combination")  # Oily, Dry, Combination, Sensitive, Normal
    skin_concerns = Column(Text, default="[]")  # JSON list
    
    # Hair & Scalp profile
    hair_type = Column(String(100), default="Wavy / Medium")
    scalp_type = Column(String(100), default="Oily Scalp")
    hair_concerns = Column(Text, default="[]")  # JSON list
    
    created_at = Column(DateTime, default=datetime.utcnow)

    user_products = relationship("UserProduct", back_populates="user", cascade="all, delete-orphan")
    experiences = relationship("ProductExperience", back_populates="user", cascade="all, delete-orphan")
    routine_analyses = relationship("RoutineAnalysis", back_populates="user", cascade="all, delete-orphan")
    timeline_logs = relationship("TimelineLog", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("ProductReview", back_populates="user", cascade="all, delete-orphan")

    def get_skin_concerns(self):
        try:
            return json.loads(self.skin_concerns)
        except Exception:
            return []

    def get_hair_concerns(self):
        try:
            return json.loads(self.hair_concerns)
        except Exception:
            return []


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    brand = Column(String(150), default="Be Bodywise", index=True)
    category = Column(String(50), nullable=False)  # "skincare", "haircare", "bodycare"
    subcategory = Column(String(100), nullable=True)  # Cleanser, Serum, Moisturizer, Roll-on, Shampoo, etc.
    description = Column(Text, nullable=True)
    
    # Active ingredients stored as JSON array: [{"name": "Salicylic Acid", "percentage": "1%", "purpose": "BHA exfoliant"}]
    active_ingredients = Column(Text, default="[]")
    full_ingredients = Column(Text, default="")
    
    instructions = Column(Text, nullable=True)
    precautions = Column(Text, nullable=True)
    pH_level = Column(String(50), default="5.5")
    recommended_time = Column(String(50), default="PM")  # AM, PM, BOTH
    frequency = Column(String(100), default="Daily")      # Daily, 2-3 times/week, Alternate days
    is_verified = Column(Boolean, default=True)
    image_url = Column(String(500), nullable=True)
    
    user_products = relationship("UserProduct", back_populates="product")
    experiences = relationship("ProductExperience", back_populates="product")
    reviews = relationship("ProductReview", back_populates="product")

    def get_active_ingredients(self):
        try:
            return json.loads(self.active_ingredients)
        except Exception:
            return []


class UserProduct(Base):
    __tablename__ = "user_products"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    is_active = Column(Boolean, default=True)
    purchased_for_concern = Column(String(200), nullable=True)
    application_time = Column(String(50), default="PM")  # AM, PM, BOTH
    frequency = Column(String(100), default="Daily")
    custom_order = Column(Integer, default=1)
    notes = Column(Text, nullable=True)
    added_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="user_products")
    product = relationship("Product", back_populates="user_products")
    experiences = relationship("ProductExperience", back_populates="user_product")


class ProductExperience(Base):
    __tablename__ = "product_experiences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    user_product_id = Column(Integer, ForeignKey("user_products.id"), nullable=True)

    natural_language_feedback = Column(Text, nullable=False)
    duration_weeks = Column(Integer, default=3)
    frequency_used = Column(String(100), default="Daily")
    
    primary_concern = Column(String(200), nullable=True)
    expected_result = Column(String(255), nullable=True)
    actual_result = Column(String(255), nullable=True)

    # JSON stored fields
    positive_outcomes = Column(Text, default="[]")    # JSON list of strings
    negative_outcomes = Column(Text, default="[]")    # JSON list of strings
    unwanted_reactions = Column(Text, default="[]")   # JSON list of strings
    classification = Column(String(50), default="mixed") # "positive", "mixed", "negative", "neutral"

    # AI Generated Explanations & Report
    ai_working_summary = Column(Text, nullable=True)
    ai_not_improved_summary = Column(Text, nullable=True)
    ai_explanations = Column(Text, default="[]")      # JSON list of hypotheses
    ai_questions = Column(Text, default="[]")         # JSON list of reflection questions
    ai_safe_next_steps = Column(Text, default="[]")   # JSON list of actionable instructions

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="experiences")
    product = relationship("Product", back_populates="experiences")
    user_product = relationship("UserProduct", back_populates="experiences")


class RoutineAnalysis(Base):
    __tablename__ = "routine_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    routine_category = Column(String(50), default="skincare") # "skincare" or "haircare"
    
    overall_score = Column(Integer, default=85) # 0 to 100
    score_breakdown = Column(Text, default="{}") # JSON: duplication, overlap, complexity, precautions, missing_info
    
    # Conflict cards: JSON list of { title, risk_level, ingredients, products_involved, why, missing_info, safe_alternatives }
    identified_conflicts = Column(Text, default="[]")
    
    # Structured routines
    structured_am_routine = Column(Text, default="[]") # JSON list of ordered steps with timing, frequency, precautions
    structured_pm_routine = Column(Text, default="[]") # JSON list of ordered steps
    missing_steps = Column(Text, default="[]")         # JSON list of recommendations (e.g. missing SPF or moisturizer)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="routine_analyses")


class ProductReview(Base):
    __tablename__ = "product_reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    reviewer_name = Column(String(150), default="Anonymous Verified Customer")
    rating = Column(Float, default=4.5)
    review_text = Column(Text, nullable=False)
    sentiment = Column(String(50), default="positive") # positive, negative, mixed
    
    # NLP aspect classifications: JSON list of strings (e.g. ["effectiveness", "dryness", "texture"])
    aspect_tags = Column(Text, default="[]")
    duration_used = Column(String(100), default="1 month")
    verified_purchase = Column(Boolean, default=True)
    source = Column(String(100), default="official_store") # official_store, community, survey, uploaded_screenshot
    
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="reviews")
    user = relationship("User", back_populates="reviews")


class TimelineLog(Base):
    __tablename__ = "timeline_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    
    week_number = Column(Integer, default=1)
    date_logged = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)
    
    # Quantitative outcome tracking (1 to 10 or 0 to 100)
    acne_score = Column(Float, default=5.0)       # 1=clear, 10=severe
    dryness_score = Column(Float, default=3.0)    # 1=hydrated, 10=extremely dry
    irritation_score = Column(Float, default=2.0) # 1=calm, 10=inflamed
    hydration_score = Column(Float, default=7.0)  # 1=parched, 10=dewy
    satisfaction_score = Column(Float, default=8.0) # 1=unhappy, 10=delighted

    user = relationship("User", back_populates="timeline_logs")


class AssistantMessage(Base):
    __tablename__ = "assistant_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    citations = Column(Text, default="[]") # JSON list of product references or ingredient docs
    created_at = Column(DateTime, default=datetime.utcnow)
