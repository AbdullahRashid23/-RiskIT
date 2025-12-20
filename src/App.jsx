import React, { useState } from 'react';
import { 
  LayoutDashboard, Scale, Target, Radio, 
  Menu, X, ArrowRight, Layers, RefreshCw, 
  Activity, Trophy, Search, Network, Zap,
  ShieldCheck, TrendingUp, BarChart3, Clock, Globe
} from 'lucide-react';
import './index.css';

// --- SUB-COMPONENTS (For Clean Code) ---

const Sparkline = ({ data }) => {
  const points = data.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - val}`).join(" L ");
  return (
    <div className="w-20 h-8 relative opacity-50 group-hover:opacity-100 transition-opacity">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <path d={`M ${points}`} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const NodeRow = ({ ticker, name, trend }) => (
  <div className="group flex items-center justify-between p-4 bg-[#0c0c0e] border border-zinc-800 rounded-xl hover:border-emerald-500/30 transition-all cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center font-black italic text-zinc-600 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-colors">
        {ticker[0]}
      </div>
      <div>
        <h4 className="font-black italic text-lg text-zinc-300 group-hover:text-white transition-colors tracking-tight">{ticker}</h4>
        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">{name}</p>
      </div>
    </div>
    <Sparkline data={trend} />
  </div>
);

const NavLink = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all group relative overflow-hidden ${
      active ? 'bg-zinc-900 text-white shadow-inner' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
    }`}
  >
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-emerald-500 rounded-r-full" />}
    <Icon size={18} className={active ? "text-emerald-500" : "group-hover:scale-110 transition-transform"} />
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

// --- MAIN APP ---

