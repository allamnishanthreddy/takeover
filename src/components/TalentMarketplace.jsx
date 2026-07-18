import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, UserPlus, CheckCircle2, Sparkles, Briefcase } from 'lucide-react';

// Skills the company currently needs — compatibility scores are derived from
// overlap with these plus experience, and the basis is always shown.
const COMPANY_NEEDS = ['React', 'Tailwind', 'Node.js', 'Python', 'Data Analysis', 'CRM Strategy', 'UI Design'];

const CANDIDATES = [
  { id: 'c-1', name: 'Priya Sharma', role: 'Frontend Engineering Intern', dept: 'Engineering', years: 1, stipend: '$2,500', skills: ['React', 'Tailwind', 'TypeScript'] },
  { id: 'c-2', name: 'Liam Patel', role: 'Frontend Engineering Intern', dept: 'Engineering', years: 2, stipend: '$2,500', skills: ['React', 'Node.js', 'Tailwind'] },
  { id: 'c-3', name: 'Ananya Rao', role: 'Data Analyst', dept: 'Data', years: 3, stipend: '$3,800', skills: ['Python', 'Data Analysis', 'SQL'] },
  { id: 'c-4', name: 'Marcus Chen', role: 'Backend Engineer', dept: 'Engineering', years: 4, stipend: '$5,200', skills: ['Node.js', 'Python', 'PostgreSQL'] },
  { id: 'c-5', name: 'Sofia Almeida', role: 'Product Designer', dept: 'Design', years: 3, stipend: '$4,100', skills: ['UI Design', 'Figma', 'Prototyping'] },
  { id: 'c-6', name: 'Dev Khanna', role: 'Sales Development Rep', dept: 'Sales', years: 2, stipend: '$3,200', skills: ['CRM Strategy', 'Outreach', 'Negotiation'] }
];

const DEPARTMENTS = ['All', 'Engineering', 'Data', 'Design', 'Sales'];

const scoreCandidate = (candidate) => {
  const matched = candidate.skills.filter((s) => COMPANY_NEEDS.includes(s));
  const score = Math.min(97, 58 + matched.length * 9 + Math.min(candidate.years, 5) * 3);
  const recommendation =
    score >= 85
      ? `Strong hire — ${matched.length} directly needed skill${matched.length === 1 ? '' : 's'} and relevant experience.`
      : score >= 72
      ? `Good fit — covers ${matched.length} current need${matched.length === 1 ? '' : 's'}; some ramp-up expected.`
      : 'Partial fit — consider only if the role pipeline stays open.';
  return { matched, score, recommendation };
};

