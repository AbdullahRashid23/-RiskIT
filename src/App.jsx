import React, { useState } from 'react';
import {
  LayoutDashboard,
  Scale,
  Target,
  Radio,
  Menu,
  X,
  ArrowRight,
  Layers,
  RefreshCw,
  Activity,
  Trophy,
  Search,
  Network,
  Zap,
  TrendingUp,
  ShieldCheck,
  Clock,
  Globe,
  BarChart3
} from 'lucide-react';
import './index.css';

// =====================
// INTELLIGENCE HELPER
// =====================

async function callIntelligence(systemPrompt, userPrompt) {
  const res = await fetch('/api/intelligence', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, userPrompt }),
  });

  if (!res.ok) {
    throw new Error(`Intelligence API failed with ${res.status}`);
  }

  const data = await res.json();
  return data.text; // expected { text: "..." }
}

// =====================
// SUB-COMPONENTS
// =====================

const Sparkline = ({ data }) => {
  const points = data
    .map((val, i) => `${(i / (data.length - 1)) * 100},${100 - val}`)
    .join(' L ');
  return (
    <div className="w-16 h-6 sm:w-20 sm:h-8 opacity-60">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <path
          d={`M ${points}`}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="100"
          cy={100 - data[data.length - 1]}
          r="3"
          fill="#10b981"
        />
      </svg>
    </div>
  );
};

const NodeRow = ({ ticker, name, trend }) => (
  <div className="flex items-center justify-between p-3 sm:p-4 bg-[#0c0c0e] border border-zinc-800 rounded-xl hover:border-emerald-500/30 transition-all cursor-pointer group gap-3">
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-zinc-900 flex items-center justify-center font-black italic text-zinc-600 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-colors text-xs sm:text-sm">
        {ticker[0]}
      </div>
      <div>
        <h4 className="font-black italic text-sm sm:text-lg text-zinc-300 group-hover:text-white transition-colors tracking-tight">
          {ticker}
        </h4>
        <p className="text-[8px] sm:text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">
          {name}
        </p>
      </div>
    </div>
    <Sparkline data={trend} />
  </div>
);

const NavTab = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 rounded-xl transition-all group relative overflow-hidden text-[9px] sm:text-[10px] ${
      active
        ? 'bg-zinc-900 text-white'
        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
    }`}
  >
    {active && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 sm:h-6 w-1 bg-emerald-500 rounded-r-full" />
    )}
    <Icon
      size={18}
      className={
        active
          ? 'text-emerald-500'
          : 'group-hover:scale-110 transition-transform'
      }
    />
    <span className="font-black uppercase tracking-widest">{label}</span>
  </button>
);

// =====================
// MAIN APP
// =====================

export default function App() {
  const [activeTab, setActiveTab] = useState('architect');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [recInputs, setRecInputs] = useState({
    amount: '10000',
    market: 'US Tech',
    horizon: 'Long Term',
    halal: true,
  });
  const [compInputs, setCompInputs] = useState({ s1: '', s2: '' });
  const [anaInput, setAnaInput] = useState('');

  const [recommendations, setRecommendations] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  // ==============
  // ARCHITECT
  // ==============

  const handleArchitect = async () => {
    setLoading(true);
    try {
      const systemPrompt = `
You are RISKIT ARCHITECT, a discrete-math financial node selector.

Your task:
1) Given an investment amount, market universe, time horizon, and halal filter,
   choose EXACTLY 3 liquid stocks from that market.
2) Use simple discrete logic:
   - estimate momentum from recent price changes,
   - penalize high volatility (frequent sign changes in returns),
   - prefer higher liquidity.
3) Output ONLY valid JSON with this exact shape:

{
  "strategy": "short natural language description",
  "nodes": [
    { "ticker": "MSFT", "name": "Microsoft Corp", "trend": [10,30,50,40,60,70,80] },
    { "ticker": "AAPL", "name": "Apple Inc", "trend": [ ...7 ints 0-100... ] },
    { "ticker": "GOOGL", "name": "Alphabet Inc", "trend": [ ...7 ints 0-100... ] }
  ]
}

