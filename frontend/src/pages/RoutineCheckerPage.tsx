import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Product, UserProduct, RoutineAnalysisResult } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { ConflictCard } from '../components/ConflictCard';
import {
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Layers,
  Calendar,
  CheckCircle2,
  Plus,
  Trash2,
  RefreshCw,
  Sun,
  Moon,
  Info,
  Sliders,
  ScanLine
} from 'lucide-react';

interface RoutineCheckerPageProps {
  onNavigateToPlanner: () => void;
  onNavigateToAddProduct: () => void;
}

export const RoutineCheckerPage: React.FC<RoutineCheckerPageProps> = ({
  onNavigateToPlanner,
  onNavigateToAddProduct,
}) => {
  const { user, routineCategory, setRoutineCategory } = useAuth();
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [analysisResult, setAnalysisResult] = useState<RoutineAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadRoutineData();
  }, [routineCategory]);

  const loadRoutineData = async () => {
    setLoading(true);
    try {
      const [allProds, userRoutine, latest] = await Promise.all([
        api.getProducts(routineCategory),
        api.getUserRoutine(),
        api.getLatestRoutine(routineCategory),
      ]);
      setCatalogProducts(allProds);

      // Default selected products to user's active routine in category
      const activeIds = userRoutine
        .filter((up) => {
          if (routineCategory === 'skincare') {
            return up.product.category === 'skincare' || up.product.category === 'bodycare';
          }
          return up.product.category === 'haircare';
        })
        .map((up) => up.product_id);

      if (activeIds.length > 0) {
        setSelectedProductIds(activeIds);
      } else if (allProds.length > 0) {
        // Select first 3-4 default products for demonstration
        setSelectedProductIds(allProds.slice(0, 4).map((p) => p.id));
      }

      setAnalysisResult(latest);
    } catch (e) {
      console.error('Error loading routine data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProduct = (id: number) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((pId) => pId !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const handleRunAnalysis = async () => {
    if (selectedProductIds.length === 0) {
      alert('Please select at least 1 product to check routine compatibility.');
      return;
    }
    setAnalyzing(true);
    try {
      const res = await api.analyzeRoutine({
        product_ids: selectedProductIds,
        routine_category: routineCategory,
      });
      setAnalysisResult(res);
    } catch (err: any) {
      alert(err.message || 'Routine evaluation failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-sage-50 px-2.5 py-0.5 rounded-full border border-sage-200">
              Main Feature Two
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
              AI Routine Conflict & Compatibility Checker
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-500 max-w-2xl">
              Evaluate your multi-product regimen as an interconnected chemical ecosystem. Detect repeated actives, 
              acid stacking risks, missing photoprotection, and receive transparent rationale for every safety precaution.
            </p>
          </div>

          <div className="flex bg-ivory-100 p-1 rounded-2xl border border-sage-200 self-start md:self-auto">
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
        </div>
      </div>

      {/* Routine Product Selection Matrix */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-charcoal-900">
              Select Products in Your Current Routine ({selectedProductIds.length} Selected)
            </h2>
            <p className="text-xs text-charcoal-500">
              Check all products you use throughout the week. You can add more from catalog or scan labels.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onNavigateToAddProduct}
              className="px-3.5 py-2 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-charcoal-700 text-xs font-semibold border border-sage-200 flex items-center space-x-1.5 transition"
            >
              <ScanLine className="w-3.5 h-3.5 text-sage-600" />
              <span>Scan Label (OCR)</span>
            </button>

            <button
              onClick={handleRunAnalysis}
              disabled={analyzing}
              className="px-5 py-2 rounded-xl bg-sage-600 text-white text-xs font-bold hover:bg-sage-700 transition shadow-sm flex items-center space-x-2 disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating Compatibility...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Re-Analyze Routine Compatibility</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Product Chips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {catalogProducts.map((p) => {
            const isSelected = selectedProductIds.includes(p.id);
            return (
              <div
                key={p.id}
                onClick={() => handleToggleProduct(p.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer select-none transition-all flex items-start justify-between ${
                  isSelected
                    ? 'bg-sage-50/90 border-sage-500 shadow-xs'
                    : 'bg-white border-sage-100 hover:border-sage-200 hover:bg-beige-50/50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                      {p.subcategory || p.category}
                    </span>
                    <span className="text-[10px] text-sage-600 font-medium">• {p.recommended_time}</span>
                  </div>
                  <h4 className="text-xs font-bold text-charcoal-900 leading-snug">{p.name}</h4>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {p.active_ingredients?.slice(0, 2).map((a, i) => (
                      <span
                        key={i}
                        className="text-[9px] bg-white text-sage-800 px-1.5 py-0.5 rounded border border-sage-200"
                      >
                        {a.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                    isSelected ? 'bg-sage-600 text-white' : 'border border-sage-300 bg-white'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Routine Analysis Results */}
      {analysisResult && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
          {/* Score & Transparent Rubric Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <ScoreGauge
                score={analysisResult.overall_score}
                breakdown={analysisResult.score_breakdown}
                size="lg"
              />
            </div>

            {/* Quick Summary Card */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-sage-50 px-2.5 py-0.5 rounded-full border border-sage-200">
                  Formulation Ecosystem Analysis
                </span>
                <h3 className="text-xl font-bold text-charcoal-900">
                  Overall Routine Health: {analysisResult.overall_score}/100
                </h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  Your routine contains {selectedProductIds.length} active products. Our engine evaluated active concentrations,
                  keratolytic layering thresholds, circadian usage schedules (AM vs PM), and photoprotection requirements.
                </p>
              </div>

              {/* Missing Steps Recommendation */}
              {analysisResult.missing_steps.length > 0 && (
                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Missing Fundamental Steps in Your Regimen</span>
                  </div>
                  {analysisResult.missing_steps.map((m, idx) => (
                    <div key={idx} className="text-xs text-amber-950">
                      <strong>• {m.step}:</strong> <span className="text-charcoal-700">{m.reason}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-sage-100">
                <p className="text-[11px] text-charcoal-400 italic">
                  Transparency Notice: This score is an active chemical balance index, not a medical safety guarantee.
                </p>
                <button
                  onClick={onNavigateToPlanner}
                  className="px-4 py-2 rounded-xl bg-sage-600 text-white text-xs font-semibold hover:bg-sage-700 transition shadow-xs flex items-center space-x-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>View Structured AM/PM Schedule</span>
                </button>
              </div>
            </div>
          </div>

          {/* D. Explain Every Warning (In-depth Conflict Cards) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-charcoal-900">
                  Detailed Compatibility Explanations ({analysisResult.identified_conflicts.length})
                </h3>
                <p className="text-xs text-charcoal-500">
                  Click each notice to expand pharmacology rationale, missing info, and safer usage alternatives.
                </p>
              </div>
            </div>

            {analysisResult.identified_conflicts.length > 0 ? (
              <div className="space-y-4">
                {analysisResult.identified_conflicts.map((conflict) => (
                  <ConflictCard key={conflict.id} conflict={conflict} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-sage-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-sage-600 mx-auto" />
                <h4 className="text-sm font-bold text-charcoal-900">Zero Active Conflicts Found</h4>
                <p className="text-xs text-charcoal-500 max-w-md mx-auto">
                  None of the selected products show direct contraindications or dangerous acid stacking.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