export default function TalentMarketplace({ isOpen, onClose, employees = [], onHire }) {
  const [query, setQuery] = useState('');
  const [dept, setDept] = useState('All');
  const [justHired, setJustHired] = useState(null);

  if (!isOpen) return null;

  const hiredNames = employees.map((e) => e.name);
  const q = query.toLowerCase().trim();
  const visible = CANDIDATES.filter((c) => {
    if (dept !== 'All' && c.dept !== dept) return false;
    if (!q) return true;
    return `${c.name} ${c.role} ${c.skills.join(' ')}`.toLowerCase().includes(q);
  });

  const handleHire = (candidate, scored) => {
    onHire({
      ...candidate,
      score: scored.score,
      matchedSkills: scored.matched,
      recommendation: scored.recommendation
    });
    setJustHired({ ...candidate, ...scored, joined: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="glass-panel w-full max-w-3xl max-h-[88vh] rounded-2xl p-6 relative overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-3.5 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wider">
              <UserPlus size={16} className="text-brand-purple" />
              AI Talent Marketplace
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
              Compatibility scored against current company needs — every hire is committed to Business Memory
            </p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {justHired ? (
            /* ── New Employee Joined experience ── */
            <motion.div
              key="hired"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-5"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center">
                <CheckCircle2 size={26} className="text-emerald-400" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">New Employee Joined 🎉</h4>
                <p className="text-xs text-zinc-400 mt-1">Committed to Business Memory</p>
              </div>

              <div className="glass-panel rounded-xl p-5 w-full max-w-sm text-left space-y-2.5 text-xs">
                {[
                  ['Name', justHired.name],
                  ['Role', justHired.role],
                  ['Department', justHired.dept],
                  ['Joining Date', justHired.joined],
                  ['Stipend', `${justHired.stipend}/mo`]
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="text-zinc-500 font-mono uppercase text-[9px] tracking-wider">{k}</span>
                    <strong className="text-slate-100">{v}</strong>
                  </div>
                ))}
                <div className="bg-brand-purple/10 border border-brand-purple/20 rounded-lg p-2.5 mt-1">
                  <span className="text-[9px] font-mono uppercase text-brand-purple flex items-center gap-1">
                    <Sparkles size={10} /> AI Summary
                  </span>
                  <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                    {justHired.score}% compatibility — {justHired.recommendation}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setJustHired(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 border border-white/5 hover:bg-slate-800 text-zinc-300 text-xs cursor-pointer"
              >
                Back to Marketplace
              </button>
            </motion.div>
          ) : (
            /* ── Browse experience ── */
            <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col min-h-0">
              {/* Search + filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex items-center flex-1">
                  <Search size={13} className="absolute left-3 text-zinc-500" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, role or skill…"
                    className="w-full bg-slate-950 border border-white/10 focus:border-brand-purple focus:outline-none pl-9 pr-3 py-2 rounded-lg text-xs text-slate-100 placeholder-zinc-600"
                  />
                </div>
                <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-white/5">
                  {DEPARTMENTS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDept(d)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-mono cursor-pointer transition-all ${
                        dept === d ? 'bg-brand-purple text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Candidate grid */}
              <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-2 gap-3 pr-1 content-start">
                {visible.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-zinc-500 text-xs">No candidates match that search.</div>
                ) : (
                  visible.map((c) => {
                    const scored = scoreCandidate(c);
                    const alreadyHired = hiredNames.includes(c.name);
                    return (
                      <div key={c.id} className="bg-slate-950/60 border border-white/5 hover:border-brand-purple/25 rounded-xl p-4 transition-all flex flex-col gap-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-purple/40 to-brand-blue/40 border border-white/10 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                              {c.name.split(' ').map((w) => w[0]).join('')}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-semibold text-slate-100 truncate">{c.name}</h4>
                              <p className="text-[10px] text-zinc-500 font-mono truncate">{c.role}</p>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono text-zinc-500 bg-slate-900 border border-white/5 px-1.5 py-0.5 rounded flex items-center gap-1 flex-shrink-0">
                            <Briefcase size={9} /> {c.dept}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {c.skills.map((s) => (
                            <span
                              key={s}
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                                scored.matched.includes(s)
                                  ? 'bg-brand-cyan/10 border-brand-cyan/30 text-brand-cyan'
                                  : 'bg-slate-900 border-white/5 text-zinc-500'
                              }`}
                            >
                              {s}
                            </span>
                          ))}
                          <span className="text-[9px] font-mono px-1.5 py-0.5 text-zinc-600">· {c.years} yr{c.years === 1 ? '' : 's'} exp</span>
                        </div>

                        {/* Derived compatibility score with its basis */}
                        <div>
                          <div className="flex justify-between text-[9px] font-mono mb-1">
                            <span className="text-zinc-500">AI COMPATIBILITY — matches {scored.matched.length}/{COMPANY_NEEDS.length} needed skills</span>
                            <strong className={scored.score >= 85 ? 'text-emerald-400' : scored.score >= 72 ? 'text-brand-cyan' : 'text-amber-500'}>
                              {scored.score}%
                            </strong>
                          </div>
                          <div className="w-full bg-slate-900 border border-white/5 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${scored.score >= 85 ? 'bg-emerald-400' : scored.score >= 72 ? 'bg-brand-cyan' : 'bg-amber-500'}`}
                              style={{ width: `${scored.score}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-zinc-400 italic mt-1.5 leading-snug">“{scored.recommendation}”</p>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-1">
                          <span className="text-[10px] font-mono text-zinc-500">{c.stipend}/mo</span>
                          {alreadyHired ? (
                            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 size={11} /> Hired
                            </span>
                          ) : (
                            <button
                              onClick={() => handleHire(c, scored)}
                              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-purple to-brand-blue text-white text-[10px] font-semibold cursor-pointer shadow-md transition-all"
                            >
                              Hire Candidate
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
