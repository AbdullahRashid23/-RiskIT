import React, { useState } from 'react';
import { 
  Activity, ArrowRight, Layers, RefreshCw, Scale, Target, Radio, 
  LayoutDashboard, Menu, X, Search, Trophy, Network, Zap
} from 'lucide-react';
import './index.css';

// --- COMPONENTS ---

// Sparkline Component
const Sparkline = ({ data = [50, 40, 60, 55, 70, 65, 80], color = "#10b981" }) => {
  const points = data.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - val}`).join(" L ");
  return (
    <svg viewBox="0 0 100 100" className="w-24 h-8 overflow-visible opacity-80">
      <path d={`M ${points}`} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="100" cy={100 - data[data.length - 1]} r="3" fill={color} />
    </svg>
  );
};

// Node Row Item
const NodeItem = ({ ticker, name, trend }) => (
  <div className="group flex items-center justify-between p-5 bg-[#0c0c0e] border border-zinc-800 rounded-xl hover:border-zinc-600 transition-all">
    <div>
      <h4 className="font-black italic text-lg text-white tracking-tight">{ticker}</h4>
      <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">{name}</p>
    </div>
    <div className="flex flex-col items-end gap-2">
      <Sparkline data={trend} />
    </div>
  </div>
);

// Sidebar Navigation Item
const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all group ${
      active ? 'bg-zinc-800 text-white shadow-inner' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
    }`}
  >
    <Icon size={18} className={active ? "text-emerald-500" : "group-hover:scale-110 transition-transform"} />
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // States
  const [recInputs, setRecInputs] = useState({ amount: '10000', market: 'US Tech', horizon: 'Long Term', halal: true });
  const [recommendations, setRecommendations] = useState(null);
  const [compInputs, setCompInputs] = useState({ s1: '', s2: '' });
  const [comparison, setComparison] = useState(null);
  const [anaInput, setAnaInput] = useState('');
  const [analysis, setAnalysis] = useState(null);

  // Mock Handlers
  const handleRecs = () => {
    setLoading(true);
    setTimeout(() => {
      setRecommendations({
        strategy: "Halal-Compliant US Tech Growth. Focuses on large-cap technology companies with strong competitive moats.",
        stability: "RESILIENT",
        nodes: [
          { ticker: 'MSFT', name: 'Microsoft Corp', trend: [20, 30, 25, 40, 35, 50, 60] },
          { ticker: 'AVGO', name: 'Broadcom Inc', trend: [15, 20, 15, 30, 45, 40, 55] },
          { ticker: 'ADBE', name: 'Adobe Systems', trend: [30, 25, 40, 35, 50, 45, 65] }
        ]
      });
      setLoading(false);
    }, 1500);
  };

  const handleComp = () => {
    setLoading(true);
    setTimeout(() => {
      setComparison({
        winner: compInputs.s1 || "HBL",
        decision: `BUY ${compInputs.s1 || "HBL"}`,
        summary: "Superior free cash flow yield and lower debt-to-equity ratio compared to the opposing node.",
        scorecard: [
          { label: "Volatility", s1: 85, s2: 40 },
          { label: "Growth", s1: 75, s2: 60 },
          { label: "Sharia Compl.", s1: 95, s2: 30 }
        ]
      });
      setLoading(false);
    }, 1500);
  };

  const handleAna = () => {
    setLoading(true);
    setTimeout(() => {
      setAnalysis({
        ticker: anaInput || "NVDA",
        name: "NVIDIA CORP",
        health: 0.98,
        description: "Critical infrastructure node showing strong bullish divergence. Logic gate status: OPEN.",
        pathways: { short: "Bullish Continuation", long: "Structural Hold" }
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#09090b] border-r border-zinc-800 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-black italic shadow-lg">!</div>
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
            <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900 rounded-xl border border-zinc-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">System Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="px-8 py-5 border-b border-zinc-900 bg-[#050505]/90 backdrop-blur-sm z-40 flex items-center justify-between shrink-0">
           <button className="lg:hidden text-zinc-400" onClick={() => setIsSidebarOpen(true)}><Menu /></button>
           <div className="flex items-center gap-3">
             <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-blue-500 animate-ping' : 'bg-zinc-600'}`} />
             <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500">
               {activeTab} Mode // {loading ? 'PROCESSING...' : 'IDLE'}
             </span>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          
          {/* DASHBOARD MODE */}
          {activeTab === 'dashboard' && (
            <div className="bento-grid animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* INPUTS CARD */}
              <section className="premium-card">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Layers size={140} /></div>
                {/* Fixed Title: Removed <br/> to let it flow naturally */}
                <h1 className="massive-title mb-8 relative z-10">ARCHITECT</h1>
                
                <div className="relative z-10 flex-1">
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
                  <div className="mt-6 p-5 bg-[#0c0c0e] border border-zinc-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors" onClick={() => setRecInputs({...recInputs, halal: !recInputs.halal})}>
                    <div>
                       <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1 block">Ethical Gate</label>
                       <span className={`text-sm font-bold ${recInputs.halal ? "text-white" : "text-zinc-500"}`}>Sharia / Halal Filter</span>
                    </div>
                    <div className={`w-12 h-7 rounded-full relative transition-all duration-300 ${recInputs.halal ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-zinc-800'}`}>
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${recInputs.halal ? 'left-6' : 'left-1'}`} />
                    </div>
                  </div>
                </div>
                <button onClick={handleRecs} disabled={loading} className="btn-initialize group">
                  <span>{loading ? 'Synthesizing...' : 'Initialize Nodes'}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </section>

              {/* STRATEGY CARD */}
              <section className="premium-card bg-[#09090b]/50">
                <div className="mb-8"><span className="glass-badge bg-blue-500/10 text-blue-400 border-blue-500/20">Strategy Inferred</span></div>
                <p className="text-base md:text-lg font-medium italic text-zinc-300 leading-relaxed mb-8">
                  "{recommendations ? recommendations.strategy : "System Standby. Awaiting architecture parameters to synthesize financial node path..."}"
                </p>
                {recommendations && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-8">
                    {recommendations.nodes.map((node, i) => <NodeItem key={i} {...node} />)}
                  </div>
                )}
                <div className="mt-auto pt-6 border-t border-zinc-900 flex justify-between text-zinc-600 text-[9px] tracking-[0.2em] uppercase font-bold">
                  <span>Selected Node Set</span><span>Node Brief</span>
                </div>
              </section>

              {/* STABILITY CARD */}
              <section className="premium-card border-emerald-500/10 relative">
                <div className="flex justify-between items-start mb-auto">
                  <span className="text-[10px] text-emerald-500 font-bold tracking-[0.3em] uppercase">Logic Stability</span>
                  <RefreshCw className={`text-emerald-500 ${loading ? 'animate-spin' : ''}`} size={20} />
                </div>
                <div className="relative py-12 flex-1 flex items-center">
                   {/* Visibility Fix: Ensure text handles wrapping */}
                   <h2 className={`massive-title w-full transition-opacity duration-1000 ${recommendations ? 'text-emerald-500 opacity-100 text-glow' : 'text-zinc-800 opacity-50'}`}>
                     {recommendations ? "RESILIENT" : "IDLE"}
                   </h2>
                </div>
                <div className="mt-auto flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${recommendations ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`} />
                  <p className="text-[10px] text-zinc-500 tracking-[0.2em] uppercase font-bold">Binary State: {recommendations ? "Confirmed" : "Waiting"}</p>
                </div>
              </section>
            </div>
          )}

          {/* COMPARATOR MODE */}
          {activeTab === 'comparator' && (
            <div className="bento-grid animate-in zoom-in-95 duration-500">
               <div className="md:col-span-2 premium-card min-h-fit items-center text-center py-16">
                  <h2 className="massive-title text-center leading-none mb-4">COMPARATOR</h2>
                  <p className="text-zinc-500 italic max-w-lg mx-auto">Head-to-head logical elimination protocol. Input two distinct node identifiers to determine dominance.</p>
               </div>

               <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="premium-card min-h-0 py-10">
                     <label className="input-label text-center mb-4">Node Alpha</label>
                     <input className="input-field-dark text-center text-3xl font-black italic uppercase py-8" placeholder="TICKER A" value={compInputs.s1} onChange={e => setCompInputs({...compInputs, s1: e.target.value.toUpperCase()})} />
                  </div>
                  <div className="premium-card min-h-0 py-10">
                     <label className="input-label text-center mb-4">Node Beta</label>
                     <input className="input-field-dark text-center text-3xl font-black italic uppercase py-8" placeholder="TICKER B" value={compInputs.s2} onChange={e => setCompInputs({...compInputs, s2: e.target.value.toUpperCase()})} />
                  </div>
               </div>
               
               <div className="md:col-span-2">
                  <button onClick={handleComp} disabled={loading} className="btn-initialize justify-center py-6 text-sm">
                    {loading ? 'AUDITING...' : 'RESOLVE LOGIC CONFLICT'}
                  </button>
               </div>

               {comparison && (
                 <>
                    <div className="premium-card bg-zinc-100 border-white text-black">
                       <div className="flex items-center gap-4 mb-auto">
                          <Trophy className="text-yellow-600" size={24} />
                          <span className="font-black tracking-widest uppercase text-xs">Dominant Node</span>
                       </div>
                       <div className="py-10">
                          <h2 className="text-[5rem] md:text-[8rem] leading-[0.8] font-black italic uppercase tracking-tighter mb-4">{comparison.winner}</h2>
                          <p className="text-2xl font-black italic opacity-40">{comparison.decision}</p>
                       </div>
                    </div>
                    <div className="premium-card">
                       <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-8">Logic Scorecard</h3>
                       <div className="space-y-6 mb-8">
                          {comparison.scorecard.map((item, i) => (
                             <div key={i} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-400">
                                   <span>{item.label}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                   <div className="flex-1 h-3 bg-zinc-900 rounded-full overflow-hidden">
                                      <div className="h-full bg-blue-500" style={{width: `${item.s1}%`}} />
                                   </div>
                                   <span className="text-[10px] font-mono text-zinc-600">VS</span>
                                   <div className="flex-1 h-3 bg-zinc-900 rounded-full overflow-hidden flex justify-end">
                                      <div className="h-full bg-rose-500" style={{width: `${item.s2}%`}} />
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                       <p className="mt-auto text-zinc-400 italic text-xs leading-relaxed border-t border-zinc-900 pt-6">"{comparison.summary}"</p>
                    </div>
                 </>
               )}
            </div>
          )}

          {/* PATHFINDER MODE */}
          {activeTab === 'pathfinder' && (
            <div className="bento-grid animate-in fade-in slide-in-from-right-8 duration-500">
               <div className="md:col-span-2 premium-card min-h-0 flex-row items-center gap-6 p-6">
                  <Search className="text-zinc-600 ml-2" size={24} />
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
                          <h2 className="text-[5rem] md:text-[8rem] font-black italic uppercase leading-[0.8] tracking-tighter text-white">{analysis.ticker}</h2>
                          <p className="text-zinc-500 font-mono tracking-widest mt-4 uppercase">{analysis.name}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs mb-2">Node Health</p>
                          <div className="text-6xl font-black text-emerald-500">{(analysis.health * 100).toFixed(0)}%</div>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <div className="p-8 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                          <Network className="text-blue-500 mb-6" size={28} />
                          <p className="text-lg italic text-zinc-300 leading-relaxed">"{analysis.description}"</p>
                       </div>
                       <div className="space-y-4">
                          <div className="p-6 bg-[#0c0c0e] border border-zinc-800 rounded-xl flex justify-between items-center">
                             <span className="text-[10px] font-bold uppercase text-zinc-500">Short Term Path</span>
                             <span className="text-emerald-400 font-bold italic text-sm">{analysis.pathways.short}</span>
                          </div>
                          <div className="p-6 bg-[#0c0c0e] border border-zinc-800 rounded-xl flex justify-between items-center">
                             <span className="text-[10px] font-bold uppercase text-zinc-500">Long Term Path</span>
                             <span className="text-blue-400 font-bold italic text-sm">{analysis.pathways.long}</span>
                          </div>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="md:col-span-2 h-[400px] flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-zinc-800 rounded-[2rem]">
                    <Target size={64} className="mb-4" />
                    <p className="font-black italic uppercase tracking-widest text-zinc-500">Awaiting Target Vector</p>
                 </div>
               )}
            </div>
          )}

          {/* PULSE MODE */}
          {activeTab === 'pulse' && (
             <div className="max-w-4xl mx-auto p-8 space-y-6 animate-in fade-in">
                <h2 className="massive-title text-center mb-12">LOGIC PULSE</h2>
                {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="premium-card min-h-0 flex-row items-center justify-between p-6 hover:bg-zinc-900/80 cursor-pointer">
                      <div className="flex items-center gap-6">
                         <span className="font-mono text-zinc-600 text-xs">10:4{i} AM</span>
                         <div>
                            <h4 className="font-bold text-zinc-200">Global Semiconductor Logic Gate Adjusted</h4>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Impact: Moderate // Sector: Tech</p>
                         </div>
                      </div>
                      <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-[9px] font-bold uppercase">Stable</div>
                   </div>
                ))}
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
