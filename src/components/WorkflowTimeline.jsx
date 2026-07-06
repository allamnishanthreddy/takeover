import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Loader2, Play } from 'lucide-react';

export default function WorkflowTimeline({ steps = [], activeStepIndex = -1, isRunning = false, statusText = "" }) {
  if (steps.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-white/5 h-full flex flex-col items-center justify-center text-center text-zinc-500 min-h-[300px]">
        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-3">
          <Play size={18} className="text-zinc-400" />
        </div>
        <p className="text-sm font-semibold text-zinc-400">Awaiting Command</p>
        <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">
          Enter a prompt in the command center to trigger autonomous workflows.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 h-full flex flex-col justify-between min-h-[400px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {isRunning && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-purple opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isRunning ? 'bg-brand-purple' : 'bg-green-500'}`}></span>
            </span>
            Live Workflow Timeline
          </h3>
          <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded border border-white/5 text-zinc-400">
            {isRunning ? 'EXECUTION IN PROGRESS' : 'IDLE / COMPLETE'}
          </span>
        </div>

        {/* Status Alert Banner */}
        {statusText && (
          <div className="mb-4 text-xs font-mono bg-slate-950/60 text-brand-cyan border border-brand-cyan/20 p-2.5 rounded-lg flex items-center gap-2">
            <Loader2 className="animate-spin text-brand-cyan flex-shrink-0" size={12} />
            <span>{statusText}</span>
          </div>
        )}

        {/* Step List Container */}
        <div className="relative pl-6 space-y-4 py-2">
          {/* Vertical linking line */}
          <div className="absolute left-2.5 top-5 bottom-5 w-[2px] bg-slate-800" />

          {/* Animated progress overlay line */}
          {steps.length > 1 && (
            <motion.div
              className="absolute left-2.5 top-5 w-[2px] bg-gradient-to-b from-brand-cyan via-brand-purple to-purple-800"
              initial={{ height: 0 }}
              animate={{
                height: `${Math.max(0, (activeStepIndex / (steps.length - 1)) * 90)}%`
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          )}

          {steps.map((step, idx) => {
            const isCompleted = idx < activeStepIndex;
            const isActive = idx === activeStepIndex;
            const isPending = idx > activeStepIndex;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="relative flex gap-4 items-start"
              >
                {/* Visual Node */}
                <div className="absolute -left-5 mt-1 bg-slate-950 rounded-full p-0.5 z-10">
                  {isCompleted ? (
                    <CheckCircle2 size={16} className="text-emerald-400 fill-emerald-400/10" />
                  ) : isActive ? (
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-full bg-brand-cyan/35 animate-ping" />
                      <Loader2 size={16} className="text-brand-cyan animate-spin relative" />
                    </div>
                  ) : (
                    <Circle size={16} className="text-zinc-600" />
                  )}
                </div>

                {/* Step Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold ${
                        isActive
                          ? 'text-brand-cyan font-bold'
                          : isCompleted
                          ? 'text-zinc-400 line-through decoration-white/10'
                          : 'text-zinc-500'
                      }`}
                    >
                      {step.title}
                    </span>
                    {step.agent && (
                      <span
                        className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                          isActive
                            ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                            : isCompleted
                            ? 'bg-zinc-800/40 border-zinc-700/20 text-zinc-500'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                        }`}
                      >
                        {step.agent} Agent
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[11px] mt-0.5 leading-snug truncate ${
                      isActive ? 'text-zinc-200' : 'text-zinc-500'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
