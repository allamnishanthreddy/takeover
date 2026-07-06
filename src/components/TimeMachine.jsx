import React, { useState } from 'react';
import { X, History, Filter, FileText, CheckCircle2, User, Calendar, MessageSquare, ArrowLeft } from 'lucide-react';

export default function TimeMachine({ isOpen, onClose, stats = {}, activities = [], chatHistory = [], meetings = [], documents = {}, onReopenItem }) {
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  if (!isOpen) return null;

  // Compile a comprehensive database array derived from our actual state logs
  const historyItems = [];

  // 1. Map Employees (Hires)
  const baseHires = [
    { name: 'Jonathan Stark', role: 'CEO', date: 'June 1, 2026', id: 'ceo' },
    { name: 'Sarah Connor', role: 'Head of Finance', date: 'June 15, 2026', id: 'finance-head' },
    { name: 'Alex Rivera', role: 'Frontend Intern', date: 'July 6, 2026', id: 'alex' }
  ];
  if (stats.employees >= 14) {
    baseHires.push({ name: 'Liam Patel', role: 'Frontend Intern (v2)', date: 'July 6, 2026', id: 'liam' });
  }

  baseHires.forEach(h => {
    historyItems.push({
      id: `hire-${h.id}`,
      type: 'hire',
      title: `Employee Hired: ${h.name}`,
      subtitle: `Role: ${h.role} | Onboarding Status: Complete`,
      dateText: h.date,
      rawItem: h,
      targetKey: 'offer_letter', // Reopening loads offer letter
      icon: User,
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/20'
    });
  });

  // 2. Map Documents (Invoices, Quotations, Reports)
  if (documents.invoice) {
    historyItems.push({
      id: 'doc-invoice',
      type: 'financial',
      title: `Invoice Generated: ${documents.invoice.invoiceNo}`,
      subtitle: `Client: ${documents.invoice.client} | Total Due: $${documents.invoice.total.toLocaleString()}`,
      dateText: 'July 6, 2026 15:00',
      rawItem: documents.invoice,
      targetKey: 'invoice',
      icon: FileText,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    });
  }

  if (documents.quotation) {
    historyItems.push({
      id: 'doc-quotation',
      type: 'financial',
      title: `Quotation Prepared: ${documents.quotation.quoteNo}`,
      subtitle: `Client: ${documents.quotation.client} | Gross Offer: $${documents.quotation.total.toLocaleString()}`,
      dateText: documents.quotation.date || 'July 6, 2026 15:10',
      rawItem: documents.quotation,
      targetKey: 'quotation',
      icon: FileText,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    });
  }

  if (documents.monthly_report) {
    historyItems.push({
      id: 'doc-report',
      type: 'report',
      title: `Sales Performance Report: ${documents.monthly_report.title}`,
      subtitle: `Revenue Tallies: ${documents.monthly_report.revenue} | Efficiency Utility: ${documents.monthly_report.utility}`,
      dateText: 'July 6, 2026 15:06',
      rawItem: documents.monthly_report,
      targetKey: 'monthly_report',
      icon: FileText,
      color: 'text-brand-purple bg-brand-purple/10 border-brand-purple/20'
    });
  }

  // 3. Map Meetings
  meetings.forEach(m => {
    historyItems.push({
      id: `meeting-${m.id}`,
      type: 'meeting',
      title: `Client Sync Scheduled: ${m.title}`,
      subtitle: `Attendees: ${m.attendee} | Location: ${m.location}`,
      dateText: m.time.startsWith('Today') ? 'July 6, 2026' : 'July 7, 2026',
      rawItem: m,
      targetKey: 'meeting_minutes',
      icon: Calendar,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    });
  });

  // 4. Map AI Conversations
  chatHistory.filter(c => c.sender === 'user').forEach((c, idx) => {
    historyItems.push({
      id: `chat-${idx}`,
      type: 'conversation',
      title: `AI Prompt Processed: "${c.text}"`,
      subtitle: `Intent mapped by NLP engine to target agents.`,
      dateText: 'July 6, 2026 15:00',
      rawItem: c,
      targetKey: 'command_chat',
      icon: MessageSquare,
      color: 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/20 font-mono text-[10px]'
    });
  });

  // 5. Map Workflows
  activities.filter(a => a.category === 'hr' || a.category === 'finance' || a.category === 'sales').forEach((a, idx) => {
    historyItems.push({
      id: `wf-${idx}`,
      type: 'workflow',
      title: `Agent Action: ${a.desc}`,
      subtitle: `System coordination node: ${a.category.toUpperCase()} Agent.`,
      dateText: `July 6, 2026 ${a.time}`,
      rawItem: a,
      targetKey: 'workflow_log',
      icon: CheckCircle2,
      color: 'text-slate-300 bg-slate-800/40 border-slate-700/20'
    });
  });

  // Filter Items dynamically
  const filteredItems = historyItems.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    
    // Simplistic date matching
    if (filterDate === 'today') {
      return item.dateText.includes('July 6') || item.dateText.includes('Today');
    }
    if (filterDate === 'week') {
      return item.dateText.includes('July') || item.dateText.includes('Tomorrow');
    }
    if (filterDate === 'month') {
      return item.dateText.includes('June') || item.dateText.includes('July');
    }
    return true;
  });

  // Sort by date text placeholder (newest first)
  const sortedItems = [...filteredItems].sort((a, b) => b.id.localeCompare(a.id));

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-panel w-full max-w-4xl h-[85vh] rounded-3xl border border-white/10 shadow-2xl p-6 relative overflow-hidden flex flex-col justify-between">
        
        {/* Glow BG */}
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-brand-purple/10 rounded-full blur-3xl -z-10 animate-pulse" />

        <div>
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-brand-purple/15 border border-brand-purple/20 text-brand-purple">
                <History size={18} className="animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 uppercase tracking-wide">Business Time Machine</h3>
                <p className="text-[10px] text-zinc-500 font-mono">Filter and reopen historical operations and documents</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-white/5 hover:bg-slate-800 text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft size={12} /> Return to OS Cockpit
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 bg-slate-950/80 p-3 rounded-2xl border border-white/5 text-xs mb-5 items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1">
                <Filter size={10} /> Category:
              </span>
              {['all', 'hire', 'financial', 'meeting', 'report', 'workflow', 'conversation'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono cursor-pointer transition-all uppercase ${
                    filterType === type
                      ? 'bg-brand-purple text-white font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-slate-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-3">
              <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider">Date:</span>
              {['all', 'today', 'week', 'month'].map((date) => (
                <button
                  key={date}
                  onClick={() => setFilterDate(date)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer uppercase ${
                    filterDate === date ? 'text-brand-cyan font-bold' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Log Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar pr-1 py-1 space-y-3.5 relative pl-6 border-l border-white/5 ml-2.5">
          {sortedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-center py-12">
              <History size={24} className="text-zinc-600 mb-2" />
              <p className="text-xs font-semibold">No historical index matched.</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">Adjust filter parameter chips above to browse logs.</p>
            </div>
          ) : (
            sortedItems.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={item.id} className="relative group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-brand-purple/20 transition-all hover:bg-slate-950/80">
                  {/* Timeline Bullet Node */}
                  <div className={`absolute -left-[31px] top-5 p-1 rounded-full border bg-slate-950 z-10 text-white ${item.color}`}>
                    <IconComponent size={12} />
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white truncate">{item.title}</span>
                      <span className="text-[9px] font-mono text-zinc-500 bg-slate-900 border border-white/5 px-2 py-0.5 rounded uppercase">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-normal">{item.subtitle}</p>
                    <span className="text-[9px] text-zinc-600 font-mono block">{item.dateText}</span>
                  </div>

                  {/* Reopen Action button */}
                  {item.targetKey && (
                    <button
                      onClick={() => onReopenItem(item.targetKey, item.rawItem, item.title)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-brand-cyan hover:text-white font-mono text-[10px] cursor-pointer transition-all hover:scale-102 flex-shrink-0"
                    >
                      Reopen & Review
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/5 text-[9px] text-zinc-600 font-mono flex items-center justify-between">
          <span>Database Nodes Index Count: {historyItems.length} | Filtered: {sortedItems.length}</span>
          <span>Time Machine Sandbox Core 2026</span>
        </div>

      </div>
    </div>
  );
}
