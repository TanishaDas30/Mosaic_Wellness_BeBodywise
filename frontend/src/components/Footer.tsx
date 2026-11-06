import React from 'react';
import { Sparkles, Shield, Heart, FileText, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal-900 text-ivory-200 pt-12 pb-8 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-sage-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-ivory-100" />
              </div>
              <span className="font-bold text-lg text-white">SkinSense</span>
              <span className="text-[10px] text-sage-300 bg-sage-950 px-1.5 py-0.5 rounded border border-sage-800">
                Be Bodywise
              </span>
            </div>
            <p className="text-xs text-charcoal-400 leading-relaxed">
              Understand your products. Improve your routine. AI-powered product experience intelligence & multi-active routine compatibility.
            </p>
            <div className="pt-1 flex items-center space-x-2 text-[11px] text-sage-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Evidence-Based Formulation Intelligence</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Core Modules</h4>
            <ul className="space-y-2 text-xs text-charcoal-300">
              <li className="hover:text-sage-300 cursor-pointer transition">AI Product Experience Tracker</li>
              <li className="hover:text-sage-300 cursor-pointer transition">Routine Compatibility Checker</li>
              <li className="hover:text-sage-300 cursor-pointer transition">AM/PM Chronological Planner</li>
              <li className="hover:text-sage-300 cursor-pointer transition">Product Review Aspect NLP</li>
              <li className="hover:text-sage-300 cursor-pointer transition">OCR Ingredient Label Scanner</li>
            </ul>
          </div>

          {/* Clinical Principles */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Formulation Principles</h4>
            <ul className="space-y-2 text-xs text-charcoal-300">
              <li>Lipid Barrier Conservation</li>
              <li>Active Layering Compatibility</li>
              <li>Skin Cycling Protocols</li>
              <li>Physiological pH Alignment</li>
              <li>Photoprotection Mandates</li>
            </ul>
          </div>

          {/* Transparency & Disclaimer */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Dermatological Disclosure</h4>
            <p className="text-[11px] text-charcoal-400 leading-relaxed">
              SkinSense evaluates ingredient interactions, manufacturer directions, and self-reported progress. 
              Observations are distinguished from clinical explanations. This platform does not provide medical diagnosis.
            </p>
            <div className="mt-3 flex items-center space-x-2 text-xs text-sage-400 font-medium">
              <span>Mosaic Fellowship Builder Challenge</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-charcoal-800 flex flex-col sm:flex-row justify-between items-center text-xs text-charcoal-400">
          <p>© 2026 SkinSense Be Bodywise. All rights reserved.</p>
          <div className="flex space-x-4 mt-3 sm:mt-0">
            <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition">Ingredient Safety Standards</span>
            <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
