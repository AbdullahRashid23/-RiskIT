import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, ArrowRight, Layers, RefreshCw, TrendingUp, ShieldCheck, Zap, 
  Scale, Target, Radio, LayoutDashboard, Menu, X, Search, Trophy, History, Network
} from 'lucide-react';
import './index.css';

// --- VISUALIZATION HELPERS ---
const Sparkline = ({ color = "#10b981", data = [] }) => {
  // Generate random data if none provided for visual flair
  const points = data.length > 0 ? data : Array.from({ length: 10 }, () => Math.floor(Math.random() * 50));
  const path = points.map((p, i) => `${(i / (points.length - 1)) * 100},${30 - (p / 50) * 30}`).join(" L ");
  
  return (
    <svg width="100" height="30" viewBox="0 0 100 30" fill="none" className="opacity-80">
      <path d={`M ${path}`} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// --- MODULE COMPONENTS ---
const NodeItem = ({ ticker, name, trend }) => (
  <div className="group flex items-center justify-between p-5 bg-[#0c0c0e] border border-zinc-800/50 rounded-2xl hover:border-zinc-600 transition-all cursor-default">
    <div>
      <h4 className="font-black italic text-xl text-zinc-200 group-hover:text-white">{ticker}</h4>
      <p className="text-[10px] text-zinc-600 font-mono mt-1 uppercase tracking-wider">{name}</p>
    </div>
    <div className="flex flex-col items-end gap-2">
      <Sparkline data={trend} />
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
    </div>
  </div>
);

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all group ${
      active ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
    }`}
  >
    <Icon size={18} className={active ? "text-emerald-500" : "group-hover:scale-110 transition-transform"} />
    <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default function App() {
  // --- GLOBAL STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- MODULE STATES ---
  
  // 1. Architect (Dashboard) State
  const [recInputs, setRecInputs] = useState({ amount: '10000', market: 'US Tech', horizon: 'Long Term', halal: true });
  const [recommendations, setRecommendations] = useState(null);

  // 2. Comparator State
  const [compInputs, setCompInputs] = useState({ s1: '', s2: '' });
  const [comparison, setComparison] = useState(null);

  // 3. Pathfinder State
  const [anaInput, setAnaInput] = useState('');
  const [analysis, setAnalysis] = useState(null);

  // --- LOGIC HANDLERS (Simulated for UI Demo) ---
  
  const handleRecs = () => {
    setLoading(true);
    setTimeout(() => {
      setRecommendations({
        strategy: "Halal-Compliant US Tech Growth. Focuses on large-cap technology companies with strong competitive moats and low debt ratios.",
        stability: "RESILIENT",
        nodes: [
          { ticker: 'MSFT', name: 'Microsoft Corp', trend: [10, 20, 15, 30, 40, 35, 50] },
          { ticker: 'AVGO', name: 'Broadcom Inc', trend: [15, 10, 25, 30, 25, 45, 60] },
          { ticker: 'ADBE', name: 'Adobe Systems', trend: [20, 25, 20, 35, 30, 50, 55] }
        ]
      });
      setLoading(false);
    }, 1500);
  };

  const handleComp = () => {
    if (!compInputs.s1 || !compInputs.s2) return;
    setLoading(true);
    setTimeout(() => {
      setComparison({
        winner: compInputs.s1,
        decision: `BUY ${compInputs.s1}`,
        summary: `${compInputs.s1} demonstrates superior free cash flow yield and lower debt-to-equity ratio compared to ${compInputs.s2}, adhering strictly to the selected risk parameters.`,
        scorecard: [
          { label: "Volatility", s1: 85, s2: 60 },
          { label: "Growth", s1: 75, s2: 70 },
          { label: "Sharia Compl.", s1: 100, s2: 40 }
        ]
      });
      setLoading(false);
    }, 1500);
  };

  const handleAna = () => {
    if (!anaInput) return;
    setLoading(true);
    setTimeout(() => {
      setAnalysis({
        ticker: anaInput,
        name: "ENTERPRISE NODE",
        health: 0.94,
        description: "Critical infrastructure node showing strong bullish divergence on the weekly timeframe. Logic gate status: OPEN for accumulation.",
        pathways: { short: "Bullish Continuation", long: "Structural Hold" }
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden selection:bg-emerald-500/30">
      
      {/* --- SIDEBAR NAVIGATION (Desktop & Mobile) --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#09090b] border-r border-zinc-800 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-black italic shadow-[0_0_20px_rgba(255,255,255,0.3)]">!</div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white">RiskIT</h1>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto text-zinc-500"><X /></button>
          </div>

          <nav className="space-y-2 flex-1">
            <NavItem icon={LayoutDashboard} label="Architect" active={activeTab === 'dashboard'} onClick={() => {setActiveTab('dashboard'); setIsSidebarOpen(false)}} />
            <NavItem icon={Scale} label="Comparator" active={activeTab === 'comparator'} onClick={() => {setActiveTab('comparator'); setIsSidebarOpen(false)}} />
            <NavItem icon={Target} label="Pathfinder" active={activeTab === 'pathfinder'} onClick={() => {setActiveTab('pathfinder'); setIsSidebarOpen(false)}} />
            <NavItem icon={Radio} label="Pulse" active={activeTab === 'pulse'} onClick={() => {setActiveTab('pulse'); setIsSidebarOpen(false)}} />
          </nav>

          <div className="mt-auto pt-6 border-t border-zinc-800">
            <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">System Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="px-8 py-6 border-b border-zinc-900 bg-[#050505]/90 backdrop-blur-sm z-40 flex items-center justify-between shrink-0">
           <button className="lg:hidden text-zinc-400" onClick={() => setIsSidebarOpen(true)}><Menu /></button>
           <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${loading ? 'bg-blue-500 animate-ping' : 'bg-zinc-700'}`} />
             <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500">
               {activeTab} Mode // {loading ? 'CALCULATING...' : 'IDLE'}
             </span>
           </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
          
          {/* =========================================================================
              VIEW 1: DASHBOARD (ARCHITECT)
             ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="bento-grid animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* CARD 1: INPUTS */}
              <section className="premium-card">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Layers size={140} /></div>
                <h1 className="massive-title mb-10 relative z-10">ARCHITEC<br/>T</h1>
                
                <div className="space-y-8 relative z-10">
                  <div className="input-group">
                    <label className="input-label">Investment Capacity</label>
                    <input type="number" className="input-field-dark" value={recInputs.amount} onChange={e => setRecInputs({...recInputs, amount: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Node Universe</label>
                    <input type="text" className="input-field-dark" value={recInputs.market} onChange={e => setRecInputs({...recInputs, market: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Time Horizon</label>
                    <select className="input-field-dark cursor-pointer" value={recInputs.horizon} onChange={e => setRecInputs({...recInputs, horizon: e.target.value})}>
                      <option>Short Term</option>
                      <option>Medium Term</option>
                      <option>Long Term</option>
                    </select>
                  </div>
                  <div className="p-6 bg-[#0c0c0e] border border-zinc-800 rounded-3xl flex items-center justify-between cursor-pointer" onClick={() => setRecInputs({...recInputs, halal: !recInputs.halal})}>
                    <div>
                       <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1 block">Ethical Gate</label>
                       <span className={`text-sm font-bold ${recInputs.halal ? "text-white" : "text-zinc-500"}`}>Sharia / Halal Filter</span>
                    </div>
                    <div className={`w-14 h-8 rounded-full relative transition-all duration-300 ${recInputs.halal ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-zinc-800'}`}>
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${recInputs.halal ? 'left-7' : 'left-1'}`} />
                    </div>
                  </div>
                </div>
                <button onClick={handleRecs} disabled={loading} className="btn-initialize group">
                  <span>{loading ? 'Processing...' : 'Initialize Nodes'}</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </section>

              {/* CARD 2: STRATEGY */}
              <section className="premium-card bg-[#09090b]/50">
                <div className="mb-8"><span className="glass-badge bg-blue-500/10 text-blue-400 border-blue-500/20">Strategy Inferred</span></div>
                <p className="text-lg font-medium italic text-zinc-300 leading-relaxed mb-12">
                  "{recommendations ? recommendations.strategy : "System Standby. Awaiting architecture parameters..."}"
                </p>
                {recommendations && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8">
                    {recommendations.nodes.map((node, i) => <NodeItem key={i} {...node} />)}
                  </div>
                )}
                <div className="mt-auto pt-8 border-t border-zinc-900 flex justify-between text-zinc-600 text-[10px] tracking-[0.2em] uppercase font-bold">
                  <span>Selected Node Set</span><span>Node Brief</span>
                </div>
              </section>

              {/* CARD 3: STABILITY */}
              <section className="premium-card border-emerald-500/10 relative">
                <div className="flex justify-between items-start mb-auto">
                  <span className="text-[10px] text-emerald-500 font-bold tracking-[0.3em] uppercase">Logic Stability</span>
                  <RefreshCw className={`text-emerald-500 ${loading ? 'animate-spin' : ''}`} size={20} />
                </div>
                <div className="relative py-20">
                   <h2 className={`massive-title transition-opacity duration-1000 ${recommendations ? 'text-emerald-500 opacity-90' : 'text-zinc-800 opacity-50'}`}>
                     {recommendations ? "RESI\nLIEN\nT" : "IDLE\nSTATE"}
                   </h2>
                   {recommendations && <div className="absolute right-0 bottom-10"><Activity className="text-emerald-500 w-20 h-20 opacity-20" /></div>}
                </div>
                <div className="mt-auto flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${recommendations ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`} />
                  <p className="text-[10px] text-zinc-500 tracking-[0.2em] uppercase font-bold">Binary State: {recommendations ? "Confirmed" : "Waiting"}</p>
                </div>
              </section>
            </div>
          )}

          {/* =========================================================================
              VIEW 2: COMPARATOR (RESTORED)
             ========================================================================= */}
          {activeTab === 'comparator' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
               <div className="text-center space-y-4 mb-12">
                  <h2 className="massive-title text-center text-[4rem]">BINARY COMPARATOR</h2>
                  <p className="text-zinc-500 italic">Head-to-head logical elimination protocol</p>
               </div>

               <div className="premium-card flex flex-col md:flex-row items-center gap-8 p-12 min-h-[400px]">
                  <div className="flex-1 w-full space-y-4">
                     <label className="input-label text-center">Node Alpha</label>
                     <input className="input-field-dark text-center text-3xl font-black italic uppercase py-8" placeholder="TICKER A" value={compInputs.s1} onChange={e => setCompInputs({...compInputs, s1: e.target.value.toUpperCase()})} />
                  </div>
                  <div className="text-6xl font-black italic text-zinc-800">VS</div>
                  <div className="flex-1 w-full space-y-4">
                     <label className="input-label text-center">Node Beta</label>
                     <input className="input-field-dark text-center text-3xl font-black italic uppercase py-8" placeholder="TICKER B" value={compInputs.s2} onChange={e => setCompInputs({...compInputs, s2: e.target.value.toUpperCase()})} />
                  </div>
               </div>
               
               <button onClick={handleComp} disabled={loading} className="btn-initialize w-full py-8 text-xl">
                  {loading ? 'AUDITING...' : 'RESOLVE CONFLICT'}
               </button>

               {comparison && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <div className="premium-card bg-zinc-100 border-white text-black min-h-[400px]">
                       <div className="flex items-center gap-4 mb-8">
                          <Trophy className="text-yellow-600" size={32} />
                          <span className="font-black tracking-widest uppercase text-sm">Dominant Node</span>
                       </div>
                       <h2 className="text-[8rem] leading-[0.8] font-black italic uppercase tracking-tighter mb-8">{comparison.winner}</h2>
                       <div className="mt-auto p-6 bg-black/5 rounded-2xl border border-black/5">
                          <p className="font-bold uppercase tracking-widest text-xs mb-2">Recommendation</p>
                          <p className="text-2xl font-black italic">{comparison.decision}</p>
                       </div>
                    </div>
                    <div className="premium-card min-h-[400px]">
                       <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-8">Logic Scorecard</h3>
                       <div className="space-y-6">
                          {comparison.scorecard.map((item, i) => (
                             <div key={i} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase text-zinc-400">
                                   <span>{item.label}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                   <div className="flex-1 h-4 bg-zinc-900 rounded-full overflow-hidden">
                                      <div className="h-full bg-blue-500" style={{width: `${item.s1}%`}} />
                                   </div>
                                   <span className="text-xs font-mono text-zinc-600">VS</span>
                                   <div className="flex-1 h-4 bg-zinc-900 rounded-full overflow-hidden flex justify-end">
                                      <div className="h-full bg-rose-500" style={{width: `${item.s2}%`}} />
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                       <p className="mt-auto text-zinc-400 italic text-sm leading-relaxed border-t border-zinc-900 pt-6">
                          "{comparison.summary}"
                       </p>
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* =========================================================================
              VIEW 3: PATHFINDER (RESTORED)
             ========================================================================= */}
          {activeTab === 'pathfinder' && (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
               <div className="premium-card flex flex-col md:flex-row items-center gap-6 p-8 min-h-[200px]">
                  <Search className="text-zinc-600 ml-4" size={32} />
                  <input 
                    placeholder="ENTER NODE IDENTIFIER..." 
                    className="flex-1 bg-transparent text-4xl font-black italic uppercase outline-none placeholder:text-zinc-800 text-white"
                    value={anaInput}
                    onChange={e => setAnaInput(e.target.value.toUpperCase())}
                  />
                  <button onClick={handleAna} className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform">
                    Execute
                  </button>
               </div>

               {analysis ? (
                 <div className="premium-card">
                    <div className="flex justify-between items-start mb-12">
                       <div>
                          <h2 className="text-[6rem] md:text-[10rem] font-black italic uppercase leading-[0.8] tracking-tighter">{analysis.ticker}</h2>
                          <p className="text-zinc-500 font-mono tracking-widest mt-4 uppercase">{analysis.name}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs mb-2">Node Health</p>
                          <div className="text-6xl font-black text-emerald-500">{(analysis.health * 100).toFixed(0)}%</div>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <div className="p-8 bg-zinc-900/50 rounded-3xl border border-zinc-800">
                          <Network className="text-blue-500 mb-6" size={32} />
                          <p className="text-xl italic text-zinc-300 leading-relaxed">"{analysis.description}"</p>
                       </div>
                       <div className="space-y-4">
                          <div className="p-6 bg-[#0c0c0e] border border-zinc-800 rounded-2xl flex justify-between items-center">
                             <span className="text-xs font-bold uppercase text-zinc-500">Short Term Path</span>
                             <span className="text-emerald-400 font-bold italic">{analysis.pathways.short}</span>
                          </div>
                          <div className="p-6 bg-[#0c0c0e] border border-zinc-800 rounded-2xl flex justify-between items-center">
                             <span className="text-xs font-bold uppercase text-zinc-500">Long Term Path</span>
                             <span className="text-blue-400 font-bold italic">{analysis.pathways.long}</span>
                          </div>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="h-[400px] flex flex-col items-center justify-center opacity-20 border border-dashed border-zinc-800 rounded-[3rem]">
                    <Target size={64} className="mb-4" />
                    <p className="font-black italic uppercase tracking-widest">Awaiting Target Vector</p>
                 </div>
               )}
            </div>
          )}

          {/* =========================================================================
              VIEW 4: PULSE (RESTORED)
             ========================================================================= */}
          {activeTab === 'pulse' && (
             <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
                <h2 className="massive-title text-center mb-12">LOGIC PULSE</h2>
                {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="premium-card min-h-0 flex-row items-center justify-between p-8 hover:bg-zinc-900/80 cursor-pointer">
                      <div className="flex items-center gap-6">
                         <span className="font-mono text-zinc-600 text-xs">10:4{i} AM</span>
                         <div>
                            <h4 className="font-bold text-zinc-200">Global Semiconductor Logic Gate Adjusted</h4>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Impact: Moderate // Sector: Tech</p>
                         </div>
                      </div>
                      <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-[10px] font-bold uppercase">Stable</div>
                   </div>
                ))}
             </div>
          )}

        </div>
      </main>
    </div>
  );
}
