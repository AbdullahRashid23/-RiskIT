import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Layers, CheckCircle2, XCircle, Activity, Search, Network, 
  Loader2, AlertTriangle, ArrowRight, Database, TrendingUp, Scale, Zap, 
  History, Target, Globe, Clock, LayoutDashboard, Menu, X, TrendingDown, 
  BarChart3, Trophy, ZapOff, MessageSquare, FileText, Radio, RefreshCw, 
  Info, Download, Share2, Maximize2 
} from 'lucide-react';
import './index.css';

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
  let delay = 1000;
  for (let i = 0; i < 5; i++) {
    try {
      const response = await fetch('/api/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt, userPrompt })
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      if (i === 4) throw error;
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

// --- MODULE COMPONENTS ---
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

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all group ${active ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900/50'}`}>
    <Icon size={18} className={`${active ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
    <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  // Module States
  const [recInputs, setRecInputs] = useState({ amount: '10000', market: 'US Tech', span: 'Long Term', halal: true });
  const [recommendations, setRecommendations] = useState(null);
  const [compInputs, setCompInputs] = useState({ s1: '', s2: '', span: 'Medium Term' });
  const [comparison, setComparison] = useState(null);
  const [anaInput, setAnaInput] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [advisorQuery, setAdvisorQuery] = useState('');
  const [advisorChat, setAdvisorChat] = useState([]);
  const chatEndRef = useRef(null);

  // Logic Handlers
  const handleRecs = async () => {
    setLoading(true); setError(null);
    const system = `Act as the !RiskIT Portfolio Architect. Output JSON: { "recommendations": [{ "ticker": "TKR", "reason": "Logic", "setStability": "High/Med", "riskFactor": "Factor", "historicalGrowth": [40,50,45,60,70] }], "setStrategy": "Strategy text", "expectedStability": "Stable/Resilient" }`;
    try { const res = await callIntelligence(system, JSON.stringify(recInputs)); setRecommendations(res); } 
    catch (e) { setError("Node Synthesis Failed"); }
    setLoading(false);
  };

  const handleComp = async () => {
    if (!compInputs.s1 || !compInputs.s2) return;
    setLoading(true); setError(null);
    const system = `Act as the !RiskIT Comparator. Output JSON: { "winner": "TKR", "binaryDecision": "BUY S1", "logicSummary": "Reasoning", "scorecard": [{ "label": "Resilience", "s1Val": 80, "s2Val": 60 }] }`;
    try { const res = await callIntelligence(system, JSON.stringify(compInputs)); setComparison(res); } 
    catch (e) { setError("Audit Failed"); }
    setLoading(false);
  };

  const handleAna = async () => {
    if (!anaInput) return;
    setLoading(true); setError(null);
    const system = `Act as !RiskIT Pathfinder. Output JSON: { "description": "Logic", "history": [{"era": "2022", "event": "Flip", "impact": "Res"}], "futurePaths": { "shortTerm": "Path A", "longTerm": "Path B" }, "nodeHealth": 0.9, "criticalDependencies": ["Node A"] }`;
    try { const res = await callIntelligence(system, anaInput); setAnalysis({ ...res, ticker: anaInput.toUpperCase() }); } 
    catch (e) { setError("Deep Audit Failed"); }
    setLoading(false);
  };

  const handleAdvisor = async () => {
    if (!advisorQuery) return;
    const q = advisorQuery; setAdvisorQuery('');
    setAdvisorChat(p => [...p, { role: 'user', text: q }]);
    try { 
      const res = await callIntelligence("Act as !RiskIT AI Advisor. JSON: { \"answer\": \"text\" }", q);
      setAdvisorChat(p => [...p, { role: 'ai', text: res.answer }]);
    } catch (e) { setAdvisorChat(p => [...p, { role: 'ai', text: "Inference Error." }]); }
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [advisorChat]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#050505] selection:bg-blue-500/30">
      
      {/* SIDE NAVIGATION */}
      <aside className={`fixed inset-0 z-50 lg:relative lg:flex w-full lg:w-72 border-r border-zinc-900 flex-col p-8 bg-[#070707] transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-black italic shadow-2xl">!</div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">RiskIT</h1>
          <button className="lg:hidden ml-auto" onClick={() => setIsSidebarOpen(false)}><X /></button>
        </div>
        <nav className="flex-1 space-y-2">
          <NavItem icon={LayoutDashboard} label="Architect" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={Scale} label="Comparator" active={activeTab === 'comparator'} onClick={() => setActiveTab('comparator')} />
          <NavItem icon={Target} label="Pathfinder" active={activeTab === 'pathfinder'} onClick={() => setActiveTab('pathfinder')} />
          <NavItem icon={Radio} label="Market Pulse" active={activeTab === 'pulse'} onClick={() => setActiveTab('pulse')} />
        </nav>
        <div className="mt-auto pt-8 border-t border-zinc-900 space-y-4">
          <button onClick={() => setIsAdvisorOpen(true)} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-blue-500/5 text-blue-400 border border-blue-500/10 hover:bg-blue-500/10 transition-all">
            <MessageSquare size={18} /> <span className="text-[11px] font-black uppercase tracking-widest">Logic Advisor</span>
          </button>
          <div className="p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800">
             <div className="flex justify-between items-center text-[10px] text-zinc-500">
               <span>SYSTEM STATUS</span>
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <header className="px-8 py-6 border-b border-zinc-900 flex justify-between items-center sticky top-0 bg-black/60 backdrop-blur-xl z-40">
           <button className="lg:hidden" onClick={() => setIsSidebarOpen(true)}><Menu /></button>
           <div className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase">
             {activeTab} Mode // stochastic_sync
           </div>
           {loading && <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black animate-pulse"><Loader2 size={14} className="animate-spin" /> INFERRING...</div>}
        </header>

        <div className="dashboard-container">
          {error && <div className="m-8 p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-500 font-black text-xs uppercase">{error}</div>}

          {/* DASHBOARD: ARCHITECT */}
          {activeTab === 'dashboard' && (
            <div className="main-grid py-12 animate-in fade-in slide-in-from-bottom-4">
              <section className="premium-card">
                <h1 className="massive-label mb-10 text-white">ARCHITEC<br/>T</h1>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest px-2">Investment Capacity</label>
                    <input type="number" value={recInputs.amount} onChange={e => setRecInputs({...recInputs, amount: e.target.value})} className="input-field-dark" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest px-2">Node Universe</label>
                    <input value={recInputs.market} onChange={e => setRecInputs({...recInputs, market: e.target.value})} className="input-field-dark" />
                  </div>
                  <div className="flex items-center justify-between p-6 bg-zinc-950 border border-zinc-900 rounded-3xl">
                     <div className="text-xs font-bold text-zinc-400">Sharia / Halal Filter</div>
                     <button onClick={() => setRecInputs({...recInputs, halal: !recInputs.halal})} className={`w-12 h-6 rounded-full relative transition-colors ${recInputs.halal ? 'bg-emerald-500' : 'bg-zinc-800'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${recInputs.halal ? 'right-1' : 'left-1'}`} />
                     </button>
                  </div>
                  <button onClick={handleRecs} className="init-button w-full">Initialize Nodes →</button>
                </div>
              </section>

              {recommendations ? (
                <>
                  <section className="premium-card bg-zinc-900/20">
                    <Badge variant="blue">Strategy Inferred</Badge>
                    <p className="fluid-text-body italic text-zinc-300 mt-10 leading-relaxed">"{recommendations.setStrategy}"</p>
                    <div className="mt-auto space-y-4">
                      {recommendations.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                           <span className="font-black italic text-xl">{rec.ticker}</span>
                           <Sparkline data={rec.historicalGrowth} />
                        </div>
                      ))}
                    </div>
                  </section>
                  <section className="premium-card border-emerald-900/20">
                    <Badge variant="success">Logic Stability</Badge>
                    <div className="mt-auto">
                      <h2 className="massive-label text-emerald-500/40">{recommendations.expectedStability}</h2>
                      <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-4">Binary State: Confirmed</p>
                    </div>
                  </section>
                </>
              ) : (
                <div className="lg:col-span-2 flex items-center justify-center opacity-10 border border-dashed border-zinc-800 rounded-[3rem] h-[500px]">
                  <p className="text-xl font-black italic tracking-widest uppercase">System Standby</p>
                </div>
              )}
            </div>
          )}

          {/* COMPARATOR VIEW */}
          {activeTab === 'comparator' && (
            <div className="max-w-5xl mx-auto py-12 space-y-12 animate-in zoom-in-95">
               <div className="text-center space-y-4">
                  <h2 className="massive-label text-white">COMPARATOR</h2>
                  <p className="text-zinc-500 italic">Side-by-side logical elimination</p>
               </div>
               <div className="premium-card flex flex-col md:flex-row items-center gap-12 p-16">
                  <input placeholder="ALPHA" value={compInputs.s1} onChange={e => setCompInputs({...compInputs, s1: e.target.value.toUpperCase()})} className="compare-input flex-1" />
                  <div className="text-zinc-800 font-black italic text-4xl">VS</div>
                  <input placeholder="BETA" value={compInputs.s2} onChange={e => setCompInputs({...compInputs, s2: e.target.value.toUpperCase()})} className="compare-input flex-1" />
               </div>
               <button onClick={handleComp} className="init-button w-full py-8">Resolve Conflict</button>
               {comparison && (
                 <div className="premium-card bg-white text-black text-center p-20">
                    <h2 className="text-[10rem] font-black italic leading-none">{comparison.winner}</h2>
                    <p className="text-xl font-bold mt-8">DOMINANT NODE SELECTED</p>
                 </div>
               )}
            </div>
          )}

          {/* PATHFINDER VIEW */}
          {activeTab === 'pathfinder' && (
            <div className="max-w-6xl mx-auto py-12 space-y-12">
               <div className="flex gap-4 p-4 bg-zinc-900 rounded-[2.5rem] border border-zinc-800">
                  <input placeholder="ENTER NODE ID..." value={anaInput} onChange={e => setAnaInput(e.target.value.toUpperCase())} className="flex-1 bg-transparent px-8 text-2xl font-black italic outline-none" />
                  <button onClick={handleAna} className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase text-xs">Execute</button>
               </div>
               {analysis && (
                 <div className="main-grid">
                    <section className="premium-card">
                       <h2 className="massive-label text-white">{analysis.ticker}</h2>
                       <p className="fluid-text-body mt-8 italic text-zinc-400">"{analysis.description}"</p>
                    </section>
                    <section className="premium-card bg-zinc-900/30">
                       <Badge variant="blue">Health</Badge>
                       <div className="text-8xl font-black text-emerald-500 mt-10">{(analysis.nodeHealth * 100)}%</div>
                    </section>
                    <div className="lg:col-span-2">
                       <CandlestickChart count={40} />
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* PULSE VIEW */}
          {activeTab === 'pulse' && (
            <div className="max-w-4xl mx-auto py-12 space-y-6">
               <h2 className="massive-label text-white text-center mb-10">TELEMETRY</h2>
               {[1,2,3,4].map(i => (
                 <div key={i} className="premium-card min-h-0 flex-row justify-between items-center py-6 px-10">
                    <div>
                      <p className="font-bold text-lg">Market Signal #{i}</p>
                      <p className="text-xs text-zinc-500 uppercase">Logic Delta: Active</p>
                    </div>
                    <Badge variant="blue">STABLE</Badge>
                 </div>
               ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL: ADVISOR */}
      {isAdvisorOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl h-[70vh] bg-zinc-950 border border-zinc-900 rounded-[3rem] flex flex-col">
            <header className="p-8 border-b border-zinc-900 flex justify-between">
               <h3 className="font-black italic text-xl uppercase">Logic Advisor</h3>
               <button onClick={() => setIsAdvisorOpen(false)}><X /></button>
            </header>
            <div className="flex-1 overflow-y-auto p-8 space-y-4">
               {advisorChat.map((m, i) => (
                 <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-4 rounded-2xl max-w-[80%] ${m.role === 'user' ? 'bg-blue-600' : 'bg-zinc-900 border border-zinc-800'}`}>
                      {m.text}
                    </div>
                 </div>
               ))}
               <div ref={chatEndRef} />
            </div>
            <footer className="p-8 border-t border-zinc-900 flex gap-4">
               <input value={advisorQuery} onChange={e => setAdvisorQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdvisor()} placeholder="Inquiry..." className="input-field-dark flex-1" />
               <button onClick={handleAdvisor} className="bg-white text-black px-8 rounded-xl font-black uppercase text-xs">Ask</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
