import React, { useState } from 'react';
import { 
  Activity, 
  ArrowRight, 
  Layers, 
  RefreshCw, 
  TrendingUp, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import './index.css';

// --- MICRO-COMPONENTS ---

// 1. Sparkline for visual data density
const Sparkline = ({ color = "#10b981" }) => (
  <svg width="100" height="30" viewBox="0 0 100 30" fill="none" className="opacity-80">
    <path d="M0 15 L 10 20 L 20 10 L 30 25 L 40 15 L 50 18 L 60 5 L 70 20 L 80 15 L 90 25 L 100 10" 
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 2. The Node Item Row (MSFT, AVGO, etc.)
const NodeItem = ({ ticker, name }) => (
  <div className="group flex items-center justify-between p-5 bg-[#0c0c0e] border border-zinc-800/50 rounded-2xl hover:border-zinc-600 transition-all cursor-default">
    <div>
      <h4 className="font-black italic text-xl text-zinc-200 group-hover:text-white">{ticker}</h4>
      <p className="text-[10px] text-zinc-600 font-mono mt-1 uppercase tracking-wider">{name}</p>
    </div>
    <div className="flex flex-col items-end gap-2">
      <Sparkline />
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
    </div>
  </div>
);

export default function App() {
  // --- STATE MANAGEMENT ---
  const [recInputs, setRecInputs] = useState({ 
    amount: '10000', 
    market: 'US Tech', 
    horizon: 'Long Term', // <--- RESTORED TIME HORIZON
    halal: true 
  });
  
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  // --- LOGIC SIMULATION ---
  const handleInitialize = () => {
    setIsSynthesizing(true);
    // Simulate API delay
    setTimeout(() => {
      setRecommendations({
        strategy: "Halal-Compliant US Tech Growth. Focuses on large-cap technology companies with strong competitive moats, low debt ratios, and clean revenue streams to maximize long-term capital appreciation while strictly adhering to Sharia principles.",
        stability: "RESILIENT",
        nodes: [
          { ticker: 'MSFT', name: 'Microsoft Corp' },
          { ticker: 'AVGO', name: 'Broadcom Inc' },
          { ticker: 'ADBE', name: 'Adobe Systems' },
          { ticker: 'HLAL', name: 'Wahed FTSE USA Sharia' }
        ]
      });
      setIsSynthesizing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER: Mimicking the image exactly */}
      <header className="px-8 py-6 border-b border-zinc-900 bg-[#050505] sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-[1800px] mx-auto w-full">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500">
               Dashboard Mode // Stochastic_Sync
             </span>
          </div>
          {isSynthesizing && <span className="text-[10px] text-blue-500 font-bold animate-pulse">SYNTHESIZING LOGIC...</span>}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="bento-grid">
          
          {/* --- CARD 1: ARCHITECT (INPUTS) --- */}
          <section className="premium-card">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <Layers size={140} />
            </div>

            <h1 className="massive-title mb-10 relative z-10">ARCHITEC<br/>T</h1>
            
            <div className="space-y-8 relative z-10">
              {/* Input 1: Investment Capacity */}
              <div className="input-group">
                <label className="input-label">Investment Capacity</label>
                <input 
                  type="number"
                  className="input-field-dark" 
                  value={recInputs.amount} 
                  onChange={(e) => setRecInputs({...recInputs, amount: e.target.value})}
                />
              </div>

              {/* Input 2: Node Universe */}
              <div className="input-group">
                <label className="input-label">Node Universe</label>
                <input 
                  type="text"
                  className="input-field-dark" 
                  value={recInputs.market} 
                  onChange={(e) => setRecInputs({...recInputs, market: e.target.value})}
                />
              </div>

              {/* Input 3: TIME HORIZON (RESTORED) */}
              <div className="input-group">
                <label className="input-label">Time Horizon</label>
                <select 
                  className="input-field-dark cursor-pointer"
                  value={recInputs.horizon}
                  onChange={(e) => setRecInputs({...recInputs, horizon: e.target.value})}
                >
                  <option>Short Term</option>
                  <option>Medium Term</option>
                  <option>Long Term</option>
                </select>
              </div>

              {/* Input 4: Ethical Gate / Halal Filter */}
              <div className="p-6 bg-[#0c0c0e] border border-zinc-800 rounded-3xl flex items-center justify-between group cursor-pointer" onClick={() => setRecInputs({...recInputs, halal: !recInputs.halal})}>
                <div>
                   <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1 block">Ethical Gate</label>
                   <div className="flex items-center gap-2">
                     <ShieldCheck size={16} className={recInputs.halal ? "text-emerald-500" : "text-zinc-600"} />
                     <span className={`text-sm font-bold ${recInputs.halal ? "text-white" : "text-zinc-500"}`}>Sharia / Halal Filter</span>
                   </div>
                </div>
                {/* The Custom Toggle Switch */}
                <div className={`w-14 h-8 rounded-full relative transition-all duration-300 ${recInputs.halal ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-zinc-800'}`}>
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md ${recInputs.halal ? 'left-7' : 'left-1'}`} />
                </div>
              </div>
            </div>

            {/* Initialize Button */}
            <button 
              onClick={handleInitialize} 
              disabled={isSynthesizing}
              className="btn-initialize group"
            >
              <span>{isSynthesizing ? 'Architecting...' : 'Initialize Nodes'}</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </section>


          {/* --- CARD 2: STRATEGY & NODES (OUTPUT) --- */}
          <section className="premium-card bg-[#09090b]/50">
            <div className="mb-8">
              <span className="glass-badge bg-blue-500/10 text-blue-400 border-blue-500/20">
                Strategy Inferred
              </span>
            </div>

            {/* Dynamic Strategy Text */}
            <p className="text-lg md:text-xl font-medium italic text-zinc-300 leading-relaxed mb-12">
              "{recommendations ? recommendations.strategy : "System Standby. Awaiting architecture parameters to synthesize financial node path..."}"
            </p>

            {/* Node List */}
            {recommendations && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {recommendations.nodes.map((node, i) => (
                  <NodeItem key={i} ticker={node.ticker} name={node.name} />
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="mt-auto pt-8 border-t border-zinc-900 flex justify-between items-center text-zinc-600 text-[10px] tracking-[0.2em] uppercase font-bold">
              <div className="flex items-center gap-2"><Layers size={14}/> Selected Node Set</div>
              <div className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors"><Zap size={14}/> Node Brief</div>
            </div>
          </section>


          {/* --- CARD 3: LOGIC STABILITY --- */}
          <section className="premium-card border-emerald-500/10 relative">
            <div className="flex justify-between items-start mb-auto">
              <span className="text-[10px] text-emerald-500 font-bold tracking-[0.3em] uppercase">Logic Stability</span>
              <RefreshCw className={`text-emerald-500 ${isSynthesizing ? 'animate-spin' : ''}`} size={20} />
            </div>

            <div className="relative py-20">
               {/* Massive Text */}
               <h2 className={`massive-title transition-opacity duration-1000 ${recommendations ? 'text-emerald-500 opacity-90' : 'text-zinc-800 opacity-50'}`}>
                 {recommendations ? "RESI\nLIEN\nT" : "IDLE\nSTATE"}
               </h2>
               
               {/* Decorative Pulse */}
               {recommendations && (
                 <div className="absolute right-0 bottom-10">
                   <Activity className="text-emerald-500 w-20 h-20 opacity-20" />
                 </div>
               )}
            </div>

            <div className="mt-auto flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${recommendations ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`} />
              <p className="text-[10px] text-zinc-500 tracking-[0.2em] uppercase font-bold">
                Binary State: {recommendations ? "Confirmed" : "Waiting"}
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