Rules:
- "trend" must be exactly 7 INTEGER values between 0 and 100 representing
  relative price over the last 7 observations.
- Use REAL, actively traded stocks for the specified market.
- If halal filter is ON, avoid obviously non-halal sectors (conventional banks,
  alcohol, gambling, etc.).
- Do NOT include any explanation text outside of that JSON.
`;

      const userPrompt = `
Amount: ${recInputs.amount}
Market universe: ${recInputs.market}
Time horizon: ${recInputs.horizon}
Halal filter: ${recInputs.halal ? 'ON' : 'OFF'}
`;

      const raw = await callIntelligence(systemPrompt, userPrompt);

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        // If Gemini wraps JSON in extra text, try to extract between first { and last }
        const first = raw.indexOf('{');
        const last = raw.lastIndexOf('}');
        if (first !== -1 && last !== -1) {
          parsed = JSON.parse(raw.slice(first, last + 1));
        } else {
          throw new Error('JSON parse failed');
        }
      }

      // Basic validation
      if (!parsed.nodes || !Array.isArray(parsed.nodes) || parsed.nodes.length === 0) {
        throw new Error('Invalid architect payload');
      }

      // Ensure each node has a 7-point trend
      const cleanedNodes = parsed.nodes.slice(0, 3).map((n) => {
        const trend = Array.isArray(n.trend) && n.trend.length === 7
          ? n.trend
          : [10, 30, 50, 40, 60, 70, 80];
        return {
          ticker: n.ticker || 'NODE',
          name: n.name || 'Unknown Node',
          trend: trend.map((v) => Math.max(0, Math.min(100, Math.round(v)))),
        };
      });

      setRecommendations({
        strategy: parsed.strategy || 'AI-generated node architecture.',
        nodes: cleanedNodes,
      });
    } catch (e) {
      console.error('Architect error', e);
      // Fallback static nodes
      setRecommendations({
        strategy:
          'Halal-Compliant US Tech Growth. Focuses on large-cap technology companies with strong competitive moats.',
        nodes: [
          { ticker: 'MSFT', name: 'Microsoft Corp', trend: [30, 40, 35, 50, 60, 55, 70] },
          { ticker: 'AVGO', name: 'Broadcom Inc', trend: [20, 25, 20, 40, 35, 60, 75] },
          { ticker: 'ADBE', name: 'Adobe Systems', trend: [40, 35, 50, 45, 60, 70, 80] },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  // ==============
  // COMPARATOR
  // ==============

  const handleComparator = async () => {
    if (!compInputs.s1 || !compInputs.s2) return;
    setLoading(true);
    try {
      const s1 = compInputs.s1.trim().toUpperCase();
      const s2 = compInputs.s2.trim().toUpperCase();

      const systemPrompt = `
You are RISKIT COMPARATOR, comparing two stock tickers as logical nodes.

You MUST:
- Use financial reasoning (valuation, growth, volatility, halal compliance)
- Decide ONE winner.
- Output ONLY JSON with this exact shape:

{
  "winner": "TICKER",
  "decision": "BUY TICKER",
  "summary": "one sentence explanation focusing on key discrete advantages",
  "scorecard": [
    { "label": "Volatility", "s1": 60, "s2": 40 },
    { "label": "Growth", "s1": 75, "s2": 55 },
    { "label": "Sharia Compl.", "s1": 95, "s2": 30 }
  ]
}

Rules:
- "s1" refers to Node Alpha (${s1}), "s2" to Node Beta (${s2}).
- Score range is 0 to 100 (integers).
- Do NOT add any explanation outside the JSON.
`;

      const userPrompt = `
