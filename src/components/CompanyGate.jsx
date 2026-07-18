import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Building2, User, Mail, Lock } from 'lucide-react';

// Landing + manager login gate. Purely local: only company/manager/email are
// stored (in localStorage) — the password field is never persisted or sent.
export default function CompanyGate({ onEnter }) {
  const [step, setStep] = useState('landing');
  const [company, setCompany] = useState('Nexus Ventures Pvt Ltd');
  const [manager, setManager] = useState('Nishanth');
  const [email, setEmail] = useState('manager@nexusventures.com');
  const [password, setPassword] = useState('');
  const [playVoice, setPlayVoice] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company.trim() || !manager.trim() || !email.trim()) return;
    onEnter({ company: company.trim(), manager: manager.trim(), email: email.trim() }, playVoice);
  };

  return (
    <div className="min-h-screen bg-slate-950 dot-grid text-slate-100 flex items-center justify-center relative overflow-hidden p-4">
      {/* Ambient brand glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[400px] bg-gradient-to-br from-brand-purple/15 to-brand-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-brand-cyan/10 rounded-full blur-3xl" />

      <AnimatePresence mode="wait">
        {step === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 max-w-xl text-center space-y-8"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-blue shadow-2xl shadow-brand-purple/30">
                <Sparkles size={30} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Nexus MemoryOS</h1>
                <p className="text-sm font-mono text-brand-cyan mt-2 uppercase tracking-widest">The OS that remembers</p>
              </div>
            </div>

            <p className="text-base text-zinc-400 leading-relaxed max-w-md mx-auto">
              The AI Business Operating System that remembers every decision —
              and the reason behind it.
            </p>

            <div className="grid grid-cols-3 gap-3 text-left">
              {[
                { title: 'Decision Ledger', desc: 'Every action recorded with its why' },
                { title: 'AI Reasoning', desc: 'Watch agents think before they act' },
                { title: 'Total Recall', desc: 'The OS never asks the same question twice' }
              ].map((f) => (
                <div key={f.title} className="glass-panel rounded-xl p-4">
                  <span className="text-brand-purple text-xs">◆</span>
                  <h3 className="text-xs font-semibold text-slate-100 mt-1.5">{f.title}</h3>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-snug">{f.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep('login')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white text-sm font-semibold shadow-xl shadow-brand-purple/20 cursor-pointer transition-all"
            >
              Manager Login <ArrowRight size={15} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 w-full max-w-md"
          >
            <div className="glass-panel rounded-2xl p-8 space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-blue shadow-lg mb-3">
                  <Sparkles size={22} className="text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">Welcome back</h2>
                <p className="text-xs text-zinc-500 mt-1">Sign in to your company workspace</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {[
                  { label: 'Company Name', icon: Building2, value: company, set: setCompany, type: 'text', placeholder: 'e.g. Nexus Ventures Pvt Ltd' },
                  { label: 'Manager Name', icon: User, value: manager, set: setManager, type: 'text', placeholder: 'e.g. Nishanth' },
                  { label: 'Email', icon: Mail, value: email, set: setEmail, type: 'email', placeholder: 'you@company.com' }
                ].map((f) => {
                  const FieldIcon = f.icon;
                  return (
                    <div key={f.label}>
                      <label className="text-zinc-400 block mb-1.5 font-mono uppercase text-[9px] tracking-wider">{f.label}</label>
                      <div className="relative flex items-center">
                        <FieldIcon size={13} className="absolute left-3 text-zinc-500" />
                        <input
                          type={f.type}
                          required
                          value={f.value}
                          onChange={(e) => f.set(e.target.value)}
                          placeholder={f.placeholder}
                          className="w-full bg-slate-950 border border-white/10 focus:border-brand-purple focus:outline-none pl-9 pr-3 py-2.5 rounded-lg text-slate-100 placeholder-zinc-600"
                        />
                      </div>
                    </div>
                  );
                })}

                <div>
                  <label className="text-zinc-400 block mb-1.5 font-mono uppercase text-[9px] tracking-wider">Password</label>
                  <div className="relative flex items-center">
                    <Lock size={13} className="absolute left-3 text-zinc-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="off"
                      className="w-full bg-slate-950 border border-white/10 focus:border-brand-purple focus:outline-none pl-9 pr-3 py-2.5 rounded-lg text-slate-100 placeholder-zinc-600"
                    />
                  </div>
                  <p className="text-[9px] text-zinc-600 mt-1.5 font-mono">Demo build — credentials are never stored or transmitted.</p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-400 pt-1">
                  <input
                    type="checkbox"
                    checked={playVoice}
                    onChange={(e) => setPlayVoice(e.target.checked)}
                    className="accent-purple-500"
                  />
                  <span className="text-[11px]">🔊 Play AI voice introduction</span>
                </label>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white text-sm font-semibold shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  Enter Dashboard <ArrowRight size={14} />
                </button>
              </form>
            </div>

            <button
              onClick={() => setStep('landing')}
              className="w-full text-center text-[11px] text-zinc-500 hover:text-zinc-300 mt-4 cursor-pointer"
            >
              ← Back
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
