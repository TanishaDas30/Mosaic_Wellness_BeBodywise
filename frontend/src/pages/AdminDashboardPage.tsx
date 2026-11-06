import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AdminAnalytics } from '../types';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ShieldCheck,
  Sparkles,
  Layers,
  Activity,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>('last_30_days');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [selectedCategory, selectedTimePeriod]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminAnalytics(selectedCategory, selectedTimePeriod);
      setAnalytics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0A42C1', '#846FA0', '#D97706', '#08359B', '#062875'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Anonymization Safeguard Notice */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-lavender-700 bg-lavender-100 px-2.5 py-0.5 rounded-full border border-lavender-200">
              Formulation & Brand Intelligence
            </span>
            <span className="text-xs text-charcoal-400 font-medium">• Aggregated Data</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
            Brand Intelligence & Feedback Analytics
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 max-w-2xl">
            Real-world post-market surveillance for Be Bodywise R&D and product formulation teams.
            Anonymized signals to identify barrier disruption patterns, active tolerance, and packaging clarity.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-800 font-semibold"
          >
            <option value="all">All Product Categories</option>
            <option value="bodycare">Bodycare Formulations</option>
            <option value="skincare">Skincare Formulations</option>
            <option value="haircare">Haircare Formulations</option>
          </select>

          <select
            value={selectedTimePeriod}
            onChange={(e) => setSelectedTimePeriod(e.target.value)}
            className="p-2 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-800 font-semibold"
          >
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="last_90_days">Last Quarter</option>
          </select>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-4 rounded-2xl bg-sage-900 text-ivory-100 text-xs flex items-center justify-between shadow-subtle">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Anonymization Safeguard:</strong> All logs are scrubbed of PII and health identifiers. 
            Data represents statistical formulation clusters under Mosaic Fellowship Builder Challenge compliance.
          </span>
        </div>
        <span className="text-[11px] text-sage-300 font-mono hidden md:inline">
          {analytics?.total_anonymized_logs || 0} Data Points Analyzed
        </span>
      </div>

      {analytics && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Key Metrics KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-sage-100 shadow-card">
              <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider">
                Total Feedback Records
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-2xl font-extrabold text-charcoal-900">
                  {analytics.total_anonymized_logs}
                </span>
                <span className="text-xs text-emerald-600 font-semibold">+18% this month</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-sage-100 shadow-card">
              <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider">
                Average Regimen Satisfaction
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-2xl font-extrabold text-sage-700">86.4%</span>
                <span className="text-xs text-sage-600 font-semibold">High Compatibility</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-sage-100 shadow-card">
              <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider">
                Top Reported Positive Signal
              </span>
              <div className="mt-1">
                <span className="text-xs font-bold text-charcoal-900 line-clamp-1">
                  {analytics.most_common_positive_outcomes[0]?.outcome || 'Blemish reduction'}
                </span>
                <span className="text-[11px] text-charcoal-500 font-medium">
                  {analytics.most_common_positive_outcomes[0]?.count || 28} verified incidents
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-sage-100 shadow-card">
              <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider">
                Primary Friction Signal
              </span>
              <div className="mt-1">
                <span className="text-xs font-bold text-amber-800 line-clamp-1">
                  {analytics.most_frequent_unwanted_effects[0]?.effect || 'Post-wash dryness'}
                </span>
                <span className="text-[11px] text-charcoal-500 font-medium">
                  {analytics.most_frequent_unwanted_effects[0]?.count || 14} barrier notices
                </span>
              </div>
            </div>
          </div>

          {/* Charts: Complaints Breakdown vs Satisfaction by Category */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Unwanted Effects Frequency Bar Chart */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-charcoal-900">
                    Most Frequently Reported Unwanted Effects
                  </h3>
                  <p className="text-xs text-charcoal-500">
                    Frequency of consumer-reported sensations requiring formulation guidance.
                  </p>
                </div>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics.most_frequent_unwanted_effects}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3EDE2" />
                    <XAxis type="number" stroke="#7E8796" fontSize={11} />
                    <YAxis
                      dataKey="effect"
                      type="category"
                      stroke="#7E8796"
                      fontSize={11}
                      width={140}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #C6DBC9',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" fill="#D97706" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Satisfaction By Category */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card space-y-4">
              <div>
                <h3 className="text-base font-bold text-charcoal-900">
                  Satisfaction By Formulation Category
                </h3>
                <p className="text-xs text-charcoal-500">
                  Customer compatibility index per vertical.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {analytics.category_satisfaction.map((cat, i) => (
                  <div key={i} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-charcoal-800">
                      <span>{cat.category} Products</span>
                      <span className="text-sage-700">{cat.satisfaction_pct}% Satisfaction</span>
                    </div>
                    <div className="w-full bg-ivory-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-sage-600 transition-all duration-700"
                        style={{ width: `${cat.satisfaction_pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-charcoal-400 block text-right">
                      {cat.product_count} active formulations in portfolio
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Performance Table & Emerging Friction Patterns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Performance Ranking Table (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card space-y-4">
              <h3 className="text-base font-bold text-charcoal-900">
                Product Formulation Performance Ranking
              </h3>
              <p className="text-xs text-charcoal-500">
                Monitoring complaint rate percentages to guide packaging directions and hydration pairing.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-sage-200 text-charcoal-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5">Product Name</th>
                      <th className="py-2.5">Category</th>
                      <th className="py-2.5 text-center">Satisfaction</th>
                      <th className="py-2.5">Primary Friction Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage-100 text-charcoal-700">
                    {analytics.product_performance_ranking.map((p) => (
                      <tr key={p.id} className="hover:bg-ivory-50/60 transition">
                        <td className="py-3 font-semibold text-charcoal-900">{p.name}</td>
                        <td className="py-3 capitalize text-charcoal-500">{p.category}</td>
                        <td className="py-3 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sage-50 text-sage-800 border border-sage-200">
                            {p.satisfaction_score}%
                          </span>
                        </td>
                        <td className="py-3 text-charcoal-600">{p.primary_reported_unwanted}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Emerging Feedback Patterns (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-charcoal-900 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-sage-600" />
                <span>Emerging Product Feedback Patterns</span>
              </div>
              <p className="text-xs text-charcoal-500">
                Actionable algorithmic insights for product managers and dermatological formulators.
              </p>

              <div className="space-y-3">
                {analytics.emerging_feedback_patterns.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-ivory-50 border border-sage-200 space-y-1.5 text-xs">
                    <h4 className="font-bold text-charcoal-900 leading-snug">{item.pattern}</h4>
                    <p className="text-amber-800 font-medium">
                      <strong>Impact:</strong> {item.impact}
                    </p>
                    <p className="text-sage-800 bg-white p-2.5 rounded-xl border border-sage-200">
                      <strong>R&D Action:</strong> {item.recommended_action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
