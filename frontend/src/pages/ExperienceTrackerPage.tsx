import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Product, ProductExperience, UserProduct } from '../types';
import {
  Activity,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  PlusCircle,
  History,
  FileText,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

export const ExperienceTrackerPage: React.FC = () => {
  const { user, routineCategory } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [userProducts, setUserProducts] = useState<UserProduct[]>([]);
  const [history, setHistory] = useState<ProductExperience[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // Form State
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [naturalLanguageFeedback, setNaturalLanguageFeedback] = useState(
    'I have been using the 1% salicylic acid body wash for three weeks. My body acne has reduced, but my skin feels very dry.'
  );
  const [durationWeeks, setDurationWeeks] = useState<number>(3);
  const [frequencyUsed, setFrequencyUsed] = useState<string>('Daily');
  const [primaryConcern, setPrimaryConcern] = useState<string>('Body Acne');
  const [expectedResult, setExpectedResult] = useState<string>('Clear acne blemishes without flaking');
  const [actualResult, setActualResult] = useState<string>('Acne improved but barrier feels dry');

  // Active AI Report Modal / Card
  const [activeReport, setActiveReport] = useState<ProductExperience | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, upList, exps] = await Promise.all([
        api.getProducts(routineCategory),
        api.getUserRoutine(),
        api.getExperienceHistory(),
      ]);
      setProducts(prods);
      setUserProducts(upList);
      setHistory(exps);
      if (prods.length > 0 && !selectedProductId) {
        setSelectedProductId(prods[0].id);
      }
      if (exps.length > 0 && !activeReport) {
        setActiveReport(exps[0]);
      }
    } catch (e) {
      console.error('Error loading experience tracker data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [routineCategory]);

  const handleSelectProduct = (prodId: number) => {
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      if (prod.name.toLowerCase().includes('salicylic')) {
        setPrimaryConcern('Body Acne');
        setNaturalLanguageFeedback('I have been using the 1% salicylic acid body wash for three weeks. My body acne has reduced, but my skin feels very dry.');
      } else if (prod.name.toLowerCase().includes('retinol')) {
        setPrimaryConcern('Post-acne marks & fine lines');
        setNaturalLanguageFeedback('I have used retinol for 4 weeks twice a week. Skin feels smoother, but some flaking near chin.');
      } else if (prod.name.toLowerCase().includes('lactic')) {
        setPrimaryConcern('Strawberry legs & keratosis pilaris');
        setNaturalLanguageFeedback('Using 10% lactic acid lotion for 2 weeks. Rough patches softened, but slight tingling on shaved skin.');
      } else if (prod.name.toLowerCase().includes('hair') || prod.name.toLowerCase().includes('redensyl')) {
        setPrimaryConcern('Hair fall & temple thinning');
        setNaturalLanguageFeedback('Applied redensyl serum daily for 4 weeks. Noticeable baby hairs forming, light shedding stopped.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    setAnalyzing(true);
    try {
      const res = await api.recordExperience({
        product_id: selectedProductId,
        natural_language_feedback: naturalLanguageFeedback,
        duration_weeks: durationWeeks,
        frequency_used: frequencyUsed,
        primary_concern: primaryConcern,
        expected_result: expectedResult,
        actual_result: actualResult,
      });
      setActiveReport(res);
      // Reload history
      const updatedHistory = await api.getExperienceHistory();
      setHistory(updatedHistory);
    } catch (err: any) {
      alert(err.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header & Mission */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-sage-50 px-2.5 py-0.5 rounded-full border border-sage-200">
              Main Feature One
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
              AI Product Experience Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-500 max-w-2xl">
              Record what actually happens when you use a product. Our formulation intelligence extracts outcomes in natural language,
              diagnoses potential stratum corneum and active ingredient interactions, and structures safe next steps.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-sage-700 bg-sage-50 p-3 rounded-2xl border border-sage-200">
            <ShieldCheck className="w-4 h-4 text-sage-600 flex-shrink-0" />
            <span className="font-medium">
              Observations are distinguished from explanations. Non-diagnostic.
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Submission Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-sage-100 shadow-card space-y-5">
            <div className="flex items-center space-x-2 text-xs font-bold text-charcoal-900 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-sage-600" />
              <span>Record New Experience Entry</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Product */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Select Product Being Used
                </label>
                <select
                  value={selectedProductId || ''}
                  onChange={(e) => handleSelectProduct(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900 font-medium focus:ring-2 focus:ring-sage-400 focus:outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.brand})
                    </option>
                  ))}
                </select>
              </div>

              {/* Natural Language Feedback */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                    Experience Feedback (Natural Language)
                  </label>
                  <span className="text-[10px] text-sage-600 font-semibold">AI NLP Extraction</span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={naturalLanguageFeedback}
                  onChange={(e) => setNaturalLanguageFeedback(e.target.value)}
                  className="w-full p-3 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900 leading-relaxed focus:ring-2 focus:ring-sage-400 focus:outline-none font-sans"
                  placeholder="Tell us what you noticed in natural sentences (e.g. acne reduced, but skin feels tight)..."
                />
              </div>

              {/* Concern & Duration Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                    Purchased For Concern
                  </label>
                  <input
                    type="text"
                    value={primaryConcern}
                    onChange={(e) => setPrimaryConcern(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900"
                    placeholder="e.g. Body Acne"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                    Duration Used (Weeks)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900"
                  />
                </div>
              </div>

              {/* Frequency of Application */}
              <div>
                <label className="block text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Frequency of Application
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['Daily', 'Alternate Days', '2-3x / Week'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFrequencyUsed(f)}
                      className={`p-2 rounded-xl border text-center transition font-medium ${
                        frequencyUsed === f
                          ? 'bg-sage-600 text-white border-sage-600 font-semibold shadow-xs'
                          : 'bg-ivory-50 text-charcoal-700 border-sage-200 hover:bg-beige-50'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Expected vs Actual */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                    Expected Result
                  </label>
                  <input
                    type="text"
                    value={expectedResult}
                    onChange={(e) => setExpectedResult(e.target.value)}
                    className="w-full p-2 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900"
                    placeholder="Clear bumps without flaking"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                    Actual Result
                  </label>
                  <input
                    type="text"
                    value={actualResult}
                    onChange={(e) => setActualResult(e.target.value)}
                    className="w-full p-2 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900"
                    placeholder="Acne improved, but skin tight"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={analyzing}
                className="w-full py-3 rounded-2xl bg-sage-600 text-white font-semibold text-xs hover:bg-sage-700 shadow-card transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-4"
              >
                {analyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Formulation Impact...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Experience Analysis</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Experience Comparison History List */}
          <div className="bg-white rounded-3xl p-6 border border-sage-100 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-charcoal-900 uppercase tracking-wider">
                <History className="w-4 h-4 text-sage-600" />
                <span>Experience History Logs ({history.length})</span>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {history.map((item) => {
                const isActive = activeReport?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveReport(item)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isActive
                        ? 'bg-sage-50 border-sage-400 shadow-xs'
                        : 'bg-ivory-50/70 border-sage-100 hover:bg-beige-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-bold text-charcoal-900 leading-tight">
                        {item.product_name}
                      </h4>
                      <span
                        className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                          item.classification === 'positive'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : item.classification === 'mixed'
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}
                      >
                        {item.classification}
                      </span>
                    </div>

                    <p className="text-[11px] text-charcoal-600 italic line-clamp-2">
                      "{item.natural_language_feedback}"
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-sage-100 text-[10px] text-charcoal-400 font-medium">
                      <span>{item.duration_weeks} weeks • {item.frequency_used}</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: In-Depth AI Intelligence Report (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeReport ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-float space-y-6 animate-in fade-in zoom-in-95 duration-200">
              {/* Header Badge & Classification */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sage-100 pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-sage-700 bg-sage-100 px-2.5 py-0.5 rounded-full">
                      Diagnostic Report
                    </span>
                    <span className="text-xs text-charcoal-400 font-medium">
                      Duration: {activeReport.duration_weeks} Weeks ({activeReport.frequency_used})
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-charcoal-900 mt-1">
                    {activeReport.product_name}
                  </h2>
                  <p className="text-xs text-charcoal-500">{activeReport.brand}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-400 block mb-0.5">
                    Experience Status
                  </span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      activeReport.classification === 'positive'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : activeReport.classification === 'mixed'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}
                  >
                    {activeReport.classification} Outcome
                  </span>
                </div>
              </div>

              {/* Natural Language Snippet */}
              <div className="bg-ivory-100 p-4 rounded-2xl border border-beige-200">
                <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-400 block mb-1">
                  User's Natural Feedback Record
                </span>
                <p className="text-xs text-charcoal-800 italic leading-relaxed">
                  "{activeReport.natural_language_feedback}"
                </p>
              </div>

              {/* 1. What Appears to be Working vs 2. What Has Not Improved */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Working */}
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>1. What Appears to Be Working</span>
                  </div>
                  <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                    {activeReport.ai_working_summary || 'Positive cellular response recorded.'}
                  </p>
                  {activeReport.positive_outcomes.length > 0 && (
                    <ul className="text-[11px] text-emerald-800 list-disc list-inside pt-1">
                      {activeReport.positive_outcomes.map((pos, i) => (
                        <li key={i}>{pos}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Not Improved */}
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>2. What Has Not Improved / Worsened</span>
                  </div>
                  <p className="text-xs text-amber-900 font-medium leading-relaxed">
                    {activeReport.ai_not_improved_summary || 'No adverse changes reported.'}
                  </p>
                  {activeReport.negative_outcomes.length > 0 && (
                    <ul className="text-[11px] text-amber-800 list-disc list-inside pt-1">
                      {activeReport.negative_outcomes.map((neg, i) => (
                        <li key={i}>{neg}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* 3. Possible Explanations That Need Further Investigation */}
              <div className="bg-white p-5 rounded-2xl border border-sage-200 shadow-xs space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-charcoal-900 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-sage-600" />
                  <span>3. Possible Explanations That Need Further Investigation</span>
                </div>
                <p className="text-[11px] text-charcoal-500 italic">
                  Distinguishing formulation chemistry observations from clinical certainties:
                </p>
                <div className="space-y-2">
                  {activeReport.ai_explanations?.map((exp, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs text-charcoal-700 leading-relaxed bg-ivory-50/80 p-3 rounded-xl border border-sage-100">
                      <span className="w-5 h-5 rounded-full bg-sage-200 text-sage-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{exp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Questions the Customer Should Consider */}
              <div className="bg-lavender-50/50 p-5 rounded-2xl border border-lavender-200 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-lavender-900 uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4 text-lavender-600" />
                  <span>4. Questions You Should Consider</span>
                </div>
                <ul className="space-y-2 text-xs text-lavender-950">
                  {activeReport.ai_questions?.map((q, idx) => (
                    <li key={idx} className="flex items-start space-x-2 bg-white/80 p-2.5 rounded-xl border border-lavender-100">
                      <span className="text-lavender-600 font-bold">•</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 5. Safe Next Steps Based on Product Instructions */}
              <div className="bg-sage-50/80 p-5 rounded-2xl border border-sage-300 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-sage-900 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-sage-700" />
                  <span>5. Safe Next Steps (Manufacturer Guidelines)</span>
                </div>
                <div className="space-y-2 text-xs text-sage-900">
                  {activeReport.ai_safe_next_steps?.map((step, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 bg-white p-3 rounded-xl border border-sage-200 shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-sage-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-Diagnostic Disclaimer Note */}
              <div className="p-3 rounded-xl bg-ivory-200/60 border border-beige-300 text-[10px] text-charcoal-600 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-charcoal-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Safety Notice:</strong> Never claim a product or ingredient caused a biological reaction based solely on user feedback. 
                  Individual skin response is influenced by environmental humidity, water temperature, friction, and pre-existing barrier integrity.
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-sage-100 text-center space-y-3">
              <Activity className="w-12 h-12 text-sage-300 mx-auto" />
              <h3 className="text-base font-bold text-charcoal-800">No Experience Entry Selected</h3>
              <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                Fill out the experience feedback form on the left or click on any log from your history to inspect the 5-point AI formulation report.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
