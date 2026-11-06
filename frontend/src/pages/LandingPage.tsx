import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Layers,
  ArrowRight,
  Activity,
  CheckCircle2,
  Calendar,
  Search,
  ScanLine,
  BarChart2
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onExploreDemo }) => {
  const { quickDemoLogin } = useAuth();
  const [demoInput, setDemoInput] = useState(
    'I have been using a 1% salicylic acid body wash for three weeks. My body acne has reduced, but my skin feels very dry.'
  );
  const [demoAnalyzing, setDemoAnalyzing] = useState(false);
  const [demoResult, setDemoResult] = useState<any>(null);

  const handleRunDemo = () => {
    setDemoAnalyzing(true);
    setTimeout(() => {
      setDemoResult({
        primary_concern: 'Body Acne & Strawberry Skin',
        positives: ['Reduced body acne lesions on shoulders/back'],
        negatives: ['Post-shower dryness & stratum corneum tightness'],
        classification: 'Mixed Outcome',
        explanation: 'Salicylic Acid effectively dissolves lipophilic sebum, but hot shower water and daily lathering without immediate ceramide sealing strips intercellular lipids.',
        next_step: 'Reduce frequency to 3x weekly and apply a 10% Urea or Ceramide lotion within 3 minutes of bathing.'
      });
      setDemoAnalyzing(false);
    }, 600);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Soft decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sage-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-lavender-200/30 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sage-100 border border-sage-200 text-sage-800 text-xs font-semibold uppercase tracking-wider shadow-xs animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-3.5 h-3.5 text-sage-600" />
            <span>AI-Powered Formulation & Routine Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-charcoal-900 max-w-4xl mx-auto leading-[1.15]">
            Understand your products.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-600 via-sage-700 to-lavender-600">
              Improve your routine.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
            Not another generic skincare quiz or basic chatbot. SkinSense evaluates multi-active product compatibility, 
            diagnoses real-world product experiences, and prevents routine conflicts before they compromise your barrier.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                quickDemoLogin('user');
                onExploreDemo();
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-sage-600 text-white font-semibold text-sm hover:bg-sage-700 shadow-card flex items-center justify-center space-x-2 group transition-all"
            >
              <span>Explore Interactive Demo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white border border-sage-200 text-charcoal-800 font-semibold text-sm hover:bg-beige-50 shadow-subtle transition"
            >
              Create Personalized Account
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-6 flex flex-wrap justify-center items-center gap-6 text-xs text-charcoal-500 font-medium">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-sage-600" />
              <span>Evidence-Based Formulation Rules</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-sage-600" />
              <span>Non-Diagnostic Clinical Rigor</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <ScanLine className="w-4 h-4 text-sage-600" />
              <span>OCR Ingredient Label Extraction</span>
            </span>
          </div>
        </div>
      </section>

      {/* The Two Critical Problems Solved */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-sage-50 px-3 py-1 rounded-full border border-sage-200">
            The Missing Layer in Beauty-Tech
          </span>
          <h2 className="text-3xl font-bold text-charcoal-900 mt-3">
            Two Major Customer Problems We Solve
          </h2>
          <p className="text-sm text-charcoal-500 mt-2">
            Single-product quizzes fail because real customers use 3 to 6 active products simultaneously.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problem 1 Card */}
          <div className="bg-white rounded-3xl p-8 border border-sage-100 shadow-card hover:shadow-float transition-all relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5 font-bold text-lg">
              01
            </div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Problem 1: Inconsistent Experience
            </span>
            <h3 className="text-xl font-bold text-charcoal-900 mt-1 mb-3">
              AI Product Experience Intelligence
            </h3>
            <p className="text-xs text-charcoal-600 leading-relaxed mb-5">
              A product often clears one concern while creating another problem. Customers struggle to decipher whether their skin is purging, peeling from dehydration, or adjusting to actives.
            </p>
            <div className="space-y-2.5 text-xs text-charcoal-700 bg-ivory-100 p-4 rounded-2xl border border-beige-200">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 flex-shrink-0 mt-0.5" />
                <span>Extracts positive outcomes, negative reactions & duration from plain text.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 flex-shrink-0 mt-0.5" />
                <span>Provides physiological explanations (sebum extraction vs lipid stripping).</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 flex-shrink-0 mt-0.5" />
                <span>Prescribes manufacturer-aligned safe next steps and reflection questions.</span>
              </div>
            </div>
          </div>

          {/* Problem 2 Card */}
          <div className="bg-white rounded-3xl p-8 border border-sage-100 shadow-card hover:shadow-float transition-all relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-sage-100 text-sage-700 flex items-center justify-center mb-5 font-bold text-lg">
              02
            </div>
            <span className="text-xs font-bold text-sage-700 uppercase tracking-wider">
              Problem 2: Routine Overload & Conflicts
            </span>
            <h3 className="text-xl font-bold text-charcoal-900 mt-1 mb-3">
              AI Routine Conflict & Compatibility Checker
            </h3>
            <p className="text-xs text-charcoal-600 leading-relaxed mb-5">
              Stacking Salicylic Acid, Lactic Acid, Retinol, and chemical roll-ons causes compounding irritation. We evaluate the complete multi-product routine rather than each product in isolation.
            </p>
            <div className="space-y-2.5 text-xs text-charcoal-700 bg-ivory-100 p-4 rounded-2xl border border-beige-200">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 flex-shrink-0 mt-0.5" />
                <span>Identifies repeated actives (e.g. multi-layer BHAs) & excessive acid stacking.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 flex-shrink-0 mt-0.5" />
                <span>Explains every conflict with pharmacology rationale & missing info notices.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 flex-shrink-0 mt-0.5" />
                <span>Generates structured AM/PM schedules with 4-night Skin Cycling alternatives.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Demo Playground */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-float">
          <div className="flex items-center space-x-2 text-xs font-bold text-sage-700 uppercase tracking-wider mb-2">
            <Activity className="w-4 h-4 text-sage-600" />
            <span>Interactive Demo: Test the Experience Intelligence Engine</span>
          </div>
          <h3 className="text-xl font-bold text-charcoal-900 mb-2">
            Try Entering Any Product Experience in Natural Language
          </h3>
          <p className="text-xs text-charcoal-500 mb-4">
            See how the AI extracts structured clinical insights, distinguishes observations from hypotheses, and guides the user.
          </p>

          <div className="space-y-3">
            <textarea
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              rows={3}
              className="w-full p-4 rounded-2xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-400 font-sans leading-relaxed"
              placeholder="e.g. I have been using 10% lactic acid body lotion for 2 weeks. Rough bumps softened, but slight tingling on legs..."
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDemoInput("I have been using the 1% salicylic acid body wash for three weeks. My body acne has reduced, but my skin feels very dry.")}
                  className="text-[11px] bg-beige-100 hover:bg-beige-200 text-charcoal-700 px-3 py-1 rounded-full border border-beige-300 transition"
                >
                  Body Wash Example
                </button>
                <button
                  type="button"
                  onClick={() => setDemoInput("Using 0.3% retinol serum and 10% lactic acid on alternate nights. Noticed smooth forehead, but slight flaking around nose.")}
                  className="text-[11px] bg-beige-100 hover:bg-beige-200 text-charcoal-700 px-3 py-1 rounded-full border border-beige-300 transition"
                >
                  Retinol + Acid Example
                </button>
              </div>

              <button
                onClick={handleRunDemo}
                disabled={demoAnalyzing}
                className="px-6 py-2.5 rounded-xl bg-sage-600 text-white font-semibold text-xs hover:bg-sage-700 transition shadow-sm flex items-center space-x-2 disabled:opacity-50"
              >
                {demoAnalyzing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Analyze Experience</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Demo Output Card */}
          {demoResult && (
            <div className="mt-6 p-5 rounded-2xl bg-ivory-100 border border-sage-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sage-200 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-charcoal-900">Extracted Concern:</span>
                  <span className="text-xs font-semibold text-sage-800 bg-white px-2.5 py-0.5 rounded-full border border-sage-200">
                    {demoResult.primary_concern}
                  </span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200">
                  {demoResult.classification}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-sage-100">
                  <span className="font-bold text-emerald-800 block mb-1">What Appears to be Working:</span>
                  <p className="text-charcoal-700">{demoResult.positives[0]}</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-amber-100">
                  <span className="font-bold text-amber-800 block mb-1">What Has Not Improved:</span>
                  <p className="text-charcoal-700">{demoResult.negatives[0]}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-sage-200 text-xs space-y-2">
                <span className="font-bold text-charcoal-900 uppercase tracking-wider text-[11px] block">
                  Scientific Explanation (Hypothesis)
                </span>
                <p className="text-charcoal-600 leading-relaxed">{demoResult.explanation}</p>
                <div className="pt-2 border-t border-sage-100">
                  <span className="font-bold text-sage-800 block mb-0.5">Recommended Safe Adjustment:</span>
                  <p className="text-charcoal-700">{demoResult.next_step}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Complete Product Intelligence Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-sage-50 px-3 py-1 rounded-full border border-sage-200">
            Platform Capabilities
          </span>
          <h2 className="text-3xl font-bold text-charcoal-900 mt-3">
            Designed for Modern Beauty-Tech Consumers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<ShieldCheck className="w-5 h-5 text-sage-600" />}
            title="Routine Conflict Engine"
            desc="Deep active ingredient pairing matrix covering Retinoids, BHAs, AHAs, Vitamin C, and Niacinamide."
          />
          <FeatureCard
            icon={<Calendar className="w-5 h-5 text-sage-600" />}
            title="AM/PM Routine Planner"
            desc="Generates viscosity-ranked application orders and structured skin cycling calendars."
          />
          <FeatureCard
            icon={<ScanLine className="w-5 h-5 text-sage-600" />}
            title="OCR Ingredient Scanner"
            desc="Extract cosmetic actives directly from bottle photographs or INCI text strings."
          />
          <FeatureCard
            icon={<BarChart2 className="w-5 h-5 text-sage-600" />}
            title="Review Aspect NLP"
            desc="Classifies verified customer reviews into 10 distinct pharmacological aspects."
          />
          <FeatureCard
            icon={<Activity className="w-5 h-5 text-sage-600" />}
            title="Outcome Timeline"
            desc="Interactive multi-week tracking of barrier hydration, acne clearance, and satisfaction."
          />
          <FeatureCard
            icon={<Sparkles className="w-5 h-5 text-sage-600" />}
            title="AI Formulation Assistant"
            desc="Context-aware chatbot citing your saved products, ingredients, and manufacturer guidelines."
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-2xl border border-sage-100 shadow-subtle hover:shadow-card transition-all">
    <div className="w-10 h-10 rounded-xl bg-sage-50 border border-sage-200 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h4 className="text-base font-bold text-charcoal-900 mb-2">{title}</h4>
    <p className="text-xs text-charcoal-600 leading-relaxed">{desc}</p>
  </div>
);
