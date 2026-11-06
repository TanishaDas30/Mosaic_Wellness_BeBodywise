import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Shield, User, Lock, Mail, ArrowRight, Check } from 'lucide-react';

interface AuthPageProps {
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { login, register, quickDemoLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Profile settings
  const [skinType, setSkinType] = useState('Combination');
  const [selectedSkinConcerns, setSelectedSkinConcerns] = useState<string[]>(['Body Acne', 'Uneven Texture']);
  const [hairType, setHairType] = useState('Wavy / Medium');
  const [scalpType, setScalpType] = useState('Oily Scalp');
  const [selectedHairConcerns, setSelectedHairConcerns] = useState<string[]>(['Hair Fall']);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const skinConcernsList = [
    'Body Acne', 'Facial Acne', 'Keratosis Pilaris', 'Uneven Texture', 
    'Dryness / Flaking', 'Hyperpigmentation', 'Underarm Darkening', 'Oiliness / Sebum'
  ];

  const hairConcernsList = [
    'Hair Fall', 'Thinning Hair', 'Delayed Growth', 'Dandruff / Flakes', 'Dry Strands', 'Oily Scalp'
  ];

  const toggleSkinConcern = (c: string) => {
    if (selectedSkinConcerns.includes(c)) {
      setSelectedSkinConcerns(selectedSkinConcerns.filter((item) => item !== c));
    } else {
      setSelectedSkinConcerns([...selectedSkinConcerns, c]);
    }
  };

  const toggleHairConcern = (c: string) => {
    if (selectedHairConcerns.includes(c)) {
      setSelectedHairConcerns(selectedHairConcerns.filter((item) => item !== c));
    } else {
      setSelectedHairConcerns([...selectedHairConcerns, c]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register({
          email,
          password,
          full_name: fullName,
          skin_type: skinType,
          skin_concerns: selectedSkinConcerns,
          hair_type: hairType,
          scalp_type: scalpType,
          hair_concerns: selectedHairConcerns,
        });
      } else {
        await login(email, password);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: 'user' | 'admin') => {
    setLoading(true);
    try {
      await quickDemoLogin(role);
      onSuccess();
    } catch (err: any) {
      setError('Demo login failed. Backend may still be initializing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 border border-sage-100 shadow-float">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-sage-500 text-white flex items-center justify-center mx-auto shadow-md shadow-sage-200">
            <Sparkles className="w-6 h-6 text-ivory-100" />
          </div>
          <h2 className="text-2xl font-bold text-charcoal-900">
            {isRegister ? 'Create Your SkinSense Profile' : 'Sign in to SkinSense'}
          </h2>
          <p className="text-xs text-charcoal-500">
            {isRegister
              ? 'Personalize your formulation profile for routine intelligence.'
              : 'Access your saved products, routine conflicts, and timeline logs.'}
          </p>

          {/* Quick Demo Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleDemo('user')}
              className="px-3 py-1.5 rounded-xl bg-sage-100 hover:bg-sage-200 text-sage-800 text-xs font-semibold border border-sage-200 transition"
            >
              Demo User (Ananya Sharma)
            </button>
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              className="px-3 py-1.5 rounded-xl bg-lavender-100 hover:bg-lavender-200 text-lavender-800 text-xs font-semibold border border-lavender-200 transition"
            >
              Demo Admin (Product Lead)
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-400"
                  placeholder="e.g. Ananya Sharma"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-400"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Registration Profile Customization Fields */}
          {isRegister && (
            <div className="pt-2 border-t border-sage-100 space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Skin Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {['Oily', 'Dry', 'Combination', 'Sensitive'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSkinType(t)}
                      className={`p-2 rounded-xl border text-center transition font-medium ${
                        skinType === t
                          ? 'bg-sage-600 text-white border-sage-600 font-semibold shadow-xs'
                          : 'bg-ivory-50 text-charcoal-700 border-sage-200 hover:bg-beige-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Primary Skin Concerns
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {skinConcernsList.map((c) => {
                    const sel = selectedSkinConcerns.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleSkinConcern(c)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition font-medium ${
                          sel
                            ? 'bg-sage-100 text-sage-800 border-sage-300 font-semibold'
                            : 'bg-white text-charcoal-600 border-sage-200 hover:bg-beige-50'
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Hair & Scalp Profile
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <select
                    value={hairType}
                    onChange={(e) => setHairType(e.target.value)}
                    className="p-2 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-800"
                  >
                    <option value="Straight / Fine">Straight / Fine</option>
                    <option value="Wavy / Medium">Wavy / Medium</option>
                    <option value="Curly / Coarse">Curly / Coarse</option>
                    <option value="Coily / Dense">Coily / Dense</option>
                  </select>

                  <select
                    value={scalpType}
                    onChange={(e) => setScalpType(e.target.value)}
                    className="p-2 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-800"
                  >
                    <option value="Oily Scalp">Oily Scalp</option>
                    <option value="Dry Scalp">Dry Scalp</option>
                    <option value="Balanced Scalp">Balanced Scalp</option>
                    <option value="Flaky / Sensitive Scalp">Flaky / Sensitive Scalp</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {hairConcernsList.map((c) => {
                    const sel = selectedHairConcerns.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleHairConcern(c)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition font-medium ${
                          sel
                            ? 'bg-lavender-100 text-lavender-800 border-lavender-300 font-semibold'
                            : 'bg-white text-charcoal-600 border-sage-200 hover:bg-beige-50'
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-sage-600 text-white font-semibold text-xs hover:bg-sage-700 shadow-card transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-6"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isRegister ? 'Complete Registration' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle between register and login */}
        <div className="mt-6 pt-4 border-t border-sage-100 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-xs font-semibold text-sage-700 hover:text-sage-900 transition"
          >
            {isRegister
              ? 'Already registered? Sign in here'
              : "Don't have an account? Create one in 60 seconds"}
          </button>
        </div>
      </div>
    </div>
  );
};