Node Alpha: ${s1}
Node Beta: ${s2}
Market universe: ${recInputs.market}
Halal filter: ${recInputs.halal ? 'ON' : 'OFF'}
`;

      const raw = await callIntelligence(systemPrompt, userPrompt);

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        const first = raw.indexOf('{');
        const last = raw.lastIndexOf('}');
        if (first !== -1 && last !== -1) {
          parsed = JSON.parse(raw.slice(first, last + 1));
        } else {
          throw new Error('JSON parse failed');
        }
      }

      const scorecard = Array.isArray(parsed.scorecard)
        ? parsed.scorecard.map((row) => ({
            label: row.label || 'Metric',
            s1: Number.isFinite(row.s1) ? Math.max(0, Math.min(100, Math.round(row.s1))) : 50,
            s2: Number.isFinite(row.s2) ? Math.max(0, Math.min(100, Math.round(row.s2))) : 50,
          }))
        : [];

      setComparison({
        winner: parsed.winner || s1,
        decision: parsed.decision || `BUY ${parsed.winner || s1}`,
        summary:
          parsed.summary ||
          `Comparator fallback: ${s1} slightly preferred over ${s2}.`,
        scorecard:
          scorecard.length > 0
            ? scorecard
            : [
                { label: 'Volatility', s1: 60, s2: 45 },
                { label: 'Growth', s1: 70, s2: 55 },
                { label: 'Sharia Compl.', s1: 90, s2: 60 },
              ],
      });
    } catch (e) {
      console.error('Comparator error', e);
      setComparison({
        winner: compInputs.s1,
        decision: `BUY ${compInputs.s1}`,
        summary:
          'Live comparator service unavailable. Fallback logic favours Node Alpha.',
        scorecard: [
          { label: 'Volatility', s1: 60, s2: 45 },
          { label: 'Growth', s1: 70, s2: 55 },
          { label: 'Sharia Compl.', s1: 90, s2: 60 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  // ==============
  // PATHFINDER
  // ==============

  const handlePathfinder = async () => {
    if (!anaInput) return;
    setLoading(true);
    try {
      const ticker = anaInput.trim().toUpperCase();

      const systemPrompt = `
You are RISKIT PATHFINDER, analysing ONE stock node in a risk graph.

Output ONLY JSON with this exact shape:

{
  "ticker": "MSFT",
  "name": "descriptive node name",
  "health": 0.87,
  "desc": "1–2 sentence technical / risk overview.",
  "short": "Short term view label",
  "long": "Long term view label"
}

Rules:
- "health" is a number between 0 and 1 representing structural stability:
  combine trend, volatility, and risk in a simple scoring.
- Make the description concrete and focused on risk/structure, not generic.
- No extra text outside this JSON.
`;

      const userPrompt = `
