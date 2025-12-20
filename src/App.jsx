import React, { useState, useEffect } from 'react';
import { 
  Activity, ArrowRight, Layers, RefreshCw, Scale, Target, Radio, 
  LayoutDashboard, Menu, X, Search, Trophy, Network, Zap,
  TrendingUp, ShieldCheck, BarChart3, Globe, Clock
} from 'lucide-react';
import './index.css';

// --- UI SUB-COMPONENTS (Modularized for perfection) ---

const Sparkline = ({ data }) => {
  const points = data.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - val}`).join(" L ");
  return (
    <div className="relative w-24 h-10 opacity-80">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M ${points}`} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${points} L 100,100 L 0,100 Z`} fill="url(#gradient)" stroke="none" className="opacity-20" />
        <circle cx="100" cy={100 - data[data.length - 1]} r="2" fill="#10b981" />
      </svg>
    </div>
  );
};

const NodeRow = ({ ticker, name, trend }) => (
  <div className="group flex items-center justify-between p-4 bg-[#0a0a0c] border border-white/5 rounded-xl hover:border-emerald-500/30 hover:bg-[#0f0f11] transition-all cursor-default">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center font-black italic text-zinc-600 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-colors">
        {ticker[0]}
      </div>
      <div>
        <h4 className="font-black italic text-base text-zinc-100 group-hover:text-white tracking-tight">{ticker}</h4>
        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">{name}</p>
      </div>
    </div>
    <Sparkline data={trend} />
  </div>
);

const TabButton = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all group relative overflow-hidden ${
      active ? 'bg-zinc-900 text-white shadow-inner' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
    }`}
  >
    {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />}
    <Icon size={18} className={active ? "text-emerald-500" : "group-hover:scale-110 transition-transform"} />
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

