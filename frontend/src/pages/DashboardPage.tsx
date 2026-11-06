import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UserProduct, RoutineAnalysisResult, ProductExperience, TimelineEntry } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { ConflictCard } from '../components/ConflictCard';
import {
  Sparkles,
  ShieldAlert,
  Calendar,
  Layers,
  Activity,
  PlusCircle,
  ArrowRight,
  Sun,
  Moon,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Bot
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user, routineCategory, setRoutineCategory } = useAuth();
  const [userProducts, setUserProducts] = useState<UserProduct[]>([]);
  const [routineAnalysis, setRoutineAnalysis] = useState<RoutineAnalysisResult | null>(null);
  const [experiences, setExperiences] = useState<ProductExperience[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [routineCategory]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [prods, analysis, exps, tl] = await Promise.all([
        api.getUserRoutine(),
        api.getLatestRoutine(routineCategory),
        api.getExperienceHistory(),
        api.getTimeline(),
      ]);
      setUserProducts(prods);
      setRoutineAnalysis(analysis);
      setExperiences(exps);
      setTimeline(tl);
    } catch (e) {
      console.error('Failed to load dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (userProdId: number) => {
    if (confirm('Remove this product from your active routine?')) {
      await api.removeFromRoutine(userProdId);
      loadDashboardData();
    }
  };

  // Filter products by category
  const activeCategoryProducts = userProducts.filter((up) => {
    if (routineCategory === 'skincare') {
      return up.product.category === 'skincare' || up.product.category === 'bodycare';
    }
    return up.product.category === 'haircare';
  });

  const amProducts = activeCategoryProducts.filter((p) => p.application_time === 'AM' || p.application_time === 'BOTH');
  const pmProducts = activeCategoryProducts.filter((p) => p.application_time === 'PM' || p.application_time === 'BOTH');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner & Routine Category Switcher */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-sage-50 px-2.5 py-0.5 rounded-full border border-sage-200">
              Personalized Intelligence Dashboard
            </span>
            <span className="text-xs text-charcoal-400 font-medium">• {user?.skin_type} Skin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Friend'}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 max-w-xl">
            {routineCategory === 'skincare'
              ? 'Monitoring multi-active skin barrier health, acid accumulation, and hydration balance.'
              : 'Tracking scalp follicle revitalization, anagen phase activation, and shedding cycles.'}
          </p>
        </div>

        {/* Switcher & Action buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 z-10">
          <div className="flex bg-ivory-100 p-1 rounded-2xl border border-sage-200">
            <button
              onClick={() => setRoutineCategory('skincare')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                routineCategory === 'skincare'
                  ? 'bg-sage-600 text-white shadow-sm'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              Skincare & Body
            </button>
            <button
              onClick={() => setRoutineCategory('haircare')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                routineCategory === 'haircare'
                  ? 'bg-sage-600 text-white shadow-sm'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              Hair & Scalp
            </button>
          </div>

          <button
            onClick={() => onNavigate('experience')}
            className="px-4 py-2.5 rounded-2xl bg-sage-500 hover:bg-sage-600 text-white text-xs font-semibold shadow-subtle flex items-center justify-center space-x-1.5 transition"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Record Experience</span>
          </button>
        </div>
      </div>

      {/* Routine Compatibility Score & Potential Conflicts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Gauge */}
        <div className="lg:col-span-1">
          {routineAnalysis ? (
            <ScoreGauge
              score={routineAnalysis.overall_score}
              breakdown={routineAnalysis.score_breakdown}
            />
          ) : (
            <div className="bg-white rounded-3xl p-6 border border-sage-100 shadow-card text-center py-12">
              <Sparkles className="w-8 h-8 text-sage-400 mx-auto mb-2" />
              <p className="text-xs text-charcoal-500">Add products to compute your Routine Compatibility Score.</p>
              <button
                onClick={() => onNavigate('add-product')}
                className="mt-3 px-4 py-2 rounded-xl bg-sage-600 text-white text-xs font-semibold"
              >
                Add Products
              </button>
            </div>
          )}
        </div>

        {/* Potential Routine Conflicts Summary */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-sage-100 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-charcoal-900">
                Potential Routine Conflicts ({routineAnalysis?.identified_conflicts.length || 0})
              </h2>
            </div>
            <button
              onClick={() => onNavigate('routine')}
              className="text-xs font-semibold text-sage-700 hover:text-sage-900 flex items-center space-x-1"
            >
              <span>View In-Depth Analysis</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {routineAnalysis && routineAnalysis.identified_conflicts.length > 0 ? (
            <div className="space-y-3">
              {routineAnalysis.identified_conflicts.slice(0, 2).map((conflict) => (
                <ConflictCard key={conflict.id} conflict={conflict} />
              ))}
              {routineAnalysis.identified_conflicts.length > 2 && (
                <p className="text-[11px] text-charcoal-500 text-center italic">
                  + {routineAnalysis.identified_conflicts.length - 2} additional compatibility notice(s) in routine checker.
                </p>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-sage-50/70 border border-sage-200 text-center text-xs text-sage-800">
              <CheckCircle2 className="w-6 h-6 text-sage-600 mx-auto mb-2" />
              <p className="font-semibold">No critical chemical conflicts detected in current routine!</p>
              <p className="text-charcoal-500 mt-0.5">Your active ingredients maintain healthy pH and barrier balance.</p>
            </div>
          )}
        </div>
      </div>

      {/* 1. My Current Routine & Products I am Using */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-sage-50 px-2.5 py-0.5 rounded-full border border-sage-200">
              Routine Inventory
            </span>
            <h2 className="text-xl font-bold text-charcoal-900 mt-1">
              Products Currently in My Routine ({activeCategoryProducts.length})
            </h2>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('planner')}
              className="px-3.5 py-2 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-charcoal-700 text-xs font-semibold border border-sage-200 flex items-center space-x-1.5 transition"
            >
              <Calendar className="w-3.5 h-3.5 text-sage-600" />
              <span>AM/PM Schedule</span>
            </button>
            <button
              onClick={() => onNavigate('add-product')}
              className="px-3.5 py-2 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {activeCategoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCategoryProducts.map((up) => {
              const p = up.product;
              return (
                <div
                  key={up.id}
                  className="bg-ivory-50/60 rounded-2xl p-4 border border-sage-100 hover:border-sage-300 hover:shadow-subtle transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-sage-700 bg-white px-2 py-0.5 rounded-full border border-sage-200">
                        {p.subcategory || p.category}
                      </span>
                      <div className="flex items-center space-x-1 text-xs">
                        {up.application_time === 'AM' && <Sun className="w-4 h-4 text-amber-500" />}
                        {up.application_time === 'PM' && <Moon className="w-4 h-4 text-lavender-600" />}
                        {up.application_time === 'BOTH' && (
                          <span className="flex text-charcoal-400">
                            <Sun className="w-3.5 h-3.5 text-amber-500" />
                            <Moon className="w-3.5 h-3.5 text-lavender-600" />
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-charcoal-900 leading-snug">{p.name}</h3>
                      <p className="text-[11px] text-charcoal-500">{p.brand}</p>
                    </div>

                    {up.purchased_for_concern && (
                      <p className="text-[11px] text-charcoal-600 bg-white p-2 rounded-lg border border-beige-200">
                        Target: <span className="font-semibold text-charcoal-800">{up.purchased_for_concern}</span>
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1 pt-1">
                      {p.active_ingredients?.map((act, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-white text-sage-800 px-2 py-0.5 rounded border border-sage-200 font-medium"
                        >
                          {act.name} {act.percentage ? `(${act.percentage})` : ''}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-sage-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-charcoal-400">{up.frequency}</span>
                    <button
                      onClick={() => handleRemoveProduct(up.id)}
                      className="text-charcoal-400 hover:text-red-600 transition p-1"
                      title="Remove from routine"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-charcoal-500 bg-ivory-50 rounded-2xl border border-dashed border-sage-200">
            No products currently saved for {routineCategory}. Search the catalog or scan your bottle label.
          </div>
        )}
      </div>

      {/* Product Experience History & Weekly Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Experience Summary */}
        <div className="bg-white rounded-3xl p-6 border border-sage-100 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-sage-600" />
              <h2 className="text-base font-bold text-charcoal-900">Weekly Experience Summary</h2>
            </div>
            <button
              onClick={() => onNavigate('timeline')}
              className="text-xs font-semibold text-sage-700 hover:text-sage-900 flex items-center space-x-1"
            >
              <span>Interactive Graph</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {timeline.length > 0 ? (
            <div className="space-y-3">
              {timeline.slice(-3).map((tl) => (
                <div key={tl.id} className="p-3.5 rounded-xl bg-ivory-50 border border-sage-100 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-charcoal-900">Week {tl.week_number} Check-in</span>
                    <span className="text-[10px] text-charcoal-400">{new Date(tl.date_logged).toLocaleDateString()}</span>
                  </div>
                  <p className="text-charcoal-600 italic leading-relaxed">"{tl.notes}"</p>
                  <div className="flex gap-3 text-[11px] font-medium text-charcoal-500 pt-1">
                    <span>Acne Score: <strong className="text-charcoal-800">{tl.acne_score}/10</strong></span>
                    <span>Dryness: <strong className="text-charcoal-800">{tl.dryness_score}/10</strong></span>
                    <span>Satisfaction: <strong className="text-sage-700">{tl.satisfaction_score}/10</strong></span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-charcoal-500 py-4 text-center">No weekly progress check-ins recorded yet.</p>
          )}
        </div>

        {/* Product Feedback & Experience Intelligence */}
        <div className="bg-white rounded-3xl p-6 border border-sage-100 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-lavender-600" />
              <h2 className="text-base font-bold text-charcoal-900">Recent Experience Diagnosis</h2>
            </div>
            <button
              onClick={() => onNavigate('experience')}
              className="text-xs font-semibold text-sage-700 hover:text-sage-900 flex items-center space-x-1"
            >
              <span>All Logs ({experiences.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {experiences.length > 0 ? (
            <div className="space-y-3">
              {experiences.slice(0, 1).map((exp) => (
                <div key={exp.id} className="p-4 rounded-2xl bg-ivory-50 border border-sage-200 text-xs space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-charcoal-900">{exp.product_name}</h4>
                      <p className="text-[10px] text-charcoal-400">{exp.duration_weeks} weeks • {exp.frequency_used}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                      {exp.classification}
                    </span>
                  </div>

                  <p className="text-charcoal-700 italic bg-white p-2.5 rounded-xl border border-beige-200">
                    "{exp.natural_language_feedback}"
                  </p>

                  <div className="space-y-1 pt-1">
                    <p className="text-[11px] text-emerald-800 font-semibold">
                      ✓ Working: <span className="font-normal text-charcoal-700">{exp.ai_working_summary || exp.positive_outcomes[0]}</span>
                    </p>
                    {exp.negative_outcomes.length > 0 && (
                      <p className="text-[11px] text-amber-800 font-semibold">
                        ⚠ Not Improved: <span className="font-normal text-charcoal-700">{exp.ai_not_improved_summary || exp.negative_outcomes[0]}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-charcoal-500 py-4 text-center">No product experience logs recorded yet.</p>
          )}

          {/* Quick AI Assistant Link */}
          <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs">
              <Bot className="w-4 h-4 text-sage-600" />
              <span className="font-medium text-sage-900">Have questions about your skin response?</span>
            </div>
            <button
              onClick={() => onNavigate('assistant')}
              className="text-xs font-bold text-sage-700 hover:text-sage-900 underline"
            >
              Ask AI Assistant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