Ticker: ${ticker}
Market universe: ${recInputs.market}
Time horizon: ${recInputs.horizon}
Halal filter: ${recInputs.halal ? 'ON' : 'OFF'}
`;

      const raw = await callIntelligence(systemPrompt, userPrompt);

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        const first = raw.indexOf('{');
        const last = raw.lastIndexOf('}');
        if (first !== -1 && last !== -1) {
          parsed = JSON.parse(raw.slice(first, last + 1));
        } else {
          throw new Error('JSON parse failed');
        }
      }

      const health =
        typeof parsed.health === 'number'
          ? Math.max(0, Math.min(1, parsed.health))
          : 0.5;

      setAnalysis({
        ticker: parsed.ticker || ticker,
        name: parsed.name || 'ENTERPRISE NODE',
        health,
        desc:
          parsed.desc ||
          'Neutral node status with balanced upside and downside risk.',
        short: parsed.short || 'Sideways / Range',
        long: parsed.long || 'Neutral Hold',
      });
    } catch (e) {
      console.error('Pathfinder error', e);
      setAnalysis({
        ticker: anaInput.trim().toUpperCase(),
        name: 'ENTERPRISE NODE',
        health: 0.5,
        desc:
          'Live pathfinder intelligence unavailable. Showing neutral synthetic node.',
        short: 'Sideways / Range',
        long: 'Neutral Hold',
      });
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // RENDER (unchanged UI)
  // =====================

  return (
    <div className="flex h-screen overflow-hidden selection:bg-emerald-500/30 selection:text-white">
      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-[#020202] border-r border-white/5 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-10 pl-1 sm:pl-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center text-black font-black italic shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              !
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tighter uppercase italic text-white">
              RiskIT
            </h1>
          </div>

          <nav className="space-y-2">
            <NavTab
              icon={LayoutDashboard}
              label="Architect"
              active={activeTab === 'architect'}
              onClick={() => {
                setActiveTab('architect');
                setIsSidebarOpen(false);
              }}
            />
            <NavTab
              icon={Scale}
              label="Comparator"
              active={activeTab === 'comparator'}
              onClick={() => {
                setActiveTab('comparator');
                setIsSidebarOpen(false);
              }}
            />
            <NavTab
              icon={Target}
              label="Pathfinder"
              active={activeTab === 'pathfinder'}
              onClick={() => {
                setActiveTab('pathfinder');
                setIsSidebarOpen(false);
              }}
            />
            <NavTab
              icon={Radio}
              label="Pulse"
              active={activeTab === 'pulse'}
              onClick={() => {
                setActiveTab('pulse');
                setIsSidebarOpen(false);
              }}
            />
          </nav>
        </div>

        <div className="mt-auto p-4 sm:p-6 border-t border-white/5 bg-[#050505]">
          <div className="mb-4 sm:mb-6 opacity-60 hover:opacity-100 transition-opacity">
            <p className="text-[8px] sm:text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2 sm:mb-3">
              Engineering Team
            </p>
            <div className="space-y-1.5 sm:space-y-2 font-mono text-[9px] sm:text-[10px] text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-zinc-700 rounded-full" /> Abdullah
                Rashid
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-zinc-700 rounded-full" /> Moawiz
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-zinc-700 rounded-full" /> Muhammad
                Abdullah
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-zinc-900 rounded-lg border border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[8px] sm:text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
              System Online
            </span>
          </div>
        </div>

        <button
          className="absolute top-4 right-3 text-zinc-400 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={18} />
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full relative bg-[#020202]">
        {/* Mobile Header */}
        <header className="lg:hidden h-14 border-b border-white/5 flex items-center justify-between px-4 sm:px-6 bg-[#020202]/90 backdrop-blur-md z-40 sticky top-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-zinc-400 hover:text-white"
            >
              <Menu size={20} />
            </button>
            <span className="text-[9px] sm:text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500">
              {activeTab}
            </span>
          </div>
          {loading && (
            <RefreshCw size={16} className="text-emerald-500 animate-spin" />
          )}
        </header>

        <div className="flex-1 overflow-y-auto custom-scroll p-3 sm:p-4 md:p-6 lg:p-8">
          {/* ARCHITECT */}
          {activeTab === 'architect' && (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,0.8fr)] gap-4 md:gap-6 xl:gap-8">
              {/* INPUT CARD */}
              <div className="glass-card relative min-h-[260px] flex flex-col">
                <div className="absolute top-0 right-0 p-8 sm:p-10 opacity-5 pointer-events-none rotate-12">
                  <Layers className="w-24 h-24 sm:w-40 sm:h-40" />
                </div>
                <h2 className="title-fluid mb-4 sm:mb-8 relative z-10">
                  ARCHITECT
                </h2>

                <div className="space-y-4 sm:space-y-6 relative z-10">
                  <div>
                    <label className="field-label flex items-center gap-2">
                      <TrendingUp size={12} /> Investment Capacity
                    </label>
                    <input
                      type="number"
                      className="field-input"
                      value={recInputs.amount}
                      onChange={(e) =>
                        setRecInputs({
                          ...recInputs,
                          amount: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="field-label flex items-center gap-2">
                      <Globe size={12} /> Node Universe
                    </label>
                    <input
                      type="text"
                      className="field-input"
                      value={recInputs.market}
                      onChange={(e) =>
                        setRecInputs({
                          ...recInputs,
                          market: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="field-label flex items-center gap-2">
                      <Clock size={12} /> Time Horizon
                    </label>
                    <div className="relative">
                      <select
                        className="field-input cursor-pointer"
                        value={recInputs.horizon}
                        onChange={(e) =>
                          setRecInputs({
                            ...recInputs,
                            horizon: e.target.value,
                          })
                        }
                      >
                        <option>Short Term</option>
                        <option>Medium Term</option>
                        <option>Long Term</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
                        ▼
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between p-3 sm:p-4 bg-[#050505] border border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-700 transition-colors group"
                    onClick={() =>
                      setRecInputs({
                        ...recInputs,
                        halal: !recInputs.halal,
                      })
                    }
                  >
                    <div>
                      <label className="text-[8px] sm:text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">
                        Ethical Gate
                      </label>
                      <div className="flex items-center gap-2">
                        <ShieldCheck
                          size={14}
                          className={
                            recInputs.halal
                              ? 'text-emerald-500'
                              : 'text-zinc-600'
                          }
                        />
                        <span
                          className={`text-xs font-bold ${
                            recInputs.halal
                              ? 'text-white'
                              : 'text-zinc-500'
                          }`}
                        >
                          Sharia / Halal Filter
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-11 sm:w-12 h-5 sm:h-6 rounded-full relative transition-all duration-300 border border-white/5 ${
                        recInputs.halal
                          ? 'bg-emerald-900/40'
                          : 'bg-zinc-900'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 sm:w-5 h-4 sm:h-5 rounded-full shadow-md transition-all duration-300 ${
                          recInputs.halal
                            ? 'left-6 sm:left-6 bg-emerald-500 shadow-[0_0_12px_#10b981]'
                            : 'left-0.5 bg-zinc-600'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 sm:mt-10">
                  <button
                    onClick={handleArchitect}
                    disabled={loading}
                    className="btn-primary group w-full sm:w-auto justify-center"
                  >
                    <span>
                      {loading ? 'Synthesizing...' : 'Initialize Nodes'}
                    </span>
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              </div>

              {/* OUTPUT CARD */}
              <div className="glass-card bg-[#050505]/60 flex flex-col min-h-[260px]">
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <span className="badge text-blue-400 border-blue-500/20 bg-blue-500/5">
                    Strategy Inferred
                  </span>
                  {recommendations && (
                    <span className="text-[8px] sm:text-[9px] font-mono text-emerald-500 uppercase animate-pulse">
                      Live Feed
                    </span>
                  )}
                </div>

                <p className="text-base sm:text-lg text-zinc-300 font-medium italic leading-relaxed mb-4 sm:mb-8 min-h-[64px] sm:min-h-[80px]">
                  "
                  {recommendations
                    ? recommendations.strategy
                    : 'System Standby. Awaiting architecture parameters to synthesize financial node path...'}
                  "
                </p>

                {recommendations ? (
                  <div className="space-y-2.5 sm:space-y-3">
                    {recommendations.nodes.map((node, i) => (
                      <NodeRow key={i} {...node} />
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl opacity-30 py-8">
                    <BarChart3 size={40} className="mb-3 text-zinc-500" />
                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-600">
                      No Nodes Selected
                    </p>
                  </div>
                )}

                <div className="mt-4 sm:mt-auto pt-4 sm:pt-6 border-t border-white/5 flex justify-between text-zinc-600 text-[8px] sm:text-[9px]">
                  <span className="font-black uppercase tracking-widest">
                    Selected Node Set
                  </span>
                  <span className="font-black uppercase tracking-widest hover:text-white cursor-pointer transition-colors">
                    Node Brief ↗
                  </span>
                </div>
              </div>

              {/* STABILITY CARD */}
              <div className="glass-card border-emerald-500/10 relative overflow-hidden flex flex-col justify-between min-h-[200px]">
                <div className="flex justify-between items-start z-10 relative mb-4">
                  <span className="field-label text-emerald-500 ml-0">
                    Logic Stability
                  </span>
                  <RefreshCw
                    size={16}
                    className={`text-emerald-500 ${
                      loading ? 'animate-spin' : ''
                    }`}
                  />
                </div>

                <div className="flex-1 flex items-center relative z-10">
                  <h2
                    className={`title-fluid w-full transition-all duration-700 text-center lg:text-left ${
                      recommendations
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 scale-100'
                        : 'text-zinc-800 scale-95 blur-sm'
                    }`}
                  >
                    {recommendations ? 'RESILIENT' : 'IDLE'}
                  </h2>
                </div>

                <div className="mt-4 flex items-center gap-3 z-10 relative">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      recommendations
                        ? 'bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]'
                        : 'bg-zinc-800'
                    }`}
                  />
                  <p className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Binary State: {recommendations ? 'Confirmed' : 'Waiting'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* COMPARATOR */}
          {activeTab === 'comparator' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 animate-in zoom-in-95 duration-500">
              <div className="md:col-span-2 glass-card items-center text-center py-8 sm:py-10 md:py-12 min-h-[220px] md:min-h-[250px] justify-center">
                <h2 className="title-fluid mb-3 sm:mb-4">
                  COMPARATOR
                </h2>
                <p className="text-zinc-500 italic font-medium max-w-xl mx-auto text-xs sm:text-sm">
                  Head-to-head logical elimination protocol. Input two distinct
                  node identifiers to determine dominance.
                </p>
              </div>

              <div className="glass-card py-6 sm:py-8">
                <label className="field-label text-center w-full">
                  Node Alpha
                </label>
                <input
                  className="w-full bg-transparent border-b border-zinc-800 py-3 sm:py-4 text-center text-2xl sm:text-3xl md:text-4xl font-black italic uppercase text-white placeholder:text-zinc-800 focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="TICKER A"
                  value={compInputs.s1}
                  onChange={(e) =>
                    setCompInputs({
                      ...compInputs,
                      s1: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
              <div className="glass-card py-6 sm:py-8">
                <label className="field-label text-center w-full">
                  Node Beta
                </label>
                <input
                  className="w-full bg-transparent border-b border-zinc-800 py-3 sm:py-4 text-center text-2xl sm:text-3xl md:text-4xl font-black italic uppercase text-white placeholder:text-zinc-800 focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="TICKER B"
                  value={compInputs.s2}
                  onChange={(e) =>
                    setCompInputs({
                      ...compInputs,
                      s2: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <button
                  onClick={handleComparator}
                  disabled={loading}
                  className="btn-primary justify-center py-4 sm:py-5 text-xs sm:text-sm w-full"
                >
                  {loading ? 'Auditing Nodes...' : 'Resolve Logic Conflict'}
                </button>
              </div>

              {comparison && (
                <>
                  <div className="glass-card bg-white border-white text-black relative overflow-hidden">
                    <div className="absolute -top-16 -right-8 sm:-top-16 sm:-right-10 opacity-10 rotate-[-12deg] pointer-events-none">
                      <Trophy className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-10">
                        <Trophy size={18} className="text-yellow-600" />
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-900">
                          Dominant Node
                        </span>
                      </div>
                      <h2 className="title-fluid text-black mb-4 sm:mb-6">
                        {comparison.winner}
                      </h2>
                      <div className="inline-block px-3 sm:px-4 py-2 bg-black/5 border border-black/10 rounded-lg">
                        <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest opacity-50 mb-1">
                          Recommendation
                        </p>
                        <p className="text-lg sm:text-xl font-black italic">
                          {comparison.decision}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card flex flex-col">
                    <h3 className="field-label mb-6 sm:mb-8">
                      Logic Scorecard
                    </h3>
                    <div className="space-y-4 sm:space-y-6">
                      {comparison.scorecard.map((s, i) => (
                        <div key={i} className="space-y-1.5 sm:space-y-2">
                          <div className="flex justify-between text-[8px] sm:text-[9px] font-bold uppercase text-zinc-500">
                            <span>{s.label}</span>
                          </div>
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500"
                                style={{ width: `${s.s1}%` }}
                              />
                            </div>
                            <span className="text-[8px] sm:text-[9px] font-mono text-zinc-700">
                              VS
                            </span>
                            <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden flex justify-end">
                              <div
                                className="h-full bg-rose-500"
                                style={{ width: `${s.s2}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 sm:mt-auto pt-4 sm:pt-6 border-t border-white/5 text-xs text-zinc-400 italic">
                      "{comparison.summary}"
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* PATHFINDER */}
          {activeTab === 'pathfinder' && (
            <div className="grid grid-cols-1 gap-4 md:gap-6 lg:gap-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="md:col-span-2 glass-card min-h-0 flex-row items-center gap-4 sm:gap-6 p-4 sm:p-6 border-emerald-500/20 shadow-[0_0_30px_-10px_rgba(16,185,129,0.15)]">
                <Search className="text-zinc-500 ml-1 sm:ml-2" size={22} />
                <input
                  placeholder="ENTER NODE ID..."
                  className="flex-1 bg-transparent text-xl sm:text-2xl md:text-4xl font-black italic uppercase outline-none placeholder:text-zinc-800 text-white"
                  value={anaInput}
                  onChange={(e) => setAnaInput(e.target.value.toUpperCase())}
                />
                <button
                  onClick={handlePathfinder}
                  className="bg-white text-black px-5 sm:px-8 py-3 sm:py-4 rounded-xl font-black uppercase tracking-widest text-[9px] sm:text-[10px] hover:scale-105 transition-transform shrink-0"
                >
                  Execute
                </button>
              </div>

              {analysis ? (
                <div className="md:col-span-2 glass-card">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-6 sm:mb-10 gap-6 sm:gap-8">
                    <div>
                      <h2 className="title-fluid text-white">
                        {analysis.ticker}
                      </h2>
                      <p className="field-label text-base sm:text-lg mt-3 sm:mt-4 text-zinc-400">
                        {analysis.name}
                      </p>
                    </div>
                    <div className="text-right p-4 sm:p-6 bg-[#0c0c0e] rounded-2xl border border-white/5">
                      <p className="field-label mb-1 sm:mb-2">
                        Node Health
                      </p>
                      <div className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-500 shadow-emerald-500/20 drop-shadow-md">
                        {(analysis.health * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                    <div className="p-5 sm:p-8 bg-[#0c0c0e] rounded-2xl border border-white/5">
                      <Network
                        className="text-blue-500 mb-4 sm:mb-6"
                        size={24}
                      />
                      <p className="text-sm sm:text-lg italic text-zinc-300 leading-relaxed">
                        "{analysis.desc}"
                      </p>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="p-4 sm:p-6 bg-[#0c0c0e] border border-white/5 rounded-xl flex justify-between items-center">
                        <span className="field-label mb-0">
                          Short Term Path
                        </span>
                        <span className="text-emerald-400 font-bold italic text-xs sm:text-sm">
                          {analysis.short}
                        </span>
                      </div>
                      <div className="p-4 sm:p-6 bg-[#0c0c0e] border border-white/5 rounded-xl flex justify-between items-center">
                        <span className="field-label mb-0">
                          Long Term Path
                        </span>
                        <span className="text-blue-400 font-bold italic text-xs sm:text-sm">
                          {analysis.long}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="md:col-span-2 h-[260px] sm:h-[320px] md:h-[400px] flex flex-col items-center justify-center opacity-30 border border-dashed border-zinc-700 rounded-[1.5rem] sm:rounded-[2rem] px-4 text-center">
                  <Target size={52} className="mb-3 sm:mb-4 text-zinc-600" />
                  <p className="title-fluid text-zinc-700">
                    Awaiting Vector
                  </p>
                </div>
              )}
            </div>
          )}

          {/* PULSE */}
          {activeTab === 'pulse' && (
            <div className="max-w-4xl mx-auto p-2 sm:p-4 space-y-3 sm:space-y-4 animate-in fade-in">
              <h2 className="title-fluid text-center mb-6 sm:mb-10">
                LOGIC PULSE
              </h2>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="group glass-card min-h-0 flex-row items-center justify-between p-4 sm:p-6 hover:bg-zinc-900/80 cursor-pointer border-l-4 border-l-emerald-500 gap-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <span className="font-mono text-zinc-600 text-[10px] sm:text-xs">
                      10:4{i} AM
                    </span>
                    <div>
                      <h4 className="font-bold text-zinc-300 group-hover:text-white transition-colors text-sm sm:text-base">
                        Global Semiconductor Logic Gate Adjusted
                      </h4>
                      <p className="field-label mt-1 text-zinc-500 text-[10px] sm:text-xs">
                        Impact: Moderate // Sector: Tech
                      </p>
                    </div>
                  </div>
                  <div className="badge bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] sm:text-[10px] mt-2 sm:mt-0">
                    Stable
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
