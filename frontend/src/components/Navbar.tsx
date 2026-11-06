import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  MessageSquare,
  BarChart3,
  Clock,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Activity,
  Bot
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, isAuthenticated, logout, routineCategory, setRoutineCategory, quickDemoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'experience', label: 'Experience Tracker', icon: Activity },
    { id: 'routine', label: 'Compatibility Checker', icon: ShieldCheck },
    { id: 'planner', label: 'AM/PM Planner', icon: Calendar },
    { id: 'add-product', label: 'Add Product & OCR', icon: PlusCircle },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'reviews', label: 'Review Intelligence', icon: MessageSquare },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
  ];

  if (user?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Brand Intelligence', icon: BarChart3 });
  }

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-ivory-50/90 backdrop-blur-md border-b border-sage-100 shadow-subtle">
      {/* Top Banner: Brand Tagline & Quick Switcher */}
      <div className="bg-sage-900 text-ivory-100 px-4 py-1.5 text-xs font-medium tracking-wide flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Be Bodywise Product Intelligence Network</span>
          <span className="hidden sm:inline text-sage-300">•</span>
          <span className="hidden sm:inline text-sage-200">Understand your products. Improve your routine.</span>
        </div>
        <div className="flex items-center space-x-3">
          {/* Skincare / Haircare Mode Switcher */}
          <div className="flex items-center bg-sage-800/80 rounded-full p-0.5 border border-sage-700">
            <button
              onClick={() => setRoutineCategory('skincare')}
              className={`px-3 py-0.5 rounded-full text-xs transition-all ${
                routineCategory === 'skincare'
                  ? 'bg-sage-600 text-white font-semibold shadow-sm'
                  : 'text-sage-300 hover:text-white'
              }`}
            >
              Skincare
            </button>
            <button
              onClick={() => setRoutineCategory('haircare')}
              className={`px-3 py-0.5 rounded-full text-xs transition-all ${
                routineCategory === 'haircare'
                  ? 'bg-sage-600 text-white font-semibold shadow-sm'
                  : 'text-sage-300 hover:text-white'
              }`}
            >
              Haircare
            </button>
          </div>

          {!isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => quickDemoLogin('user')}
                className="text-xs bg-sage-700 hover:bg-sage-600 text-ivory-50 px-2 py-0.5 rounded border border-sage-600 transition"
              >
                Demo User
              </button>
              <button
                onClick={() => quickDemoLogin('admin')}
                className="text-xs bg-lavender-700 hover:bg-lavender-600 text-ivory-50 px-2 py-0.5 rounded border border-lavender-600 transition"
              >
                Admin Demo
              </button>
            </div>
          ) : (
            <span className="text-xs text-sage-300 hidden md:inline">
              Logged in: <strong className="text-white">{user?.full_name}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-sage-500 flex items-center justify-center text-white shadow-md shadow-sage-200 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-ivory-100" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-xl tracking-tight text-charcoal-900">SkinSense</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-sage-600 bg-sage-100 px-1.5 py-0.5 rounded">
                  Be Bodywise
                </span>
              </div>
              <p className="text-[10px] text-charcoal-400 font-medium tracking-tight -mt-0.5">
                Formulation & Routine Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'bg-sage-100 text-sage-800 font-semibold shadow-xs'
                        : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-beige-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-sage-600' : 'text-charcoal-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-beige-100 border border-sage-200 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-sage-200 text-sage-800 font-bold text-xs flex items-center justify-center">
                    {user?.full_name?.charAt(0) || 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-charcoal-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-float border border-sage-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-sage-100">
                      <p className="text-sm font-semibold text-charcoal-900">{user?.full_name}</p>
                      <p className="text-xs text-charcoal-400 truncate">{user?.email}</p>
                      <div className="mt-1 flex gap-1">
                        <span className="text-[10px] bg-sage-50 text-sage-700 font-medium px-2 py-0.5 rounded-full">
                          {user?.skin_type}
                        </span>
                        {user?.role === 'admin' && (
                          <span className="text-[10px] bg-lavender-100 text-lavender-700 font-semibold px-2 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigate('profile');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-charcoal-700 hover:bg-beige-50 flex items-center space-x-2"
                    >
                      <User className="w-4 h-4 text-charcoal-400" />
                      <span>User Profile & Skin/Hair Data</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigate('admin');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-charcoal-700 hover:bg-beige-50 flex items-center space-x-2"
                    >
                      <BarChart3 className="w-4 h-4 text-lavender-500" />
                      <span>Brand Intelligence Dashboard</span>
                    </button>

                    <div className="border-t border-sage-100 my-1"></div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        onNavigate('landing');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onNavigate('auth')}
                  className="px-4 py-2 text-xs font-semibold text-charcoal-700 hover:text-charcoal-900 transition"
                >
                  Log In
                </button>
                <button
                  onClick={() => onNavigate('auth')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-sage-600 text-white hover:bg-sage-700 shadow-sm transition"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            {isAuthenticated && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-charcoal-600 hover:text-charcoal-900 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && isAuthenticated && (
        <div className="lg:hidden bg-white border-b border-sage-200 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  active ? 'bg-sage-100 text-sage-900 font-semibold' : 'text-charcoal-600 hover:bg-beige-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-sage-600' : 'text-charcoal-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
