import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Shield,
  Activity,
  Layers,
  CheckCircle2,
  Save,
  Sparkles,
  Mail,
  Calendar
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [skinType, setSkinType] = useState(user?.skin_type || 'Combination');
  const [skinConcerns, setSkinConcerns] = useState<string[]>(user?.skin_concerns || []);
  const [hairType, setHairType] = useState(user?.hair_type || 'Wavy / Medium');
  const [scalpType, setScalpType] = useState(user?.scalp_type || 'Oily Scalp');
  const [hairConcerns, setHairConcerns] = useState<string[]>(user?.hair_concerns || []);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const availableSkinConcerns = [
    'Body Acne', 'Facial Acne', 'Uneven Texture', 'Keratosis Pilaris',
    'Post-Inflammatory Hyperpigmentation', 'Dehydration', 'Sebum Regulation', 'Barrier Compromise'
  ];

  const availableHairConcerns = [
    'Hair Fall', 'Follicle Miniaturization', 'Telogen Shedding', 'Dandruff / Scalp Flaking', 'Dry Ends', 'Excess Sebum'
  ];

  const toggleSkin = (c: string) => {
    if (skinConcerns.includes(c)) {
      setSkinConcerns(skinConcerns.filter((x) => x !== c));
    } else {
      setSkinConcerns([...skinConcerns, c]);
    }
  };

  const toggleHair = (c: string) => {
    if (hairConcerns.includes(c)) {
      setHairConcerns(hairConcerns.filter((x) => x !== c));
    } else {
      setHairConcerns([...hairConcerns, c]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await updateProfile({
        full_name: fullName,
        skin_type: skinType,
        skin_concerns: skinConcerns,
        hair_type: hairType,
        scalp_type: scalpType,
        hair_concerns: hairConcerns,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-3xl bg-sage-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-sage-200">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-charcoal-900">{user?.full_name}</h1>
              {user?.role === 'admin' && (
                <span className="text-xs bg-lavender-100 text-lavender-800 font-bold px-2.5 py-0.5 rounded-full border border-lavender-200">
                  Product Lead / Admin
                </span>
              )}
            </div>
            <p className="text-xs text-charcoal-400 flex items-center space-x-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{user?.email}</span>
              <span>•</span>
              <Calendar className="w-3.5 h-3.5" />
              <span>Registered {new Date(user?.created_at || '').toLocaleDateString()}</span>
            </p>
          </div>
        </div>

        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-200 flex items-center space-x-1 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile Saved!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Skin Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card space-y-5">
          <div className="flex items-center space-x-2 text-xs font-bold text-charcoal-900 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-sage-600" />
            <span>Epidermal & Skin Barrier Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Skin Type
              </label>
              <select
                value={skinType}
                onChange={(e) => setSkinType(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900"
              >
                <option value="Oily">Oily</option>
                <option value="Dry">Dry</option>
                <option value="Combination">Combination</option>
                <option value="Combination / Acne-Prone">Combination / Acne-Prone</option>
                <option value="Sensitive">Sensitive</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
              Primary Skin Concerns
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSkinConcerns.map((c) => {
                const sel = skinConcerns.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleSkin(c)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition font-medium ${
                      sel
                        ? 'bg-sage-600 text-white border-sage-600 font-semibold shadow-xs'
                        : 'bg-ivory-50 text-charcoal-700 border-sage-200 hover:bg-beige-50'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hair & Scalp Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card space-y-5">
          <div className="flex items-center space-x-2 text-xs font-bold text-charcoal-900 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-lavender-600" />
            <span>Hair & Scalp Follicle Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Hair Texture / Density
              </label>
              <input
                type="text"
                value={hairType}
                onChange={(e) => setHairType(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Scalp Environment
              </label>
              <input
                type="text"
                value={scalpType}
                onChange={(e) => setScalpType(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
              Primary Hair & Scalp Concerns
            </label>
            <div className="flex flex-wrap gap-2">
              {availableHairConcerns.map((c) => {
                const sel = hairConcerns.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleHair(c)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition font-medium ${
                      sel
                        ? 'bg-lavender-600 text-white border-lavender-600 font-semibold shadow-xs'
                        : 'bg-ivory-50 text-charcoal-700 border-sage-200 hover:bg-beige-50'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-2xl bg-sage-600 text-white font-semibold text-xs hover:bg-sage-700 shadow-card transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          {saving ? (
            <span>Saving Changes...</span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Update Profile Parameters</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
