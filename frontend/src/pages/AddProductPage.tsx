import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Product, OCRResult } from '../types';
import {
  Search,
  PlusCircle,
  ScanLine,
  Camera,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface AddProductPageProps {
  onSuccess: () => void;
}

export const AddProductPage: React.FC<AddProductPageProps> = ({ onSuccess }) => {
  const { routineCategory } = useAuth();
  const [activeTab, setActiveTab] = useState<'catalog' | 'ocr' | 'custom'>('catalog');
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // OCR state
  const [ocrText, setOcrText] = useState(
    'Aqua, Glycerin, Salicylic Acid (2%), Niacinamide (5%), Zinc PCA, Allantoin, Phenoxyethanol, Disodium EDTA, Parfum (Fragrance)'
  );
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [ocrScanning, setOcrScanning] = useState(false);

  // Custom product state
  const [customName, setCustomName] = useState('');
  const [customBrand, setCustomBrand] = useState('Be Bodywise');
  const [customCategory, setCustomCategory] = useState<'skincare' | 'haircare' | 'bodycare'>('skincare');
  const [customSubcategory, setCustomSubcategory] = useState('Serum');
  const [customActives, setCustomActives] = useState('Salicylic Acid 2%, Zinc PCA 1%');
  const [customInstructions, setCustomInstructions] = useState('Apply 3-4 drops evening only.');
  const [customPrecautions, setCustomPrecautions] = useState('Always follow with broad-spectrum SPF.');
  const [customTime, setCustomTime] = useState<'AM' | 'PM' | 'BOTH'>('PM');
  const [customFrequency, setCustomFrequency] = useState('Daily');

  useEffect(() => {
    loadCatalog();
  }, [routineCategory]);

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts(routineCategory);
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCatalogProduct = async (p: Product) => {
    try {
      await api.addToRoutine({
        product_id: p.id,
        purchased_for_concern: p.subcategory || 'General improvement',
        application_time: p.recommended_time || 'PM',
        frequency: p.frequency || 'Daily',
      });
      alert(`"${p.name}" successfully added to your routine!`);
      onSuccess();
    } catch (err: any) {
      alert(err.message || 'Failed to add product');
    }
  };

  const handleRunOCR = async () => {
    setOcrScanning(true);
    try {
      const res = await api.scanLabelOCR({ raw_text: ocrText });
      setOcrResult(res);
    } catch (err: any) {
      alert('OCR extraction failed');
    } finally {
      setOcrScanning(false);
    }
  };

  const handleSaveCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName) return;

    // Parse actives string
    const activesArr = customActives.split(',').map((item) => {
      const trimmed = item.trim();
      return {
        name: trimmed.replace(/[\d%]/g, '').trim(),
        percentage: trimmed.match(/\d+%/)?.[0] || '',
        purpose: 'Active compound',
      };
    });

    try {
      const newProd = await api.createCustomProduct({
        name: customName,
        brand: customBrand,
        category: customCategory,
        subcategory: customSubcategory,
        description: 'User-customized formulation',
        active_ingredients: activesArr,
        instructions: customInstructions,
        precautions: customPrecautions,
        recommended_time: customTime,
        frequency: customFrequency,
      });

      await api.addToRoutine({
        product_id: newProd.id,
        purchased_for_concern: customSubcategory,
        application_time: customTime,
        frequency: customFrequency,
      });

      alert(`Custom formulation "${customName}" saved and added to routine!`);
      onSuccess();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-sage-50 px-2.5 py-0.5 rounded-full border border-sage-200">
              Product Onboarding
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
              Add Products to Your Intelligence Registry
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-500 max-w-2xl">
              Choose from verified Be Bodywise formulations, scan ingredient labels via OCR, or enter a custom targeted product.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-ivory-100 p-1 rounded-2xl border border-sage-200 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'catalog' ? 'bg-sage-600 text-white shadow-sm' : 'text-charcoal-600'
              }`}
            >
              Be Bodywise Catalog
            </button>
            <button
              onClick={() => setActiveTab('ocr')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                activeTab === 'ocr' ? 'bg-sage-600 text-white shadow-sm' : 'text-charcoal-600'
              }`}
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>OCR Label Scanner</span>
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'custom' ? 'bg-sage-600 text-white shadow-sm' : 'text-charcoal-600'
              }`}
            >
              Custom Formulation
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: CATALOG SEARCH */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name, active ingredient..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-sage-200 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-400 shadow-subtle"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-6 border border-sage-100 shadow-card hover:shadow-float transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-sage-700 bg-sage-50 px-2.5 py-0.5 rounded-full border border-sage-200">
                      {p.subcategory || p.category}
                    </span>
                    <span className="text-[10px] text-charcoal-400 font-semibold">{p.recommended_time} Regimen</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-charcoal-900 leading-snug">{p.name}</h3>
                    <p className="text-xs text-charcoal-400">{p.brand}</p>
                  </div>

                  <p className="text-xs text-charcoal-600 leading-relaxed line-clamp-2">
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.active_ingredients?.map((a, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-ivory-100 text-sage-900 px-2 py-0.5 rounded-md border border-sage-200 font-medium"
                      >
                        {a.name} {a.percentage ? `(${a.percentage})` : ''}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-sage-100 flex items-center justify-between">
                  <span className="text-xs text-charcoal-500 font-medium">{p.frequency}</span>
                  <button
                    onClick={() => handleAddCatalogProduct(p)}
                    className="px-3.5 py-2 rounded-xl bg-sage-600 text-white text-xs font-semibold hover:bg-sage-700 transition shadow-xs flex items-center space-x-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add to Routine</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: OCR LABEL SCANNER */}
      {activeTab === 'ocr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-charcoal-900 uppercase tracking-wider">
              <ScanLine className="w-4 h-4 text-sage-600" />
              <span>Ingredient Label OCR & Analysis</span>
            </div>
            <p className="text-xs text-charcoal-500">
              Paste ingredient list text or simulate an uploaded product bottle photo to extract actives, detect irritants, and verify compatibility.
            </p>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                Ingredient List / OCR Text
              </label>
              <textarea
                rows={5}
                value={ocrText}
                onChange={(e) => setOcrText(e.target.value)}
                className="w-full p-3 rounded-2xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900 font-mono leading-relaxed focus:ring-2 focus:ring-sage-400 focus:outline-none"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setOcrText(
                      'Aqua, Salicylic Acid (1%), Sodium Lauroyl Sarcosinate, Chamomilla Recutita Flower Extract, Glycerin, Phenoxyethanol'
                    )
                  }
                  className="text-[11px] bg-beige-100 hover:bg-beige-200 text-charcoal-700 px-3 py-1 rounded-full border border-beige-300"
                >
                  Salicylic Wash Label
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setOcrText(
                      'Aqua, Retinol (0.3%), Bakuchiol (1%), Squalane, Alcohol Denat, Parfum (Fragrance), Phenoxyethanol'
                    )
                  }
                  className="text-[11px] bg-beige-100 hover:bg-beige-200 text-charcoal-700 px-3 py-1 rounded-full border border-beige-300"
                >
                  Retinol + Sensitizer Label
                </button>
              </div>

              <button
                onClick={handleRunOCR}
                disabled={ocrScanning}
                className="w-full py-3 rounded-2xl bg-sage-600 text-white font-semibold text-xs hover:bg-sage-700 transition shadow-card flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {ocrScanning ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Extracting Chemical Nomenclature...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Process OCR & Detect Actives</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* OCR Result View */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card space-y-5">
            <h3 className="text-base font-bold text-charcoal-900">OCR Extraction Report</h3>

            {ocrResult ? (
              <div className="space-y-4 animate-in fade-in duration-200 text-xs">
                {/* Cleanliness score */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-ivory-100 border border-sage-200">
                  <div>
                    <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider block">
                      Formula Cleanliness Index
                    </span>
                    <span className="text-2xl font-extrabold text-sage-800">
                      {ocrResult.cleanliness_score}/100
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-sage-700 bg-white px-3 py-1 rounded-full border border-sage-200">
                    {ocrResult.potential_sensitizers.length === 0 ? 'Hypoallergenic Standard' : 'Sensitizers Flagged'}
                  </span>
                </div>

                {/* Detected Actives */}
                <div>
                  <h4 className="font-bold text-charcoal-900 mb-2 uppercase tracking-wider text-[11px]">
                    Identified Active Ingredients ({ocrResult.active_compounds.length})
                  </h4>
                  <div className="space-y-2">
                    {ocrResult.active_compounds.map((act, i) => (
                      <div key={i} className="p-3 rounded-xl bg-sage-50 border border-sage-200 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sage-900">{act.name}</span>
                          <span className="text-[10px] text-sage-700 font-semibold">{act.classification}</span>
                        </div>
                        <p className="text-[11px] text-charcoal-600">{act.purpose}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flagged Sensitizers */}
                {ocrResult.potential_sensitizers.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-amber-900 font-bold uppercase tracking-wider text-[11px]">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Potential Sensitizers Detected</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {ocrResult.potential_sensitizers.map((s, i) => (
                        <span key={i} className="bg-white text-amber-800 px-2 py-0.5 rounded border border-amber-300 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-charcoal-400">
                Click "Process OCR" to parse active compounds and potential sensitizers.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOM PRODUCT CREATION */}
      {activeTab === 'custom' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card">
          <h3 className="text-lg font-bold text-charcoal-900 mb-1">Add Custom Formulation</h3>
          <p className="text-xs text-charcoal-500 mb-6">
            Register any product in your skincare cabinet with active ingredients and timing parameters.
          </p>

          <form onSubmit={handleSaveCustom} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. 2% BHA Liquid Exfoliant"
                  className="w-full p-2.5 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  placeholder="e.g. Be Bodywise"
                  className="w-full p-2.5 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={customCategory}
                  onChange={(e: any) => setCustomCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900"
                >
                  <option value="skincare">Skincare</option>
                  <option value="bodycare">Bodycare</option>
                  <option value="haircare">Haircare</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Format
                </label>
                <input
                  type="text"
                  value={customSubcategory}
                  onChange={(e) => setCustomSubcategory(e.target.value)}
                  placeholder="e.g. Exfoliant Serum"
                  className="w-full p-2.5 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Application Timing
                </label>
                <select
                  value={customTime}
                  onChange={(e: any) => setCustomTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900"
                >
                  <option value="AM">Morning (AM)</option>
                  <option value="PM">Evening (PM)</option>
                  <option value="BOTH">Both AM & PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Active Ingredients (Comma separated with %)
              </label>
              <input
                type="text"
                value={customActives}
                onChange={(e) => setCustomActives(e.target.value)}
                placeholder="e.g. Salicylic Acid 2%, Niacinamide 5%"
                className="w-full p-2.5 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Usage Instructions
              </label>
              <input
                type="text"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Apply 3 drops onto clean dry skin"
                className="w-full p-2.5 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-sage-600 text-white font-semibold text-xs hover:bg-sage-700 transition shadow-card flex items-center justify-center space-x-2 mt-6"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Save and Add to Routine</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
