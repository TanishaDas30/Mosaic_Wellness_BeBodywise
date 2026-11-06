import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AssistantResponse } from '../types';
import {
  Bot,
  User,
  Send,
  Sparkles,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Info,
  CheckCircle2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: { source: string; details: string }[];
  followups?: string[];
  disclaimer?: string;
  timestamp: string;
}

export const AssistantPage: React.FC = () => {
  const { user, routineCategory } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    'Why does my skin feel dry after using these products?',
    'Am I using too many exfoliating ingredients?',
    'Which products in my routine have overlapping active ingredients?',
    'Why am I experiencing different results from what I expected?',
    'What should I check before adding another product?'
  ];

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: `Hello ${user?.full_name?.split(' ')[0] || 'there'}! I am your SkinSense Formulation & Product Assistant. I have loaded your current ${routineCategory} routine, your active ingredients, manufacturer application guidelines, and your recent weekly experience records. How can I assist you with your routine today?`,
        citations: [
          {
            source: 'SkinSense Context Engine',
            details: `Active Profile: ${user?.skin_type} Skin, Concerns: ${user?.skin_concerns.join(', ')}`,
          },
        ],
        followups: sampleQuestions.slice(0, 3),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [routineCategory, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const q = textToSend || inputText;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await api.askAssistant(q);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: res.response,
        citations: res.citations,
        followups: res.suggested_followups,
        disclaimer: res.non_diagnostic_notice,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'I apologize, but I encountered an issue analyzing your query. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sage-100 shadow-card flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-sage-500 text-white flex items-center justify-center shadow-md shadow-sage-200">
            <Bot className="w-6 h-6 text-ivory-100" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-charcoal-900">AI Product & Routine Assistant</h1>
              <span className="text-[10px] text-sage-700 bg-sage-100 px-2 py-0.5 rounded-full font-semibold">
                Context-Aware
              </span>
            </div>
            <p className="text-xs text-charcoal-500">
              Evidence-based answers citing your saved products, active ingredients, and clinical formulation rules.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-sage-800 bg-sage-50 px-3 py-1.5 rounded-2xl border border-sage-200">
          <ShieldCheck className="w-4 h-4 text-sage-600" />
          <span>Non-Diagnostic Disclaimer Active</span>
        </div>
      </div>

      {/* Suggested Questions Ribbon */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider whitespace-nowrap">
          Quick Inquiries:
        </span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="text-xs bg-white hover:bg-beige-50 text-charcoal-700 px-3 py-1.5 rounded-full border border-sage-200 whitespace-nowrap transition shadow-subtle hover:border-sage-400"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card min-h-[480px] max-h-[600px] overflow-y-auto space-y-6">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-charcoal-900 text-white'
                    : 'bg-sage-600 text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`space-y-2 max-w-2xl ${isUser ? 'items-end' : ''}`}>
                <div
                  className={`p-4 rounded-3xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-sage-600 text-white rounded-tr-xs shadow-subtle font-medium'
                      : 'bg-ivory-50 text-charcoal-900 border border-sage-200 rounded-tl-xs shadow-xs font-sans whitespace-pre-line'
                  }`}
                >
                  {m.text}
                </div>

                {/* Citations */}
                {m.citations && m.citations.length > 0 && (
                  <div className="space-y-1.5 pl-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 flex items-center space-x-1">
                      <BookOpen className="w-3 h-3 text-sage-600" />
                      <span>Formulation Citations & References:</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {m.citations.map((c, i) => (
                        <div
                          key={i}
                          className="bg-white p-2 rounded-xl border border-sage-200 text-[10px] text-charcoal-700 shadow-xs"
                        >
                          <strong className="text-sage-800">{c.source}:</strong> {c.details}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Followups */}
                {m.followups && m.followups.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5 pl-2">
                    {m.followups.map((f, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(f)}
                        className="text-[10px] bg-sage-50 hover:bg-sage-100 text-sage-800 px-2.5 py-1 rounded-full border border-sage-200 font-medium transition"
                      >
                        → {f}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-charcoal-400 block px-2">
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-sage-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-3xl bg-ivory-50 border border-sage-200 rounded-tl-xs flex items-center space-x-2 text-xs text-charcoal-500">
              <span className="w-3.5 h-3.5 border-2 border-sage-600 border-t-transparent rounded-full animate-spin" />
              <span>Consulting routine active pharmacology and instructions...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a question about your products, peeling, dryness, or ingredient layering..."
          className="w-full pl-5 pr-14 py-4 rounded-3xl bg-white border border-sage-200 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-sage-400 shadow-card font-sans"
        />
        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="absolute right-2.5 top-2.5 p-2 rounded-2xl bg-sage-600 text-white hover:bg-sage-700 transition disabled:opacity-40 shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      <p className="text-[10px] text-charcoal-400 text-center italic">
        SkinSense Assistant provides evidence-based formulation and routine insights. It does not provide medical diagnoses or replace consultations with licensed dermatologists.
      </p>
    </div>
  );
};
