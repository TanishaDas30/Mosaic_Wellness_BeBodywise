import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { TimelineEntry } from '../types';
import {
  Clock,
  Sparkles,
  Calendar,
  Activity,
  PlusCircle,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export const TimelinePage: React.FC = () => {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);

  // New log form state
  const [newWeek, setNewWeek] = useState(5);
  const [newNotes, setNewNotes] = useState('');
  const [acneScore, setAcneScore] = useState(3.0);
  const [drynessScore, setDrynessScore] = useState(3.5);
  const [irritationScore, setIrritationScore] = useState(2.0);
  const [hydrationScore, setHydrationScore] = useState(7.5);
  const [satisfactionScore, setSatisfactionScore] = useState(8.5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    setLoading(true);
    try {
      const data = await api.getTimeline();
      setTimeline(data);
      if (data.length > 0) {
        setNewWeek(Math.max(...data.map((d) => d.week_number)) + 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.logTimelineWeek({
        week_number: newWeek,
        notes: newNotes,
        acne_score: acneScore,
        dryness_score: drynessScore,
        irritation_score: irritationScore,
        hydration_score: hydrationScore,
        satisfaction_score: satisfactionScore,
      });
      setShowLogModal(false);
      setNewNotes('');
      loadTimeline();
    } catch (err: any) {
      alert(err.message || 'Failed to record check-in');
    } finally {
      setSubmitting(false);
    }
  };

  const chartData = timeline.map((t) => ({
    week: `Week ${t.week_number}`,
    Acne: t.acne_score,
    Dryness: t.dryness_score,
    Irritation: t.irritation_score,
    Hydration: t.hydration_score,
    Satisfaction: t.satisfaction_score,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-600 bg-sage-50 px-2.5 py-0.5 rounded-full border border-sage-200">
              Longitudinal Monitoring
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
              Product Experience Progression Timeline
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-500 max-w-2xl">
              Track how your skin barrier and active concerns transform week by week. Visualizing self-reported outcomes
              helps separate transient acclimatization (purging or mild dryness) from chronic incompatibility.
            </p>
          </div>

          <button
            onClick={() => setShowLogModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-sage-600 text-white text-xs font-semibold hover:bg-sage-700 transition shadow-xs flex items-center space-x-1.5 self-start md:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Log Weekly Check-in</span>
          </button>
        </div>
      </div>

      {/* Interactive Charts Section (Recharts) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-charcoal-900">
              Multivariate Outcome Progression
            </h3>
            <p className="text-xs text-charcoal-500">
              Correlating active acne lesions, stratum corneum dryness, and overall satisfaction over time.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-semibold">
            <span className="flex items-center space-x-1 text-red-600">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>Acne</span>
            </span>
            <span className="flex items-center space-x-1 text-amber-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Dryness</span>
            </span>
            <span className="flex items-center space-x-1 text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Hydration</span>
            </span>
            <span className="flex items-center space-x-1 text-sage-700">
              <span className="w-2.5 h-2.5 rounded-full bg-sage-600" />
              <span>Satisfaction</span>
            </span>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3EDE2" />
              <XAxis dataKey="week" stroke="#7E8796" fontSize={11} />
              <YAxis domain={[0, 10]} stroke="#7E8796" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #C6DBC9',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="Acne"
                stroke="#DC2626"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#DC2626' }}
              />
              <Line
                type="monotone"
                dataKey="Dryness"
                stroke="#D97706"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#D97706' }}
              />
              <Line
                type="monotone"
                dataKey="Hydration"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#10B981' }}
              />
              <Line
                type="monotone"
                dataKey="Satisfaction"
                stroke="#0A42C1"
                strokeWidth={3}
                dot={{ r: 5, fill: '#0A42C1' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p className="text-[11px] text-charcoal-400 italic text-center">
          Notice: Self-reported metric progression reflects individual customer experience and does not establish clinical trial efficacy.
        </p>
      </div>

      {/* Week-by-Week Visual Timeline Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-charcoal-900">
          Chronological Experience Journal
        </h3>

        <div className="space-y-4 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-sage-200 before:z-0">
          {timeline.map((entry, idx) => (
            <div
              key={entry.id}
              className="relative z-10 flex items-start space-x-4 animate-in fade-in"
            >
              {/* Timeline circle badge */}
              <div className="w-10 h-10 rounded-2xl bg-sage-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-md shadow-sage-200">
                W{entry.week_number}
              </div>

              {/* Card */}
              <div className="flex-1 bg-white rounded-3xl p-6 border border-sage-100 shadow-card hover:shadow-float transition-all space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sage-100 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-charcoal-900">
                      Week {entry.week_number} Experience Milestone
                    </h4>
                    <span className="text-[11px] text-charcoal-400">
                      Logged on {new Date(entry.date_logged).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-sage-50 text-sage-800 font-semibold border border-sage-200">
                      Satisfaction: {entry.satisfaction_score}/10
                    </span>
                  </div>
                </div>

                <p className="text-xs text-charcoal-700 italic bg-ivory-50 p-3 rounded-2xl border border-beige-200 leading-relaxed font-sans">
                  "{entry.notes}"
                </p>

                {/* Quantitative metrics ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                  <div className="bg-white p-2.5 rounded-xl border border-sage-100">
                    <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">
                      Acne Lesions
                    </span>
                    <span className="text-sm font-extrabold text-red-600">{entry.acne_score} / 10</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-sage-100">
                    <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">
                      Dryness / Flaking
                    </span>
                    <span className="text-sm font-extrabold text-amber-600">{entry.dryness_score} / 10</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-sage-100">
                    <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">
                      Irritation / Stinging
                    </span>
                    <span className="text-sm font-extrabold text-charcoal-800">{entry.irritation_score} / 10</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-sage-100">
                    <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">
                      Barrier Hydration
                    </span>
                    <span className="text-sm font-extrabold text-emerald-600">{entry.hydration_score} / 10</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Weekly Check-in Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-sage-200 shadow-float space-y-4">
            <h3 className="text-lg font-bold text-charcoal-900">
              Record Week {newWeek} Experience Check-in
            </h3>
            <p className="text-xs text-charcoal-500">
              Rate your symptoms on a 1-10 scale to track barrier recovery and concern resolution.
            </p>

            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Week Number
                </label>
                <input
                  type="number"
                  min={1}
                  value={newWeek}
                  onChange={(e) => setNewWeek(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Qualitative Notes & Changes Noticed
                </label>
                <textarea
                  required
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Dryness eased after using 10% urea lotion; back bumps are 80% clearer..."
                  className="w-full p-3 rounded-xl bg-ivory-50 border border-sage-200 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-400"
                />
              </div>

              {/* Sliders */}
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-charcoal-800 mb-1">
                    <span>Acne / Blemish Severity: {acneScore}/10</span>
                    <span className="text-[10px] text-charcoal-400 font-normal">1=Clear, 10=Severe</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={acneScore}
                    onChange={(e) => setAcneScore(Number(e.target.value))}
                    className="w-full accent-sage-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-charcoal-800 mb-1">
                    <span>Dryness / Tightness: {drynessScore}/10</span>
                    <span className="text-[10px] text-charcoal-400 font-normal">1=Hydrated, 10=Extreme Flaking</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={drynessScore}
                    onChange={(e) => setDrynessScore(Number(e.target.value))}
                    className="w-full accent-sage-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-charcoal-800 mb-1">
                    <span>Satisfaction With Routine: {satisfactionScore}/10</span>
                    <span className="text-[10px] text-charcoal-400 font-normal">1=Unhappy, 10=Delighted</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={satisfactionScore}
                    onChange={(e) => setSatisfactionScore(Number(e.target.value))}
                    className="w-full accent-sage-600"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-600 hover:bg-beige-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-sage-600 text-white text-xs font-semibold hover:bg-sage-700 shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Check-in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