// --- MAIN APPLICATION ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [recInputs, setRecInputs] = useState({ amount: '10000', market: 'US Tech', horizon: 'Long Term', halal: true });
  const [recommendations, setRecommendations] = useState(null);
  const [compInputs, setCompInputs] = useState({ s1: '', s2: '' });
  const [comparison, setComparison] = useState(null);
  const [anaInput, setAnaInput] = useState('');
  const [analysis, setAnalysis] = useState(null);

  // Logic Simulators
  const handleRecs = () => {
    setLoading(true);
    setTimeout(() => {
      setRecommendations({
        strategy: "Halal-Compliant US Tech Growth. Focuses on large-cap technology companies with strong competitive moats.",
        nodes: [
          { ticker: 'MSFT', name: 'Microsoft Corp', trend: [20, 30, 25, 40, 35, 50, 60] },
          { ticker: 'AVGO', name: 'Broadcom Inc', trend: [15, 20, 15, 30, 45, 40, 55] },
          { ticker: 'ADBE', name: 'Adobe Systems', trend: [30, 25, 40, 35, 50, 45, 65] }
        ]
      });
      setLoading(false);
    }, 1200);
  };

  const handleComp = () => {
    if(!compInputs.s1 || !compInputs.s2) return;
    setLoading(true);
    setTimeout(() => {
      setComparison({
        winner: compInputs.s1,
        decision: `BUY ${compInputs.s1}`,
        summary: `${compInputs.s1} shows superior Free Cash Flow Yield (4.2%) vs ${compInputs.s2} (1.8%), confirming stronger liquidity for long-term holding.`,
        scorecard: [
          { label: "Volatility", s1: 85, s2: 40 },
          { label: "Growth", s1: 75, s2: 60 },
          { label: "Sharia Compl.", s1: 95, s2: 30 }
        ]
      });
      setLoading(false);
    }, 1200);
  };

  const handleAna = () => {
    if(!anaInput) return;
    setLoading(true);
    setTimeout(() => {
      setAnalysis({
        ticker: anaInput,
        name: "ENTERPRISE NODE",
        health: 0.98,
        description: "Critical infrastructure node showing strong bullish divergence. Logic gate status: OPEN.",
        pathways: { short: "Bullish Continuation", long: "Structural Hold" }
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="flex h-screen bg-[#030303] overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-900">
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#050505] border-r border-white/5 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-10 pl-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-black italic shadow-[0_0_20px_rgba(255,255,255,0.2)]">!</div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white">RiskIT</h1>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto text-zinc-500"><X /></button>
          </div>

          <nav className="space-y-2 flex-1">
            <TabButton icon={LayoutDashboard} label="Architect" active={activeTab === 'dashboard'} onClick={() => {setActiveTab('dashboard'); setIsSidebarOpen(false)}} />
            <TabButton icon={Scale} label="Comparator" active={activeTab === 'comparator'} onClick={() => {setActiveTab('comparator'); setIsSidebarOpen(false)}} />
            <TabButton icon={Target} label="Pathfinder" active={activeTab === 'pathfinder'} onClick={() => {setActiveTab('pathfinder'); setIsSidebarOpen(false)}} />
            <TabButton icon={Radio} label="Pulse" active={activeTab === 'pulse'} onClick={() => {setActiveTab('pulse'); setIsSidebarOpen(false)}} />
          </nav>

          {/* CREDITS SECTION */}
          <div className="mt-auto space-y-4">
             <div className="p-4 bg-zinc-900/30 rounded-xl border border-white/5">
                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Engineering Team</p>
                <div className="space-y-1">
                   <p className="text-[10px] text-zinc-400 font-medium">Abdulah Rashid</p>
                   <p className="text-[10px] text-zinc-400 font-medium">Moawiz</p>
                   <p className="text-[10px] text-zinc-400 font-medium">Muhammad Abdullah</p>
                </div>
             </div>
             
             <div className="pt-4 border-t border-white/5 flex items-center gap-3 px-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">System Online v2.1</span>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Mobile Header */}
        <header className="lg:hidden px-6 py-4 border-b border-white/5 bg-[#030303]/90 backdrop-blur-md z-40 flex items-center justify-between">
           <button className="text-zinc-400" onClick={() => setIsSidebarOpen(true)}><Menu /></button>
           <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500">{activeTab}</span>
        </header>

        {/* Scroll Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
          
          {/* =========================================================
              DASHBOARD (ARCHITECT)
             ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="bento-grid animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* CARD 1: INPUTS */}
              <section className="premium-card">
                 {/* Decorative Background Icon */}
                <div className="absolute -top-10 -right-10 text-white/5 rotate-12 pointer-events-none"><Layers size={200} /></div>
                
                {/* FLUID TITLE: Guaranteed not to overflow */}
                <div className="w-full relative z-10 mb-8">
                  <h1 className="fluid-title">ARCHITECT</h1>
                </div>

                <div className="relative z-10 space-y-6 flex-1">
                  <div className="space-y-2">
                    <label className="mono-label flex items-center gap-2"><TrendingUp size={12}/> Investment Capacity</label>
                    <input type="number" className="terminal-input" value={recInputs.amount} onChange={e => setRecInputs({...recInputs, amount: e.target.value})} />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="mono-label flex items-center gap-2"><Globe size={12}/> Node Universe</label>
                    <input type="text" className="terminal-input" value={recInputs.market} onChange={e => setRecInputs({...recInputs, market: e.target.value})} />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="mono-label flex items-center gap-2"><Clock size={12}/> Time Horizon</label>
                    <div className="relative">
                      <select className="terminal-input appearance-none cursor-pointer" value={recInputs.horizon} onChange={e => setRecInputs({...recInputs, horizon: e.target.value})}>
                        <option>Short Term</option>
                        <option>Medium Term</option>
                        <option>Long Term</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">▼</div>
                    </div>
                  </div>

                  <div 
                    className="p-4 bg-[#050505] border border-white/10 rounded-xl flex items-center justify-between cursor-pointer hover:border-zinc-600 transition-colors group"
                    onClick={() => setRecInputs({...recInputs, halal: !recInputs.halal})}
                  >
                    <div>
                       <label className="mono-label mb-1">Ethical Gate</label>
                       <div className="flex items-center gap-2">
                         <ShieldCheck size={14} className={recInputs.halal ? "text-emerald-500" : "text-zinc-600"} />
                         <span className={`text-xs font-bold ${recInputs.halal ? "text-white" : "text-zinc-500"}`}>Sharia / Halal Filter</span>
                       </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-all duration-300 border border-white/5 ${recInputs.halal ? 'bg-emerald-900/50' : 'bg-zinc-900'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 shadow-md ${recInputs.halal ? 'left-6 bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'left-0.5 bg-zinc-600'}`} />
                    </div>
                  </div>
                </div>

                <button onClick={handleRecs} disabled={loading} className="btn-primary group mt-8">
                  <span>{loading ? 'Synthesizing...' : 'Initialize Nodes'}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </section>

              {/* CARD 2: STRATEGY & OUTPUT */}
              <section className="premium-card bg-[#050505]/50">
                <div className="flex justify-between items-start mb-6">
                   <span className="glass-tag text-blue-400 border-blue-500/20">Strategy Inferred</span>
                   {recommendations && <span className="mono-label text-emerald-500 animate-pulse">Live Feed</span>}
                </div>
                
                <p className="text-lg md:text-xl font-medium italic text-zinc-300 leading-relaxed mb-8 min-h-[80px]">
                  "{recommendations ? recommendations.strategy : "Awaiting architecture parameters..."}"
                </p>

                {recommendations ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
                    {recommendations.nodes.map((node, i) => <NodeRow key={i} {...node} />)}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl opacity-30">
                     <BarChart3 size={48} className="mb-4" />
                     <p className="mono-label">System Idle</p>
                  </div>
                )}

                <div className="mt-auto pt-6 border-t border-white/5 flex justify-between text-zinc-600">
                   <span className="mono-label">Selected Node Set</span>
                   <span className="mono-label hover:text-white cursor-pointer transition-colors">View Brief ↗</span>
                </div>
              </section>

              {/* CARD 3: STABILITY MONITOR */}
              <section className="premium-card border-emerald-500/10 relative overflow-hidden">
                <div className="flex justify-between items-start z-10 relative">
                  <span className="mono-label text-emerald-500">Logic Stability</span>
                  <RefreshCw className={`text-emerald-500 ${loading ? 'animate-spin' : ''}`} size={16} />
                </div>
                
                <div className="relative z-10 flex-1 flex items-center">
                   <h2 className={`fluid-title w-full transition-all duration-1000 ${recommendations ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600' : 'text-zinc-800'}`}>
                     {recommendations ? "RESILIENT" : "IDLE"}
                   </h2>
                </div>
                
                {/* Animated Background Pulse */}
                {recommendations && (
                  <div className="absolute right-0 bottom-0 pointer-events-none">
                    <Activity className="text-emerald-500/10 w-64 h-64" />
                  </div>
                )}

                <div className="mt-auto flex items-center gap-3 z-10 relative">
                  <div className={`w-2 h-2 rounded-full ${recommendations ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-zinc-800'}`} />
                  <p className="mono-label text-zinc-400">Binary State: {recommendations ? "Confirmed" : "Waiting"}</p>
                </div>
              </section>
            </div>
          )}

          {/* =========================================================
              COMPARATOR (Fixed Visibility & Layout)
             ========================================================= */}
          {activeTab === 'comparator' && (
            <div className="bento-grid animate-in zoom-in-95 duration-500">
               {/* Header Banner */}
               <div className="md:col-span-2 premium-card min-h-fit items-center text-center py-12">
                  <h2 className="fluid-title text-[4rem] mb-4">COMPARATOR</h2>
                  <p className="text-zinc-500 italic max-w-lg mx-auto">Input two distinct node identifiers to determine dominance via binary elimination protocol.</p>
               </div>

               {/* Inputs */}
               <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="premium-card min-h-0 py-8">
                     <label className="mono-label text-center mb-4">Node Alpha</label>
                     <input className="terminal-input text-center text-3xl font-black italic uppercase py-8" placeholder="TICKER A" value={compInputs.s1} onChange={e => setCompInputs({...compInputs, s1: e.target.value.toUpperCase()})} />
                  </div>
                  <div className="premium-card min-h-0 py-8">
                     <label className="mono-label text-center mb-4">Node Beta</label>
                     <input className="terminal-input text-center text-3xl font-black italic uppercase py-8" placeholder="TICKER B" value={compInputs.s2} onChange={e => setCompInputs({...compInputs, s2: e.target.value.toUpperCase()})} />
                  </div>
               </div>
               
               <div className="md:col-span-2">
                  <button onClick={handleComp} disabled={loading} className="btn-primary justify-center py-6 text-sm">
                    {loading ? 'AUDITING...' : 'RESOLVE LOGIC CONFLICT'}
                  </button>
               </div>

               {comparison && (
                 <>
                    {/* Winner Card - FIXED VISIBILITY */}
                    <div className="premium-card bg-zinc-100 border-white text-black relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Trophy size={180} /></div>
                       <div className="flex items-center gap-3 mb-12">
                          <Trophy className="text-yellow-600" size={20} />
                          <span className="font-black tracking-widest uppercase text-[10px]">Dominant Node</span>
                       </div>
                       
                       {/* This text is explicitly styled to be visible on the light card */}
                       <h2 className="text-[6rem] md:text-[8rem] leading-[0.8] font-black italic uppercase tracking-tighter mb-4 text-black z-10 relative">
                         {comparison.winner}
                       </h2>
                       
                       <div className="mt-auto p-4 bg-black/5 rounded-xl border border-black/5 z-10 relative w-fit">
                          <p className="font-bold uppercase tracking-widest text-[9px] mb-1 opacity-60">Recommendation</p>
                          <p className="text-xl font-black italic">{comparison.decision}</p>
                       </div>
                    </div>

                    {/* Stats Card */}
                    <div className="premium-card">
                       <h3 className="mono-label mb-8">Logic Scorecard</h3>
                       <div className="space-y-6 mb-8">
                          {comparison.scorecard.map((item, i) => (
                             <div key={i} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-400">
                                   <span>{item.label}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                   <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
                                      <div className="h-full bg-blue-500" style={{width: `${item.s1}%`}} />
                                   </div>
                                   <span className="text-[10px] font-mono text-zinc-600">VS</span>
                                   <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden flex justify-end">
                                      <div className="h-full bg-rose-500" style={{width: `${item.s2}%`}} />
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                       <p className="mt-auto text-zinc-400 italic text-xs leading-relaxed border-t border-white/5 pt-6">"{comparison.summary}"</p>
                    </div>
                 </>
               )}
            </div>
          )}

          {/* =========================================================
              PATHFINDER
             ========================================================= */}
          {activeTab === 'pathfinder' && (
            <div className="bento-grid animate-in fade-in slide-in-from-right-8 duration-500">
               <div className="md:col-span-2 premium-card min-h-0 flex-row items-center gap-6 p-6 border-emerald-500/20 shadow-[0_0_50px_-20px_rgba(16,185,129,0.2)]">
                  <Search className="text-zinc-500 ml-2" size={24} />
                  <input 
                    placeholder="ENTER NODE IDENTIFIER..." 
                    className="flex-1 bg-transparent text-2xl md:text-4xl font-black italic uppercase outline-none placeholder:text-zinc-800 text-white"
                    value={anaInput}
                    onChange={e => setAnaInput(e.target.value.toUpperCase())}
                  />
                  <button onClick={handleAna} className="bg-white text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform">
                    Execute
                  </button>
               </div>

               {analysis ? (
                 <div className="md:col-span-2 premium-card">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
                       <div>
                          <h2 className="fluid-title text-white">{analysis.ticker}</h2>
                          <p className="mono-label mt-4 text-lg">{analysis.name}</p>
                       </div>
                       <div className="text-right p-6 bg-[#0a0a0c] rounded-2xl border border-white/5">
                          <p className="mono-label mb-2">Node Health</p>
                          <div className="text-5xl font-black text-emerald-500 shadow-emerald-500/20 drop-shadow-lg">{(analysis.health * 100).toFixed(0)}%</div>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="p-8 bg-[#0a0a0c] rounded-2xl border border-white/5">
                          <Network className="text-blue-500 mb-6" size={28} />
                          <p className="text-lg italic text-zinc-300 leading-relaxed">"{analysis.description}"</p>
                       </div>
                       <div className="space-y-4">
                          <div className="p-6 bg-[#0a0a0c] border border-white/5 rounded-xl flex justify-between items-center">
                             <span className="mono-label">Short Term Path</span>
                             <span className="text-emerald-400 font-bold italic text-sm">{analysis.pathways.short}</span>
                          </div>
                          <div className="p-6 bg-[#0a0a0c] border border-white/5 rounded-xl flex justify-between items-center">
                             <span className="mono-label">Long Term Path</span>
                             <span className="text-blue-400 font-bold italic text-sm">{analysis.pathways.long}</span>
                          </div>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="md:col-span-2 h-[400px] flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-zinc-800 rounded-[2rem]">
                    <Target size={64} className="mb-4 text-zinc-600" />
                    <p className="fluid-title text-zinc-800 text-[3rem]">Awaiting Vector</p>
                 </div>
               )}
            </div>
          )}

          {/* =========================================================
              PULSE
             ========================================================= */}
          {activeTab === 'pulse' && (
             <div className="max-w-4xl mx-auto p-4 space-y-4 animate-in fade-in">
                <h2 className="fluid-title text-center mb-8 text-[4rem]">LOGIC PULSE</h2>
                {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="group premium-card min-h-0 flex-row items-center justify-between p-6 hover:bg-zinc-900/80 cursor-pointer border-l-4 border-l-emerald-500">
                      <div className="flex items-center gap-6">
                         <span className="font-mono text-zinc-600 text-xs">10:4{i} AM</span>
                         <div>
                            <h4 className="font-bold text-zinc-200 group-hover:text-white transition-colors">Global Semiconductor Logic Gate Adjusted</h4>
                            <p className="mono-label mt-1">Impact: Moderate // Sector: Tech</p>
                         </div>
                      </div>
                      <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-[9px] font-bold uppercase shadow-[0_0_10px_rgba(16,185,129,0.1)]">Stable</div>
                   </div>
                ))}
                
                {/* FOOTER CREDITS IN PULSE AS WELL */}
                <div className="text-center mt-20 pt-10 border-t border-white/5">
                    <p className="mono-label text-zinc-700">Engineering: Abdulah Rashid | Moawiz | Muhammad Abdullah</p>
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