export default function App() {
  const [activeTab, setActiveTab] = useState('architect');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // States
  const [recInputs, setRecInputs] = useState({ amount: '10000', market: 'US Tech', horizon: 'Long Term', halal: true });
  const [compInputs, setCompInputs] = useState({ s1: '', s2: '' });
  const [anaInput, setAnaInput] = useState('');
  
  const [recommendations, setRecommendations] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  // --- LOGIC HANDLERS ---
  const handleArchitect = () => {
    setLoading(true);
    setTimeout(() => {
      setRecommendations({
        strategy: "Halal-Compliant US Tech Growth. Focuses on large-cap technology companies with strong competitive moats.",
        nodes: [
          { ticker: 'MSFT', name: 'Microsoft Corp', trend: [30, 45, 40, 60, 55, 75, 80] },
          { ticker: 'AVGO', name: 'Broadcom Inc', trend: [20, 25, 30, 45, 40, 60, 70] },
          { ticker: 'ADBE', name: 'Adobe Systems', trend: [40, 35, 50, 45, 60, 65, 80] }
        ]
      });
      setLoading(false);
    }, 1200);
  };

  const handleComparator = () => {
    if (!compInputs.s1 || !compInputs.s2) return;
    setLoading(true);
    setTimeout(() => {
      setComparison({
        winner: compInputs.s1,
        decision: `BUY ${compInputs.s1}`,
        summary: `superior Free Cash Flow Yield (4.2%) vs ${compInputs.s2} (1.8%), confirming stronger liquidity.`,
        scorecard: [
          { label: "Volatility", s1: 85, s2: 40 },
          { label: "Growth", s1: 75, s2: 60 },
          { label: "Sharia Compl.", s1: 95, s2: 30 }
        ]
      });
      setLoading(false);
    }, 1200);
  };

  const handlePathfinder = () => {
    if (!anaInput) return;
    setLoading(true);
    setTimeout(() => {
      setAnalysis({
        ticker: anaInput,
        name: "ENTERPRISE NODE",
        health: 0.98,
        desc: "Critical infrastructure node showing strong bullish divergence. Logic gate status: OPEN.",
        short: "Bullish Continuation",
        long: "Structural Hold"
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="flex h-screen overflow-hidden selection:bg-emerald-500/30 selection:text-white">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#020202] border-r border-white/5 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 pl-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-black italic shadow-[0_0_20px_rgba(255,255,255,0.2)]">!</div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white">RiskIT</h1>
          </div>
          
          <nav className="space-y-2">
            <NavLink icon={LayoutDashboard} label="Architect" active={activeTab === 'architect'} onClick={() => {setActiveTab('architect'); setIsSidebarOpen(false)}} />
            <NavLink icon={Scale} label="Comparator" active={activeTab === 'comparator'} onClick={() => {setActiveTab('comparator'); setIsSidebarOpen(false)}} />
            <NavLink icon={Target} label="Pathfinder" active={activeTab === 'pathfinder'} onClick={() => {setActiveTab('pathfinder'); setIsSidebarOpen(false)}} />
            <NavLink icon={Radio} label="Pulse" active={activeTab === 'pulse'} onClick={() => {setActiveTab('pulse'); setIsSidebarOpen(false)}} />
          </nav>
        </div>

        {/* --- ENGINEERING CREDITS --- */}
        <div className="mt-auto p-6 border-t border-white/5 bg-[#050505]">
          <div className="mb-6 opacity-60 hover:opacity-100 transition-opacity">
             <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Engineering Team</p>
             <div className="space-y-1.5 font-mono text-[10px] text-zinc-400">
               <div className="flex items-center gap-2"><div className="w-1 h-1 bg-zinc-700 rounded-full"/> Abdullah Rashid</div>
               <div className="flex items-center gap-2"><div className="w-1 h-1 bg-zinc-700 rounded-full"/> Moawiz</div>
               <div className="flex items-center gap-2"><div className="w-1 h-1 bg-zinc-700 rounded-full"/> Muhammad Abdullah</div>
             </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900 rounded-lg border border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">System Online</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full relative bg-[#020202]">
        
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#020202]/90 backdrop-blur-md z-40 sticky top-0">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsSidebarOpen(true)} className="text-zinc-400 hover:text-white"><Menu size={20}/></button>
             <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500">{activeTab}</span>
          </div>
          {loading && <RefreshCw size={16} className="text-emerald-500 animate-spin" />}
        </header>

        <div className="flex-1 overflow-y-auto custom-scroll p-4 md:p-8">
          
          {/* =======================================================
              1. ARCHITECT MODE
             ======================================================= */}
          {activeTab === 'architect' && (
            <div className="bento-grid animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* INPUT CARD */}
              <div className="glass-card">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12"><Layers size={180}/></div>
                <h2 className="title-fluid mb-8 relative z-10">ARCHITECT</h2>
                
                <div className="space-y-6 relative z-10">
                  <div>
                    <label className="field-label flex items-center gap-2"><TrendingUp size={12}/> Investment Capacity</label>
                    <input type="number" className="field-input" value={recInputs.amount} onChange={e => setRecInputs({...recInputs, amount: e.target.value})} />
                  </div>
                  <div>
                    <label className="field-label flex items-center gap-2"><Globe size={12}/> Node Universe</label>
                    <input type="text" className="field-input" value={recInputs.market} onChange={e => setRecInputs({...recInputs, market: e.target.value})} />
                  </div>
                  <div>
                    <label className="field-label flex items-center gap-2"><Clock size={12}/> Time Horizon</label>
                    <div className="relative">
                       <select className="field-input cursor-pointer" value={recInputs.horizon} onChange={e => setRecInputs({...recInputs, horizon: e.target.value})}>
                         <option>Short Term</option>
                         <option>Medium Term</option>
                         <option>Long Term</option>
                       </select>
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">▼</div>
                    </div>
                  </div>
                  
                  {/* Halal Toggle */}
                  <div className="flex items-center justify-between p-4 bg-[#050505] border border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-700 transition-colors group" onClick={() => setRecInputs({...recInputs, halal: !recInputs.halal})}>
                     <div>
                       <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Ethical Gate</label>
                       <div className="flex items-center gap-2">
                         <ShieldCheck size={14} className={recInputs.halal ? "text-emerald-500" : "text-zinc-600"}/>
                         <span className={`text-xs font-bold ${recInputs.halal ? "text-white" : "text-zinc-500"}`}>Sharia / Halal Filter</span>
                       </div>
                     </div>
                     <div className={`w-12 h-6 rounded-full relative transition-all duration-300 border border-white/5 ${recInputs.halal ? 'bg-emerald-900/40' : 'bg-zinc-900'}`}>
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all duration-300 ${recInputs.halal ? 'left-6 bg-emerald-500 shadow-[0_0_12px_#10b981]' : 'left-0.5 bg-zinc-600'}`} />
                     </div>
                  </div>
                </div>

                <div className="mt-12">
                   <button onClick={handleArchitect} disabled={loading} className="btn-primary group">
                     <span>{loading ? 'Synthesizing...' : 'Initialize Nodes'}</span>
                     <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                   </button>
                </div>
              </div>

              {/* OUTPUT CARD */}
              <div className="glass-card bg-[#050505]/60">
                <div className="flex justify-between items-start mb-6">
                  <span className="badge-glass text-blue-400 border-blue-500/20 bg-blue-500/5">Strategy Inferred</span>
                  {recommendations && <span className="text-[9px] font-mono text-emerald-500 uppercase animate-pulse">Live Feed</span>}
                </div>
                
                <p className="text-lg text-zinc-300 font-medium italic leading-relaxed mb-8 min-h-[80px]">
                  "{recommendations ? recommendations.strategy : "System Standby. Awaiting architecture parameters to synthesize financial node path..."}"
                </p>

                {recommendations ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
                    {recommendations.nodes.map((node, i) => <NodeRow key={i} {...node} />)}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl opacity-30">
                     <BarChart3 size={48} className="mb-4 text-zinc-500"/>
                     <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">No Nodes Selected</p>
                  </div>
                )}
                
                <div className="mt-auto pt-6 border-t border-white/5 flex justify-between text-zinc-600">
                   <span className="text-[9px] font-black uppercase tracking-widest">Selected Node Set</span>
                   <span className="text-[9px] font-black uppercase tracking-widest hover:text-white cursor-pointer transition-colors">Node Brief ↗</span>
                </div>
              </div>

              {/* STABILITY CARD */}
              <div className="glass-card border-emerald-500/10 relative overflow-hidden">
                 <div className="flex justify-between items-start z-10 relative">
                   <span className="field-label text-emerald-500 ml-0">Logic Stability</span>
                   <RefreshCw size={16} className={`text-emerald-500 ${loading ? 'animate-spin' : ''}`} />
                 </div>
                 
                 <div className="flex-1 flex items-center relative z-10">
                    <h2 className={`title-fluid w-full transition-all duration-700 ${recommendations ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 scale-100' : 'text-zinc-800 scale-95 blur-sm'}`}>
                      {recommendations ? "RESILIENT" : "IDLE"}
                    </h2>
                 </div>

                 <div className="mt-auto flex items-center gap-3 z-10 relative">
                    <div className={`w-2 h-2 rounded-full ${recommendations ? 'bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]' : 'bg-zinc-800'}`} />
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Binary State: {recommendations ? 'Confirmed' : 'Waiting'}</p>
                 </div>
              </div>
            </div>
          )}

          {/* =======================================================
              2. COMPARATOR MODE
             ======================================================= */}
          {activeTab === 'comparator' && (
            <div className="bento-grid animate-in zoom-in-95 duration-500">
               {/* Header Banner */}
               <div className="md:col-span-2 glass-card items-center text-center py-12 min-h-[250px] justify-center">
                  <h2 className="title-fluid mb-4 text-[4rem]">COMPARATOR</h2>
                  <p className="text-zinc-500 italic font-medium max-w-lg">
                    Head-to-head logical elimination protocol. Input two distinct node identifiers to determine dominance.
                  </p>
               </div>

               {/* Inputs */}
               <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card py-10">
                     <label className="field-label text-center w-full">Node Alpha</label>
                     <input 
                       className="w-full bg-transparent border-b border-zinc-800 py-4 text-center text-4xl font-black italic uppercase text-white placeholder:text-zinc-800 focus:outline-none focus:border-emerald-500 transition-colors" 
                       placeholder="TICKER A" 
                       value={compInputs.s1} 
                       onChange={e => setCompInputs({...compInputs, s1: e.target.value.toUpperCase()})}
                     />
                  </div>
                  <div className="glass-card py-10">
                     <label className="field-label text-center w-full">Node Beta</label>
                     <input 
                       className="w-full bg-transparent border-b border-zinc-800 py-4 text-center text-4xl font-black italic uppercase text-white placeholder:text-zinc-800 focus:outline-none focus:border-emerald-500 transition-colors" 
                       placeholder="TICKER B" 
                       value={compInputs.s2} 
                       onChange={e => setCompInputs({...compInputs, s2: e.target.value.toUpperCase()})}
                     />
                  </div>
               </div>
               
               <div className="md:col-span-2">
                 <button onClick={handleComparator} disabled={loading} className="btn-primary justify-center py-6 text-sm">
                   {loading ? 'Auditing Nodes...' : 'Resolve Logic Conflict'}
                 </button>
               </div>

               {comparison && (
                 <>
                   {/* WINNER CARD - High Contrast (Inverted) */}
                   <div className="glass-card bg-white border-white text-black relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 opacity-10 rotate-[-12deg] pointer-events-none"><Trophy size={250} /></div>
                      <div className="relative z-10">
                         <div className="flex items-center gap-3 mb-10">
                            <Trophy size={20} className="text-yellow-600"/>
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Dominant Node</span>
                         </div>
                         <h2 className="text-[6rem] md:text-[8rem] leading-[0.8] font-black italic uppercase tracking-tighter mb-6 text-black">
                           {comparison.winner}
                         </h2>
                         <div className="inline-block px-4 py-2 bg-black/5 border border-black/10 rounded-lg">
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-1">Recommendation</p>
                            <p className="text-xl font-black italic">{comparison.decision}</p>
                         </div>
                      </div>
                   </div>

                   {/* SCORECARD */}
                   <div className="glass-card">
                      <h3 className="field-label mb-8">Logic Scorecard</h3>
                      <div className="space-y-6">
                        {comparison.scorecard.map((s, i) => (
                          <div key={i} className="space-y-2">
                             <div className="flex justify-between text-[9px] font-bold uppercase text-zinc-500">
                               <span>{s.label}</span>
                             </div>
                             <div className="flex items-center gap-4">
                               <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500" style={{width: `${s.s1}%`}}/>
                               </div>
                               <span className="text-[9px] font-mono text-zinc-700">VS</span>
                               <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden flex justify-end">
                                  <div className="h-full bg-rose-500" style={{width: `${s.s2}%`}}/>
                               </div>
                             </div>
                          </div>
                        ))}
                      </div>
                      <p className="mt-auto pt-6 border-t border-white/5 text-xs text-zinc-400 italic">"{comparison.summary}"</p>
                   </div>
                 </>
               )}
            </div>
          )}

          {/* =======================================================
              3. PATHFINDER MODE
             ======================================================= */}
          {activeTab === 'pathfinder' && (
            <div className="bento-grid animate-in fade-in slide-in-from-right-8 duration-500">
               <div className="md:col-span-2 glass-card min-h-0 flex-row items-center gap-6 p-6 border-emerald-500/20 shadow-[0_0_30px_-10px_rgba(16,185,129,0.15)]">
                  <Search className="text-zinc-500 ml-2" size={24} />
                  <input 
                    placeholder="ENTER NODE ID..." 
                    className="flex-1 bg-transparent text-2xl md:text-4xl font-black italic uppercase outline-none placeholder:text-zinc-800 text-white"
                    value={anaInput}
                    onChange={e => setAnaInput(e.target.value.toUpperCase())}
                  />
                  <button onClick={handlePathfinder} className="bg-white text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform">
                    Execute
                  </button>
               </div>

               {analysis ? (
                 <div className="md:col-span-2 glass-card">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-8">
                       <div>
                          <h2 className="title-fluid text-white">{analysis.ticker}</h2>
                          <p className="field-label text-lg mt-4 text-zinc-400">{analysis.name}</p>
                       </div>
                       <div className="text-right p-6 bg-[#0c0c0e] rounded-2xl border border-white/5">
                          <p className="field-label mb-2">Node Health</p>
                          <div className="text-5xl font-black text-emerald-500 shadow-emerald-500/20 drop-shadow-md">
                             {(analysis.health * 100).toFixed(0)}%
                          </div>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="p-8 bg-[#0c0c0e] rounded-2xl border border-white/5">
                          <Network className="text-blue-500 mb-6" size={28} />
                          <p className="text-lg italic text-zinc-300 leading-relaxed">"{analysis.desc}"</p>
                       </div>
                       <div className="space-y-4">
                          <div className="p-6 bg-[#0c0c0e] border border-white/5 rounded-xl flex justify-between items-center">
                             <span className="field-label mb-0">Short Term Path</span>
                             <span className="text-emerald-400 font-bold italic text-sm">{analysis.short}</span>
                          </div>
                          <div className="p-6 bg-[#0c0c0e] border border-white/5 rounded-xl flex justify-between items-center">
                             <span className="field-label mb-0">Long Term Path</span>
                             <span className="text-blue-400 font-bold italic text-sm">{analysis.long}</span>
                          </div>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="md:col-span-2 h-[400px] flex flex-col items-center justify-center opacity-30 border border-dashed border-zinc-700 rounded-[2rem]">
                    <Target size={64} className="mb-4 text-zinc-600" />
                    <p className="title-fluid text-[3rem] text-zinc-700">Awaiting Vector</p>
                 </div>
               )}
            </div>
          )}

          {/* =======================================================
              4. PULSE MODE
             ======================================================= */}
          {activeTab === 'pulse' && (
             <div className="max-w-4xl mx-auto p-4 space-y-4 animate-in fade-in">
                <h2 className="title-fluid text-center mb-10 text-[4rem]">LOGIC PULSE</h2>
                {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="group glass-card min-h-0 flex-row items-center justify-between p-6 hover:bg-zinc-900/80 cursor-pointer border-l-4 border-l-emerald-500">
                      <div className="flex items-center gap-6">
                         <span className="font-mono text-zinc-600 text-xs">10:4{i} AM</span>
                         <div>
                            <h4 className="font-bold text-zinc-300 group-hover:text-white transition-colors">Global Semiconductor Logic Gate Adjusted</h4>
                            <p className="field-label mt-1 text-zinc-500">Impact: Moderate // Sector: Tech</p>
                         </div>
                      </div>
                      <div className="badge-glass bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Stable</div>
                   </div>
                ))}
             </div>
          )}

        </div>
      </main>
    </div>
  );
}
