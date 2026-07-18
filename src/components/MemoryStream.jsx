import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';

// Agent badge colors matching the activity log's existing category palette
const AGENT_BADGES = {
  ceo: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  hr: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
  finance: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  sales: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  knowledge: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
};

const formatTimestamp = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const now = new Date();
  const time = d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  if (d.toDateString() === now.toDateString()) return `Today · ${time}`;
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${time}`;
};

export default function MemoryStream({ memories = [], onOpenMemory, onOpenBrowser, recalledIds = [] }) {
  return (
    <section className="glass-panel-glow-purple rounded-2xl p-5">
      {/* Band header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <span className="text-brand-purple">◆</span>
            Memory Stream
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">Every decision this business remembers — and why.</p>
        </div>
        <button
          onClick={onOpenBrowser}
          className="text-[10px] font-mono bg-slate-900 border border-white/5 hover:border-brand-purple/40 hover:bg-slate-800 text-zinc-300 hover:text-white px-2.5 py-1.5 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-1"
          title="Browse the full Business Memory"
        >
          <span className="text-brand-purple font-bold">{memories.length}</span>
          <span>remembered</span>
          <ChevronRight size={10} />
        </button>
      </div>

      {memories.length === 0 ? (
        // Honest empty state: the ledger starts empty and fills with real decisions
        <div className="flex flex-col items-center justify-center text-center py-8 text-zinc-500">
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center mb-3">
            <Sparkles size={16} className="text-brand-purple" />
          </div>
          <p className="text-xs font-semibold text-zinc-400">No decisions in memory yet</p>
          <p className="text-[11px] text-zinc-500 mt-1 max-w-[320px] leading-relaxed">
            Run your first command — every decision Nexus makes is recorded here with its reasoning.
          </p>
        </div>
      ) : (
        <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pb-1">
          {/* NOW marker: the seam between the present and the remembered past */}
          <div className="flex flex-col items-center justify-center flex-shrink-0 px-1.5 border-r border-white/5 pr-3">
            <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
            <span className="text-[9px] font-mono text-brand-purple uppercase tracking-widest mt-1.5">Now</span>
          </div>

          {memories.map((entry) => {
            const isRecalled = recalledIds.includes(entry.id);
            return (
            <motion.button
              key={entry.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              onClick={() => onOpenMemory(entry)}
              className={`w-[240px] flex-shrink-0 text-left border rounded-xl p-3.5 cursor-pointer transition-all flex flex-col gap-1.5 ${
                isRecalled
                  ? 'bg-amber-500/5 border-amber-500/60 shadow-[0_0_18px_rgba(245,158,11,0.18)]'
                  : 'bg-slate-950/60 border-white/5 hover:border-brand-purple/35 hover:bg-slate-950'
              }`}
              title="Reopen this decision"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] ${isRecalled ? 'text-amber-500' : 'text-brand-purple'}`}>◆</span>
                <span className="flex items-center gap-1.5">
                  {isRecalled && (
                    <span className="text-[8px] font-mono uppercase text-amber-500 tracking-wider">Recalled</span>
                  )}
                  <span className={`text-[8px] uppercase font-mono px-1.5 py-0.5 rounded border ${AGENT_BADGES[entry.agent] || 'bg-slate-900 border-white/5 text-zinc-400'}`}>
                    {entry.agent}
                  </span>
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-100 leading-snug line-clamp-2">{entry.title}</span>
              <p className="text-[10px] text-zinc-400 italic leading-snug line-clamp-2">“{entry.why}”</p>
              <span className="text-[9px] font-mono text-zinc-600 mt-auto pt-1">{formatTimestamp(entry.timestamp)}</span>
            </motion.button>
            );
          })}
        </div>
      )}
    </section>
  );
}
