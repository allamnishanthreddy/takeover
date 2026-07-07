import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, DollarSign, TrendingUp, BookOpen, AlertCircle } from 'lucide-react';

const AGENTS = [
  {
    id: 'ceo',
    name: 'CEO Agent',
    role: 'Strategy & Insights',
    desc: 'Business intelligence, KPI tracking, and cross-agent orchestrations.',
    icon: Briefcase,
    color: 'from-blue-500 to-indigo-600',
    glowColor: 'rgba(59, 130, 246, 0.4)',
  },
  {
    id: 'hr',
    name: 'HR Agent',
    role: 'Talent & Culture',
    desc: 'Manages candidate recruiting, onboarding workflows, leave tracking, and payroll.',
    icon: Users,
    color: 'from-pink-500 to-purple-600',
    glowColor: 'rgba(236, 72, 153, 0.4)',
  },
  {
    id: 'finance',
    name: 'Finance Agent',
    role: 'Financial Operations',
    desc: 'Creates invoices, budgets, expense reports, and processes quotations.',
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-600',
    glowColor: 'rgba(16, 185, 129, 0.4)',
  },
  {
    id: 'sales',
    name: 'Sales Agent',
    role: 'CRM & Client Success',
    desc: 'Maintains client relationships, schedules outreach meetings, and updates pipelines.',
    icon: TrendingUp,
    color: 'from-amber-500 to-orange-600',
    glowColor: 'rgba(245, 158, 11, 0.4)',
  },
  {
    id: 'knowledge',
    name: 'Knowledge Agent',
    role: 'Company Knowledge Base',
    desc: 'Answers policy inquiries, digests documentation, and indexes regulations.',
    icon: BookOpen,
    color: 'from-cyan-500 to-blue-600',
    glowColor: 'rgba(6, 182, 212, 0.4)',
  }
];

export default function AgentGrid({ activeAgents = [], pendingMemoryAction = null }) {
  const getAgentStatus = (agentId, isActive) => {
    // Intercept if Sales Agent is awaiting human confirmation/approval
    if (agentId === 'sales' && pendingMemoryAction) {
      return {
        label: 'Waiting Approval',
        color: 'bg-red-500 animate-ping',
        bgClass: 'bg-red-500/10 border-red-500/25',
        textClass: 'text-red-400 font-bold'
      };
    }

    if (!isActive) {
      switch (agentId) {
        case 'ceo':
          return { label: 'Monitoring Business', color: 'bg-emerald-500', bgClass: 'bg-emerald-500/10 border-emerald-500/20', textClass: 'text-emerald-400 font-bold' };
        case 'hr':
          return { label: 'Roster In Sync', color: 'bg-emerald-500', bgClass: 'bg-emerald-500/10 border-emerald-500/20', textClass: 'text-emerald-400 font-bold' };
        case 'finance':
          return { label: 'Ledger Closed', color: 'bg-emerald-500', bgClass: 'bg-emerald-500/10 border-emerald-500/20', textClass: 'text-emerald-400 font-bold' };
        case 'sales':
          return { label: 'CRM Connected', color: 'bg-emerald-500', bgClass: 'bg-emerald-500/10 border-emerald-500/20', textClass: 'text-emerald-400 font-bold' };
        case 'knowledge':
          return { label: 'System Indexed', color: 'bg-emerald-500', bgClass: 'bg-emerald-500/10 border-emerald-500/20', textClass: 'text-emerald-400 font-bold' };
        default:
          return { label: 'Idle', color: 'bg-zinc-500', bgClass: 'bg-zinc-500/10 border-zinc-500/20', textClass: 'text-zinc-500' };
      }
    } else {
      switch (agentId) {
        case 'ceo':
          return { label: 'Coordinating Chain', color: 'bg-brand-purple animate-pulse', bgClass: 'bg-brand-purple/10 border-brand-purple/20', textClass: 'text-brand-purple font-bold' };
        case 'hr':
          return { label: 'Onboarding Candidate', color: 'bg-amber-500 animate-pulse', bgClass: 'bg-amber-500/10 border-amber-500/20', textClass: 'text-amber-500 font-bold' };
        case 'finance':
          return { label: 'Compiling Invoices', color: 'bg-amber-500 animate-pulse', bgClass: 'bg-amber-500/10 border-amber-500/20', textClass: 'text-amber-500 font-bold' };
        case 'sales':
          return { label: 'Syncing CRM Leads', color: 'bg-blue-500 animate-pulse', bgClass: 'bg-blue-500/10 border-blue-500/20', textClass: 'text-blue-400 font-bold' };
        case 'knowledge':
          return { label: 'Querying Database', color: 'bg-cyan-500 animate-pulse', bgClass: 'bg-cyan-500/10 border-cyan-500/20', textClass: 'text-brand-cyan font-bold' };
        default:
          return { label: 'Processing', color: 'bg-brand-purple animate-pulse', bgClass: 'bg-brand-purple/10 border-brand-purple/20', textClass: 'text-brand-purple font-bold' };
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {AGENTS.map((agent) => {
        const IconComponent = agent.icon;
        const isActive = activeAgents.includes(agent.id);
        const statusInfo = getAgentStatus(agent.id, isActive);

        return (
          <motion.div
            key={agent.id}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[190px] ${
              isActive
                ? 'bg-slate-900/90 border-brand-purple active-glow scale-102 z-10'
                : 'glass-panel border-white/5 opacity-80 hover:opacity-100'
            }`}
            style={{
              boxShadow: isActive ? `0 0 30px ${agent.glowColor}` : 'none'
            }}
          >
            {/* Glowing background blob when active */}
            {isActive && (
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.15, 0.25, 0.15]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`absolute -top-10 -left-10 w-24 h-24 bg-gradient-to-br ${agent.color} rounded-full blur-2xl -z-10`}
              />
            )}

            <div>
              {/* Header: Icon & Status badge */}
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${agent.color} text-white shadow-lg`}>
                  <IconComponent size={18} className={isActive ? 'animate-bounce' : ''} />
                </div>
                
                {/* Dynamic Status Badge */}
                <span className={`flex items-center gap-1.5 text-[9px] font-mono uppercase bg-slate-950/80 px-2 py-1 rounded-lg border ${statusInfo.bgClass}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.color}`} />
                  <span className={statusInfo.textClass}>{statusInfo.label}</span>
                </span>
              </div>

              {/* Identity */}
              <h3 className="text-sm font-semibold text-slate-100 tracking-wide">
                {agent.name}
              </h3>
              <p className="text-[10px] font-mono text-cyan-400/80 mb-2">
                {agent.role}
              </p>
              
              {/* Description */}
              <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                {agent.desc}
              </p>
            </div>

            {/* Bottom active state label */}
            {isActive && (
              <div className="mt-3 text-[10px] font-mono text-brand-cyan/90 bg-brand-cyan/5 border border-brand-cyan/20 rounded p-1.5 flex items-center gap-1 animate-pulse">
                <AlertCircle size={10} />
                Analyzing execution tree...
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
