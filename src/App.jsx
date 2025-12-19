import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Activity,
  Search,
  Network,
  Loader2,
  AlertTriangle,
  ArrowRight,
  Database,
  TrendingUp,
  Scale,
  Zap,
  History,
  Target,
  Globe,
  Clock,
  LayoutDashboard,
  Menu,
  X,
  TrendingDown,
  BarChart3,
  Trophy,
  ZapOff,
  MessageSquare,
  FileText,
  Radio,
  RefreshCw,
  Info,
  Download,
  Share2,
  Maximize2
} from 'lucide-react';

/**
 * !RiskIT Intelligence Platform
 * GitHub Export Version
 * * Deployment Instructions:
 * 1. Create a React project (Vite recommended)
 * 2. npm install lucide-react clsx tailwind-merge
 * 3. Ensure Tailwind CSS is configured.
 */

// --- CONFIGURATION ---
// API key now handled by serverless function
const MODEL_ID = "gemini-2.5-flash-preview-09-2025";

// --- VISUALIZATION HELPERS ---

const Sparkline = ({ data = [40, 30, 50, 45, 60, 55, 70], color = "#10b981", height = 40 }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 120;
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((d - min) / range) * height
  }));
  const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={pathData} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill={color} />
    </svg>
  );
};

const CandlestickChart = ({ count = 24 }) => {
  const candles = useMemo(() => {
    let current = 140;
    return Array.from({ length: count }).map(() => {
      const volatility = 15;
      const open = current;
      const close = current + (Math.random() - 0.5) * volatility;
      const high = Math.max(open, close) + Math.random() * 5;
      const low = Math.min(open, close) - Math.random() * 5;
      const candle = { open, close, high, low, up: close >= open };
      current = close;
      return candle;
    });
  }, [count]);

  const allValues = candles.flatMap(c => [c.high, c.low]);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const range = maxVal - minVal || 1;
  const getY = (val) => 100 - ((val - minVal) / range) * 100;

  return (
    <div className="flex items-end justify-between h-48 w-full gap-[2px] px-2 relative group/chart bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/50">
      <div className="absolute inset-0 flex flex-col justify-between py-6 pointer-events-none opacity-10">
        {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-px bg-white" />)}
      </div>
      {candles.map((c, i) => {
        const top = getY(Math.max(c.open, c.close));
        const bottom = getY(Math.min(c.open, c.close));
        const highY = getY(c.high);
        const lowY = getY(c.low);
        const height = Math.max(2, bottom - top);
        return (
          <div key={i} className="relative flex-1 h-full group">
            <div className={`absolute left-1/2 -translate-x-1/2 w-[1px]`} style={{ top: `${highY}%`, height: `${lowY - highY}%`, backgroundColor: c.up ? '#10b981' : '#f43f5e', opacity: 0.4 }} />
            <div className={`absolute left-1/2 -translate-x-1/2 w-full max-w-[6px] rounded-sm transition-all group-hover:brightness-125`} style={{ top: `${top}%`, height: `${height}%`, backgroundColor: c.up ? '#10b981' : '#f43f5e' }} />
          </div>
        );
      })}
    </div>
  );
};

// --- CORE INTELLIGENCE API ---

async function callIntelligence(systemPrompt, userPrompt) {
  const payload = {
    contents: [{ parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
  };
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${apiKey}`;
  
  let delay = 1000;
  for (let i = 0; i < 5; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const result = await response.json();
      return JSON.parse(result.candidates[0].content.parts[0].text);
    } catch (error) {
      if (i === 4) throw error;
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

// --- MODULES ---

const Badge = ({ children, variant = "default" }) => {
  const styles = {
    default: "bg-zinc-800 text-zinc-400 border-zinc-700",
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    rose: "bg-rose-500/10 text-rose-500 border-rose-500/20"
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border ${styles[variant]}`}>
      {children}
    </span>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  // States for Modules
  const [recInputs, setRecInputs] = useState({ amount: '10000', market: 'US Tech', span: 'Long Term', halal: true });
  const [recommendations, setRecommendations] = useState(null);
  const [compInputs, setCompInputs] = useState({ s1: '', s2: '', span: 'Medium Term' });
  const [comparison, setComparison] = useState(null);
  const [anaInput, setAnaInput] = useState('');
  const [analysis, setAnalysis] = useState(null);
  
  // Advisor logic
  const [advisorQuery, setAdvisorQuery] = useState('');
  const [advisorChat, setAdvisorChat] = useState([]);
  const chatEndRef = useRef(null);

  const handleRecs = async () => {
    setLoading(true);
    const system = `Act as the !RiskIT Portfolio Architect. Output JSON: {
      "recommendations": [{ "ticker": "TKR", "reason": "Logic", "setStability": "High/Med", "riskFactor": "Factor", "historicalGrowth": [40,50,45,60,70] }],
      "setStrategy": "Strategy text",
      "expectedStability": "Stable/Resilient"
    }`;
    try {
      const res = await callIntelligence(system, JSON.stringify(recInputs));
      setRecommendations(res);
    } catch (e) { setError("Node Synthesis Failed"); }
    setLoading(false);
  };

  const handleComp = async () => {
    if (!compInputs.s1 || !compInputs.s2) return;
    setLoading(true);
    const system = `Act as the !RiskIT Comparator. Output JSON: {
      "winner": "TKR", "binaryDecision": "BUY S1", "logicSummary": "Reasoning",
      "scorecard": [{ "label": "Resilience", "s1Val": 80, "s2Val": 60 }]
    }`;
    try {
      const res = await callIntelligence(system, JSON.stringify(compInputs));
      setComparison(res);
    } catch (e) { setError("Head-to-Head Audit Failed"); }
    setLoading(false);
  };

  const handleAna = async () => {
    if (!anaInput) return;
    setLoading(true);
    const system = `Act as !RiskIT Pathfinder. Output JSON: {
      "description": "Logic", "history": [{"era": "2022", "event": "Flip", "impact": "Res"}],
      "futurePaths": { "shortTerm": "Path A", "longTerm": "Path B" },
      "nodeHealth": 0.9, "criticalDependencies": ["Node A"]
    }`;
    try {
      const res = await callIntelligence(system, anaInput);
      setAnalysis({ ...res, ticker: anaInput.toUpperCase() });
    } catch (e) { setError("Deep Node Audit Failed"); }
    setLoading(false);
  };

  const handleAdvisor = async () => {
    if (!advisorQuery) return;
    const q = advisorQuery;
    setAdvisorQuery('');
    setAdvisorChat(p => [...p, { role: 'user', text: q }]);
    const system = `Act as !RiskIT AI Advisor. Use discrete math context. JSON: { "answer": "text" }`;
    try {
      const res = await callIntelligence(system, q);
      setAdvisorChat(p => [...p, { role: 'ai', text: res.answer }]);
    } catch (e) { setAdvisorChat(p => [...p, { role: 'ai', text: "Inference Error." }]); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col md:flex-row font-sans selection:bg-blue-500/30">
      
      {/* MOBILE NAV */}
      <div className="md:hidden flex items-center justify-between p-5 border-b border-zinc-900 bg-[#070707] sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-black italic">!</div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">RiskIT</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`fixed inset-0 z-50 md:relative md:flex w-full md:w-72 border-r border-zinc-900 flex-col p-8 bg-[#070707] transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="hidden md:flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-black italic shadow-2xl">!</div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">RiskIT</h1>
        </div>

        <nav className="flex-1 space-y-3">
          <NavItem icon={LayoutDashboard} label="Portfolio Architect" active={activeTab === 'dashboard'} onClick={() => {setActiveTab('dashboard'); setIsSidebarOpen(false)}} />
          <NavItem icon={Scale} label="Binary Comparator" active={activeTab === 'comparator'} onClick={() => {setActiveTab('comparator'); setIsSidebarOpen(false)}} />
          <NavItem icon={Target} label="Deep Pathfinder" active={activeTab === 'pathfinder'} onClick={() => {setActiveTab('pathfinder'); setIsSidebarOpen(false)}} />
          <NavItem icon={Radio} label="Market Pulse" active={activeTab === 'pulse'} onClick={() => {setActiveTab('pulse'); setIsSidebarOpen(false)}} />
        </nav>

        <div className="mt-auto space-y-4 pt-8 border-t border-zinc-900">
          <button onClick={() => setIsAdvisorOpen(true)} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-blue-500/5 text-blue-400 border border-blue-500/10 hover:bg-blue-500/10 transition-all group">
            <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-widest">Logic Advisor</span>
          </button>
          <div className="p-5 bg-zinc-900/30 rounded-[1.5rem] border border-zinc-800 shadow-inner">
            <div className="flex items-center gap-2 mb-3 text-zinc-600">
              <Zap size={12} />
              <span className="text-[10px] font-black uppercase tracking-widest">Discrete Engine v2.5</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-zinc-400 font-mono uppercase">System Active</p>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505]">
        <header className="h-24 border-b border-zinc-900 hidden md:flex items-center justify-between px-12 bg-[#070707]/60 backdrop-blur-2xl sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <div className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
              {activeTab} mode // logic active
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 text-[10px] font-mono text-emerald-500 bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10">
              <RefreshCw size={12} className="animate-spin" />
              STOCHASTIC SYNC ACTIVE
            </div>
            {loading && <div className="flex items-center gap-3 text-blue-500 text-[11px] font-black animate-pulse"><Loader2 className="animate-spin" size={16} /> COMPUTING INFERENCE...</div>}
          </div>
        </header>

        <div className="p-8 md:p-16 max-w-7xl mx-auto pb-40">
          {error && (
            <div className="mb-10 p-6 bg-rose-500/5 border border-rose-500/20 rounded-3xl flex items-center gap-5 text-rose-500 animate-in fade-in zoom-in-95">
              <AlertTriangle size={24} />
              <p className="text-sm font-black uppercase tracking-tight">{error}</p>
            </div>
          )}

          {/* DASHBOARD: ARCHITECT */}
          {activeTab === 'dashboard' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-8">
                  <div className="bg-zinc-900/40 p-10 rounded-[3rem] border border-zinc-800 shadow-2xl relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity"><Layers size={200} /></div>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-10 text-white leading-none">Architect</h2>
                    <div className="space-y-8 relative z-10">
                      <InputGroup label="Investment Capacity" icon={TrendingUp}>
                        <input type="number" value={recInputs.amount} onChange={e => setRecInputs({...recInputs, amount: e.target.value})} className="input-field" placeholder="0.00" />
                      </InputGroup>
                      <InputGroup label="Node Universe" icon={Globe}>
                        <input type="text" placeholder="e.g. US Tech" value={recInputs.market} onChange={e => setRecInputs({...recInputs, market: e.target.value})} className="input-field" />
                      </InputGroup>
                      <InputGroup label="Time Horizon" icon={Clock}>
                        <select value={recInputs.span} onChange={e => setRecInputs({...recInputs, span: e.target.value})} className="input-field appearance-none">
                          <option>Short Term</option>
                          <option>Medium Term</option>
                          <option>Long Term</option>
                        </select>
                      </InputGroup>
                      <div className="flex items-center justify-between p-6 bg-zinc-950 border border-zinc-800 rounded-3xl group/toggle">
                        <div>
                          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Ethical Gate</p>
                          <p className="text-xs font-bold text-zinc-200">Sharia / Halal Filter</p>
                        </div>
                        <button onClick={() => setRecInputs({...recInputs, halal: !recInputs.halal})} className={`w-14 h-7 rounded-full transition-all relative ${recInputs.halal ? 'bg-emerald-500 shadow-[0_0_20px_#10b98166]' : 'bg-zinc-800'}`}>
                          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${recInputs.halal ? 'left-8' : 'left-1'}`} />
                        </button>
                      </div>
                      <button onClick={handleRecs} disabled={loading} className="w-full py-6 bg-white text-black font-black text-xs uppercase tracking-[0.4em] rounded-[1.5rem] hover:bg-zinc-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(255,255,255,0.1)] disabled:opacity-30">
                        {loading ? 'ARCHITECTING...' : 'INITIALIZE NODES'} <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-10">
                  {recommendations ? (
                    <div className="space-y-10 animate-in fade-in duration-1000">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="p-10 bg-zinc-900/50 border border-zinc-800 rounded-[3rem] hover:border-blue-500/20 transition-all group">
                          <Badge variant="blue">Strategy Inferred</Badge>
                          <p className="mt-8 text-xl font-bold text-zinc-200 leading-snug italic group-hover:text-white transition-colors">"{recommendations.setStrategy}"</p>
                        </div>
                        <div className="p-10 bg-emerald-500/5 border border-emerald-500/20 rounded-[3rem] flex flex-col justify-between group">
                          <Badge variant="success">Logic Stability</Badge>
                          <div className="mt-8 flex items-end justify-between">
                            <div>
                              <span className="text-7xl font-black tracking-tighter text-white uppercase italic">{recommendations.expectedStability}</span>
                              <p className="text-[10px] text-zinc-500 font-mono uppercase mt-2">Binary State: Confirmed</p>
                            </div>
                            <Activity className="text-emerald-500 animate-pulse group-hover:scale-125 transition-transform" size={56} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between px-4">
                          <h3 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.5em] flex items-center gap-3">
                            <Layers size={16}/> Selected Node Set
                          </h3>
                          <button className="flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">
                            <Download size={14}/> Node Brief
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                          {recommendations.recommendations.map((rec, i) => (
                            <div key={i} className="group p-8 bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] hover:border-zinc-600 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10">
                              <div className="flex items-center gap-10">
                                <div className="w-24 h-24 bg-zinc-950 border border-zinc-800 rounded-3xl flex items-center justify-center text-white font-black text-3xl group-hover:bg-blue-500/10 group-hover:text-blue-400 group-hover:border-blue-500/20 transition-all italic shadow-2xl">
                                  {rec.ticker}
                                </div>
                                <div className="space-y-3">
                                  <div className="flex items-center gap-4">
                                    <p className="text-xs text-zinc-600 font-black uppercase tracking-widest">{rec.riskFactor}</p>
                                    <Badge variant={rec.setStability === 'High' ? 'success' : 'warning'}>{rec.setStability} Stability</Badge>
                                  </div>
                                  <p className="text-base text-zinc-400 leading-relaxed font-medium max-w-md italic">"{rec.reason}"</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-4 w-full sm:w-auto">
                                <span className="text-[10px] font-mono text-zinc-700 tracking-[0.2em] uppercase">Historical State Path</span>
                                <Sparkline data={rec.historicalGrowth || [40, 35, 55, 40, 60, 65, 80]} color={rec.setStability === 'High' ? '#10b981' : '#fbbf24'} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <EmptyState icon={TrendingUp} title="System Standby" subtitle="Input your discrete parameters to synthesize a new node-weighted portfolio architecture." />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MODULE: COMPARATOR */}
          {activeTab === 'comparator' && (
            <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in zoom-in-95 duration-700">
              <div className="text-center space-y-6">
                <Badge variant="blue">Side by Side Logic Audit</Badge>
                <h2 className="text-7xl font-black italic uppercase tracking-tighter text-white">Binary Comparator</h2>
                <p className="text-zinc-500 text-lg max-w-2xl mx-auto italic font-medium leading-relaxed">
                  Pitting two financial nodes against each other in a head-to-head logical elimination. 
                  Identify the dominant path with binary certainty.
                </p>
              </div>

              <div className="relative p-16 bg-zinc-900/30 border border-zinc-800 rounded-[4rem] overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-rose-500/5 pointer-events-none" />
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-20">
                  <div className="flex flex-col items-center gap-6">
                    <span className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] italic">Node Alpha</span>
                    <input placeholder="SYMBOL A" value={compInputs.s1} onChange={e => setCompInputs({...compInputs, s1: e.target.value.toUpperCase()})} className="compare-input text-blue-100 focus:border-blue-500/40" />
                  </div>
                  <div className="text-zinc-800 font-black italic text-6xl md:text-8xl uppercase tracking-tighter select-none opacity-20">VS</div>
                  <div className="flex flex-col items-center gap-6">
                    <span className="text-[11px] font-black text-rose-500 uppercase tracking-[0.5em] italic">Node Beta</span>
                    <input placeholder="SYMBOL B" value={compInputs.s2} onChange={e => setCompInputs({...compInputs, s2: e.target.value.toUpperCase()})} className="compare-input text-rose-100 focus:border-rose-500/40" />
                  </div>
                </div>
                <div className="flex justify-center mt-16">
                   <button onClick={handleComp} disabled={loading || !compInputs.s1 || !compInputs.s2} className="group relative px-20 py-7 bg-white text-black font-black uppercase text-xs tracking-[0.5em] rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_30px_60px_rgba(255,255,255,0.1)] disabled:opacity-20">
                     {loading ? 'AUDITING...' : 'RESOLVE LOGIC CONFLICT'}
                   </button>
                </div>
              </div>

              {comparison && (
                <div className="space-y-20 animate-in slide-in-from-top-12 duration-1000">
                  <div className="relative p-24 bg-zinc-900 border border-zinc-800 rounded-[5rem] text-center overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                    <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
                    <div className="relative z-10 space-y-12">
                      <div className="flex flex-col items-center gap-6">
                        <Trophy className="text-emerald-500 animate-bounce" size={64} />
                        <Badge variant="success">Dominant Logical Node</Badge>
                      </div>
                      <div className="text-[14rem] md:text-[20rem] font-black text-white italic tracking-tighter leading-none uppercase drop-shadow-[0_40px_80px_rgba(255,255,255,0.15)]">
                        {comparison.winner}
                      </div>
                      <div className="flex flex-col items-center gap-8 pt-12">
                        <div className="px-14 py-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-black uppercase tracking-[0.6em] rounded-3xl shadow-xl">
                          RECOMMENDATION: {comparison.binaryDecision}
                        </div>
                        <p className="text-zinc-500 text-lg italic font-medium max-w-3xl leading-relaxed">
                          "{comparison.logicSummary}"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <h3 className="text-[12px] font-black text-zinc-700 uppercase tracking-[0.6em] text-center italic">Head to Head Metric Scorecard</h3>
                    <div className="grid grid-cols-1 gap-10 max-w-5xl mx-auto">
                      {comparison.scorecard.map((row, idx) => {
                        const s1Better = row.s1Val >= row.s2Val;
                        return (
                          <div key={idx} className="bg-zinc-900/40 border border-zinc-800/60 p-12 rounded-[3.5rem] hover:bg-zinc-900/60 transition-all shadow-xl group">
                            <div className="text-center mb-12 relative">
                               <span className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.5em] italic mb-2 block">Property Logic Key</span>
                               <h4 className="text-2xl font-black text-white italic tracking-tight uppercase">{row.label}</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-20 relative">
                              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-800 -translate-x-1/2" />
                              <div className="space-y-5">
                                <div className="flex justify-between items-end">
                                  <span className={`text-xl font-black uppercase italic ${s1Better ? 'text-white' : 'text-zinc-700'}`}>{compInputs.s1}</span>
                                  {s1Better && <Badge variant="blue">ADVANTAGE</Badge>}
                                </div>
                                <div className="h-5 bg-zinc-950 rounded-full border border-zinc-900 overflow-hidden flex justify-end shadow-inner">
                                  <div className={`h-full transition-all duration-1000 ${s1Better ? 'bg-blue-500' : 'bg-zinc-800/40'}`} style={{ width: `${row.s1Val}%`, boxShadow: s1Better ? '0 0 25px #3b82f644' : 'none' }} />
                                </div>
                                <div className="flex justify-between font-mono text-[10px] text-zinc-600 uppercase">
                                  <span>LOGIC FLOOR</span>
                                  <span>{row.s1Val}% STRENGTH</span>
                                </div>
                              </div>
                              <div className="space-y-5">
                                <div className="flex justify-between items-end">
                                   {!s1Better && <Badge variant="rose">ADVANTAGE</Badge>}
                                  <span className={`text-xl font-black uppercase italic ${!s1Better ? 'text-white' : 'text-zinc-700'}`}>{compInputs.s2}</span>
                                </div>
                                <div className="h-5 bg-zinc-950 rounded-full border border-zinc-900 overflow-hidden shadow-inner">
                                  <div className={`h-full transition-all duration-1000 ${!s1Better ? 'bg-rose-500' : 'bg-zinc-800/40'}`} style={{ width: `${row.s2Val}%`, boxShadow: !s1Better ? '0 0 25px #f43f5e44' : 'none' }} />
                                </div>
                                <div className="flex justify-between font-mono text-[10px] text-zinc-600 uppercase">
                                  <span>{row.s2Val}% STRENGTH</span>
                                  <span>LOGIC FLOOR</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODULE: PULSE */}
          {activeTab === 'pulse' && (
            <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
               <div className="text-center space-y-6">
                <Badge variant="blue">System Telemetry</Badge>
                <h2 className="text-7xl font-black italic uppercase tracking-tighter text-white leading-none">Logic Pulse</h2>
                <p className="text-zinc-500 text-lg max-w-xl mx-auto italic font-medium">
                  Translating global market chaos into discrete logic state flips in real time.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { time: '14:22', event: 'Federal Reserve Policy Shift', impact: 'Debt Gate Threshold Adjusted +12%', type: 'stability' },
                  { time: '13:05', event: 'Global Semiconductor Node Failure', impact: 'Tech Sector Logic Flip 1 -> 0', type: 'warning' },
                  { time: '10:15', event: 'Sovereign Debt Audit Confirmed', impact: 'New Boolean Filter Active', type: 'success' },
                  { time: '09:00', event: 'Market Open Telemetry Initialized', impact: 'Graph Edges Calibration Complete', type: 'stability' }
                ].map((pulse, i) => (
                  <div key={i} className="group p-8 bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] flex items-center justify-between hover:border-zinc-600 transition-all hover:bg-zinc-900/60 shadow-xl">
                    <div className="flex items-center gap-10">
                      <span className="text-sm font-mono text-zinc-600 italic tracking-widest">{pulse.time}</span>
                      <div className="space-y-2">
                        <p className="text-lg font-bold text-zinc-200 group-hover:text-white transition-colors">{pulse.event}</p>
                        <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-[0.2em]">{pulse.impact}</p>
                      </div>
                    </div>
                    <Badge variant={pulse.type === 'stability' ? 'blue' : pulse.type === 'success' ? 'success' : 'rose'}>
                      {pulse.type === 'warning' ? 'FLIPPED' : 'STABLE'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE: PATHFINDER */}
          {activeTab === 'pathfinder' && (
            <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="flex flex-col md:flex-row items-center gap-8 bg-zinc-900/50 p-4 rounded-[3.5rem] border border-zinc-800 focus-within:border-zinc-600 transition-all shadow-2xl">
                <div className="flex-1 w-full relative">
                  <Search size={32} className="absolute left-10 top-1/2 -translate-y-1/2 text-zinc-700" />
                  <input placeholder="ENTER NODE IDENTIFIER..." value={anaInput} onChange={e => setAnaInput(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && handleAna()} className="w-full bg-transparent px-24 py-10 text-2xl md:text-4xl font-black tracking-tighter uppercase outline-none placeholder:text-zinc-900 text-white italic" />
                </div>
                <button onClick={handleAna} disabled={loading} className="w-full md:w-auto px-16 py-10 bg-white text-black rounded-[2.5rem] hover:bg-zinc-200 transition-all flex items-center justify-center gap-4 group shadow-2xl">
                   <TrendingUp size={32} className="group-hover:scale-110 transition-transform" />
                   <span className="font-black uppercase tracking-[0.3em] text-xs">Execute Deep Audit</span>
                </button>
              </div>

              {analysis ? (
                <div className="space-y-20 pb-32">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-16">
                    <div className="space-y-8">
                      <div className="flex items-center gap-12">
                        <h2 className="text-[12rem] md:text-[16rem] font-black italic text-white tracking-tighter uppercase leading-none">{analysis.ticker}</h2>
                        <div className="h-32 w-[2px] bg-zinc-900 hidden md:block" />
                        <div className="space-y-3">
                          <p className="text-[11px] text-zinc-600 font-black uppercase tracking-[0.5em]">Node Integrity</p>
                          <div className="text-6xl font-black text-emerald-500 drop-shadow-[0_0_25px_#10b98133]">{(analysis.nodeHealth * 100).toFixed(0)}%</div>
                        </div>
                      </div>
                      <p className="text-zinc-500 text-2xl max-w-4xl leading-relaxed italic font-medium">"{analysis.description}"</p>
                    </div>
                    <div className="flex gap-6 shrink-0">
                      <button className="flex items-center gap-3 px-8 py-4 bg-rose-500/5 text-rose-500 border border-rose-500/20 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-rose-500/10 transition-all group shadow-lg">
                        <ZapOff size={16} className="group-hover:rotate-12 transition-transform" /> Stress Test Node
                      </button>
                    </div>
                  </div>

                  <div className="p-12 bg-zinc-900/20 border border-zinc-800 rounded-[4rem] space-y-10 relative overflow-hidden shadow-inner group/chart-cont">
                    <div className="flex items-center justify-between relative z-10 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_15px_#3b82f6]" />
                        <Badge variant="blue">Logic Momentum Delta</Badge>
                      </div>
                      <div className="flex gap-10 text-xs font-mono text-zinc-600 uppercase">
                        <span className="text-zinc-500">HIGH: 142.2</span>
                        <span className="text-zinc-500">LOW: 139.1</span>
                        <span className="text-emerald-500 font-bold underline underline-offset-8 decoration-2">CLOSE: 141.8</span>
                      </div>
                    </div>
                    
                    <div className="relative py-12">
                      <CandlestickChart count={36} />
                    </div>

                    <div className="flex justify-between text-[11px] font-mono text-zinc-700 uppercase pt-10 border-t border-zinc-900 px-6 italic">
                      <span>T MINUS 72H SYSTEM HISTORY</span>
                      <span className="text-zinc-600">INFERENCE ENGINE V2.5 ACTIVE // NODES_CALIBRATED</span>
                      <span>CURRENT STABLE STATE</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div className="space-y-12">
                      <h3 className="flex items-center gap-4 text-[12px] font-black text-zinc-700 uppercase tracking-[0.6em] px-6">
                        <History size={20} className="text-blue-500"/> Sequence of Eras
                      </h3>
                      <div className="space-y-10">
                        {analysis.history.map((item, i) => (
                          <div key={i} className="group relative pl-16 border-l-2 border-zinc-900 py-4">
                            <div className="absolute left-[-9px] top-10 w-4 h-4 bg-zinc-800 border-4 border-[#050505] rounded-full group-hover:bg-blue-500 group-hover:scale-125 transition-all shadow-xl" />
                            <p className="text-[11px] font-mono text-zinc-700 uppercase mb-3 tracking-widest italic">{item.era}</p>
                            <h4 className="text-3xl font-black text-zinc-200 uppercase tracking-tight group-hover:text-blue-400 transition-colors italic leading-none">{item.event}</h4>
                            <p className="text-lg text-zinc-500 leading-relaxed mt-4 max-w-md italic">"{item.impact}"</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-12">
                      <h3 className="flex items-center gap-4 text-[12px] font-black text-zinc-700 uppercase tracking-[0.6em] px-6">
                        <Activity size={20} className="text-emerald-500"/> Binary Predictive Paths
                      </h3>
                      <div className="p-12 bg-zinc-900/40 border border-zinc-800 rounded-[4rem] space-y-14 relative overflow-hidden group/paths">
                        <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:opacity-10 transition-opacity"><Network size={200} /></div>
                        
                        <div className="space-y-8 relative z-10">
                          <div className="flex items-center gap-5">
                            <div className="w-3.5 h-3.5 rounded-full bg-blue-500 shadow-[0_0_20px_#3b82f6]" />
                            <Badge variant="blue">Short Term Logic Branch</Badge>
                          </div>
                          <p className="text-3xl text-zinc-100 font-bold italic leading-tight group-hover:translate-x-1 transition-transform">"{analysis.futurePaths.shortTerm}"</p>
                        </div>
                        
                        <div className="h-px bg-zinc-800 w-full" />
                        
                        <div className="space-y-8 relative z-10">
                          <div className="flex items-center gap-5">
                            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_20px_#10b981]" />
                            <Badge variant="success">Long Term Logic Branch</Badge>
                          </div>
                          <p className="text-3xl text-zinc-100 font-bold italic leading-tight group-hover:translate-x-1 transition-transform">"{analysis.futurePaths.longTerm}"</p>
                        </div>
                      </div>

                      <div className="p-10 bg-rose-500/5 border border-rose-500/10 rounded-[2.5rem] space-y-8 shadow-inner">
                        <h4 className="text-[11px] font-black text-rose-500/70 uppercase tracking-[0.5em] flex items-center gap-3 italic">
                          <AlertTriangle size={18}/> Critical System Dependencies
                        </h4>
                        <div className="flex flex-wrap gap-4">
                          {analysis.criticalDependencies.map(dep => (
                            <span key={dep} className="px-6 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl text-xs font-mono text-zinc-500 uppercase tracking-widest hover:border-rose-500/30 hover:text-rose-400 transition-all cursor-crosshair">{dep}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState icon={Target} title="Inference Hub Standby" subtitle="Input a node identifier to render the historical stability eras and binary predictive branches of any global asset." />
              )}
            </div>
          )}
        </div>
      </main>

      {/* MODAL: ADVISOR SIDEBAR */}
      <aside className={`fixed right-0 top-0 bottom-0 w-full md:w-[500px] bg-[#080808] border-l border-zinc-900 z-[70] transition-transform duration-700 ease-in-out shadow-[-40px_0_100px_rgba(0,0,0,0.8)] ${isAdvisorOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-10 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/20 backdrop-blur-xl">
            <div className="flex items-center gap-5">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl shadow-inner"><MessageSquare size={24} /></div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-widest text-white leading-none italic mb-1">Logic Advisor</h3>
                <p className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest">Global Inference Engine v2.5</p>
              </div>
            </div>
            <button onClick={() => setIsAdvisorOpen(false)} className="p-3 text-zinc-600 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 rounded-xl"><X size={24} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
            {advisorChat.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                <Info size={48} className="text-zinc-800" />
                <p className="text-sm text-zinc-600 max-w-[240px] italic font-medium">Ask about your current architecture, node health, or asset dependencies.</p>
              </div>
            )}
            {advisorChat.map((chat, i) => (
              <div key={i} className={`flex flex-col ${chat.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-[90%] p-6 rounded-[2rem] text-sm leading-relaxed ${chat.role === 'user' ? 'bg-zinc-800 text-zinc-100 rounded-tr-none shadow-xl' : 'bg-blue-500/10 text-blue-50 border border-blue-500/20 rounded-tl-none italic shadow-inner'}`}>
                  {chat.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-10 border-t border-zinc-900 bg-zinc-900/10 backdrop-blur-xl">
            <div className="relative group">
              <input 
                value={advisorQuery} 
                onChange={e => setAdvisorQuery(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleAdvisor()} 
                placeholder="Ask the Logic Engine..." 
                className="w-full bg-zinc-950 border-2 border-zinc-900 rounded-[2rem] pl-8 pr-20 py-6 text-base focus:outline-none focus:border-blue-500/30 transition-all placeholder:text-zinc-800 shadow-2xl" 
              />
              <button onClick={handleAdvisor} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-400 transition-all shadow-lg active:scale-90"><ArrowRight size={24} /></button>
            </div>
          </div>
        </div>
      </aside>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f1f23; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2a2a2f; }
        
        .input-field { 
          width: 100%; 
          background: #000; 
          border: 1px solid #1f1f1f; 
          padding: 1.5rem; 
          border-radius: 1.5rem; 
          font-size: 0.875rem; 
          font-weight: 700; 
          color: white; 
          outline: none; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
        }
        .input-field:focus { 
          border-color: #3f3f46; 
          background: #050505; 
          box-shadow: 0 0 30px rgba(0,0,0,0.8), inset 0 2px 4px rgba(0,0,0,0.5); 
        }
        
        .compare-input { 
          background: transparent; 
          border-bottom: 4px solid #1f1f1f; 
          padding: 1rem 1.5rem; 
          text-align: center; 
          font-size: 5rem; 
          font-weight: 900; 
          text-transform: uppercase; 
          outline: none; 
          width: 380px; 
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          color: white; 
          font-style: italic; 
          letter-spacing: -0.05em; 
        }
        .compare-input:focus { 
          border-color: white; 
          width: 420px; 
          transform: scale(1.05); 
          drop-shadow: 0 0 30px rgba(255,255,255,0.1);
        }
        .compare-input::placeholder { color: #151515; }

        @media (max-width: 768px) { 
          .compare-input { font-size: 2.5rem; width: 220px; } 
          .compare-input:focus { width: 240px; } 
        }
      `}</style>
    </div>
  );
}

// --- HELPER COMPONENTS ---

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-5 px-7 py-6 rounded-3xl transition-all duration-500 group ${
      active 
        ? 'bg-zinc-800 text-white shadow-2xl border border-zinc-700 translate-x-2' 
        : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/50 hover:translate-x-1'
    }`}
  >
    <Icon size={24} className={`transition-transform duration-500 ${active ? 'scale-110' : 'group-hover:scale-110 opacity-50 group-hover:opacity-100'}`} />
    <span className={`text-[12px] font-black uppercase tracking-[0.25em] ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
  </button>
);

const InputGroup = ({ label, icon: Icon, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 text-[11px] font-black text-zinc-600 uppercase tracking-[0.3em] px-3">
      <Icon size={14} /> {label}
    </div>
    {children}
  </div>
);

const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-60 text-center space-y-12 animate-in fade-in zoom-in-95 duration-1000">
    <div className="w-36 h-36 bg-zinc-900 rounded-[4rem] flex items-center justify-center border border-zinc-800 shadow-2xl relative group">
      <div className="absolute inset-0 bg-blue-500/5 blur-[80px] rounded-full animate-pulse group-hover:bg-blue-500/10 transition-all duration-1000" />
      <Icon className="text-zinc-700 relative z-10 transition-transform group-hover:rotate-12 duration-500" size={60} />
    </div>
    <div className="space-y-6">
      <h2 className="text-5xl font-black tracking-tight text-white uppercase italic leading-none">{title}</h2>
      <p className="text-zinc-600 text-base max-w-sm leading-relaxed mx-auto italic font-bold tracking-tight opacity-70">
        {subtitle}
      </p>
    </div>
  </div>
);






















i dont know how to post thsi code on github for safe deployment without any worries of api key leaks

so convet this code into different files to add on github
