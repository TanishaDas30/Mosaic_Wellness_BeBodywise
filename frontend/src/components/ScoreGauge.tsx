import React from 'react';
import { ShieldCheck, AlertCircle, Info } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  breakdown?: {
    duplication_balance: number;
    ingredient_compatibility: number;
    application_flow: number;
    barrier_safety: number;
    completeness: number;
  };
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, breakdown, size = 'md' }) => {
  // Determine color theme based on score
  let strokeColor = '#0A42C1'; // Be Bodywise signature blue #0A42C1
  let textColor = 'text-sage-700';
  let badgeBg = 'bg-sage-50 text-sage-800 border-sage-200';
  let statusText = 'Optimal Routine Compatibility';

  if (score < 60) {
    strokeColor = '#DC2626'; // red-600
    textColor = 'text-red-700';
    badgeBg = 'bg-red-50 text-red-800 border-red-200';
    statusText = 'High Routine Conflicts Detected';
  } else if (score < 80) {
    strokeColor = '#D97706'; // amber-600
    textColor = 'text-amber-700';
    badgeBg = 'bg-amber-50 text-amber-800 border-amber-200';
    statusText = 'Moderate Active Overlap';
  }

  const radius = size === 'lg' ? 64 : size === 'sm' ? 36 : 50;
  const strokeWidth = size === 'lg' ? 10 : size === 'sm' ? 6 : 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const diameter = (radius + strokeWidth) * 2;

  return (
    <div className="bg-white rounded-3xl p-6 border border-sage-100 shadow-card">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Radial SVG Gauge */}
        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <svg width={diameter} height={diameter} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={diameter / 2}
                cy={diameter / 2}
                r={radius}
                stroke="#F3EDE2"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Animated Progress circle */}
              <circle
                cx={diameter / 2}
                cy={diameter / 2}
                r={radius}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-3xl font-extrabold ${textColor}`}>{score}</span>
              <span className="text-[10px] text-charcoal-400 font-semibold uppercase tracking-wider">/ 100</span>
            </div>
          </div>
          <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}>
            {statusText}
          </div>
        </div>

        {/* Breakdown bars */}
        {breakdown && (
          <div className="flex-1 w-full space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider">
                Transparent Compatibility Breakdown
              </h4>
              <span className="text-[10px] text-charcoal-400">Non-Clinical Metric</span>
            </div>

            <div className="space-y-2">
              <ScoreBar label="Duplication Balance" value={breakdown.duplication_balance} />
              <ScoreBar label="Ingredient Compatibility" value={breakdown.ingredient_compatibility} />
              <ScoreBar label="Application Sequence Flow" value={breakdown.application_flow} />
              <ScoreBar label="Barrier Safety & Hydration" value={breakdown.barrier_safety} />
              <ScoreBar label="Core Steps Completeness" value={breakdown.completeness} />
            </div>

            <p className="text-[10px] text-charcoal-400 italic pt-1 flex items-start space-x-1">
              <Info className="w-3 h-3 flex-shrink-0 mt-0.5 text-sage-600" />
              <span>
                Calculated from active concentration overlap, application timing, known chemical contraindications, and missing barrier/SPF steps.
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ScoreBar: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  let color = 'bg-sage-500';
  if (value < 60) color = 'bg-red-500';
  else if (value < 80) color = 'bg-amber-500';

  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1 font-medium text-charcoal-700">
        <span>{label}</span>
        <span className="font-semibold text-charcoal-900">{value}%</span>
      </div>
      <div className="w-full bg-ivory-200 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-1.5 rounded-full ${color} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};
