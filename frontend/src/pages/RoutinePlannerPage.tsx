import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { RoutineAnalysisResult, RoutineStep } from '../types';
import {
  Sun,
  Moon,
  Calendar,
  Clock,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Info,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';

export const RoutinePlannerPage: React.FC = () => {
  const { routineCategory, setRoutineCategory } = useAuth();
  const [analysis, setAnalysis] = useState<RoutineAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'both' | 'am' | 'pm'>('both');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlanner();
  }, [routineCategory]);

  const loadPlanner = async () => {
    setLoading(true);
    try {
      const data = await api.getLatestRoutine(routineCategory);
      setAnalysis(data);
    } catch (e) {
      console.error('Failed to load planner data', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-sage-50 px-2.5 py-0.5 rounded-full border border-sage-200">
              Circadian Chrono-Scheduling
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
              AM/PM Structured Routine Planner
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-500 max-w-2xl">
              Applying products in optimal sequence ensures dermal bioavailability without disrupting your moisture barrier.
              Ranked from lowest molecular weight / thinnest viscosity to occlusive sealants.
            </p>
          </div>

          {/* Tab Filter */}
          <div className="flex bg-ivory-100 p-1 rounded-2xl border border-sage-200 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'both' ? 'bg-sage-600 text-white shadow-sm' : 'text-charcoal-600'
              }`}
            >
              Full Day View
            </button>
            <button
              onClick={() => setActiveTab('am')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                activeTab === 'am' ? 'bg-amber-500 text-white shadow-sm' : 'text-charcoal-600'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>AM Only</span>
            </button>
            <button
              onClick={() => setActiveTab('pm')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                activeTab === 'pm' ? 'bg-lavender-600 text-white shadow-sm' : 'text-charcoal-600'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>PM Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Skin Cycling Education Callout */}
      <div className="bg-sage-900 text-ivory-100 rounded-3xl p-6 sm:p-7 shadow-float border border-sage-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-sage-300 bg-sage-800 px-2 py-0.5 rounded border border-sage-700">
              Clinical Protocol
            </span>
            <h3 className="text-lg font-bold text-white">
              Recommended 4-Night Skin Cycling Protocol
            </h3>
            <p className="text-xs text-sage-200 max-w-2xl leading-relaxed">
              When pairing chemical acids (AHA/BHA) and retinoids, do not layer them simultaneously. Follow this cycle to maximize results while safeguarding your stratum corneum.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto text-xs">
            <div className="bg-sage-800/80 p-2.5 rounded-xl border border-sage-700 text-center">
              <span className="text-[10px] text-amber-300 font-bold block">Night 1</span>
              <span className="font-semibold text-white">Exfoliate (AHA/BHA)</span>
            </div>
            <div className="bg-sage-800/80 p-2.5 rounded-xl border border-sage-700 text-center">
              <span className="text-[10px] text-lavender-300 font-bold block">Night 2</span>
              <span className="font-semibold text-white">Retinoid</span>
            </div>
            <div className="bg-sage-800/80 p-2.5 rounded-xl border border-sage-700 text-center">
              <span className="text-[10px] text-emerald-300 font-bold block">Night 3</span>
              <span className="font-semibold text-white">Recovery (Lipids)</span>
            </div>
            <div className="bg-sage-800/80 p-2.5 rounded-xl border border-sage-700 text-center">
              <span className="text-[10px] text-emerald-300 font-bold block">Night 4</span>
              <span className="font-semibold text-white">Recovery (Urea)</span>
            </div>
          </div>
        </div>
      </div>

      {analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AM Routine Column */}
          {(activeTab === 'both' || activeTab === 'am') && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-sage-200">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-charcoal-900">Morning Routine (AM)</h3>
                  <p className="text-[11px] text-charcoal-500">Focus: Antioxidants, Hydration & Photoprotection</p>
                </div>
              </div>

              <div className="space-y-4">
                {analysis.structured_am_routine.map((step) => (
                  <StepCard key={step.step_number} step={step} type="AM" />
                ))}
              </div>
            </div>
          )}

          {/* PM Routine Column */}
          {(activeTab === 'both' || activeTab === 'pm') && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-sage-200">
                <div className="w-8 h-8 rounded-xl bg-lavender-100 text-lavender-600 flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-charcoal-900">Evening Routine (PM)</h3>
                  <p className="text-[11px] text-charcoal-500">Focus: Deep Desquamation, Cellular Turnover & Overnight Repair</p>
                </div>
              </div>

              <div className="space-y-4">
                {analysis.structured_pm_routine.map((step) => (
                  <StepCard key={step.step_number} step={step} type="PM" />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 border border-sage-100 text-center">
          <p className="text-xs text-charcoal-500">Select products in Routine Compatibility Checker to generate schedule.</p>
        </div>
      )}
    </div>
  );
};

const StepCard: React.FC<{ step: RoutineStep; type: 'AM' | 'PM' }> = ({ step, type }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-sage-100 shadow-card hover:shadow-float transition-all space-y-3 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2.5">
          <span className="w-6 h-6 rounded-lg bg-sage-100 text-sage-800 font-bold text-xs flex items-center justify-center">
            {step.step_number}
          </span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
              {step.step_name}
            </span>
            <h4 className="text-sm font-bold text-charcoal-900 leading-snug">{step.product_name}</h4>
          </div>
        </div>

        <span className="text-[10px] font-semibold text-sage-700 bg-sage-50 px-2.5 py-1 rounded-full border border-sage-200">
          {step.recommended_frequency}
        </span>
      </div>

      {/* Sequence Rationale */}
      <div className="bg-ivory-50 p-2.5 rounded-xl border border-sage-100 text-[11px] text-charcoal-600">
        <strong className="text-charcoal-800">Order Rationale: </strong>
        {step.application_order_reason}
      </div>

      {/* Attention Actives */}
      {step.attention_ingredients.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Actives:</span>
          {step.attention_ingredients.map((a, i) => (
            <span key={i} className="text-[10px] bg-beige-100 text-charcoal-800 px-2 py-0.5 rounded border border-beige-300 font-medium">
              {a}
            </span>
          ))}
        </div>
      )}

      {/* Alternate Day Note (Skin Cycling) */}
      {step.alternate_day_note && (
        <div className="bg-lavender-50 p-2.5 rounded-xl border border-lavender-200 text-[11px] text-lavender-900 flex items-start space-x-2">
          <Info className="w-3.5 h-3.5 flex-shrink-0 text-lavender-600 mt-0.5" />
          <span>
            <strong>Skin Cycling Rule:</strong> {step.alternate_day_note}
          </span>
        </div>
      )}

      {/* Precautions */}
      {step.precautions && (
        <p className="text-[11px] text-charcoal-500 italic pt-1">
          <strong className="text-charcoal-700">Precaution:</strong> {step.precautions}
        </p>
      )}
    </div>
  );
};
