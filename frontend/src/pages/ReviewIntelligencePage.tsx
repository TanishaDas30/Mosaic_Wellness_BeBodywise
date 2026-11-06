import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Product, ProductReview, ReviewIntelligence } from '../types';
import {
  MessageSquare,
  Search,
  Filter,
  Star,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  Upload,
  PlusCircle
} from 'lucide-react';

export const ReviewIntelligencePage: React.FC = () => {
  const { routineCategory } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [intelligence, setIntelligence] = useState<ReviewIntelligence | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [selectedAspect, setSelectedAspect] = useState<string>('all');

  // Submit Review Modal/Form State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5.0);
  const [newDuration, setNewDuration] = useState('1 month');
  const [submitting, setSubmitting] = useState(false);

  const aspectsList = [
    'all',
    'effectiveness',
    'irritation',
    'dryness',
    'pigmentation',
    'acne',
    'hair fall',
    'texture',
    'fragrance',
    'absorption',
    'long-term results'
  ];

  useEffect(() => {
    loadProducts();
  }, [routineCategory]);

  useEffect(() => {
    if (selectedProductId) {
      loadReviewsAndIntelligence(selectedProductId);
    }
  }, [selectedProductId, sentimentFilter, selectedAspect]);

  const loadProducts = async () => {
    try {
      const prods = await api.getProducts(routineCategory);
      setProducts(prods);
      if (prods.length > 0 && !selectedProductId) {
        setSelectedProductId(prods[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadReviewsAndIntelligence = async (pId: number) => {
    try {
      const [revs, intel] = await Promise.all([
        api.getReviews({
          product_id: pId,
          sentiment: sentimentFilter,
          aspect: selectedAspect,
          search: searchTerm,
        }),
        api.getReviewIntelligence(pId),
      ]);
      setReviews(revs);
      setIntelligence(intel);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProductId) loadReviewsAndIntelligence(selectedProductId);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !newReviewText) return;

    setSubmitting(true);
    try {
      await api.submitReview({
        product_id: selectedProductId,
        rating: newRating,
        review_text: newReviewText,
        duration_used: newDuration,
        verified_purchase: true,
        source: 'community',
      });
      setShowSubmitModal(false);
      setNewReviewText('');
      loadReviewsAndIntelligence(selectedProductId);
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-sage-50 px-2.5 py-0.5 rounded-full border border-sage-200">
              Supporting Module
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
              AI Product Review Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-500 max-w-2xl">
              Distill customer feedback through pharmacological NLP. Filter by 10 clinical aspects, analyze verified purchases,
              and compare short-term initial reactions vs long-term stratum corneum outcomes.
            </p>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-sage-600 text-white text-xs font-semibold hover:bg-sage-700 transition shadow-xs flex items-center space-x-1.5 self-start md:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Submit / Upload Review</span>
          </button>
        </div>
      </div>

      {/* Product Selector Ribbon */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {products.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedProductId(p.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedProductId === p.id
                ? 'bg-sage-600 text-white border-sage-600 shadow-sm'
                : 'bg-white text-charcoal-700 border-sage-200 hover:bg-beige-50'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Intelligence Synthesis Overview (Benefits vs Drawbacks, Short vs Long Term) */}
      {intelligence && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sentiment & Aspect Frequency (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-sage-100 shadow-card space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                  Aggregate NLP Score
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-extrabold text-charcoal-900">{intelligence.average_rating}</span>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-charcoal-400 font-medium">({intelligence.total_reviews} reviews)</span>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="text-emerald-700 font-bold block">{intelligence.sentiment_distribution.positive_pct}% Positive</span>
                <span className="text-amber-700 font-bold block">{intelligence.sentiment_distribution.mixed_pct}% Mixed</span>
                <span className="text-red-700 font-bold block">{intelligence.sentiment_distribution.negative_pct}% Critical</span>
              </div>
            </div>

            {/* Aspect Frequency Tags */}
            <div className="pt-2 border-t border-sage-100 space-y-2">
              <span className="text-xs font-bold text-charcoal-800 uppercase tracking-wider block">
                Top NLP Aspect Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(intelligence.aspect_frequency).map(([aspect, count]) => (
                  <button
                    key={aspect}
                    onClick={() => setSelectedAspect(aspect)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition flex items-center space-x-1 ${
                      selectedAspect === aspect
                        ? 'bg-sage-600 text-white border-sage-600 font-bold'
                        : 'bg-ivory-50 text-charcoal-700 border-sage-200 hover:bg-beige-50'
                    }`}
                  >
                    <span className="capitalize">{aspect}</span>
                    <span className="text-[9px] opacity-75 font-mono">({count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Benefits, Drawbacks & Short vs Long Term (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-sage-100 shadow-card space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Common Benefits */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center space-x-1.5 text-emerald-900 font-bold uppercase tracking-wider text-[11px]">
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Frequently Reported Benefits</span>
                </div>
                <ul className="space-y-1.5 text-emerald-950">
                  {intelligence.common_benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>"{b}..."</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common Drawbacks */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center space-x-1.5 text-amber-900 font-bold uppercase tracking-wider text-[11px]">
                  <ThumbsDown className="w-3.5 h-3.5 text-amber-600" />
                  <span>Common Complaints / Drawbacks</span>
                </div>
                <ul className="space-y-1.5 text-amber-950">
                  {intelligence.common_drawbacks.map((d, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>"{d}..."</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Short vs Long Term Differences */}
            <div className="p-4 rounded-2xl bg-lavender-50/60 border border-lavender-200 text-xs space-y-2">
              <span className="font-bold text-lavender-900 uppercase tracking-wider text-[11px] block">
                Short-Term (&lt;3 Weeks) vs Long-Term (&gt;6 Weeks) Differences
              </span>
              <p className="text-charcoal-700 leading-relaxed">
                <strong>Initial Usage: </strong>{intelligence.short_vs_long_term.short_term}
              </p>
              <p className="text-charcoal-700 leading-relaxed">
                <strong>Extended Usage: </strong>{intelligence.short_vs_long_term.long_term}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Review Filters & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-sage-100 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Aspect Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-charcoal-400 uppercase tracking-wider mr-1">Aspect:</span>
          {aspectsList.map((a) => (
            <button
              key={a}
              onClick={() => setSelectedAspect(a)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all border ${
                selectedAspect === a
                  ? 'bg-sage-600 text-white border-sage-600'
                  : 'bg-ivory-50 text-charcoal-600 border-sage-200 hover:bg-beige-50'
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Sentiment Filter */}
        <div className="flex items-center space-x-2">
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="p-2 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-800 font-medium"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive Experiences</option>
            <option value="mixed">Mixed Outcomes</option>
            <option value="negative">Negative / Critical</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-3xl p-6 border border-sage-100 shadow-card hover:shadow-subtle transition-all space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-sage-100 text-sage-800 font-bold text-xs flex items-center justify-center">
                  {rev.reviewer_name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-charcoal-900">{rev.reviewer_name}</span>
                    {rev.verified_purchase && (
                      <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified Customer</span>
                      </span>
                    )}
                    <span className="text-[10px] text-charcoal-400 capitalize">• Source: {rev.source}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[10px] font-semibold text-sage-700 bg-sage-50 px-2 py-0.5 rounded-md border border-sage-200">
                      {rev.product_name}
                    </span>
                    <span className="text-[11px] text-charcoal-400">• Duration Used: {rev.duration_used}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-ivory-300'}`}
                    />
                  ))}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    rev.sentiment === 'positive'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : rev.sentiment === 'mixed'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-red-100 text-red-800 border-red-200'
                  }`}
                >
                  {rev.sentiment}
                </span>
              </div>
            </div>

            <p className="text-xs text-charcoal-700 leading-relaxed font-sans">
              "{rev.review_text}"
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider mr-1">
                Aspects Extracted:
              </span>
              {rev.aspect_tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-ivory-100 text-sage-900 px-2 py-0.5 rounded-md border border-sage-200 font-medium capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center text-xs text-charcoal-400 border border-sage-100">
            No customer reviews found matching the selected filters.
          </div>
        )}
      </div>

      {/* Submit Review Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-sage-200 shadow-float space-y-4">
            <h3 className="text-lg font-bold text-charcoal-900">
              Submit Product Feedback / Review
            </h3>
            <p className="text-xs text-charcoal-500">
              For: <span className="font-bold text-sage-800">{selectedProduct?.name}</span>
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Overall Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className={`p-2 rounded-xl text-xs font-bold transition ${
                        newRating === star
                          ? 'bg-amber-400 text-charcoal-900 shadow-xs'
                          : 'bg-ivory-100 text-charcoal-600 hover:bg-beige-100'
                      }`}
                    >
                      ★ {star}.0
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Duration of Usage
                </label>
                <input
                  type="text"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  placeholder="e.g. 3 weeks, 2 months"
                  className="w-full p-2.5 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Review Text
                </label>
                <textarea
                  required
                  rows={4}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Describe the texture, effectiveness, irritation, or long-term skin changes noticed..."
                  className="w-full p-3 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-400 leading-relaxed font-sans"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-600 hover:bg-beige-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-sage-600 text-white text-xs font-semibold hover:bg-sage-700 shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Analyzing & Posting...' : 'Publish Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
