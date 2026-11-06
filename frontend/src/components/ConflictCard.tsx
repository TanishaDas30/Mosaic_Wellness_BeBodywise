import React, { useState } from 'react';
import { ConflictCardData } from '../types';
import { AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp, ShieldCheck, HelpCircle } from 'lucide-react';

interface ConflictCardProps {
  conflict: ConflictCardData;
}

export const ConflictCard: React.FC<ConflictCardProps> = ({ conflict }) => {
  const [expanded, setExpanded] = useState(true);

  let badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
  let icon = <AlertCircle className="w-5 h-5 text-amber-600" />;
  let cardBorder = 'border-amber-200';

  if (conflict.risk_level === 'high') {
    badgeColor = 'bg-red-100 text-red-800 border-red-200';
    icon = <AlertTriangle className="w-5 h-5 text-red-600" />;
    cardBorder = 'border-red-200';
  } else if (conflict.risk_level === 'caution') {
    badgeColor = 'bg-lavender-100 text-lavender-800 border-lavender-200';
    icon = <Info className="w-5 h-5 text-lavender-600" />;
    cardBorder = 'border-lavender-200';
  }

  return (
    <div className={`bg-white rounded-2xl border ${cardBorder} shadow-subtle overflow-hidden transition-all duration-200 hover:shadow-card`}>
      {/* Header */}
      <div
        className="p-4 sm:p-5 flex items-start justify-between cursor-pointer select-none bg-ivory-50/50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-white shadow-xs border border-sage-100 mt-0.5">
            {icon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
                {conflict.risk_level} Attention
              </span>
              <span className="text-xs text-charcoal-400 font-medium">
                {conflict.ingredients.join(' + ')}
              </span>
            </div>
            <h3 className="text-base font-bold text-charcoal-900">{conflict.title}</h3>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Affects: <span className="font-semibold text-charcoal-800">{conflict.products_involved.join(', ')}</span>
            </p>
          </div>
        </div>

        <button className="p-1 rounded-lg hover:bg-beige-200 text-charcoal-400 transition mt-1">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-5 pt-3 border-t border-sage-100 space-y-4 text-xs">
          {/* Why it deserves attention */}
          <div className="bg-white p-3.5 rounded-xl border border-sage-100">
            <h4 className="font-bold text-charcoal-900 flex items-center space-x-1.5 mb-1 text-[11px] uppercase tracking-wider">
              <AlertCircle className="w-3.5 h-3.5 text-sage-600" />
              <span>Why This Combination Deserves Attention</span>
            </h4>
            <p className="text-charcoal-700 leading-relaxed">{conflict.why}</p>
          </div>

          {/* Missing info */}
          <div className="bg-beige-50/70 p-3.5 rounded-xl border border-beige-200">
            <h4 className="font-bold text-charcoal-800 flex items-center space-x-1.5 mb-1 text-[11px] uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5 text-charcoal-500" />
              <span>What Information is Missing</span>
            </h4>
            <p className="text-charcoal-600 leading-relaxed italic">{conflict.missing_info}</p>
          </div>

          {/* Safer usage alternatives */}
          <div className="bg-sage-50/60 p-3.5 rounded-xl border border-sage-200">
            <h4 className="font-bold text-sage-900 flex items-center space-x-1.5 mb-2 text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-sage-600" />
              <span>Safer Usage Alternatives to Consider</span>
            </h4>
            <ul className="space-y-1.5 text-sage-800">
              {conflict.safe_alternatives.map((alt, idx) => (
                <li key={idx} className="flex items-start space-x-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-500 flex-shrink-0 mt-1.5" />
                  <span>{alt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
